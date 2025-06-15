<?php

namespace App\Services;

use App\DTO\SubscriptionDTO;
use App\Jobs\SendSubscriptionReminderJob;
use App\Models\Authentication;
use App\Models\Subscription;
use App\Repositories\Contracts\SubscriptionRepositoryInterface;
use App\Services\Interfaces\AuthServiceInterface;
use App\Services\Interfaces\SubscriptionServiceInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;

class SubscriptionService implements SubscriptionServiceInterface
{
    protected $subscriptionRepository;
    protected $authService;

    public function __construct(SubscriptionRepositoryInterface $subscriptionRepository, AuthServiceInterface $authService)
    {
        $this->subscriptionRepository = $subscriptionRepository;
        $this->authService = $authService;
    }

    public function getAllUsersSubscriptions(): Collection
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        return DB::transaction(function () {
            return $this->subscriptionRepository->getAllUsersSubscriptions();
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
    public function storeSubscription(SubscriptionDTO $subsData, Authentication $authData): Subscription|null
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($subsData, $authData) {

            $newData = array_merge($subsData->toArray(), ['auth_id' => $authData->id]);
            $jobId = $this->scheduleSubscriptionReminder($authData, (object)$newData);
            if (!$jobId) {
                DB::rollBack();
                return null;
            }
            $result = $this->subscriptionRepository->storeSubscription(array_merge($newData, ['reminder_job_id' => $jobId]));
            if (!$result) {
                DB::rollBack();
                return null;
            }
            return $result;
        });
    }
    public function updateSubscription(SubscriptionDTO $newSubsData, int $subsId, Authentication $authData): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        return DB::transaction(function () use ($newSubsData, $subsId, $authData) {
            $currSubsData = $this->subscriptionRepository->getUsersSubscriptionById($subsId, $authData->id);
            if (!$currSubsData) {
                return false; // Subscription not found for this user
            }
            if (!$newSubsData->name) {
                $newSubsData->name = $currSubsData->name;
            }
            if (!$newSubsData->date_of_expiration) {
                $newSubsData->date_of_expiration = Carbon::parse($currSubsData->date_of_expiration);
            }
            $isReminderJobNeedUpdate = false;
            if ($newSubsData->reminder_time && !$currSubsData->reminder_time) {
                if ($newSubsData->reminder_time->isPast()) {
                    return false;
                }
                $isReminderJobNeedUpdate = true;
            } else if (!$currSubsData->reminder_time->eq($newSubsData->reminder_time)) {
                if ($newSubsData->reminder_time->isPast()) {
                    return false;
                }
                $isReminderJobNeedUpdate = true;
            } else if (!$newSubsData->date_of_expiration->eq($currSubsData->date_of_expiration)) {
                if ($newSubsData->date_of_expiration->isPast()) {
                    return false;
                }
                $isReminderJobNeedUpdate = true;
            }
            $newDataArray = $newSubsData->toArrayWithNull();
            if ($isReminderJobNeedUpdate) {
                $this->deleteQueuedJobById('reminder', $currSubsData->reminder_job_id);
                $jobId = $this->scheduleSubscriptionReminder($authData, (object)$newDataArray);
                if (!$jobId) {
                    DB::rollBack();
                    return false; // Failed to schedule reminder job
                }
                $result = $this->subscriptionRepository->updateSubscription($currSubsData, array_merge($newDataArray, ['reminder_job_id' => $jobId]));
                if (!$result) {
                    DB::rollBack();
                    return false; // Failed to update subscription
                }
                return $result;
            }
            $result = $this->subscriptionRepository->updateSubscription($currSubsData, $newDataArray);
            return $result;
        });
    }

    public function scheduleSubscriptionReminder($user, $subscription): string|null
    {
        $delayUntil = isset($subscription->reminder_time) ? Carbon::parse($subscription->reminder_time) : Carbon::parse($subscription->date_of_expiration);

        $job = new SendSubscriptionReminderJob($user, $subscription);
        $jobId = Queue::later($delayUntil, $job, null, 'reminder');
        return $jobId;
    }
    public function deleteQueuedJobById(string $queue, string $jobId): bool
    {
        // 1. Check the main queue (list)
        $redisQueueKey = 'queues:' . $queue;
        $jobs = Redis::lrange($redisQueueKey, 0, -1);
        foreach ($jobs as $jobPayload) {
            $payload = json_decode($jobPayload, true);
            if (isset($payload['id']) && $payload['id'] == $jobId) {
                Redis::lrem($redisQueueKey, 1, $jobPayload);
                return true;
            }
        }

        // 2. Check the delayed queue (sorted set)
        $delayedKey = $redisQueueKey . ':delayed';
        $delayedJobs = Redis::zrange($delayedKey, 0, -1);
        foreach ($delayedJobs as $jobPayload) {
            $payload = json_decode($jobPayload, true);
            if (isset($payload['id']) && $payload['id'] == $jobId) {
                Redis::zrem($delayedKey, $jobPayload);
                return true;
            }
        }

        return false;
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
            if ($fileName) {
                $currSubsData->file_name = $fileName;
            } else {
                $currSubsData->file_name = null;
            }
            return $this->subscriptionRepository->updateSubscription($currSubsData, $currSubsData->toArray());
        });
    }

    public function deleteSubscription(int $subsId, Authentication $authData): bool
    {
        DB::statement('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
        return DB::transaction(function () use ($subsId, $authData) {
            $currSubsData = $this->subscriptionRepository->getSubscriptionById($subsId);

            if (!$currSubsData || !$authData) {
                return false;
            }
            if ($currSubsData->auth_id !== $authData->id) {
                return false;
            }
            $result = $this->subscriptionRepository->deleteSubscription($currSubsData);
            if (!$result) {
                return false; // Failed to delete subscription
            }
            $this->deleteQueuedJobById('reminder', $currSubsData->reminder_job_id);
            return true;
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
