<?php

namespace App\Services\Interfaces;

use App\DTO\AuthenticationDTO;
use App\Models\Authentication;


interface AuthServiceInterface
{
    public function signup(AuthenticationDTO $authData);
    public function loginUser(AuthenticationDTO $authData, array $sessionData): array|int;
    public function refreshToken(string $refreshToken, Authentication $authData, array $sessionData): array|int;
    public function logout(string $token, Authentication $authData): int;
    public function invalidateToken(string $token): array | null;

    public function findAuthUserDetailsById(int $auth_id);
}
