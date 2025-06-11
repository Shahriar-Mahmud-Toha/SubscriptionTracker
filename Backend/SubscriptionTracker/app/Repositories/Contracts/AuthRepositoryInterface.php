<?php

namespace App\Repositories\Contracts;

use App\Models\ApiSession;
use App\Models\Authentication;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface AuthRepositoryInterface
{
    public function signup(array $authData): Authentication|null;
    
    public function findAuthDataById(string $email): Authentication|null;
    public function findAuthDataByEmail(string $email): Authentication|null;
    public function findAuthUserDetailsById(int $id): Authentication|null;
    public function findAuthUserDetailsByEmail(string $email): Authentication|null;
    public function updateAuthData(Authentication $authData, array $updatedData): bool;
    
    public function storeOrUpdateToken(string $email, string $token, int $expireAfterMin): bool;
    public function findTokenByEmail(string $email): ?object;
    public function getTokenData(string $token): ?object;

    public function deleteTokenByEmail(string $email): bool;
    public function deleteToken(string $token): bool;

    public function createApiSession(array $apiSessionData): ApiSession|null;
    public function getTokenDataByAuthId(int $authId): EloquentCollection|null;
    public function updateApiSession(ApiSession $apiSessionData, array $updatedData): bool;
    public function deleteApiSession(ApiSession $apiSession): bool;
    public function deleteApiSessionById(string $id): bool;
    public function getUsersStatistics();
}
