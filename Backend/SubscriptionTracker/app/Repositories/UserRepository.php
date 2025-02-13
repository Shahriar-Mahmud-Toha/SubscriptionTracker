<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function getAllUsers(): Collection
    {
        return User::all();
    }

    public function findUserById(int $id): ?User
    {
        return User::find($id);
    }
    public function findUserByAuthId(int $auth_id): ?User
    {
        return User::where('auth_id', $auth_id)->first();
    }

    public function createUser(array $userData): User
    {
        return User::create($userData);
    }

    public function updateUser(int $id, array $userData): bool
    {
        $user = User::findOrFail($id);
        return $user->update($userData);
    }

    public function deleteUser(int $id): bool
    {
        $user = User::findOrFail($id);
        return $user->delete();
    }
}
