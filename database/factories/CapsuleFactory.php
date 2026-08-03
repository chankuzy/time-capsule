<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CapsuleFactory extends Factory
{
    public function definition(): array
    {
        $colors = ['#C99A3E', '#2F7A6E', '#B4552F', '#8A6B2C'];

        return [
            'user_id' => User::factory(),
            'title' => fake()->randomElement([
                'My Future Goals', 'Graduation Class of '.now()->year, 'Ramadan Reflections',
                'For My Daughter, 10 Years From Now', 'Wedding Day Messages',
            ]),
            'description' => fake()->sentence(12),
            'type' => fake()->randomElement(['personal', 'event', 'shared']),
            'cover_color' => fake()->randomElement($colors),
            'unlock_at' => fake()->dateTimeBetween('-6 months', '+5 years'),
            'is_locked' => true,
            'allow_contributions' => fake()->boolean(30),
        ];
    }
}
