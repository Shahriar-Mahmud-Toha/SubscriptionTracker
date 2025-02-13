<?php

namespace App\Services;

use App\DTO\SubscriptionDTO;
use App\Services\Interfaces\SubscriptionValidationServiceInterface;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriptionValidationService implements SubscriptionValidationServiceInterface
{
    public function validateSubscriptionStore(Request $request)
    {
        $validator = Validator::make(
            $request->only(['name', 'seller_info', 'date_of_purchase', 'reminder_time', 'date_of_expiration', 'account_info', 'price', 'currency', 'comment']),
            [
                'name' => ['required', 'string', 'max:255'],
                'seller_info' => ['nullable', 'string', 'max:255'],
                'date_of_purchase' => ['nullable', 'date'],
                'reminder_time' => ['nullable', 'date'],
                'date_of_expiration' => ['required', 'date'],
                'account_info' => ['nullable', 'string', 'max:255'],
                'price' => ['nullable', 'numeric', 'between:0,99999999999999.99'],
                'currency' => ['nullable', 'string', 'size:3'],
                'comment' => ['nullable', 'string', 'max:255']
            ],
            [
                'name.required' => 'The name field is required.',
                'name.string' => 'The name must be a string.',
                'name.max' => 'The name cannot be longer than 255 characters.',

                'seller_info.string' => 'The seller information must be a string.',
                'seller_info.max' => 'The seller information cannot be longer than 255 characters.',

                'date_of_purchase.date' => 'The date of purchase must be a valid date.',

                'reminder_time.date' => 'The reminder time must be a valid date.',

                'date_of_expiration.required' => 'The date of expiration is required.',
                'date_of_expiration.date' => 'The date of expiration must be a valid date.',

                'account_info.string' => 'The account information must be a string.',
                'account_info.max' => 'The account information cannot be longer than 255 characters.',

                'price.numeric' => 'The price must be a number.',
                'price.between' => 'The price must be between 0 and 99,999,999.99.',

                'currency.string' => 'The currency must be a string.',
                'currency.size' => 'The currency must be exactly 3 characters (e.g., USD, BDT).',

                'comment.string' => 'The comment must be a string.',
                'comment.max' => 'The comment cannot be longer than 255 characters.',
            ]
        );

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }
        $validatedData = $validator->validated();

        $subscriptionDTO = new SubscriptionDTO();
        $subscriptionDTO->name = $validatedData['name'];
        if (!empty($validatedData['seller_info'])) {
            $subscriptionDTO->seller_info = $validatedData['seller_info'];
        }
        if (!empty($validatedData['date_of_purchase'])) {
            $subscriptionDTO->date_of_purchase = Carbon::parse($validatedData['date_of_purchase']);
        }
        if (!empty($validatedData['reminder_time'])) {
            $subscriptionDTO->reminder_time = Carbon::parse($validatedData['reminder_time']);
        }
        $subscriptionDTO->date_of_expiration = Carbon::parse($validatedData['date_of_expiration']);
        if (!empty($validatedData['account_info'])) {
            $subscriptionDTO->account_info = $validatedData['account_info'];
        }
        if (!empty($validatedData['price'])) {
            $subscriptionDTO->price = $validatedData['price'];
        }
        if (!empty($validatedData['currency'])) {
            $subscriptionDTO->currency = $validatedData['currency'];
        }
        if (!empty($validatedData['comment'])) {
            $subscriptionDTO->comment = $validatedData['comment'];
        }

        return $subscriptionDTO;
    }
    public function validateSubscriptionUpdate(Request $request)
    {
        $validator = Validator::make(
            $request->only(['name', 'seller_info', 'date_of_purchase', 'reminder_time', 'date_of_expiration', 'account_info', 'price', 'currency', 'comment']),
            [
                'name' => ['nullable', 'string', 'max:255'],
                'seller_info' => ['nullable', 'string', 'max:255'],
                'date_of_purchase' => ['nullable', 'date'],
                'reminder_time' => ['nullable', 'date'],
                'date_of_expiration' => ['nullable', 'date'],
                'account_info' => ['nullable', 'string', 'max:255'],
                'price' => ['nullable', 'numeric', 'between:0,99999999999999.99'],
                'currency' => ['nullable', 'string', 'size:3'],
                'comment' => ['nullable', 'string', 'max:255']
            ],
            [
                'name.string' => 'The name must be a string.',
                'name.max' => 'The name cannot be longer than 255 characters.',

                'seller_info.string' => 'The seller information must be a string.',
                'seller_info.max' => 'The seller information cannot be longer than 255 characters.',

                'date_of_purchase.date' => 'The date of purchase must be a valid date.',

                'reminder_time.date' => 'The reminder time must be a valid date.',

                'date_of_expiration.date' => 'The date of expiration must be a valid date.',

                'account_info.string' => 'The account information must be a string.',
                'account_info.max' => 'The account information cannot be longer than 255 characters.',

                'price.numeric' => 'The price must be a number.',
                'price.between' => 'The price must be between 0 and 99,999,999.99.',

                'currency.string' => 'The currency must be a string.',
                'currency.size' => 'The currency must be exactly 3 characters (e.g., USD, BDT).',

                'comment.string' => 'The comment must be a string.',
                'comment.max' => 'The comment cannot be longer than 255 characters.',
            ]
        );

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }
        $validatedData = $validator->validated();

        $subscriptionDTO = new SubscriptionDTO();
        if (!empty($validatedData['name'])) {
            $subscriptionDTO->name = $validatedData['name'];
        }
        if (!empty($validatedData['seller_info'])) {
            $subscriptionDTO->seller_info = $validatedData['seller_info'];
        }
        if (!empty($validatedData['date_of_purchase'])) {
            $subscriptionDTO->date_of_purchase = Carbon::parse($validatedData['date_of_purchase']);
        }
        if (!empty($validatedData['reminder_time'])) {
            $subscriptionDTO->reminder_time = Carbon::parse($validatedData['reminder_time']);
        }
        if (!empty($validatedData['date_of_expiration'])) {
            $subscriptionDTO->date_of_expiration = Carbon::parse($validatedData['date_of_expiration']);
        }
        if (!empty($validatedData['account_info'])) {
            $subscriptionDTO->account_info = $validatedData['account_info'];
        }
        if (!empty($validatedData['price'])) {
            $subscriptionDTO->price = $validatedData['price'];
        }
        if (!empty($validatedData['currency'])) {
            $subscriptionDTO->currency = $validatedData['currency'];
        }
        if (!empty($validatedData['comment'])) {
            $subscriptionDTO->comment = $validatedData['comment'];
        }

        return $subscriptionDTO;
    }
}
