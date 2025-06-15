<?php

namespace Database\Factories;

use App\Models\Authentication;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Subscription::class;

    public function definition(): array
    {
        $purchaseDate = $this->faker->dateTimeBetween('-1 year', 'now');
        $duration = $this->faker->numberBetween(1, 12); // Duration in months
        $expirationDate = (clone $purchaseDate)->modify("+{$duration} months");

        return [
            'auth_id' => Authentication::factory(),
            'name' => $this->faker->company,
            'seller_info' => $this->faker->company,
            'reminder_time' => $this->faker->dateTimeBetween('now', '+1 month'),
            'date_of_purchase' => $purchaseDate,
            'duration' => $duration,
            'date_of_expiration' => $expirationDate,
            'reminder_job_id'=> $this->faker->uuid,
            'account_info' => $this->faker->iban(null),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'currency' => $this->faker->currencyCode,
            'comment' => $this->faker->sentence,
            'file_name' => $this->faker->word . '.pdf',
        ];
    }
}
