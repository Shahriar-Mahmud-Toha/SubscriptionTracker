<?php

namespace App\Jobs;

use App\Models\Authentication;
use Illuminate\Support\Facades\Notification;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendVerificationMailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Authentication $user;
    public string $frontendUrl;
    public $customEmail;

    public function __construct($user, $frontendUrl, $customEmail = null)
    {
        $this->user = $user;
        $this->frontendUrl = $frontendUrl;
        $this->customEmail = $customEmail;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $notification = new CustomVerifyEmail($this->frontendUrl);
        if ($this->customEmail) {
            Notification::route('mail', $this->customEmail)
                ->notify($notification);
        } else {
            $this->user->notify($notification);
        }
    }
    public function failed(\Exception $exception): void
    {
        Log::error('SendVerificationMailJob failed', [
            'user_id' => $this->user->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
