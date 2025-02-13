<?php

namespace App\Services;

use App\Services\Interfaces\UserServiceInterface;
use App\DTO\UserDTO;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserService implements UserServiceInterface
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function createUser(UserDTO $userDTO)
    {
        return $this->userRepository->createUser($userDTO->toArray());
    }

    public function updateUser(int $id, UserDTO $userDTO)
    {
        return $this->userRepository->updateUser($id, $userDTO->toArray());
    }

    public function deleteUser(int $id)
    {
        return $this->userRepository->deleteUser($id);
    }

    public function getUserById(int $id)
    {
        return $this->userRepository->findUserById($id);
    }
    public function getUserByAuthId(int $auth_id)
    {
        return $this->userRepository->findUserByAuthId($auth_id);
    }
    public function getAllUsers()
    {
        return $this->userRepository->getAllUsers();
    }
}
