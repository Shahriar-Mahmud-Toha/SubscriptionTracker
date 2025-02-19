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
    public function updateAuthDataById(Authentication $authData, array $updatedData): bool;

    public function createApiSession(array $apiSessionData): ApiSession|null;
    public function getTokenDataByAuthId(int $authId): EloquentCollection|null;
    public function updateApiSession(ApiSession $apiSessionData, array $updatedData): bool;
    public function deleteApiSession(ApiSession $apiSession): bool;
    public function getUsersStatistics();
}
