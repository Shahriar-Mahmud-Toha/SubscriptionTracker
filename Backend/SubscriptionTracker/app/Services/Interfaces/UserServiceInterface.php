<?php

namespace App\Services\Interfaces;

use App\DTO\UserDTO;

interface UserServiceInterface
{
    public function createUser(UserDTO $userDTO);

    public function updateUser(int $id, UserDTO $userDTO);

    public function deleteUser(int $id);

    public function getUserById(int $id);

    public function getUserByAuthId(int $auth_id);

    public function getAllUsers();
}
