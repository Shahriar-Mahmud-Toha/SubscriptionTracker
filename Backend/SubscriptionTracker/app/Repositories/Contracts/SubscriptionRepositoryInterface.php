<?php

namespace App\Repositories\Contracts;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

interface SubscriptionRepositoryInterface
{
    public function getAllUsersSubscriptions(): Collection;
    public function showUsersAllSubscriptions(int $authId): EloquentCollection|null;
    public function showUsersAllSubscriptionsDescOrder(int $authId): EloquentCollection|null;
    public function getUsersSubscriptionById(int $subsId, int $authId): Subscription|null;
    public function getSubscriptionById(int $subsId): Subscription|null;
    public function storeSubscription(array $subsData): Subscription|null;
    public function updateSubscription(Subscription $prevSubsData, array $newSubsData): bool;
    public function deleteSubscription(Subscription $subsData): bool;
    public function deleteUsersSubscription(int $subsId, int $authId): bool;
    public function searchSubscriptions(string $keyword, int $authId): Collection;
    public function showAllUsersAlmostExpiredSubscriptions(): EloquentCollection|null;
}
