<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function getAllUsers(): Collection;

    public function findUserById(int $id): ?User;
    
    public function findUserByAuthId(int $auth_id): ?User;

    public function createUser(array $userData): User;

    public function updateUser(int $id, array $userData): bool;

    public function deleteUser(int $id): bool;
}
