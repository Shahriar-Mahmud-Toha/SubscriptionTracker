<?php

namespace App\Services;

use App\Services\Interfaces\UserServiceInterface;
use App\DTO\UserDTO;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class UserService implements UserServiceInterface
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function createUser(UserDTO $userDTO)
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($userDTO) {
            return $this->userRepository->createUser($userDTO->toArray());
        });
    }

    public function updateUser(int $id, UserDTO $userDTO)
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($id, $userDTO) {
            return $this->userRepository->updateUser($id, $userDTO->toArray());
        });
    }

    public function deleteUser(int $id)
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
        return DB::transaction(function () use ($id) {
            return $this->userRepository->deleteUser($id);
        });
    }

    public function getUserById(int $id)
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($id) {
            return $this->userRepository->findUserById($id);
        });
    }
    public function getUserByAuthId(int $auth_id)
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($auth_id) {
            return $this->userRepository->findUserByAuthId($auth_id);
        });
    }

    public function getAllUsers()
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () {
            return $this->userRepository->getAllUsers();
        });
    }
}
