<?php

namespace Database\Factories;

use App\Models\ApiSession;
use App\Models\Authentication;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApiSession>
 */
class ApiSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = ApiSession::class;

    public function definition(): array
    {
        return [
            'auth_id' => Authentication::factory(),
            'access_token' => Crypt::encryptString(Str::random(60)), // Encrypt access token
            'refresh_token' => Crypt::encryptString(Str::random(60)), // Encrypt refresh token
            'ip_address' => $this->faker->ipv4,
            'user_agent' => $this->faker->userAgent,
            'device_name' => $this->faker->word,
            'expires_at' => now()->addDays(7), // Expires in 7 days
        ];
    }
}
