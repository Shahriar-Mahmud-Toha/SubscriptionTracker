<?php

namespace App\Services\Interfaces;

use Illuminate\Http\Request; // Import the Request class
use App\DTO\UserDTO; // Import the UserDTO class

interface UserValidationServiceInterface
{
    public function validateUserSignup(Request $request);
    public function validateUserLogin(Request $request);
    public function validateUser(Request $request, int $auth_id);
    public function validateUserEmailUpdate(Request $request);
    public function validateUserIdFromToken(Request $request);
    public function validateUserPasswordUpdate(Request $request, string $authId);
    public function validateExistingUserEmail(Request $request);
    public function validatePasswordReset(Request $request);
}
