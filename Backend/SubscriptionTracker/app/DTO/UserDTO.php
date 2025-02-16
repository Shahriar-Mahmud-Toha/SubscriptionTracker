<?php

namespace App\DTO;

use Carbon\Carbon;

class UserDTO
{
    public int $auth_id;
    public ?string $first_name = null;
    public ?string $last_name = null;
    public ?Carbon $dob = null;

    public function toArray(): array
    {
        return array_filter([
            'auth_id' => $this->auth_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'dob' => $this->dob?->toDateTimeString(),
        ], function ($value) {
            return $value !== null;
        });
    }
    public function toArrayWithNull(): array
    {
        return [
            'auth_id' => $this->auth_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'dob' => $this->dob?->toDateTimeString(),
        ];
    }
}
