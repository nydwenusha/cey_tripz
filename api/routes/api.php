<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlockPostCategoryController;
use App\Http\Controllers\BlogPostCategoryController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;
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

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Bookings
Route::post('/booking', [BookingController::class, 'store']);

// Blog posts
Route::get('/blogPosts', [BlogPostController::class, 'index']);
Route::get('/blogPosts/{id}', [BlogPostController::class, 'show']);

// Reviews
Route::post('/reviews', [ReviewController::class, 'store']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Bookings
    Route::get('/GetBookings', [BookingController::class, 'index']);
    Route::get('/GetBookings/{id}', [BookingController::class, 'show']);
    Route::get('/TotalBookings', [BookingController::class, 'getTotalBookings']);
    Route::get('/TodayBookings', [BookingController::class, 'getTodayBookings']);
    Route::put('/updateStatus', [BookingController::class, 'updateStatus']);
    Route::put('/UpdateBooking/{id}', [BookingController::class, 'update']);
    Route::delete('/DeleteBooking/{id}', [BookingController::class, 'destroy']);

    // Customers
    Route::get('/GetCustomers', [CustomerController::class, 'index']);
    Route::get('/GetCustomers/{id}', [CustomerController::class, 'show']);
    Route::put('/UpdateCustomer/{id}', [CustomerController::class, 'update']);
    Route::delete('/DeleteCustomer/{id}', [CustomerController::class, 'destroy']);
    // Payments
    Route::get('/GetPayments', [PaymentController::class, 'index']);
    Route::get('/GetPayments/{id}', [PaymentController::class, 'show']);
    Route::get('/PaymentStats', [PaymentController::class, 'stats']);
    Route::post('/AddPayment', [PaymentController::class, 'store']);
    Route::put('/UpdatePayment/{id}', [PaymentController::class, 'update']);

    // Reviews
    Route::get('/GetReviews', [ReviewController::class, 'index']);

    // Blog categories
    Route::get('/blogPostCategories', [BlogPostCategoryController::class, 'index']);
    Route::post('/addBlogPostCategory', [BlogPostCategoryController::class, 'store']);

    // Blog posts
    Route::post('/addBlogPost', [BlogPostController::class, 'store']);
    Route::delete('/blogPostDelete/{id}', [BlogPostController::class, 'destroy']);
});



