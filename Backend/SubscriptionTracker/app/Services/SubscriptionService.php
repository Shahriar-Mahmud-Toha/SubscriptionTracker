<?php

namespace App\Services;

use App\DTO\SubscriptionDTO;
use App\Models\Subscription;
use App\Repositories\Contracts\SubscriptionRepositoryInterface;
use App\Services\Interfaces\SubscriptionServiceInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SubscriptionService implements SubscriptionServiceInterface
{
    protected $subscriptionRepository;

    public function __construct(SubscriptionRepositoryInterface $subscriptionRepository)
    {
        $this->subscriptionRepository = $subscriptionRepository;
    }

    public function getAllUsersSubscriptions(): Collection
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () {
            return $this->subscriptionRepository->getAllUsersSubscriptions();
        });
    }
    public function sendEmailNotificationBeforeSubsExpire(): bool
    {
        throw new \Exception('This method is not implemented yet.');
        
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () {
            $data = $this->subscriptionRepository->showAllUsersAlmostExpiredSubscriptions();
            if ($data->isEmpty()) {
                return false; // No subscriptions to notify
            }
            foreach ($data as $subscription) {
                $email = $subscription->email;
                $name = $subscription->name;
                $dateOfExpiration = Carbon::parse($subscription->date_of_expiration)->format('Y-m-d');
                // Here you would typically send an email notification
                // For example, using a Mail facade or a notification system
                // Mail::to($email)->send(new SubscriptionReminder($name, $dateOfExpiration));
            }
        });
    }
    public function showUsersAllSubscriptions(int $authId): EloquentCollection|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($authId) {
            return $this->subscriptionRepository->showUsersAllSubscriptionsDescOrder($authId);
        });
    }
    public function getUsersSubscriptionById(int $subsId, int $authId): Subscription|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($subsId, $authId) {
            return $this->subscriptionRepository->getUsersSubscriptionById($subsId, $authId);
        });
    }
    public function getSubscriptionById(int $subsId): Subscription|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($subsId) {
            return $this->subscriptionRepository->getSubscriptionById($subsId);
        });
    }
    public function storeSubscription(SubscriptionDTO $subsData, int $authId): Subscription|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($subsData, $authId) {
            return $this->subscriptionRepository->storeSubscription(array_merge($subsData->toArray(), ['auth_id' => $authId]));
        });
    }
    public function updateSubscription(SubscriptionDTO $newSubsData, int $subsId, int $authId): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($newSubsData, $subsId, $authId) {
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
        });
    }
    public function updateSubscriptionsFile(int $subsId, int $authId, string $fileName): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($subsId, $authId, $fileName) {
            $currSubsData = $this->subscriptionRepository->getUsersSubscriptionById($subsId, $authId);
            if (!$currSubsData) {
                return false; // Subscription not found for this user
            }
            if (Storage::disk('local')->exists("subscriptions/{$currSubsData->file_name}")) {
                Storage::disk('local')->delete("subscriptions/{$currSubsData->file_name}");
            }
            if($fileName){
                $currSubsData->file_name = $fileName;
            }
            else{
                $currSubsData->file_name = null;
            }
            return $this->subscriptionRepository->updateSubscription($currSubsData, $currSubsData->toArray());
        });
    }

    public function deleteSubscription(int $subsId): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
        return DB::transaction(function () use ($subsId) {
            $currSubsData = $this->subscriptionRepository->getSubscriptionById($subsId);

            if (!$currSubsData) {
                return false; // Subscription not found for this user
            }
            return $this->subscriptionRepository->deleteSubscription($currSubsData);
        });
    }
    public function deleteUsersSubscription(int $subsId, int $authId): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
        return DB::transaction(function () use ($subsId, $authId) {
            return $this->subscriptionRepository->deleteUsersSubscription($subsId, $authId);
        });
    }
    public function searchSubscriptions(string $keyword, int $authId): Collection
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () use ($keyword, $authId) {
            return $this->subscriptionRepository->searchSubscriptions($keyword, $authId);
        });
    }
}
