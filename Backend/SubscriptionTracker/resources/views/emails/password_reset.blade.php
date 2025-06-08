<!DOCTYPE html>
<html>

<head>
    <title>Reset Your Password - Subscription Tracker</title>
    <style>
        .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 12px 0;
            cursor: pointer;
            border-radius: 4px;
        }

        .container {
            max-width: 640px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            border: 1px solid #eee;
            padding: 24px;
            border-radius: 8px;
            background: #fafafa;
        }

        .footer {
            margin-top: 32px;
            color: #888;
            font-size: 13px;
        }
        .maxW{
            max-width: 90%;
            word-break: break-all;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Reset Your Password</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your {{ env('APP_NAME') }} account.</p>
        @php
            $resetUrl = env('FRONT_END_URL') . '/forgot/reset_password/' . $token;
        @endphp
        <p>
            <a href="{{ $resetUrl }}" class="button">Reset Password</a>
        </p>
        <p>If the button above does not work, copy and paste the following link into your browser:</p>
        <p class="maxW"><a href="{{ $resetUrl }}">{{ $resetUrl }}</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <div class="footer">
            Regards,<br>
            {{ env('APP_NAME') }}
        </div>
    </div>
</body>

</html>