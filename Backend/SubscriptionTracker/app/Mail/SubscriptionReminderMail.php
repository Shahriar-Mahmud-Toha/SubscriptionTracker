<?php

namespace App\Mail;

use App\Models\Authentication;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SubscriptionReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public Authentication $user;
    public $subscription;
    public string $timezone;


    public function __construct($user, $subscription, string $timezone = 'UTC')
    {
        $this->user = $user;
        $this->subscription = $subscription;
        $this->timezone = $timezone;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Subscription Reminder Notification',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.subscription_reminder',
            with: [
                'user' => $this->user,
                'subscription' => $this->subscription,
                'timezone' => $this->timezone
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
