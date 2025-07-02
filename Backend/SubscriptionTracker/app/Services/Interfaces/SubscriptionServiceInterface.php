<?php

namespace App\Services\Interfaces;

use App\DTO\SubscriptionDTO;
use App\Models\Authentication;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface SubscriptionServiceInterface
{
    public function getAllUsersSubscriptions(): Collection;
    public function showUsersAllSubscriptions(int $authId): EloquentCollection|null;
    public function getUsersSubscriptionById(int $subsId, int $authId): Subscription|null;
    public function getSubscriptionById(int $subsId): Subscription|null;
    public function storeSubscription(SubscriptionDTO $subsData, Authentication $authData, string $timezone): Subscription|null;
    public function updateSubscription(SubscriptionDTO $newSubsData, int $subsId, Authentication $authData, string $timezone): bool;
    public function deleteSubscription(int $subsId, Authentication $authData): bool;
    public function deleteUsersSubscription(int $subsId, int $authId): bool;
    public function searchSubscriptions(string $keyword, int $authId): Collection;
    public function updateSubscriptionsFile(int $subsId, int $authId, string $fileName): bool;
}
