<?php

namespace Database\Seeders;

use App\Models\Authentication;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthenticationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Authentication::factory()->count(10)->create();
    }
}
