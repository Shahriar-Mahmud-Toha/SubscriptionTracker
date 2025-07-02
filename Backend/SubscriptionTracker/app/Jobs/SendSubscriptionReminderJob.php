<?php

namespace App\Jobs;

use App\Mail\SubscriptionReminderMail;
use App\Models\Authentication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendSubscriptionReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Authentication $user;
    public $subscription;
    public string $timezone;

    /**
     * Create a new job instance.
     */
    public function __construct($user, $subscription, string $timezone = 'UTC')
    {
        $this->user = $user;
        $this->subscription = $subscription;
        $this->timezone = $timezone;
    }

    public function handle(): void
    {
        Mail::to($this->user->email)
            ->send(new SubscriptionReminderMail(
                $this->user,
                $this->subscription,
                $this->timezone
            ));
    }
}
