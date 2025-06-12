<?php

namespace App\Constants;

class TokenConstants
{
    // Token validity periods (in minutes)
    public const ACCESS_TOKEN_VALIDITY = 15;
    public const REFRESH_TOKEN_VALIDITY = 60;
    
    // Safety buffer (in seconds)
    public const TOKEN_EXPIRE_BUFFER = 10;

    public const SIGNUP_EMAIL_TOKEN_VALIDITY = 60; // 1 minute

    public const EMAIL_VERIFICATION_TOKEN_VALIDITY = 60; // 1 minute
}