<?php

namespace App\Repositories;

use App\Models\ApiSession;
use App\Models\Authentication;
use App\Models\User;
use App\Repositories\Contracts\AuthRepositoryInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class AuthRepository implements AuthRepositoryInterface
{

    public function signup(array $authData): Authentication|null
    {
        return Authentication::create([
            'role' => $authData["role"],
            'email' => $authData["email"],
            'password' => $authData["password"],
        ]);
    }
    public function findAuthDataById(string $id): Authentication|null
    {
        return Authentication::find($id);
    }
    public function findAuthDataByEmail(string $email): Authentication|null
    {
        return Authentication::where('email', $email)->first();
    }
    public function findAuthUserDetailsById(int $id): Authentication|null
    {
        return Authentication::with('user')->find($id);
    }
    public function findAuthUserDetailsByEmail(string $email): Authentication|null
    {
        return Authentication::with('user')->where('email', $email)->first();
    }

    public function createApiSession(array $apiSessionData): ApiSession|null
    {
        return ApiSession::create($apiSessionData);
    }
    public function getTokenDataByAuthId(int $authId): EloquentCollection|null
    {
        return ApiSession::where('auth_id', $authId)->get();
    }
    public function updateApiSession(ApiSession $apiSessionData, array $updatedData): bool
    {
        return $apiSessionData->update($updatedData);
    }
    public function deleteApiSession(ApiSession $apiSession): bool
    {
        return $apiSession->delete();
    }
    public function getUsersStatistics() //No need transactions
    {
        return Authentication::where('role', '!=', 'admin')
            ->selectRaw('
            COUNT(*) as total_users,
            SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as active_users,
            SUM(CASE WHEN verified = 0 THEN 1 ELSE 0 END) as inactive_users
        ')->first();
    }
}
