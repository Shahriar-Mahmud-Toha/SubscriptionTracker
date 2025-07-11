<?php

namespace App\Services\Interfaces;

use App\DTO\AuthenticationDTO;
use App\Models\Authentication;


interface AuthServiceInterface
{
    public function signup(AuthenticationDTO $authData, $timezone_preferred='UTC');
    public function generateVerificationUrls($user);
    public function loginUser(AuthenticationDTO $authData, array $sessionData, $timezone_preferred): array|int|null;
    public function refreshToken(string $refreshToken, Authentication $authData): array|int;
    public function logout(string $accessToken): int;
    public function invalidateToken(string $token): bool;

    public function findAuthDataById(string $id): Authentication|null;
    public function findAuthUserDetailsById(int $auth_id);
    public function updateEmail(int $authId, string $email): bool;
    public function verifyEmailUpdate(Authentication $user, string $hash): bool;
    public function updatePassword(int $authId, string $password): bool;
    
    public function forgotPassword(string $email): bool;
    public function resetPassword(string $token, string $password): int;

    public function getUsersStatistics();
}
