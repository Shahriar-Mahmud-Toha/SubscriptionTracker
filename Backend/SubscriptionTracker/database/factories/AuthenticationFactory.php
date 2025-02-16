<?php

namespace Database\Factories;

use App\Models\Authentication;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Authentication>
 */
class AuthenticationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Authentication::class;
    public function definition(): array
    {
        return [
            'role' => $this->faker->randomElement(['admin', 'user']),
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('123'),
            'email_verified_at' => $this->faker->optional(0.7)->dateTimeBetween(now(), now()->addMinutes(10)),
        ];
    }
}
