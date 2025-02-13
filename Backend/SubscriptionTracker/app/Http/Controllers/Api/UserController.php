<?php

namespace App\Http\Controllers\Api;

use App\DTO\UserDTO;
use App\Http\Controllers\Controller;
use App\Services\Interfaces\UserServiceInterface;
use App\Services\Interfaces\UserValidationServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    private UserServiceInterface $userService;
    private UserValidationServiceInterface $userValidationService;

    public function __construct(UserServiceInterface $userService, UserValidationServiceInterface $userValidationService)
    {
        $this->userService = $userService;
        $this->userValidationService = $userValidationService;
    }

    public function index(): JsonResponse
    {
        return response()->json($this->userService->getAllUsers(), 200);
    }

    public function create(Request $request): JsonResponse
    {
        $authId = Auth::user()->id;
        $user = $this->userService->getUserByAuthId($authId);
        if ($user != null) {
            return $this->update($request);
        }
        $data = new UserDTO();
        $data = $this->userValidationService->validateUser($request, $authId);

        if (is_array($data) && !$data['success']) {
            return response()->json($data['errors'], 400);
        }
        return response()->json($this->userService->createUser($data), 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        if ($user == null) {
            return response()->json(['message' => 'No Valid User found.'], 404);
        }
        return response()->json($user, 200);
    }

    // Update user (PATCH)
    public function update(Request $request): JsonResponse
    {
        $user = $this->userService->getUserByAuthId(Auth::user()->id);
        if ($user == null) {
            return $this->create($request);
        }
        $data = new UserDTO();
        $data = $this->userValidationService->validateUser($request, $user->auth_id);
        // Validate input data
        if (is_array($data) && !$data['success']) {
            return response()->json($data['errors'], 304);
        }
        if($this->userService->updateUser($user->id, $data)){
            return response()->json(['message' => 'User data Updated successfully'], 200);
        }
        return response()->json(['message' => 'User NOT Updated'], 500);
    }

    public function destroy($id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        if ($user == null) {
            return response()->json("No Valid User found.", 404);
        }
        $data = $this->userService->deleteUser($id);
        if ($data) {
            return response()->json(['message' => 'User deleted successfully'], 200);
        }
        return response()->json(['message' => 'User NOT deleted'], 500);
    }
}
