<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

// Temporary route to clear cache - DELETE THIS AFTER USING!
Route::get('/clear-all-cache', function () {
    $output = [];
    
    try {
        Artisan::call('config:clear');
        $output[] = '✓ Config cleared';
        
        Artisan::call('cache:clear');
        $output[] = '✓ Cache cleared';
        
        Artisan::call('route:clear');
        $output[] = '✓ Routes cleared';
        
        Artisan::call('view:clear');
        $output[] = '✓ Views cleared';
        
        Artisan::call('config:cache');
        $output[] = '✓ Config cached';
        
        Artisan::call('route:cache');
        $output[] = '✓ Routes cached';
        
        $output[] = '';
        $output[] = '⚠️ DELETE THIS ROUTE FROM routes/web.php NOW!';
        
    } catch (\Exception $e) {
        $output[] = '❌ Error: ' . $e->getMessage();
    }
    
    return response()->json([
        'success' => true,
        'output' => $output,
        'note' => 'IMPORTANT: Delete /clear-all-cache route from routes/web.php for security!'
    ], 200, [], JSON_PRETTY_PRINT);
});
