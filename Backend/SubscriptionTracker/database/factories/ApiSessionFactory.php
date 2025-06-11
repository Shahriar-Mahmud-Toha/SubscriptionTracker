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
            // 'refresh_token' => Crypt::encryptString(Str::random(60)), 
            'ip_address' => $this->faker->ipv4,
            'device_info' => $this->generateSimpleDeviceInfo(),
        ];
    }
    protected function generateSimpleDeviceInfo(): string
    {
        $operatingSystems = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
        $browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
        
        $os = $this->faker->randomElement($operatingSystems);
        $browser = $this->faker->randomElement($browsers);
        
        if (in_array($os, ['iOS', 'Android'])) {
            $osVersion = $this->faker->numberBetween(8, 16);
            $os .= " {$osVersion}";
        }
        
        return "{$os} {$browser}";
    }
}
