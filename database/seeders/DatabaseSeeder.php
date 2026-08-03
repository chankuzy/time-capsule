<?php

namespace Database\Seeders;

use App\Models\Capsule;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Khalifa',
            'email' => 'khalifa@example.com',
        ]);

        Capsule::factory()->count(3)->for($user)->create();

        // One capsule already due, to demo the unlock flow immediately:
        Capsule::factory()->for($user)->create([
            'title' => 'A Note From Last Year',
            'unlock_at' => now()->subMinute(),
        ]);
    }
}
