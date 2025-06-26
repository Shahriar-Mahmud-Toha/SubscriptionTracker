<!DOCTYPE html>
<html>

<head>
    <title>Subscription Expiration Reminder - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 0;
        }

        .container {
            background: #fff;
            max-width: 600px;
            margin: 30px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px #e0e0e0;
        }

        h2 {
            color: #2c3e50;
        }

        ul {
            padding-left: 20px;
        }

        li {
            margin-bottom: 12px;
            font-size: 16px;
        }

        .expired {
            color: #e74c3c;
            font-weight: bold;
        }

        .expiring {
            color: #f39c12;
            font-weight: bold;
        }

        .footer {
            margin-top: 30px;
            color: #888;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Subscription Expiration Reminder</h2>
        <p>Hello {{ $user->email }},</p>
        <p>
            This is a reminder from <strong>{{ config('app.name') }}</strong> about your subscription that is expiring soon or have already expired:
        </p>
        <ul>
            <li>
                <strong>{{ $subscription->name }}</strong> &mdash;
                @if ($subscription->date_of_expiration < now())
                    <span class="expired">Expired on {{ \Carbon\Carbon::parse($subscription->date_of_expiration)->format('M d, Y H:i') }}</span>
                    @else
                    <span class="expiring">Expires on {{ \Carbon\Carbon::parse($subscription->date_of_expiration)->format('M d, Y H:i') }}</span>
                    @endif
            </li>
        </ul>
        <div class="footer">
            Regards,<br>
            {{ config('app.name') }}
        </div>
    </div>
</body>

</html>