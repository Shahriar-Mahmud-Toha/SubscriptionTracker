<?php

namespace App\DTO;

use Carbon\Carbon;

class AuthenticationDTO
{
    public ?string $role = null;
    public ?string $email = null;
    public ?string $password = null;
    public ?Carbon $email_verified_at = null;

    public function toArray(): array
    {
        return array_filter([
            'role' => $this->role,
            'email' => $this->email,
            'password' => $this->password,
            'email_verified_at' => $this->email_verified_at?->toDateTimeString(),
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
            'verified' => $this->email_verified_at?->toDateTimeString(),
        ];
    }
}
