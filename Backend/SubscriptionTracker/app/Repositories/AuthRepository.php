<?php

namespace App\Repositories;

use App\Models\ApiSession;
use App\Models\Authentication;
use App\Repositories\Contracts\AuthRepositoryInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\DB;

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
    public function updateAuthData(Authentication $authData, array $updatedData): bool
    {
        return $authData->update($updatedData);
    }

    public function storeOrUpdateToken(string $email, string $token, int $expireAfterMin): bool
    {
        return DB::table('password_resets')->updateOrInsert(
            ['email' => $email],
            [
                'token' => $token,
                'created_at' => now(),
                'expires_at' => now()->addMinutes($expireAfterMin)
            ]
        ) > 0;
    }
    public function findTokenByEmail(string $email): ?object
    {
        return DB::table('password_resets')->where('email', $email)->first();
    }
    public function getTokenData(string $token): ?object
    {
        return DB::table('password_resets')->where('token', $token)->first();
    }
    public function deleteTokenByEmail(string $email): bool
    {
        return DB::table('password_resets')->where('email', $email)->delete() > 0;
    }
    public function deleteToken(string $token): bool
    {
        return DB::table('password_resets')->where('token', $token)->delete() > 0;
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
    public function deleteApiSessionById(string $id): bool
    {
        return ApiSession::where('id', $id)->delete() > 0;
    }
    public function getUsersStatistics() //No need transactions
    {
        return "This feature is under development";
        // return Authentication::where('role', '!=', 'admin')
        //     ->selectRaw('
        //     COUNT(*) as total_users,
        //     SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as active_users,
        //     SUM(CASE WHEN verified = 0 THEN 1 ELSE 0 END) as inactive_users
        // ')->first();
    }
}
