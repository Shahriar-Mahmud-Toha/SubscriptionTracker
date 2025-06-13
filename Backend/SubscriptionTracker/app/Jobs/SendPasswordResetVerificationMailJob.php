<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPasswordResetVerificationMailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $token;
    public string $email;

    /**
     * Create a new job instance.
     */
    public function __construct(string $token, string $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::send(
                'emails.password_reset',
                ['token' => $this->token],
                function ($message) {
                    $message->to($this->email)
                        ->subject('Reset Password Notification');
                }
            );

        } catch (\Exception $e) {
            Log::error('Failed to send password reset email', [
                'email' => $this->email,
                'error' => $e->getMessage()
            ]);

            $this->fail($e);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Password reset email job failed', [
            'email' => $this->email,
            'error' => $exception->getMessage()
        ]);
    }
}
