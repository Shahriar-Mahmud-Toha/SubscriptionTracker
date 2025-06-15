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
            $request->only(['name', 'seller_info', 'date_of_purchase', 'reminder_time', 'duration', 'date_of_expiration', 'account_info', 'price', 'currency', 'comment', 'file']),
            [
                'name' => ['required', 'string', 'max:255'],
                'seller_info' => ['nullable', 'string', 'max:255'],
                'date_of_purchase' => ['nullable', 'date'],
                'reminder_time' => [
                    'nullable',
                    'date',
                    'after:now',
                ],
                'duration' => ['nullable', 'numeric'],
                'date_of_expiration' => [
                    'required',
                    'date',
                    'after:now',
                ],
                'account_info' => ['nullable', 'string', 'max:255'],
                'price' => ['nullable', 'numeric', 'between:0,99999999999999.99'],
                'currency' => ['nullable', 'string', 'size:3'],
                'comment' => ['nullable', 'string', 'max:255'],
                'file' => [
                    'nullable',
                    // 'mimes:pdf,txt,doc,docx,xls,xlsx,png,jpg,webp,heic',
                    'max:5120',
                    function ($attribute, $value, $fail) {
                        $this->fileTypeValidator($attribute, $value, $fail);
                    }
                ],
            ],
            [
                'name.required' => 'The name field is required.',
                'name.string' => 'The name must be a string.',
                'name.max' => 'The name cannot be longer than 255 characters.',

                'seller_info.string' => 'The seller information must be a string.',
                'seller_info.max' => 'The seller information cannot be longer than 255 characters.',

                'date_of_purchase.date' => 'The date of purchase must be a valid date.',

                'reminder_time.date' => 'The reminder time must be a valid date.',
                'reminder_time.after' => 'The reminder time must be a future date and time.',

                'duration.numeric' => 'The duration must be a number.',

                'date_of_expiration.required' => 'The date of expiration is required.',
                'date_of_expiration.date' => 'The date of expiration must be a valid date.',
                'date_of_expiration.after' => 'The date of expiration must be a future date and time.',

                'account_info.string' => 'The account information must be a string.',
                'account_info.max' => 'The account information cannot be longer than 255 characters.',

                'price.numeric' => 'The price must be a number.',
                'price.between' => 'The price must be between 0 and 99,999,999.99.',

                'currency.string' => 'The currency must be a string.',
                'currency.size' => 'The currency must be exactly 3 characters (e.g., USD, BDT).',

                'comment.string' => 'The comment must be a string.',
                'comment.max' => 'The comment cannot be longer than 255 characters.',

                'file.max' => 'The file size must not exceed 5mb.'
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
        if (!empty($validatedData['duration'])) {
            $subscriptionDTO->duration = $validatedData['duration'];
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
            $request->only(['name', 'seller_info', 'date_of_purchase', 'reminder_time', 'duration', 'date_of_expiration', 'account_info', 'price', 'currency', 'comment']),
            [
                'name' => ['nullable', 'string', 'max:255'],
                'seller_info' => ['nullable', 'string', 'max:255'],
                'date_of_purchase' => ['nullable', 'date'],
                'reminder_time' => [
                    'nullable',
                    'date',
                    // 'after:now',
                ],
                'duration' => ['nullable', 'numeric'],
                'date_of_expiration' => [
                    'nullable',
                    'date',
                    // 'after:now',
                ],
                'account_info' => ['nullable', 'string', 'max:255'],
                'price' => ['nullable', 'numeric', 'between:0,99999999999999.99'],
                'currency' => ['nullable', 'string', 'size:3'],
                'comment' => ['nullable', 'string', 'max:255'],
            ],
            [
                'name.string' => 'The name must be a string.',
                'name.max' => 'The name cannot be longer than 255 characters.',

                'seller_info.string' => 'The seller information must be a string.',
                'seller_info.max' => 'The seller information cannot be longer than 255 characters.',

                'date_of_purchase.date' => 'The date of purchase must be a valid date.',

                'reminder_time.date' => 'The reminder time must be a valid date.',
                // 'reminder_time.after' => 'The reminder time must be a future date and time.',

                'duration.numeric' => 'The duration must be a number.',

                'date_of_expiration.date' => 'The date of expiration must be a valid date.',
                // 'date_of_expiration.after' => 'The date of expiration must be a future date and time.',

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
        if (!empty($validatedData['duration'])) {
            $subscriptionDTO->duration = $validatedData['duration'];
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
    public function validateSubscriptionFileUpdate(Request $request)
    {
        $validator = Validator::make(
            $request->only(['file']),
            [
                'file' => [
                    'nullable',
                    'max:5120',
                    function ($attribute, $value, $fail) {
                        $this->fileTypeValidator($attribute, $value, $fail);
                    }
                ],
            ],
            [
                'file.max' => 'The file size must not exceed 5mb.'
            ]
        );

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }
        return true;
    }
    public function fileTypeValidator($attribute, $value, $fail)
    {
        $allowedExtensions = [
            'pdf' => 'application/pdf',
            'txt' => 'text/plain',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'webp' => 'image/webp',
            'heic' => 'image/heic',
        ];

        $extension = strtolower($value->getClientOriginalExtension());
        $mimeType = $value->getMimeType();
        if (!array_key_exists($extension, $allowedExtensions)) {
            return $fail("Invalid file type. Allowed types: pdf, txt, doc, docx, xls, xlsx, png, jpg, webp, heic.");
        }

        if ($allowedExtensions[$extension] !== $mimeType) {
            return $fail("The file extension does not match the actual file type.");
        }
    }
}
