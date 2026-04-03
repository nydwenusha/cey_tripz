<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlockPostCategoryController;
use App\Http\Controllers\BlogPostCategoryController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now(),
        'cors_origins' => config('cors.allowed_origins'),
    ]);
});

Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/booking', [BookingController::class, 'store']);
Route::get('/blogPosts', [BlogPostController::class, 'index']);
Route::get('/blogPosts/{id}', [BlogPostController::class, 'show']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/updateStatus', [BookingController::class, 'updateStatus']);
    Route::get('/TotalBookings', [BookingController::class, 'getTotalBookings']);
    Route::get('/TodayBookings', [BookingController::class, 'getTodayBookings']);
    Route::get('/blogPostCategories', [BlogPostCategoryController::class, 'index']);
    Route::post('/addBlogPostCategory', [BlogPostCategoryController::class, 'store']);
    Route::post('/addBlogPost', [BlogPostController::class, 'store']);
    Route::get('/GetBookings', [BookingController::class, 'index']);
    Route::delete('/blogPostDelete/{id}', [BlogPostController::class, 'destroy']);
});
