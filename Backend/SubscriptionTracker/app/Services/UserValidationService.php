<?php

namespace App\Services;

use App\DTO\AuthenticationDTO;
use App\DTO\UserDTO;
use App\Enums\Gender;
// use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Interfaces\UserValidationServiceInterface;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserValidationService implements UserValidationServiceInterface
{
    // protected $userRepository;

    // public function __construct(UserRepositoryInterface $userRepository)
    // {
    //     $this->userRepository = $userRepository;
    // }

    public function validateUserSignup(Request $request)
    {
        $validator = Validator::make($request->only(['email', 'password', 'password_confirmation']), [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:authentications'],
            'password' => ['required', 'string', 'min:3', 'confirmed'],
        ], [
            'email.required' => 'The email field is required.',
            'email.string' => 'The email field must be string.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Max email address length is 255 characters.',
            'email.unique' => 'This email is already registered. Please use a different email.',

            'password.required' => 'The password field is required.',
            'password.string' => 'The password field must be string.',
            'password.min' => 'The password must be at least 3 characters long.',
            'password.confirmed' => 'Password confirmation does not match.',
        ]);
        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }
        $validatedData = $validator->validated();

        $authenticationDTO = new AuthenticationDTO();
        $authenticationDTO->email = $validatedData['email'];
        $authenticationDTO->password = $validatedData['password'];

        return $authenticationDTO;
    }
    public function validateUserLogin(Request $request)
    {
        $validator = Validator::make($request->only(['email', 'password']), [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:3'],
        ], [
            'email.required' => 'The email field is required.',
            'email.string' => 'The email field must be string.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Max email address length is 255 characters.',
            'password.required' => 'The password field is required.',
            'password.string' => 'The password field must be string.',
            'password.min' => 'The password must be at least 3 characters long.',
        ]);
        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }
        $validatedData = $validator->validated();

        $authDTO = new AuthenticationDTO();
        $authDTO->email = $validatedData['email'];
        $authDTO->password = $validatedData['password'];

        return $authDTO;
    }

    public function validateUser(Request $request, int $auth_id)
    {
        $validator = Validator::make($request->only(['first_name', 'last_name', 'dob']), [
            'first_name' => ['string', 'max:255'],
            'last_name' => ['string', 'max:255'],
            'dob' => ['date'],
        ], [
            'first_name.string' => 'The first name must be a string.',
            'first_name.max' => 'The first name may not be greater than 255 characters.',

            'last_name.string' => 'The last name must be a string.',
            'last_name.max' => 'The last name may not be greater than 255 characters.',

            'dob.date' => 'The date of birth must be a valid date.',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }

        // If validation passes, return a new UserDTO
        $validatedData = $validator->validated();

        $userDTO = new UserDTO();
        $userDTO->auth_id = $auth_id;
        if (!empty($validatedData['first_name'])) {
            $userDTO->first_name = $validatedData['first_name'];
        }
        if (!empty($validatedData['last_name'])) {
            $userDTO->last_name = $validatedData['last_name'];
        }
        if (!empty($validatedData['dob'])) {
            $userDTO->dob = Carbon::parse($validatedData['dob']);
        }

        return $userDTO;
    }
}
