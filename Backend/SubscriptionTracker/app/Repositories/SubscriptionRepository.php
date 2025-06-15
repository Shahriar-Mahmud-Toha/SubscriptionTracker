<?php

namespace App\Repositories;

use App\Models\Subscription;
use App\Repositories\Contracts\SubscriptionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class SubscriptionRepository implements SubscriptionRepositoryInterface
{
    public function showUsersAllSubscriptions(int $authId): EloquentCollection|null
    {
        return Subscription::where('auth_id', $authId)->get();
    }

    public function showUsersAllSubscriptionsDescOrder(int $authId): EloquentCollection|null
    {
        return Subscription::where('auth_id', $authId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getUsersSubscriptionById(int $subsId, int $authId): Subscription|null
    {
        return Subscription::where('id', $subsId)->where('auth_id', $authId)->first();
    }

    public function getSubscriptionById(int $subsId): Subscription|null
    {
        return Subscription::find($subsId);
    }

    public function storeSubscription(array $subsData): Subscription|null
    {
        return Subscription::create($subsData);
    }
    public function updateSubscription(Subscription $prevSubsData, array $newSubsData): bool
    {
        return $prevSubsData->update($newSubsData);
    }
    public function deleteSubscription(Subscription $subsData): bool
    {
        return $subsData->delete();
    }
    public function deleteUsersSubscription(int $subsId, int $authId): bool
    {
        return Subscription::where('id', $subsId)->where('auth_id', $authId)->delete() > 0;
    }

    public function getAllUsersSubscriptions(): Collection
    {
        return Subscription::all();
    }
    public function searchSubscriptions(string $keyword, int $authId): Collection
    {
        return Subscription::where('auth_id', $authId)
            ->where(function ($query) use ($keyword) {
                $query->where('id', 'LIKE', "%{$keyword}%")
                    ->orWhere('name', 'LIKE', "%{$keyword}%")
                    ->orWhere('seller_info', 'LIKE', "%{$keyword}%")
                    ->orWhere('date_of_purchase', 'LIKE', "%{$keyword}%")
                    ->orWhere('reminder_time', 'LIKE', "%{$keyword}%")
                    ->orWhere('date_of_expiration', 'LIKE', "%{$keyword}%")
                    ->orWhere('duration', 'LIKE', "%{$keyword}%")
                    ->orWhere('account_info', 'LIKE', "%{$keyword}%")
                    ->orWhere('price', 'LIKE', "%{$keyword}%")
                    ->orWhere('currency', 'LIKE', "%{$keyword}%")
                    ->orWhere('comment', 'LIKE', "%{$keyword}%");
            })
            ->get();
    }
}
