<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlockPostCategoryController;
use App\Http\Controllers\BlogPostCategoryController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// TEMPORARY: One-click database setup (remove after use!)
Route::get('/setup', function () {
    try {
        // Drop all tables first
        \DB::statement('SET FOREIGN_KEY_CHECKS=0');
        $tables = \DB::select('SHOW TABLES');
        foreach ($tables as $table) {
            $tableName = reset($table);
            \DB::statement("DROP TABLE IF EXISTS $tableName");
        }
        \DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Run migrations
        \Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = \Artisan::output();

        // Import SQL file
        $sqlFile = database_path('cey_tripz_dashboard_demo_data.sql');
        if (file_exists($sqlFile)) {
            $sql = file_get_contents($sqlFile);
            \DB::unprepared($sql);
            $importOutput = "✅ SQL file imported successfully!";
        } else {
            $importOutput = "❌ SQL file not found at: " . $sqlFile;
        }

        return response()->json([
            'status' => 'success',
            'message' => '🎉 Database setup completed!',
            'migrations' => $migrateOutput,
            'import' => $importOutput,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

// Root API route
Route::get('/', function () {
    return response()->json([
        'message' => 'Cey Tripz API is running!',
        'version' => '1.0.0',
        'status' => 'success',
        'available_endpoints' => [
            '/api/test',
            '/api/tours',
            '/api/vehicles',
            '/api/blogPosts',
            '/api/reviews',
            '/api/register',
            '/api/login',
        ]
    ]);
});

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
Route::get('/reviews', [ReviewController::class, 'publicIndex']);
Route::post('/reviews', [ReviewController::class, 'store']);

// Vehicles
Route::get('/vehicles', [VehicleController::class, 'publicIndex']);
Route::get('/vehicles/{id}', [VehicleController::class, 'publicShow']);

// Tours
Route::get('/tours', [TourController::class, 'publicIndex']);
Route::get('/tours/{id}', [TourController::class, 'publicShow']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Dashboard and reports
    Route::get('/DashboardAnalytics', [DashboardController::class, 'index']);

    // Bookings
    Route::get('/GetBookings', [BookingController::class, 'index']);
    Route::get('/GetBookings/{id}', [BookingController::class, 'show']);
    Route::get('/TotalBookings', [BookingController::class, 'getTotalBookings']);
    Route::get('/TodayBookings', [BookingController::class, 'getTodayBookings']);
    Route::put('/updateStatus', [BookingController::class, 'updateStatus']);
    Route::put('/UpdateBooking/{id}', [BookingController::class, 'update']);
    Route::delete('/DeleteBooking/{id}', [BookingController::class, 'destroy']);

    // Vehicles
    Route::get('/GetVehicles', [VehicleController::class, 'index']);
    Route::post('/AddVehicle', [VehicleController::class, 'store']);
    Route::put('/UpdateVehicle/{id}', [VehicleController::class, 'update']);
    Route::put('/UpdateVehicleStatus/{id}', [VehicleController::class, 'updateStatus']);
    Route::put('/UpdateVehicleFeatured/{id}', [VehicleController::class, 'updateFeatured']);
    Route::post('/AddVehicleImage/{id}', [VehicleController::class, 'addImage']);
    Route::delete('/DeleteVehicleImage/{id}', [VehicleController::class, 'removeImage']);
    Route::delete('/DeleteVehicle/{id}', [VehicleController::class, 'destroy']);

    // Tours
    Route::get('/GetTours', [TourController::class, 'index']);
    Route::post('/AddTour', [TourController::class, 'store']);
    Route::put('/UpdateTour/{id}', [TourController::class, 'update']);
    Route::post('/UpdateTour/{id}', [TourController::class, 'update']);
    Route::put('/UpdateTourStatus/{id}', [TourController::class, 'updateStatus']);
    Route::put('/UpdateTourFeatured/{id}', [TourController::class, 'updateFeatured']);
    Route::delete('/DeleteTour/{id}', [TourController::class, 'destroy']);

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
    Route::get('/GetReviews', [ReviewController::class, 'index']);
    Route::get('/GetReviewBookingOptions', [ReviewController::class, 'bookingOptions']);
    Route::put('/UpdateReview/{id}', [ReviewController::class, 'update']);

    // Blog categories
    Route::get('/blogPostCategories', [BlogPostCategoryController::class, 'index']);
    Route::post('/addBlogPostCategory', [BlogPostCategoryController::class, 'store']);

    // Blog posts
    Route::post('/addBlogPost', [BlogPostController::class, 'store']);
    Route::put('/blogPosts/{id}', [BlogPostController::class, 'update']);
    Route::post('/blogPosts/{id}', [BlogPostController::class, 'update']);
    Route::delete('/blogPostDelete/{id}', [BlogPostController::class, 'destroy']);
});





