<?php

namespace App\DTO;

use Carbon\Carbon;

class SubscriptionDTO
{
    public ?string $name = null;
    public ?string $seller_info = null;
    public ?Carbon $date_of_purchase = null;
    public ?Carbon $reminder_time = null;
    public ?Carbon $date_of_expiration = null;
    public ?float $duration = null;
    public ?string $account_info = null;
    public ?float $price = null;
    public ?string $currency = null;
    public ?string $comment = null;
    public ?string $file_name = null;

    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'seller_info' => $this->seller_info,
            'date_of_purchase' => $this->date_of_purchase?->toDateTimeString(),
            'reminder_time' => $this->reminder_time?->toDateTimeString(),
            'date_of_expiration' => $this->date_of_expiration?->toDateTimeString(),
            'duration' => $this->duration,
            'account_info' => $this->account_info,
            'price' => $this->price,
            'currency' => $this->currency,
            'comment' => $this->comment,
            'file_name' => $this->file_name,
        ], function ($value) {
            return $value !== null;
        });
    }
    public function toArrayWithNull(): array
    {
        return [
            'name' => $this->name,
            'seller_info' => $this->seller_info,
            'date_of_purchase' => $this->date_of_purchase?->toDateTimeString(),
            'reminder_time' => $this->reminder_time?->toDateTimeString(),
            'date_of_expiration' => $this->date_of_expiration?->toDateTimeString(),
            'duration' => $this->duration,
            'account_info' => $this->account_info,
            'price' => $this->price,
            'currency' => $this->currency,
            'comment' => $this->comment,
            'file_name' => $this->file_name,
        ];
    }
}
