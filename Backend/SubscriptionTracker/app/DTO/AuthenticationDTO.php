<?php

namespace App\DTO;

class AuthenticationDTO
{
    public ?string $role = null;
    public ?string $email = null;
    public ?string $password = null;
    public bool $verified = false;

    public function toArray(): array
    {
        return array_filter([
            'role' => $this->role,
            'email' => $this->email,
            'password' => $this->password,
            'verified' => $this->verified,
        ], function ($value) {
            return $value !== null;
        });
    }
    public function toArrayWithNull(): array
    {
        return [
            'role' => $this->role,
            'email' => $this->email,
            'password' => $this->password,
            'verified' => $this->verified,
        ];
    }
}
