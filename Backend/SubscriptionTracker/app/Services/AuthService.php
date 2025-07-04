<?php

namespace App\Services;

use App\Constants\TokenConstants;
use App\DTO\AuthenticationDTO;
use App\DTO\UserDTO;
use App\Jobs\SendPasswordResetVerificationMailJob;
use App\Jobs\SendVerificationMailJob;
use App\Models\Authentication;
use App\Models\User;
use App\Repositories\Contracts\AuthRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Interfaces\AuthServiceInterface;
use App\Services\Interfaces\UserServiceInterface;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redis;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Token;
use Illuminate\Support\Str;

class AuthService implements AuthServiceInterface
{

    protected $authRepository;
    protected $userRepository;

    public function __construct(AuthRepositoryInterface $authRepository, UserRepositoryInterface $userRepository)
    {
        $this->authRepository = $authRepository;
        $this->userRepository = $userRepository;
    }

    public function signup(AuthenticationDTO $authData, $timezone_preferred = 'UTC')
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($authData, $timezone_preferred) {
            $data = $this->authRepository->signup($authData->toArray());

            $userData = [
                'auth_id' => $data->id,
                'timezone_preferred' => $timezone_preferred,
                'timezone_last_known' => $timezone_preferred,
            ];

            $this->userRepository->createUser($userData);

            $token = JWTAuth::customClaims([
                'role' => $data->role,
                'type' => 'signup',
                'exp' => Carbon::now()->addMinutes(TokenConstants::SIGNUP_EMAIL_TOKEN_VALIDITY)->timestamp
            ])->fromUser($data);
            $urls = $this->generateVerificationUrls($data);
            SendVerificationMailJob::dispatch($data, $urls['frontend_url'])->onQueue('mid');
            return $token;
        });
    }

    public function generateVerificationUrls($user)
    {
        $hash = sha1($user->email);
        $expiration = now()->addMinutes(TokenConstants::EMAIL_VERIFICATION_TOKEN_VALIDITY);
        $signedUrl = url()->temporarySignedRoute('verification.verify', $expiration, ['id' => $user->id, 'hash' => $hash]);
        $parsed = parse_url($signedUrl);
        $queryParams = [];
        if (isset($parsed['query'])) {
            parse_str($parsed['query'], $queryParams);
        }
        $frontendUrl = config('app.FRONT_END_URL') . '/verify-email?' . http_build_query($queryParams + ['hash' => $hash]);
        return [
            'signed_url' => $signedUrl,
            'frontend_url' => $frontendUrl,
        ];
    }

    public function loginUser(AuthenticationDTO $authData, array $sessionData, $timezone_last_known = 'UTC'): array|int|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($authData, $sessionData, $timezone_last_known) {
            $verifiedUser = $this->authRepository->findAuthDataByEmail($authData->email);
            if ($verifiedUser == null || !Hash::check($authData->password, $verifiedUser->password) || $verifiedUser->email_verified_at == null) {
                return -1; // Invalid credentials
            }
            $apiSession = [
                'auth_id' => $verifiedUser->id,
                'ip_address' => $sessionData['ip_address'],
                'device_info' => $sessionData['device_info'],
            ];
            $authSessionData = $this->authRepository->createApiSession($apiSession);
            $userData = $this->userRepository->updateUser($verifiedUser->id, [
                'timezone_last_known' => $timezone_last_known,
            ]);
            if ($authSessionData == null || !$userData) {
                DB::rollBack();
                return -2;
            }
            $refreshTokenExpireTime = Carbon::now()->addMinutes(TokenConstants::REFRESH_TOKEN_VALIDITY)->timestamp;

            $refreshToken = JWTAuth::customClaims(['role' => $verifiedUser->role, 'type' => 'refresh', 'sid' => $authSessionData->id, 'exp' => $refreshTokenExpireTime])
                ->fromUser($verifiedUser);

            $decodedToken = JWTAuth::decode(new Token($refreshToken));

            $accessToken = JWTAuth::customClaims(['role' => $verifiedUser->role, 'type' => 'access', 'rft_jti' => $decodedToken['jti'], 'sid' => $authSessionData->id, 'exp' => Carbon::now()->addMinutes(TokenConstants::ACCESS_TOKEN_VALIDITY)->timestamp])
                ->fromUser($verifiedUser);

            if (!$this->addToAllowedRefreshTokenList($decodedToken['jti'], $decodedToken['exp'])) {
                DB::rollBack();
                return -3; // Failed to add refresh token to allowed list
            }

            return [
                'access_token' => $accessToken,
                'access_token_validity' => (TokenConstants::ACCESS_TOKEN_VALIDITY * 60) - TokenConstants::TOKEN_EXPIRE_BUFFER,
                'refresh_token' => $refreshToken,
                'refresh_token_validity' => (TokenConstants::REFRESH_TOKEN_VALIDITY * 60) - TokenConstants::TOKEN_EXPIRE_BUFFER,
            ];
        });
    }
    public function addToAllowedRefreshTokenList(string $refreshTokenJti, string $refreshTokenExp): bool
    {
        try {
            $currentTime = time();

            $remainingTime = $refreshTokenExp - $currentTime;

            $result = Redis::setex("allowed_refresh_token:{$refreshTokenJti}", $remainingTime, 1);
            if (!$result) {
                return false;
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    public function refreshToken(string $oldRefreshToken, Authentication $authData): array|int
    {
        $decodedOldToken = JWTAuth::decode(new Token($oldRefreshToken));

        if (!$this->invalidateToken($decodedOldToken['jti'])) {
            return -1; //invalidation failed
        }
        $refreshToken = JWTAuth::customClaims(['role' => $authData->role, 'type' => 'refresh', 'sid' => $decodedOldToken['sid'], 'exp' => Carbon::now()->addMinutes(TokenConstants::REFRESH_TOKEN_VALIDITY)->timestamp])
            ->fromUser($authData);
        $decodedToken = JWTAuth::decode(new Token($refreshToken));

        $accessToken = JWTAuth::customClaims(['role' => $authData->role, 'type' => 'access', 'rft_jti' => $decodedToken['jti'], 'sid' => $decodedOldToken['sid'], 'exp' => Carbon::now()->addMinutes(TokenConstants::ACCESS_TOKEN_VALIDITY)->timestamp])
            ->fromUser($authData);
        if (!$this->addToAllowedRefreshTokenList($decodedToken['jti'], $decodedToken['exp'])) {
            return -2;
        }
        return [
            'access_token' => $accessToken,
            'access_token_validity' => (TokenConstants::ACCESS_TOKEN_VALIDITY * 60) - TokenConstants::TOKEN_EXPIRE_BUFFER,
            'refresh_token' => $refreshToken,
            'refresh_token_validity' => (TokenConstants::REFRESH_TOKEN_VALIDITY * 60) - TokenConstants::TOKEN_EXPIRE_BUFFER,
        ];
    }
    public function logout(string $accessToken): int
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($accessToken) {
            $decodedToken = JWTAuth::decode(new Token($accessToken));

            if (!$this->authRepository->deleteApiSessionById($decodedToken['sid'])) {
                DB::rollBack();
                return -1;
            }
            if (!$this->invalidateToken($decodedToken['rft_jti'])) {
                DB::rollBack();
                return -2; //invalidation failed
            }
            return 1;
        });
    }

    public function invalidateToken(string $tokenJti): bool
    {
        try {
            $result = Redis::del("allowed_refresh_token:{$tokenJti}");
            return $result > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
    public function findAuthDataById(string $id): Authentication|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($id) {
            return $this->authRepository->findAuthDataById($id);
        });
    }
    public function findAuthUserDetailsById(int $auth_id)
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($auth_id) {
            return $this->authRepository->findAuthUserDetailsById($auth_id);
        });
    }
    public function generateUpdateEmailVerificationUrls($user)
    {
        $hash = sha1($user->email);
        $expiration = now()->addMinutes(TokenConstants::EMAIL_VERIFICATION_TOKEN_VALIDITY);
        $signedUrl = url()->temporarySignedRoute('updateEmail.verify', $expiration, ['id' => $user->id, 'hash' => $hash]);
        $parsed = parse_url($signedUrl);
        $queryParams = [];
        if (isset($parsed['query'])) {
            parse_str($parsed['query'], $queryParams);
        }
        $frontendUrl = config('app.FRONT_END_URL') . '/verify-update-email?' . http_build_query($queryParams + [
            'hash' => $hash,
            'type' => 'update'
        ]);
        return [
            'signed_url' => $signedUrl,
            'frontend_url' => $frontendUrl,
            'signed_hash' => $hash  // Added this line
        ];
    }
    public function updateEmail(int $authId, string $email): bool
    {
        try {
            DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

            return DB::transaction(function () use ($authId, $email) {
                $currData = $this->authRepository->findAuthDataById($authId);
                if (!$currData) {
                    return false; // Auth data not found for this user
                }
                $urls = $this->generateUpdateEmailVerificationUrls($currData);
                $result = Redis::setex("updated_email:{$urls['signed_hash']}", TokenConstants::EMAIL_VERIFICATION_TOKEN_VALIDITY * 60, $email);
                if (!$result) {
                    return false;
                }
                SendVerificationMailJob::dispatch($currData, $urls['frontend_url'], $email)->onQueue('high');

                return true;
            });
        } catch (\Exception $e) {
            return false;
        }
    }
    public function verifyEmailUpdate(Authentication $user, string $hash): bool
    {
        try {
            DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

            return DB::transaction(function () use ($user, $hash) {
                $newEmail = Redis::get("updated_email:{$hash}");
                if (!$newEmail) {
                    return false; // No email found for this hash
                }

                $updatedData = [
                    'email' => $newEmail,
                    'email_verified_at' => now(),
                ];

                if (!$this->authRepository->updateAuthData($user, $updatedData)) {
                    return false;
                }

                Redis::del("updated_email:{$hash}");

                return true;
            });
        } catch (\Exception $e) {
            return false; // Handle exception as needed
        }
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
            $this->authRepository->storeOrUpdateToken($email, $token, 1);
            SendPasswordResetVerificationMailJob::dispatch($token, $email)->onQueue('mid');

            return true;
        });
    }
    public function resetPassword(string $token, string $password): int
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($token, $password) {
            $data = $this->authRepository->getTokenData($token);
            if (!$data) {
                return -1; // Invalid token.
            }
            $authData = $this->authRepository->findAuthDataByEmail($data->email);
            if (!$authData) {
                return 0; // No user found.
            }

            $updatedData = ['password' => $password];

            if (!$this->authRepository->updateAuthData($authData, $updatedData)) {
                throw new \Exception("Failed to update password."); // Force rollback
            }

            if (!$this->authRepository->deleteTokenByEmail($data->email)) {
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
