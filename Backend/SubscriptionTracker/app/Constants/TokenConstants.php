<?php

namespace App\Constants;

class TokenConstants
{
    // Token validity periods (in minutes)
    public const ACCESS_TOKEN_VALIDITY = 0.3;
    public const REFRESH_TOKEN_VALIDITY = 60;
    
    // Safety buffer (in seconds)
    public const TOKEN_EXPIRE_BUFFER = 5;
}