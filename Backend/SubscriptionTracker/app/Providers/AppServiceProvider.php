<?php

namespace App\Providers;

use App\Repositories\AuthRepository;
use App\Repositories\Contracts\AuthRepositoryInterface;
use App\Repositories\Contracts\SubscriptionRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\SubscriptionRepository;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use App\Services\Interfaces\AuthServiceInterface;
use App\Services\Interfaces\SubscriptionServiceInterface;
use App\Services\Interfaces\SubscriptionValidationServiceInterface;
use App\Services\Interfaces\UserServiceInterface;
use App\Services\Interfaces\UserValidationServiceInterface;
use App\Services\SubscriptionService;
use App\Services\SubscriptionValidationService;
use App\Services\UserService;
use App\Services\UserValidationService;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(UserValidationServiceInterface::class, UserValidationService::class);
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
        $this->app->bind(SubscriptionRepositoryInterface::class, SubscriptionRepository::class);
        $this->app->bind(SubscriptionServiceInterface::class, SubscriptionService::class);
        $this->app->bind(SubscriptionValidationServiceInterface::class, SubscriptionValidationService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(Schedule $schedule): void
    {
        RateLimiter::for('client', function ($request) {
            $limits = [];

            // 1.  ID: 1 request per minute
            $clientId = $request->header('X-Client-UID');
            if ($clientId) {
                $limits[] = Limit::perMinute(3)->by('device:' . $clientId)->response(function () {
                    return response()->json(['message' => 'Too many requests for this verification.'], 429);
                });
            }
            // 1. Device ID: 1 request per minute
            $deviceId = $request->header('X-Client-ID');
            if ($deviceId) {
                $limits[] = Limit::perMinute(3)->by('device:' . $deviceId)->response(function () {
                    return response()->json(['message' => 'Too many requests from this device.'], 429);
                });
            }

            // 2. IP: 30 requests per minute
            $ip = $request->header('X-Client-IP') ?: $request->ip();
            if ($ip) {
                $limits[] = Limit::perMinute(30)->by('ip:' . $ip)->response(function () {
                    return response()->json(['message' => 'Too many requests from this IP address.'], 429);
                });
            }

            // 3. Device Info (OS Agent: Windows Chrome) + IP: 15 requests per minute
            $deviceInfo = $request->header('X-Device-Info');
            if ($deviceInfo && $ip) {
                $limits[] = Limit::perMinute(15)->by('devinfo:' . md5($deviceInfo . '|' . $ip))->response(function () {
                    return response()->json(['message' => 'Too many requests from this device/browser.'], 429);
                });
            }

            // If no headers, fallback to IP only
            if (empty($limits)) {
                $limits[] = Limit::perMinute(10)->by('ip:' . $request->ip());
            }

            return $limits;
        });

        // $schedule->command('cleanup:password_resets')->everyMinute();

        $schedule->call(function () {
            DB::table('password_resets')->where('expires_at', '<', now())->delete();
        })->hourly();
    }
}
