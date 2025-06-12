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
        try {
            return response()->json($this->subscriptionService->getAllUsersSubscriptions(), 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }

    public function create(Request $request): JsonResponse
    {
        try {
            $data = new SubscriptionDTO();
            $data = $this->subscriptionValidationService->validateSubscriptionStore($request);

            if (is_array($data) && !$data['success']) {
                return response()->json($data['errors'], 400);
            }

            if ($request->hasFile('file')) {
                $data->file_name = basename($request->file('file')->store('subscriptions'));
            }
            
            return response()->json($this->subscriptionService->storeSubscription($data, Auth::id()), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $data = $this->subscriptionService->getUsersSubscriptionById($id, Auth::id());
            if ($data == null) {
                return response()->json(['message' => 'Subscription Not found for this user.'], 404);
            }
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function search(Request $request): JsonResponse
    {
        try {
            $keyword = $request->input('keyword');

            if (!$keyword) {
                return response()->json(['message' => 'Search keyword is required'], 400);
            }
            $data = $this->subscriptionService->searchSubscriptions($keyword, Auth::id());
            if ($data == null) {
                return response()->json(['message' => 'No result found.'], 404);
            }
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function showAllSubscriptionForThisUser(): JsonResponse
    {
        try {
            $data = $this->subscriptionService->showUsersAllSubscriptions(Auth::id());
            if ($data == null) {
                return response()->json(['message' => 'Subscription Not found for this user.'], 404);
            }
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $data = new SubscriptionDTO();
            $data = $this->subscriptionValidationService->validateSubscriptionUpdate($request);

            if (is_array($data) && !$data['success']) {
                return response()->json($data['errors'], 400);
            }
            if ($this->subscriptionService->updateSubscription($data, $id, Auth::id())) {
                return response()->json(['message' => 'Subscription data Updated successfully'], 200);
            }
            return response()->json(['message' => 'Subscription data NOT Updated'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
    public function updateFile(Request $request, int $id): JsonResponse
    {
        try {
            $data = $this->subscriptionValidationService->validateSubscriptionFileUpdate($request);

            if (is_array($data) && !$data['success']) {
                return response()->json($data['errors'], 400);
            }
            $fileName = null;
            if ($request->hasFile('file')) {
                $fileName = basename($request->file('file')->store('subscriptions'));
            }
            if ($this->subscriptionService->updateSubscriptionsFile($id, Auth::id(), $fileName)) {
                return response()->json(['message' => 'This Subscription\'s file updated successfully'], 200);
            }
            return response()->json(['message' => 'Subscription data NOT Updated'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $data = $this->subscriptionService->deleteUsersSubscription($id, Auth::id());
            if (!$data) {
                return response()->json(['message' => "No valid subscription data found"], 404);
            }
            return response()->json(['message' => 'Subscription deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
    }
}
