<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('user/signup', [AuthController::class, 'signupUser']);
Route::get('user/signup/verifyEmail/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['signed', 'throttle:2,1'])->name('verification.verify');
Route::get('user/signup/reverifyEmail/{id}', [AuthController::class, 'reVerifyEmail'])->middleware(['throttle:2,1'])->name('verification.send'); //throttle:2,1 => max 2 request in 1 min.

Route::post('login', [AuthController::class, 'login']);
Route::post('admin/signup', [AuthController::class, 'signupAdmin']);
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
});
