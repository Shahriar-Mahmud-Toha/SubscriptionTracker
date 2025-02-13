<?php

namespace App\Services\Interfaces;

use Illuminate\Http\Request; // Import the Request class

interface SubscriptionValidationServiceInterface
{
    public function validateSubscriptionStore(Request $request);
    public function validateSubscriptionUpdate(Request $request);
}
