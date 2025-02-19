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
    public function validateUserPasswordUpdate(Request $request);
}
