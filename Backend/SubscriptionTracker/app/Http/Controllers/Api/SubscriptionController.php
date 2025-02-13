<?php

namespace App\Http\Controllers\Api;

use App\DTO\SubscriptionDTO;
use App\Http\Controllers\Controller;
use App\Services\Interfaces\SubscriptionServiceInterface;
use App\Services\Interfaces\SubscriptionValidationServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    private SubscriptionServiceInterface $subscriptionService;
    private SubscriptionValidationServiceInterface $subscriptionValidationService;

    public function __construct(SubscriptionServiceInterface $subscriptionService, SubscriptionValidationServiceInterface $subscriptionValidationService)
    {
        $this->subscriptionService = $subscriptionService;
        $this->subscriptionValidationService = $subscriptionValidationService;
    }

    public function index(): JsonResponse
    {
        return response()->json($this->subscriptionService->getAllUsersSubscriptions(), 200);
    }

    public function create(Request $request): JsonResponse
    {
        $data = new SubscriptionDTO();
        $data = $this->subscriptionValidationService->validateSubscriptionStore($request);

        if (is_array($data) && !$data['success']) {
            return response()->json($data['errors'], 400);
        }

        return response()->json($this->subscriptionService->storeSubscription($data, Auth::user()->id), 201);
    }

    public function show(int $id): JsonResponse
    {
        $data = $this->subscriptionService->getUsersSubscriptionById($id, Auth::user()->id);
        if ($data == null) {
            return response()->json(['message' => 'Subscription Not found for this user.'], 404);
        }
        return response()->json($data, 200);
    }
    public function showAllSubscriptionForThisUser(): JsonResponse
    {
        $data = $this->subscriptionService->showUsersAllSubscriptions(Auth::user()->id);
        if ($data == null) {
            return response()->json(['message' => 'Subscription Not found for this user.'], 404);
        }
        return response()->json($data, 200);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = new SubscriptionDTO();
        $data = $this->subscriptionValidationService->validateSubscriptionUpdate($request);

        if (is_array($data) && !$data['success']) {
            return response()->json($data['errors'], 400);
        }

        if ($this->subscriptionService->updateSubscription($data, $id, Auth::user()->id)) {
            return response()->json(['message' => 'Subscription data Updated successfully'], 200);
        }
        return response()->json(['message' => 'Subscription data NOT Updated'], 500);
    }

    public function destroy(int $id): JsonResponse
    {
        $data = $this->subscriptionService->deleteUsersSubscription($id, Auth::user()->id);
        if (!$data) {
            return response()->json(['message' => "No valid subscription data found"], 404);
        }
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
