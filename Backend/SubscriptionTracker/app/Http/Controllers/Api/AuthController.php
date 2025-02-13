<?php

namespace App\Http\Controllers\Api;

use App\DTO\AuthenticationDTO;
use App\DTO\UserDTO;
use App\Http\Controllers\Controller;
use App\Services\Interfaces\AuthServiceInterface;
use App\Services\Interfaces\UserValidationServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    private UserValidationServiceInterface $userValidationService;
    private AuthServiceInterface $authService;

    // Dependency injection of AuthServiceInterface and UserValidationServiceInterface via constructor
    public function __construct(AuthServiceInterface $authService, UserValidationServiceInterface $userValidationService)
    {
        $this->authService = $authService;
        $this->userValidationService = $userValidationService;
    }

    public function signupUser(Request $request)
    {
        $data = new AuthenticationDTO();
        $data = $this->userValidationService->validateUserSignup($request);
        if (is_array($data) && !$data['success']) {
            return response()->json($data['errors'], 400);
        }
        $data->role = 'user';
        return response()->json(['authData' => $this->authService->signup($data), 'message' => 'Account Created Successfully'], 201);
    }
    public function signupAdmin(Request $request)
    {
        $data = new AuthenticationDTO();
        $data = $this->userValidationService->validateUserSignup($request);
        if (is_array($data) && !$data['success']) {
            return response()->json($data['errors'], 400);
        }
        $data->role = 'admin';
        return response()->json(['authData' => $this->authService->signup($data), 'message' => 'Account Created Successfully'], 201);
    }

    public function login(Request $request)
    {
        $data = new AuthenticationDTO();
        $data = $this->userValidationService->validateUserLogin($request);
        if (is_array($data) && !$data['success']) {
            return response()->json($data['errors'], 400);
        }
        $sessionData = [
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'device_name' => $request->header('Device-Name', 'Unknown Device'),
        ];
        $tokens = $this->authService->loginUser($data, $sessionData);
        if ($tokens <= 0) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json(['tokens' => $tokens, 'message' => 'Login Successful'], 200);
    }
    // Get the authenticated user
    public function me()
    {
        return response()->json(['user' => Auth::user(), 'current_token' => JWTAuth::getToken()->get()], 200);
    }

    public function viewProfile()
    {
        return response()->json($this->authService->findAuthUserDetailsById(Auth::id()), 200);
    }

    public function logout()
    {
        $result = $this->authService->logout(JWTAuth::getToken(), Auth::user());
        //also true for access token.
        if ($result === -1) {
            return response()->json(['error' => 'This token Not Found in System'], 401);
        }
        if ($result === -2) {
            return response()->json(['error' => 'Token invalidation failed.'], 500);
        }
        if ($result == 0) {
            return response()->json(['error' => 'Session Not Deleted. Logout Unsuccessful'], 500);
        }

        return response()->json(['message' => 'Logout Successful'], 200);
    }
    public function refresh(Request $request)
    {
        try{
            $sessionData = [
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
                'device_name' => $request->header('Device-Name', 'Unknown Device'),
            ];
            $tokens = $this->authService->refreshToken(JWTAuth::getToken(), Auth::user(), $sessionData);
            
            //also true for access token.
            if ($tokens === -1) {
                return response()->json(['error' => 'This refresh token Not Found in System'], 401);
            }
            if ($tokens === -2) {
                return response()->json(['error' => 'Token invalidation failed.'], 500);
            }
            if ($tokens === -3) {
                return response()->json(['error' => 'Session update failed.'], 500);
            }
    
            return response()->json(['tokens' => $tokens, 'message' => 'Token Refresh Successful'], 201);
        }
        catch(\Exception $e){
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
}
