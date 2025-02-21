<!DOCTYPE html>
<html>

<head>
    <title>Reset Your Password - Subscription Tracker</title>
</head>

<body>
    <p>You requested a password reset for Subscription Tracker. Use this api url below to reset your password:</p>
    <p>
        <!-- <a href="{{ url(route('reset.password', ['token' => $token])) }}">
            Reset Password
        </a> -->
        <p><b>Request Type: </b>Post</p>
        <p><b>API: </b>{{ url(route('reset.password')) }}</p>
        <p><b>token: </b>{{ $token }}</p>
    </p>
    <p>If you did not request this, please ignore this email.</p>
</body>

</html>