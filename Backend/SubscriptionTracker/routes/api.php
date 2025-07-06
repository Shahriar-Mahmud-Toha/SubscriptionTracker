<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Foundation\Events\DiagnosingHealth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Response;

Route::group(['middleware' => 'server-verification'], function () {

    Route::post('user/signup', [AuthController::class, 'signupUser']);
    Route::get('user/update/verify-email', [AuthController::class, 'verifyEmailUpdate'])->middleware(['signed', 'EmailUpdateVerification'])->name('updateEmail.verify');
    Route::get('user/signup/verify-email', [AuthController::class, 'verifyEmail'])->middleware(['signed', 'throttle:client'])->name('verification.verify');
    Route::post('user/signup/reverifyEmail', [AuthController::class, 'reVerifyEmail'])->middleware(['throttle:client'])->name('verification.send'); //throttle:3,1 => max 3 request in 1 min.
    Route::post('user/password/forgot', [AuthController::class, 'forgotPassword'])->middleware(['throttle:client'])->name('forgot.password');
    Route::post('user/password/reset', [AuthController::class, 'resetPassword'])->middleware(['throttle:client'])->name('reset.password');

    Route::post('login', [AuthController::class, 'login'])->middleware(['throttle:client']);
    Route::post('admin/signup', [AuthController::class, 'signupAdmin'])->middleware(['throttle:client']);
    // Route::get('me', [AuthController::class, 'me'])->middleware(['auth:api', 'authorization:admin,user']);

    Route::group(['middleware' => 'authentication'], function () {
        Route::group(['middleware' => 'authorization:admin'], function () {
            Route::get('subscription/countAll', [AuthController::class, 'getAllCount']);
            Route::get('subscription', [SubscriptionController::class, 'index']); //dev mode
        });
        Route::group(['middleware' => 'authorization:user'], function () {
            Route::get('subscription/showAll', [SubscriptionController::class, 'showAllSubscriptionForThisUser']);
            Route::get('subscription/show/{id}', [SubscriptionController::class, 'show']);
            Route::post('subscription/store', [SubscriptionController::class, 'create']);
            Route::patch('subscription/update/{id}', [SubscriptionController::class, 'update']);
            Route::post('subscription/updateFile/{id}', [SubscriptionController::class, 'updateFile']);
            Route::delete('subscription/delete/{id}', [SubscriptionController::class, 'destroy']);
            Route::get('subscription/search', [SubscriptionController::class, 'search']);
        });
        Route::get('me', [AuthController::class, 'me']); //dev mode
        Route::get('profile', [AuthController::class, 'viewProfile']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh_token', [AuthController::class, 'refresh']);

        Route::post('create', [UserController::class, 'create']);
        Route::patch('update', [UserController::class, 'update']);
        Route::patch('update/email', [AuthController::class, 'updateEmail']);
        Route::patch('update/password', [AuthController::class, 'updatePassword']);
    });
});

// Health check route 
Route::get('up', function () {
    try {
        Event::dispatch(new DiagnosingHealth);
        DB::select('SELECT 1');
        return Response::json(['status' => 'healthy'], 200);
    } catch (\Exception $e) {
        return Response::json(['status' => 'error'], 500);
    }
});
