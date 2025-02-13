<?php

namespace Database\Seeders;

use App\Models\ApiSession;
use App\Models\Authentication;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Authentication::factory()
            ->count(10)
            ->has(User::factory())
            ->has(ApiSession::factory()->count(2)) // Each user has 2 sessions
            ->has(Subscription::factory()->count(3)) // Each user has 3 subscription
            ->create();
    }
}
