<?php

namespace App\Http\Controllers\Api;

use App\DTO\AuthenticationDTO;
use App\Http\Controllers\Controller;
use App\Jobs\SendVerificationMailJob;
use App\Services\Interfaces\AuthServiceInterface;
use App\Services\Interfaces\UserValidationServiceInterface;
use Illuminate\Http\JsonResponse;
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
        try {
            $data = $this->userValidationService->validateUserSignup($request);
            if (is_array($data) && !$data['success']) {
                return response()->json($data['errors'], 400);
            }
            $authData = new AuthenticationDTO();
            $authData = $data['authentication'];
            $authData->role = 'user';
            $result = $this->authService->signup($authData, $data['timezone_preferred']);
            if (!$result) {
                return response()->json(['message' => 'Account Creation Failed'], 500);
            }
            return response()->json(['token' => $result, 'message' => 'An email verification link has been sent to your email. Please check your inbox and click the link to verify your account.'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function verifyEmail(Request $request): JsonResponse
    {
        try {
            $id = $request->query('id');
            $hash = $request->query('hash');
            if (!$id) {
                return response()->json(['message' => 'Invalid verification link: missing user ID'], 400);
            }
            $user = $this->authService->findAuthUserDetailsById((int)$id);
            if (!$user) {
                return response()->json(['message' => 'No Valid user found.'], 400);
            }
            if ($user->email_verified_at) {
                return response()->json(['message' => 'Email already verified. You can login!'], 200);
            }
            if (!hash_equals(sha1($user->email), $hash)) {
                return response()->json(['message' => 'Invalid verification link'], 403);
            }
            $user->markEmailAsVerified();

            return response()->json(['message' => 'Email successfully verified. You can login!'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function reVerifyEmail(Request $request): JsonResponse
    {
        try {
            $data = $this->userValidationService->validateUserIdFromToken($request);
            if (is_array($data) && !$data['success']) {
                return response()->json($data['errors'], 400);
            }
            $user = $this->authService->findAuthUserDetailsById($data);
            if (!$user) {
                return response()->json(['message' => 'No Valid user found.'], 400);
            }
            if ($user->email_verified_at) {
                return response()->json(['message' => 'Email already verified. You can login!'], 200);
            }
            $urls= $this->authService->generateVerificationUrls($user);
            SendVerificationMailJob::dispatch($user, $urls['frontend_url'])->onQueue('low');
            return response()->json(['message' => 'Verification link sent!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function signupAdmin(Request $request)
    {
        try {
            $data = new AuthenticationDTO();
            $data = $this->userValidationService->validateUserSignup($request);
            if (is_array($data) && !$data['success']) {
                return response()->json($data['errors'], 400);
            }
            $data->role = 'admin';
            $result = $this->authService->signup($data);
            if (!$result) {
                return response()->json(['message' => 'Account Creation Failed'], 500);
            }
            return response()->json(['message' => 'An email verification link has been sent to your email. Please check your inbox and click the link to verify your account.'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $reqData = $this->userValidationService->validateUserRequestHeader($request);
            if (is_array($reqData) && !$reqData['success']) {
                return response()->json(["message" => $reqData['errors']], 400);
            }
            $data = $this->userValidationService->validateUserLogin($request);
            if (is_array($data) && !$data['success']) {
                return response()->json(["message" => $data['errors']], 400);
            }
            $authData = new AuthenticationDTO();
            $authData = $data['authentication'];
            $sessionData = [
                'ip_address' => $request->header('X-Client-IP'),
                'device_info' => $request->header('X-Device-Info'),
            ];
            $tokens = $this->authService->loginUser($authData, $sessionData, $data['timezone_last_known']);
            if ($tokens <= 0) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            return response()->json(['tokens' => $tokens, 'message' => 'Login Successful'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    // Get the authenticated user
    public function me()
    {
        try {
            $authData = $this->authService->findAuthUserDetailsById(Auth::id());
            return response()->json(['user' => $authData, 'current_token' => JWTAuth::getToken()->get()], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }

    public function viewProfile()
    {
        try {
            $data = $this->authService->findAuthUserDetailsById(Auth::id());
            if (!$data) {
                return response()->json(['error' => 'Operation failed.'], 500);
            }
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }

    public function logout()
    {
        try {
            $authData = $this->authService->findAuthDataById(Auth::id());
            if (!$authData->email_verified_at) {
                return response()->json(['error' => 'Account is inactive. Access denied.'], 403);
            }
            $result = $this->authService->logout(JWTAuth::getToken());
            //also true for access token.
            if ($result === 1) {
                return response()->json(['message' => 'Logout Successful'], 200);
            }
            if ($result === -1) {
                return response()->json(['error' => 'Session Not Found in System'], 500);
            }
            return response()->json(['error' => 'Token invalidation failed.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function refresh()
    {
        try {
            $authData = $this->authService->findAuthDataById(Auth::id());
            if (!$authData->email_verified_at) {
                return response()->json(['error' => 'Account is inactive. Access denied.'], 403);
            }
            $tokens = $this->authService->refreshToken(JWTAuth::getToken(), $authData);

            if ($tokens === -1) {
                return response()->json(['error' => 'Token invalidation failed.'], 500);
            }
            if ($tokens === -2) {
                return response()->json(['error' => 'Failed to add token in allowed list.'], 500);
            }

            return response()->json(['tokens' => $tokens, 'message' => 'Token Refresh Successful'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function getAllCount(): JsonResponse
    {
        try {
            return response()->json(["data" => $this->authService->getUsersStatistics()], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function updateEmail(Request $request): JsonResponse
    {
        try {
            $email = $this->userValidationService->validateUserEmailUpdate($request);
            if (is_array($email) && !$email['success']) {
                return response()->json($email['errors'], 400);
            }

            if ($this->authService->updateEmail(Auth::id(), $email)) {
                return response()->json(['message' => 'An email verification link has been sent to your email. Please check your inbox and click the link to verify your account.'], 200);
            }
            return response()->json(["message" => "Operation Failed"], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function verifyEmailUpdate(Request $request): JsonResponse
    {
        try {
            $id = $request->query('id');
            $hash = $request->query('hash');
            if (!$id) {
                return response()->json(['message' => 'Invalid verification link: missing user ID'], 400);
            }
            $user = $this->authService->findAuthDataById((int)$id);
            if (!$user) {
                return response()->json(['message' => 'No Valid user found.'], 400);
            }
            if (!hash_equals(sha1($user->email), $hash)) {
                return response()->json(['message' => 'Invalid verification link'], 403);
            }
            $result = $this->authService->verifyEmailUpdate($user, $hash);
            if (!$result) {
                return response()->json(['message' => 'Email verification failed.'], 500);
            }

            return response()->json(['message' => 'Email successfully verified and Updated.'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function updatePassword(Request $request): JsonResponse
    {
        try {
            $authId = Auth::id();
            $password = $this->userValidationService->validateUserPasswordUpdate($request, $authId);
            if (is_array($password) && !$password['success']) {
                return response()->json($password['errors'], 400);
            }
            if ($this->authService->updatePassword($authId, $password)) {
                return response()->json(['message' => 'Password Updated Successfully!'], 200);
            }
            return response()->json(["message" => "Operation Failed"], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.', 'details' => $e->getMessage()], 500);
        }
    }
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $email = $this->userValidationService->validateExistingUserEmail($request);
            if (is_array($email) && !$email['success']) {
                return response()->json($email['errors'], 400);
            }
            if ($this->authService->forgotPassword($email)) {
                return response()->json(['message' => 'Password reset link sent to your email.'], 200);
            }
            return response()->json(["message" => "Operation Failed"], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.', 'details' => $e->getMessage()], 500);
        }
    }
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $data = $this->userValidationService->validatePasswordReset($request);
            if (!empty($data['errors'])) {
                return response()->json($data['errors'], 400);
            }
            $result = $this->authService->resetPassword($data['token'], $data['password']);
            if ($result > 0) {
                return response()->json(['message' => 'Password reset successfully!'], 200);
            }
            if ($result == -1) {
                return response()->json(['message' => 'Invalid or expired token.'], 400);
            }
            if ($result == 0) {
                return response()->json(['message' => 'No password reset request found for this user.'], 400);
            }
            return response()->json(["message" => "Operation Failed"], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.', 'details' => $e->getMessage()], 500);
        }
    }
}
