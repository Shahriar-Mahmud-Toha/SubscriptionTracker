<?php

namespace App\Services;

use App\Constants\TokenConstants;
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
use Ramsey\Uuid\Type\Time;

class AuthService implements AuthServiceInterface
{

    protected $authRepository;

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
                'exp' => Carbon::now()->addMinutes(TokenConstants::SIGNUP_EMAIL_TOKEN_VALIDITY)->timestamp
            ])->fromUser($data);
            $urls = $this->generateVerificationUrls($data);
            $this->sendVerificationEmail($data, $urls);
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
        $frontendUrl = env('FRONT_END_URL') . '/verify-email?' . http_build_query($queryParams + ['hash' => $hash]);
        return [
            'signed_url' => $signedUrl,
            'frontend_url' => $frontendUrl,
        ];
    }

    public function sendVerificationEmail($user, $urls)
    {
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
            $apiSession = [
                'auth_id' => $verifiedUser->id,
                'ip_address' => $sessionData['ip_address'],
                'device_info' => $sessionData['device_info'],
            ];
            $authSessionData = $this->authRepository->createApiSession($apiSession);
            if ($authSessionData == null) {
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
        $frontendUrl = env('FRONT_END_URL') . '/verify-update-email?' . http_build_query($queryParams + [
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
                $currData['email'] = $email;
                $result = Redis::setex("updated_email:{$urls['signed_hash']}", TokenConstants::EMAIL_VERIFICATION_TOKEN_VALIDITY * 60, $email);
                if (!$result) {
                    return false;
                }
                $this->sendVerificationEmail($currData, $urls);

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
    // public function updateEmail(int $authId, string $email): bool
    // {
    //     DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

    //     return DB::transaction(function () use ($authId, $email) {
    //         $currData = $this->authRepository->findAuthDataById($authId);
    //         if (!$currData) {
    //             return false; // Auth data not found for this user
    //         }

    //         $updatedData = [
    //             'email' => $email,
    //             'email_verified_at' => null
    //         ];

    //         if (!$this->authRepository->updateAuthData($currData, $updatedData)) {
    //             return false;
    //         }

    //         $currData->email = $email;
    //         $currData->email_verified_at = null;

    //         try {
    //             $currData->sendEmailVerificationNotification();
    //         } catch (\Throwable $e) {
    //             throw new \Exception("Failed to send verification email: " . $e->getMessage());
    //         }

    //         return true;
    //     });
    // }
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

            Mail::send('emails.password_reset', ['token' => $token], function ($message) use ($email) {
                $message->to($email);
                $message->subject('Reset Password Notification');
            });

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
