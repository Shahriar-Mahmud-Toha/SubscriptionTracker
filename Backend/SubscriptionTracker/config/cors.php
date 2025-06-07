<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // Only apply CORS in API routes
    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

    'allowed_origins' => [
        env('FRONT_END_URL'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-CSRF-TOKEN',
        'X-XSRF-TOKEN',
        'X-Device-Name',  // Custom header from the code
    ],

    // Headers that browsers are allowed to access
    'exposed_headers' => [
        'Authorization',
        'Message',
    ],

    // Cache preflight requests for better performance (in seconds, 1 hour = 3600)
    'max_age' => 3600,

    'supports_credentials' => false,
];
