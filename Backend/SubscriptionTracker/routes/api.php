<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('user/signup', [AuthController::class, 'signupUser']);
Route::post('admin/signup', [AuthController::class, 'signupAdmin']);
Route::post('login', [AuthController::class, 'login']);
// Route::get('me', [AuthController::class, 'me'])->middleware(['auth:api', 'authorization:admin,user']);

Route::group(['middleware' => 'authentication'], function () {
    Route::group(['middleware' => 'authorization:admin'], function () {
        Route::get('subscription', [SubscriptionController::class, 'index']);
    });
    Route::group(['middleware' => 'authorization:user'], function () {
        Route::get('subscription/showAll', [SubscriptionController::class, 'showAllSubscriptionForThisUser']);
        Route::get('subscription/show/{id}', [SubscriptionController::class, 'show']);
        Route::post('subscription/store', [SubscriptionController::class, 'create']);
        Route::patch('subscription/update/{id}', [SubscriptionController::class, 'update']);
        Route::delete('subscription/delete/{id}', [SubscriptionController::class, 'destroy']);
    });
    Route::get('me', [AuthController::class, 'me']); //dev mode
    Route::get('profile', [AuthController::class, 'viewProfile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh_token', [AuthController::class, 'refresh']);
    
    Route::post('create', [UserController::class, 'create']);
    Route::patch('update', [UserController::class, 'update']);
});
