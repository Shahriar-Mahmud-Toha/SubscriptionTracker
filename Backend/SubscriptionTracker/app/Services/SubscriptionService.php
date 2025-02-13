<?php

namespace App\Services;

use App\DTO\SubscriptionDTO;
use App\Models\Subscription;
use App\Repositories\Contracts\SubscriptionRepositoryInterface;
use App\Services\Interfaces\SubscriptionServiceInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class SubscriptionService implements SubscriptionServiceInterface
{
    protected $subscriptionRepository;

    public function __construct(SubscriptionRepositoryInterface $subscriptionRepository)
    {
        $this->subscriptionRepository = $subscriptionRepository;
    }

    public function getAllUsersSubscriptions(): Collection
    {
        return $this->subscriptionRepository->getAllUsersSubscriptions();
    }
    public function showUsersAllSubscriptions(int $authId): EloquentCollection|null
    {
        return $this->subscriptionRepository->showUsersAllSubscriptions($authId);
    }
    public function getUsersSubscriptionById(int $subsId, int $authId): Subscription|null
    {
        return $this->subscriptionRepository->getUsersSubscriptionById($subsId, $authId);
    }
    public function getSubscriptionById(int $subsId): Subscription|null
    {
        return $this->subscriptionRepository->getSubscriptionById($subsId);
    }
    public function storeSubscription(SubscriptionDTO $subsData, int $authId): Subscription|null
    {
        return $this->subscriptionRepository->storeSubscription(array_merge($subsData->toArray(), ['auth_id' => $authId]));
    }
    public function updateSubscription(SubscriptionDTO $newSubsData, int $subsId, int $authId): bool
    {
        $currSubsData = $this->subscriptionRepository->getUsersSubscriptionById($subsId, $authId);
        if (!$currSubsData) {
            return false; // Subscription not found for this user
        }
        if (!$newSubsData->name) {
            $newSubsData->name = $currSubsData->name;
        }
        if (!$newSubsData->date_of_expiration) {
            $newSubsData->date_of_expiration = Carbon::parse($currSubsData->date_of_expiration);
        }
        return $this->subscriptionRepository->updateSubscription($currSubsData, $newSubsData->toArrayWithNull());
    }

    public function deleteSubscription(int $subsId): bool
    {
        $currSubsData = $this->subscriptionRepository->getSubscriptionById($subsId);

        if (!$currSubsData) {
            return false; // Subscription not found for this user
        }
        return $this->subscriptionRepository->deleteSubscription($currSubsData);
    }
    public function deleteUsersSubscription(int $subsId, int $authId): bool
    {
        return $this->subscriptionRepository->deleteUsersSubscription($subsId, $authId);
    }
}
