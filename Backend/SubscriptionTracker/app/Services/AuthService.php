<?php

namespace App\Services;

use App\DTO\AuthenticationDTO;
use App\Models\Authentication;
use App\Notifications\CustomVerifyEmail;
use App\Repositories\Contracts\AuthRepositoryInterface;
use App\Services\Interfaces\AuthServiceInterface;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redis;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Token;
use Illuminate\Support\Str;

class AuthService implements AuthServiceInterface
{

    protected $authRepository;
    private int $accessTokenValidity = 50;
    private int $refreshTokenValidity = 60;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function signup(AuthenticationDTO $authData)
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($authData) {
            $data = $this->authRepository->signup($authData->toArray());
            $token = JWTAuth::customClaims([
                'role' => $data->role,
                'type' => 'signup',
                'exp' => Carbon::now()->addMinutes(60)->timestamp
            ])->fromUser($data);
            $this->sendVerificationEmail($data);
            return $token;
        });
    }

    public function generateVerificationUrls($user)
    {
        $hash = sha1($user->email);
        $expiration = now()->addMinutes(60);
        $signedUrl = url()->temporarySignedRoute('verification.verify', $expiration, ['id' => $user->id, 'hash' => $hash]);
        $parsed = parse_url($signedUrl);
        $queryParams = [];
        if (isset($parsed['query'])) {
            parse_str($parsed['query'], $queryParams);
        }
        $frontendUrl = env('FRONT_END_URL') . '/verify-email?' . http_build_query($queryParams + ['hash' => $hash]);
        return [
            'signed_url' => $signedUrl,
            'frontend_url' => $frontendUrl,
        ];
    }

    public function sendVerificationEmail($user)
    {
        $urls = $this->generateVerificationUrls($user);
        $frontendUrl = $urls['frontend_url'];
        $user->notify(new CustomVerifyEmail($frontendUrl));
    }

    public function loginUser(AuthenticationDTO $authData, array $sessionData): array|int|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($authData, $sessionData) {
            $verifiedUser = $this->authRepository->findAuthDataByEmail($authData->email);
            if ($verifiedUser == null || !Hash::check($authData->password, $verifiedUser->password) || $verifiedUser->email_verified_at == null) {
                return -1; // Invalid credentials
            }
            $accessToken = JWTAuth::customClaims(['role' => $verifiedUser->role, 'type' => 'access', 'exp' => Carbon::now()->addMinutes($this->accessTokenValidity)->timestamp])
                ->fromUser($verifiedUser);
            $refreshTokenExpireTime = Carbon::now()->addMinutes($this->refreshTokenValidity)->timestamp;

            $refreshToken = JWTAuth::customClaims(['role' => $verifiedUser->role, 'type' => 'refresh', 'exp' => $refreshTokenExpireTime])
                ->fromUser($verifiedUser);

            $apiSession = [
                'auth_id' => $verifiedUser->id,
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'ip_address' => $sessionData['ip_address'],
                'user_agent' => $sessionData['user_agent'],
                'device_name' => $sessionData['device_name'],
                'expires_at' => $refreshTokenExpireTime
            ];

            if ($this->authRepository->createApiSession($apiSession) == null) {
                DB::rollBack();
                return -2;
            }

            return [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
            ];
        });
    }
    public function refreshToken(string $refreshToken, Authentication $authData, array $sessionData): array|int|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($refreshToken, $authData, $sessionData) {
            $apiTokenCollection = $this->authRepository->getTokenDataByAuthId($authData->id);
            $apiToken = null;
            $decryptedRefreshToken = null;
            if ($apiTokenCollection == null) {
                return -1; //token not found
            }
            foreach ($apiTokenCollection as $apiTokenData) {
                $decryptedRefreshToken = Crypt::decryptString($apiTokenData->refresh_token);
                if ($decryptedRefreshToken == $refreshToken) {
                    $apiToken = $apiTokenData;
                    break;
                }
            }
            if ($apiToken == null) {
                return -1; //token not found
            }
            // JWTAuth::setToken($decryptedAccessToken);
            // JWTAuth::invalidate($decryptedAccessToken);
            $invRefreshRes = $this->invalidateToken($decryptedRefreshToken);

            if (!$invRefreshRes['result']) {
                return -2; //invalidation failed
            }
            $accessToken = JWTAuth::customClaims(['role' => $authData->role, 'type' => 'access', 'exp' => Carbon::now()->addMinutes($this->accessTokenValidity)->timestamp])
                ->fromUser($authData);
            $refreshTokenExpireTime = Carbon::now()->addMinutes($this->refreshTokenValidity)->timestamp;
            $refreshToken = JWTAuth::customClaims(['role' => $authData->role, 'type' => 'refresh', 'exp' => $refreshTokenExpireTime])
                ->fromUser($authData);

            $updatedData = [
                'auth_id' => $authData->id,
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'ip_address' => $sessionData['ip_address'],
                'user_agent' => $sessionData['user_agent'],
                'device_name' => $sessionData['device_name'],
                'expires_at' => $refreshTokenExpireTime
            ];

            $result = $this->authRepository->updateApiSession($apiToken, $updatedData);
            if (!$result) {
                Redis::del([$invRefreshRes['redisEntry']]);
                DB::rollBack();
                return -3; //Session update failed.
            }
            return [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
            ];
        });
    }
    public function logout(string $token, Authentication $authData): int
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($token, $authData) {
            $apiTokenCollection = $this->authRepository->getTokenDataByAuthId($authData->id);
            $apiToken = null;
            $decryptedAccessToken = null;
            $decryptedRefreshToken = null;
            if ($apiTokenCollection == null) {
                return -1; //token not found
            }
            foreach ($apiTokenCollection as $apiTokenData) {
                $decryptedAccessToken = Crypt::decryptString($apiTokenData->access_token);
                $decryptedRefreshToken = Crypt::decryptString($apiTokenData->refresh_token);
                if (($decryptedRefreshToken == $token) || ($decryptedAccessToken == $token)) {
                    $apiToken = $apiTokenData;
                    break;
                }
            }
            if ($apiToken == null) {
                return -1; //token not found
            }
            $invRefreshRes = $this->invalidateToken($decryptedRefreshToken);
            $invAccessRes = $this->invalidateToken($decryptedAccessToken);
            if (!$invRefreshRes['result'] || !$invAccessRes['result']) {
                return -2; //invalidation failed
            }
            if ($this->authRepository->deleteApiSession($apiToken) != null) {
                return 1;
            } else {
                Redis::del([$invRefreshRes['redisEntry'], $invAccessRes['redisEntry']]);
                DB::rollBack();
                return -2; ////invalidation failed
            }
        });
    }
    public function invalidateToken(string $token): array | null
    {
        try {
            $decodedToken = JWTAuth::decode(new Token($token));
            $expirationTime = $decodedToken['exp']; // 'exp' is the expiration time in UNIX timestamp

            // current time in UNIX timestamp
            $currentTime = time();

            // Calculate the remaining time (in seconds) until the token expires
            $remainingTime = $expirationTime - $currentTime;

            // If remaining time is less than or equal to 0, set TTL to 0 (expired)
            $ttl = ($remainingTime > 0) ? $remainingTime : 0;
            $result = Redis::setex("banned_token:{$decodedToken['jti']}", $ttl, 1); // ttl in seconds 
            return [
                'result' => $result,
                'redisEntry' => "banned_token:{$decodedToken['jti']}"
            ];
        } catch (\Exception $e) {
            return null;
        }
    }

    public function findAuthUserDetailsById(int $auth_id)
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($auth_id) {
            return $this->authRepository->findAuthUserDetailsById($auth_id);
        });
    }

    public function updateEmail(int $authId, string $email): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

        return DB::transaction(function () use ($authId, $email) {
            $currData = $this->authRepository->findAuthDataById($authId);
            if (!$currData) {
                return false; // Auth data not found for this user
            }

            $updatedData = [
                'email' => $email,
                'email_verified_at' => null
            ];

            if (!$this->authRepository->updateAuthData($currData, $updatedData)) {
                return false;
            }

            $currData->email = $email;
            $currData->email_verified_at = null;

            try {
                $currData->sendEmailVerificationNotification();
            } catch (\Throwable $e) {
                throw new \Exception("Failed to send verification email: " . $e->getMessage());
            }

            return true;
        });
    }
    public function updatePassword(int $authId, string $password): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

        return DB::transaction(function () use ($authId, $password) {
            $currData = $this->authRepository->findAuthDataById($authId);
            if (!$currData) {
                return false; // Auth data not found for this user
            }

            $updatedData = [
                'password' => $password,
            ];

            return $this->authRepository->updateAuthData($currData, $updatedData) > 0;
        });
    }
    public function forgotPassword(string $email): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

        return DB::transaction(function () use ($email) {
            $token = Str::random(64);
            $this->authRepository->storeOrUpdateToken($email, Hash::make($token), 1);

            Mail::send('emails.password_reset', ['token' => $token], function ($message) use ($email) {
                $message->to($email);
                $message->subject('Reset Password Notification');
            });

            return true;
        });
    }
    public function resetPassword(string $email, string $token, string $password): int
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($email, $token, $password) {
            $data = $this->authRepository->findTokenByEmail($email);
            if (!$data) {
                return 0; // No password reset request found for this user.
            }
            if (!Hash::check($token, $data->token)) {
                return -1; // Invalid token.
            }
            $authData = $this->authRepository->findAuthDataByEmail($email);
            if (!$authData) {
                return 0; // No user found.
            }

            $updatedData = ['password' => $password];

            if (!$this->authRepository->updateAuthData($authData, $updatedData)) {
                throw new \Exception("Failed to update password."); // Force rollback
            }

            if (!$this->authRepository->deleteTokenByEmail($email)) {
                throw new \Exception("Failed to delete reset token."); // Force rollback
            }

            return 1;
        });
    }



    public function getUsersStatistics()
    {
        return $this->authRepository->getUsersStatistics();
    }
}
