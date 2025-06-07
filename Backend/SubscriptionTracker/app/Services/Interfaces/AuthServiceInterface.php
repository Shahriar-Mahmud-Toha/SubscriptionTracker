<?php

namespace App\Services\Interfaces;

use App\DTO\AuthenticationDTO;
use App\Models\Authentication;


interface AuthServiceInterface
{
    public function signup(AuthenticationDTO $authData);
    public function sendVerificationEmail($user);
    public function loginUser(AuthenticationDTO $authData, array $sessionData): array|int|null;
    public function refreshToken(string $refreshToken, Authentication $authData, array $sessionData): array|int|null;
    public function logout(string $token, Authentication $authData): int;
    public function invalidateToken(string $token): array | null;

    public function findAuthUserDetailsById(int $auth_id);
    public function updateEmail(int $authId, string $email): bool;
    public function updatePassword(int $authId, string $password): bool;
    
    public function forgotPassword(string $email): bool;
    public function resetPassword(string $email, string $token, string $password): int;

    public function getUsersStatistics();
}
