<?php

namespace App\Services;

use App\DTO\AuthenticationDTO;
use App\DTO\UserDTO;
use App\Enums\Gender;
use App\Repositories\Contracts\AuthRepositoryInterface;
// use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Interfaces\UserValidationServiceInterface;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserValidationService implements UserValidationServiceInterface
{
    // protected $userRepository;
    protected $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }
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
    public function validateUserEmailUpdate(Request $request)
    {
        $validator = Validator::make($request->only(['email']), [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:authentications'],
        ], [
            'email.required' => 'The email field is required.',
            'email.string' => 'The email field must be string.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Max email address length is 255 characters.',
            'email.unique' => 'This email is already registered. Please use a different email.',
        ]);
        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }
        $validatedData = $validator->validated();

        return $validatedData['email'];
    }
    public function validateUserIdFromToken(Request $request)
    {
        $validator = Validator::make($request->only(['token']), [
            'token' => ['required', 'string'],
        ], [
            'token.required' => 'The token field is required.',
            'token.string' => 'The token field must be string.',
        ]);
        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }
        $validatedData = $validator->validated();
        $token = $validatedData['token'];
        try {
            JWTAuth::setToken($token);
            JWTAuth::parseToken();
            $payload = JWTAuth::getPayload();

            if ($payload->get('type') !== 'signup') {
                return [
                    'success' => false,
                    'errors' => ['token' => ['Invalid token type']],
                ];
            }
            $userId = $payload->get('sub');
            if (!$userId) {
                return [
                    'success' => false,
                    'errors' => ['token' => ['User ID not found in token']],
                ];
            }

            return $userId;

        } catch (\Exception $e) {
            return [
                'success' => false,
                'errors' => ['token' => ['Invalid or expired token']],
            ];
        }
    }
    public function validateUserPasswordUpdate(Request $request, string $authId)
    {
        $validator = Validator::make($request->only(['current_password', 'password', 'password_confirmation']), [
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:3', 'confirmed'],
        ], [
            'current_password.required' => 'The current password field is required.',
            'current_password.string' => 'The current password field must be string.',
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
        $authData = $this->authRepository->findAuthDataById($authId);

        if (!Hash::check($validatedData['current_password'], $authData->password)) {
            return [
                'success' => false,
                'errors' => ['current_password' => ['Current password is incorrect.']],
            ];
        }

        return $validatedData['password'];
    }
    public function validateExistingUserEmail(Request $request)
    {
        $validator = Validator::make($request->only(['email']), [
            'email' => ['required', 'string', 'email', 'max:255', 'exists:authentications'],
        ], [
            'email.required' => 'The email field is required.',
            'email.string' => 'The email field must be string.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Max email address length is 255 characters.',
            'email.exists' => 'No user found with this email.',
        ]);
        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->messages(),
            ];
        }
        $validatedData = $validator->validated();

        return $validatedData['email'];
    }
    public function validatePasswordReset(Request $request)
    {
        $validator = Validator::make($request->only(['token', 'password', 'password_confirmation']), [
            'token' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:3', 'confirmed'],
        ], [
            'token.required' => 'The token field is required.',
            'token.string' => 'The token field must be string.',
            'token.max' => 'Max token length is 255 characters.',

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

        return [
            'token' => $validatedData['token'],
            'password' => $validatedData['password'],
        ];
    }
}
