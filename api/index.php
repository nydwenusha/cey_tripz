<?php

// CORS - Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $allowed = ['https://ceytripz.com', 'https://www.ceytripz.com', 'https://admin.ceytripz.com'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, ngrok-skip-browser-warning');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        http_response_code(200);
        exit();
    }
}

// Laravel Bootstrap
define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'./storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/vendor/autoload.php';  // ← ./ (same folder)

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
)->send();

$kernel->terminate($request, $response);