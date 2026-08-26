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

// Redirect old endpoints to new ones
Route::post('/login', function (Request $request) {
    return redirect()->to('/api/login');
});

Route::post('/register', function (Request $request) {
    return redirect()->to('/api/register');
});

Route::post('/logout', function (Request $request) {
    return redirect()->to('/api/logout');
});

// Simple test route
Route::get('/test-db', function () {
    try {
        $tables = \DB::select('SHOW TABLES');
        return response()->json([
            'status' => 'success',
            'tables' => array_column($tables, 'Tables_in_defaultdb')
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Import data - Simplified version
Route::get('/import-data', function () {
    try {
        $sqlFile = database_path('cey_tripz_dashboard_demo_data.sql');
        
        if (!file_exists($sqlFile)) {
            return response()->json(['error' => 'SQL file not found'], 404);
        }
        
        $sql = file_get_contents($sqlFile);
        
        // Split into individual statements
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        
        $successCount = 0;
        $errors = [];
        
        foreach ($statements as $statement) {
            // Skip empty statements and comments
            if (empty($statement) || str_starts_with($statement, '--')) {
                continue;
            }
            
            try {
                \DB::unprepared($statement . ';');
                $successCount++;
            } catch (\Exception $e) {
                // Skip ON DUPLICATE KEY UPDATE errors
                if (str_contains($e->getMessage(), 'Duplicate entry')) {
                    $successCount++;
                    continue;
                }
                $errors[] = $e->getMessage();
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => "Imported $successCount statements",
            'errors' => $errors,
            'total_statements' => count($statements)
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Simple import - essential data only
Route::get('/import-simple', function () {
    try {
        // Check if admin already exists
        $adminExists = \DB::table('users')->where('email', 'admin@gmail.com')->exists();
        if (!$adminExists) {
            \DB::table('users')->insert([
                'name' => 'Administrator',
                'email' => 'admin@gmail.com',
                'email_verified_at' => now(),
                'password' => '$2y$10$/jo6Bh7v3uNZMnP.Is.oOeBEZP/LeJ5P2MDzuUARjB513cUuLJEam',
                'role' => 'admin',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $adminAdded = true;
        } else {
            $adminAdded = false;
        }

        // Insert Tours (12 tours)
        $tours = [
            ['Sigiriya Sunrise & Village Discovery', 'Sigiriya', 185.00, 'active', 'Cultural', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85', 'A private cultural journey combining an early Sigiriya Rock Fortress climb with a guided village experience and traditional lunch.', '2 Days / 1 Night', 12, 'Medium', '["Licensed English-speaking guide","Air-conditioned transport","Breakfast and village lunch","Entrance tickets","Bottled water"]', '["Travel insurance","Personal expenses","Alcoholic beverages"]', '["sigiriya","culture","village","sunrise"]', 1],
            ['Kandy Heritage & Tea Country Escape', 'Kandy', 245.00, 'active', 'Historical', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85', 'A curated journey through the Temple of the Sacred Tooth Relic, Peradeniya gardens, and a working tea estate.', '3 Days / 2 Nights', 14, 'Easy', '["Private transport","Two nights accommodation","Daily breakfast","Cultural guide","Tea factory visit"]', '["Lunch and dinner","Camera permits","Tips"]', '["kandy","tea","heritage","highlands"]', 1],
            ['Ella Highlands & Nine Arches Trail', 'Ella', 155.00, 'active', 'Hiking', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85', 'A guided highland adventure featuring Little Adams Peak, Nine Arches Bridge, local cuisine, and panoramic tea-country scenery.', '2 Days / 1 Night', 10, 'Medium', '["Resident hiking guide","Boutique guesthouse","Breakfast","Trail snacks","Local transfers"]', '["Train tickets to Ella","Dinner","Personal hiking equipment"]', '["ella","hiking","railway","nature"]', 1],
            ['Yala Wildlife Safari Expedition', 'Yala', 295.00, 'active', 'Wildlife', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85', 'A responsibly operated safari with an experienced naturalist, private jeep, and carefully timed drives through Yala National Park.', '2 Days / 1 Night', 8, 'Easy', '["Private safari jeep","Naturalist guide","Eco-lodge stay","Breakfast and dinner","Park entrance fees"]', '["Travel insurance","Premium beverages","Gratuities"]', '["yala","wildlife","safari","leopard"]', 1],
            ['Galle Fort, Coast & Culinary Journey', 'Galle', 210.00, 'active', 'Photography', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85', 'A relaxed south-coast itinerary combining Galle Fort architecture, local markets, a hands-on cooking session, and sunset photography.', '2 Days / 1 Night', 12, 'Easy', '["Fort specialist guide","Boutique hotel","Breakfast","Cooking workshop","Private transfers"]', '["Lunch outside the workshop","Personal shopping","Alcohol"]', '["galle","coast","food","photography"]', 1],
            ['Mirissa Ocean & Whale Watching Retreat', 'Mirissa', 265.00, 'active', 'Beach', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=85', 'A coastal escape with an ethical whale-watching operator, beach leisure, and a guided visit to the fishing harbour.', '3 Days / 2 Nights', 16, 'Easy', '["Two nights beachfront accommodation","Breakfast","Whale-watching ticket","Harbour transfer","Marine naturalist briefing"]', '["Lunch and dinner","Water sports","Travel insurance"]', '["mirissa","whales","beach","ocean"]', 0],
            ['Anuradhapura Sacred City Explorer', 'Anuradhapura', 175.00, 'active', 'Historical', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85', 'An expert-led exploration of ancient monasteries, monumental stupas, reservoirs, and living Buddhist heritage.', '2 Days / 1 Night', 15, 'Easy', '["Archaeology guide","Private transport","Hotel with breakfast","Site tickets","Bicycle option"]', '["Temple offerings","Lunch and dinner","Personal expenses"]', '["anuradhapura","unesco","history","buddhism"]', 0],
            ['Knuckles Range Eco Adventure', 'Kandy', 325.00, 'active', 'Adventure', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85', 'A low-impact trekking programme through cloud forest, village landscapes, waterfalls, and biodiversity-rich sections.', '3 Days / 2 Nights', 8, 'Challenging', '["Certified trek leader","Eco-lodge accommodation","All main meals","Trail permits","Safety equipment"]', '["Specialist footwear","Travel insurance","Personal porters"]', '["knuckles","trekking","eco","mountains"]', 1],
            ['Bentota Family River & Beach Holiday', 'Bentota', 390.00, 'active', 'Family', 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=85', 'A family-friendly coastal holiday with a calm river safari, beach time, turtle conservation visit, and flexible private transport.', '4 Days / 3 Nights', 18, 'Easy', '["Family resort stay","Daily breakfast","River safari","Turtle conservation visit","Private transfers"]', '["Optional water sports","Lunch and dinner","Childcare"]', '["bentota","family","river","beach"]', 0],
            ['Nuwara Eliya Tea & Wellness Weekend', 'Nuwara Eliya', 285.00, 'active', 'Wellness', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=85', 'A restorative highland weekend with tea estate walks, gentle wellness sessions, seasonal cuisine, and time beside Gregory Lake.', '3 Days / 2 Nights', 10, 'Easy', '["Heritage bungalow stay","Daily breakfast","Guided tea walk","One wellness session","Private transfers"]', '["Spa upgrades","Lunch and dinner","Personal purchases"]', '["nuwara-eliya","tea","wellness","slow-travel"]', 0],
            ['Polonnaruwa Cycling Heritage Trail', 'Polonnaruwa', 145.00, 'draft', 'Cultural', 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=1400&q=85', 'A proposed guided cycling route linking the main monuments of medieval Polonnaruwa with shaded rest stops and local refreshments.', '1 Day', 12, 'Medium', '["Bicycle and helmet","Heritage guide","Entrance ticket","Refreshments"]', '["Hotel transfer","Lunch","Travel insurance"]', '["polonnaruwa","cycling","heritage"]', 0],
            ['Arugam Bay Surf & Lagoon Escape', 'Arugam Bay', 235.00, 'inactive', 'Beach', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=85', 'A seasonal surf and lagoon package designed for beginner and intermediate surfers, currently paused outside the operating season.', '3 Days / 2 Nights', 10, 'Medium', '["Guesthouse stay","Breakfast","Two surf lessons","Lagoon safari"]', '["Board rental outside lessons","Lunch and dinner","Insurance"]', '["arugam-bay","surf","lagoon"]', 0]
        ];

        $tourCount = 0;
        foreach ($tours as $tour) {
            $exists = \DB::table('tours')->where('name', $tour[0])->exists();
            if (!$exists) {
                \DB::table('tours')->insert([
                    'name' => $tour[0],
                    'destination' => $tour[1],
                    'price' => $tour[2],
                    'status' => $tour[3],
                    'category' => $tour[4],
                    'photo_path' => $tour[5],
                    'description' => $tour[6],
                    'duration' => $tour[7],
                    'max_participants' => $tour[8],
                    'difficulty' => $tour[9],
                    'inclusions' => $tour[10],
                    'exclusions' => $tour[11],
                    'tags' => $tour[12],
                    'featured' => $tour[13],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                $tourCount++;
            }
        }

        // Insert Vehicles (10 vehicles)
        $vehicles = [
            ['Toyota Prius Hybrid', 'Car', 'Comfortable and fuel-efficient hybrid sedan for airport transfers and private touring.', 'active', 'Sedan Car', 58.00, 350.00, 1180.00, 'Hybrid', 'Automatic', 2022, 'Pearl White', '22 km/l', '1800 cc', 4, '["air-conditioning","hybrid","airport-transfer"]', 1],
            ['Toyota KDH High Roof', 'Van', 'Spacious high-roof van with luggage capacity for families and small tour groups.', 'active', 'Seater Van', 110.00, 690.00, 2250.00, 'Diesel', 'Automatic', 2021, 'Silver', '11 km/l', '3000 cc', 10, '["air-conditioning","large-luggage","group-travel"]', 1],
            ['Toyota Hiace Luxury', 'Van', 'Executive passenger van configured for premium multi-day tours and corporate groups.', 'active', 'Luxury Van', 135.00, 840.00, 2780.00, 'Diesel', 'Automatic', 2023, 'Black', '10 km/l', '2800 cc', 9, '["executive-seats","wifi","premium"]', 1],
            ['Suzuki Wagon R Hybrid', 'Car', 'Compact hybrid hatchback suited to city transfers and couples travelling with light luggage.', 'active', 'Hatchback Car', 42.00, 255.00, 850.00, 'Hybrid', 'Automatic', 2022, 'Blue', '24 km/l', '660 cc', 4, '["compact","hybrid","city"]', 0],
            ['Honda Shuttle Hybrid', 'Car', 'Practical hybrid station wagon balancing passenger comfort with generous luggage space.', 'active', 'Station Wagon', 62.00, 380.00, 1260.00, 'Hybrid', 'Automatic', 2021, 'Grey', '21 km/l', '1500 cc', 4, '["hybrid","large-luggage","long-distance"]', 1],
            ['Toyota Axio Hybrid', 'Car', 'Reliable sedan with a quiet cabin for business transfers and private island-wide journeys.', 'active', 'Sedan Car', 55.00, 335.00, 1120.00, 'Hybrid', 'Automatic', 2020, 'White', '23 km/l', '1500 cc', 4, '["business","hybrid","comfortable"]', 0],
            ['Mitsubishi Montero Sport', 'SUV', 'Four-wheel-drive SUV for hill-country roads, wildlife areas, and premium family touring.', 'active', 'SUV', 125.00, 770.00, 2520.00, 'Diesel', 'Automatic', 2021, 'Graphite', '10 km/l', '2400 cc', 6, '["4x4","family","adventure"]', 1],
            ['Toyota Coaster', 'Bus', 'Air-conditioned mini coach for organised groups, conferences, and extended round tours.', 'active', 'Mini Coach', 190.00, 1180.00, 3850.00, 'Diesel', 'Manual', 2019, 'White and Blue', '7 km/l', '4000 cc', 24, '["group-travel","microphone","large-luggage"]', 0],
            ['Suzuki Alto', 'Car', 'Economical compact car for short city transfers and solo business travellers.', 'active', 'Mini Car', 35.00, 210.00, 700.00, 'Petrol', 'Automatic', 2021, 'Red', '20 km/l', '660 cc', 3, '["economy","city","compact"]', 0],
            ['Nissan Caravan', 'Van', 'Versatile passenger van with strong air conditioning and flexible seating for regional tours.', 'active', 'Seater Van', 98.00, 610.00, 2020.00, 'Diesel', 'Automatic', 2020, 'Silver', '12 km/l', '2500 cc', 8, '["family","group-travel","luggage"]', 0]
        ];

        $vehicleCount = 0;
        foreach ($vehicles as $vehicle) {
            $exists = \DB::table('vehicles')->where('name', $vehicle[0])->exists();
            if (!$exists) {
                \DB::table('vehicles')->insert([
                    'name' => $vehicle[0],
                    'type' => $vehicle[1],
                    'description' => $vehicle[2],
                    'status' => $vehicle[3],
                    'category' => $vehicle[4],
                    'daily_rate' => $vehicle[5],
                    'weekly_rate' => $vehicle[6],
                    'monthly_rate' => $vehicle[7],
                    'fuel_type' => $vehicle[8],
                    'transmission' => $vehicle[9],
                    'year' => $vehicle[10],
                    'color' => $vehicle[11],
                    'mileage' => $vehicle[12],
                    'engine' => $vehicle[13],
                    'capacity' => $vehicle[14],
                    'tags' => $vehicle[15],
                    'featured' => $vehicle[16],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                $vehicleCount++;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => '✅ Data imported successfully!',
            'admin_user' => $adminAdded ? 'Added' : 'Already exists',
            'tours_added' => $tourCount,
            'vehicles_added' => $vehicleCount
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// FINAL - Simple import that works
Route::get('/import-final', function () {
    try {
        $results = [];
        
        // 1. Add Admin User
        $userExists = \DB::table('users')->where('email', 'admin@gmail.com')->exists();
        if (!$userExists) {
            \DB::table('users')->insert([
                'name' => 'Administrator',
                'email' => 'admin@gmail.com',
                'email_verified_at' => now(),
                'password' => '$2y$10$/jo6Bh7v3uNZMnP.Is.oOeBEZP/LeJ5P2MDzuUARjB513cUuLJEam',
                'role' => 'admin',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $results['user'] = 'Added';
        } else {
            $results['user'] = 'Already exists';
        }

        // 2. Get the actual columns from vehicles table
        $vehicleColumns = array_column(\DB::select('DESCRIBE vehicles'), 'Field');
        $results['vehicle_columns'] = $vehicleColumns;

        // 3. Insert vehicles (only with columns that exist)
        $vehicles = [
            ['Toyota Prius Hybrid', 'Car', 58.00],
            ['Toyota KDH High Roof', 'Van', 110.00],
            ['Toyota Hiace Luxury', 'Van', 135.00],
            ['Suzuki Wagon R Hybrid', 'Car', 42.00],
            ['Honda Shuttle Hybrid', 'Car', 62.00],
            ['Toyota Axio Hybrid', 'Car', 55.00],
            ['Mitsubishi Montero Sport', 'SUV', 125.00],
            ['Toyota Coaster', 'Bus', 190.00],
            ['Suzuki Alto', 'Car', 35.00],
            ['Nissan Caravan', 'Van', 98.00]
        ];

        $vehicleCount = 0;
        foreach ($vehicles as $v) {
            $exists = \DB::table('vehicles')->where('name', $v[0])->exists();
            if (!$exists) {
                $data = ['name' => $v[0]];
                if (in_array('type', $vehicleColumns)) $data['type'] = $v[1];
                if (in_array('daily_rate', $vehicleColumns)) $data['daily_rate'] = $v[2];
                if (in_array('created_at', $vehicleColumns)) $data['created_at'] = now();
                if (in_array('updated_at', $vehicleColumns)) $data['updated_at'] = now();
                if (in_array('status', $vehicleColumns)) $data['status'] = 'active';
                \DB::table('vehicles')->insert($data);
                $vehicleCount++;
            }
        }
        $results['vehicles_added'] = $vehicleCount;

        // 4. Insert tours
        $tourColumns = array_column(\DB::select('DESCRIBE tours'), 'Field');
        $results['tour_columns'] = $tourColumns;

        $tours = [
            ['Sigiriya Sunrise & Village Discovery', 'Sigiriya', 185.00],
            ['Kandy Heritage & Tea Country Escape', 'Kandy', 245.00],
            ['Ella Highlands & Nine Arches Trail', 'Ella', 155.00],
            ['Yala Wildlife Safari Expedition', 'Yala', 295.00],
            ['Galle Fort, Coast & Culinary Journey', 'Galle', 210.00],
            ['Mirissa Ocean & Whale Watching Retreat', 'Mirissa', 265.00],
            ['Anuradhapura Sacred City Explorer', 'Anuradhapura', 175.00],
            ['Knuckles Range Eco Adventure', 'Kandy', 325.00],
            ['Bentota Family River & Beach Holiday', 'Bentota', 390.00],
            ['Nuwara Eliya Tea & Wellness Weekend', 'Nuwara Eliya', 285.00],
            ['Polonnaruwa Cycling Heritage Trail', 'Polonnaruwa', 145.00],
            ['Arugam Bay Surf & Lagoon Escape', 'Arugam Bay', 235.00]
        ];

        $tourCount = 0;
        foreach ($tours as $t) {
            $exists = \DB::table('tours')->where('name', $t[0])->exists();
            if (!$exists) {
                $data = ['name' => $t[0]];
                if (in_array('destination', $tourColumns)) $data['destination'] = $t[1];
                if (in_array('price', $tourColumns)) $data['price'] = $t[2];
                if (in_array('status', $tourColumns)) $data['status'] = 'active';
                if (in_array('created_at', $tourColumns)) $data['created_at'] = now();
                if (in_array('updated_at', $tourColumns)) $data['updated_at'] = now();
                \DB::table('tours')->insert($data);
                $tourCount++;
            }
        }
        $results['tours_added'] = $tourCount;

        return response()->json([
            'status' => 'success',
            'message' => '✅ Data imported!',
            'results' => $results
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
});

// FIX: Create vehicles table and import
Route::get('/fix-vehicles', function () {
    try {
        // Drop and recreate vehicles table with correct columns
        \DB::statement("DROP TABLE IF EXISTS vehicles");
        
        \DB::statement("
            CREATE TABLE vehicles (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(255) DEFAULT NULL,
                description TEXT DEFAULT NULL,
                status VARCHAR(255) DEFAULT NULL,
                category VARCHAR(255) DEFAULT NULL,
                daily_rate DECIMAL(10,2) DEFAULT NULL,
                weekly_rate DECIMAL(10,2) DEFAULT NULL,
                monthly_rate DECIMAL(10,2) DEFAULT NULL,
                fuel_type VARCHAR(255) DEFAULT NULL,
                transmission VARCHAR(255) DEFAULT NULL,
                year INT DEFAULT NULL,
                color VARCHAR(255) DEFAULT NULL,
                mileage VARCHAR(255) DEFAULT NULL,
                engine VARCHAR(255) DEFAULT NULL,
                capacity INT DEFAULT NULL,
                tags JSON DEFAULT NULL,
                featured TINYINT(1) DEFAULT 0,
                images JSON DEFAULT NULL,
                created_at TIMESTAMP DEFAULT NULL,
                updated_at TIMESTAMP DEFAULT NULL
            )
        ");
        
        // Insert vehicles
        $vehicles = [
            ['Toyota Prius Hybrid', 'Car', 'Comfortable and fuel-efficient hybrid sedan.', 'active', 'Sedan Car', 58.00, 350.00, 1180.00, 'Hybrid', 'Automatic', 2022, 'Pearl White', '22 km/l', '1800 cc', 4, '["air-conditioning","hybrid"]', 1],
            ['Toyota KDH High Roof', 'Van', 'Spacious high-roof van for families and groups.', 'active', 'Seater Van', 110.00, 690.00, 2250.00, 'Diesel', 'Automatic', 2021, 'Silver', '11 km/l', '3000 cc', 10, '["air-conditioning","group-travel"]', 1],
            ['Toyota Hiace Luxury', 'Van', 'Executive passenger van for premium tours.', 'active', 'Luxury Van', 135.00, 840.00, 2780.00, 'Diesel', 'Automatic', 2023, 'Black', '10 km/l', '2800 cc', 9, '["executive","premium"]', 1],
            ['Suzuki Wagon R Hybrid', 'Car', 'Compact hybrid for city transfers.', 'active', 'Hatchback Car', 42.00, 255.00, 850.00, 'Hybrid', 'Automatic', 2022, 'Blue', '24 km/l', '660 cc', 4, '["compact","city"]', 0],
            ['Honda Shuttle Hybrid', 'Car', 'Hybrid station wagon with generous luggage space.', 'active', 'Station Wagon', 62.00, 380.00, 1260.00, 'Hybrid', 'Automatic', 2021, 'Grey', '21 km/l', '1500 cc', 4, '["hybrid","large-luggage"]', 1],
            ['Toyota Axio Hybrid', 'Car', 'Reliable sedan for business transfers.', 'active', 'Sedan Car', 55.00, 335.00, 1120.00, 'Hybrid', 'Automatic', 2020, 'White', '23 km/l', '1500 cc', 4, '["business","comfortable"]', 0],
            ['Mitsubishi Montero Sport', 'SUV', '4WD SUV for hill-country and wildlife areas.', 'active', 'SUV', 125.00, 770.00, 2520.00, 'Diesel', 'Automatic', 2021, 'Graphite', '10 km/l', '2400 cc', 6, '["4x4","adventure"]', 1],
            ['Toyota Coaster', 'Bus', 'Mini coach for groups and conferences.', 'active', 'Mini Coach', 190.00, 1180.00, 3850.00, 'Diesel', 'Manual', 2019, 'White and Blue', '7 km/l', '4000 cc', 24, '["group-travel","conference"]', 0],
            ['Suzuki Alto', 'Car', 'Economical compact car for city transfers.', 'active', 'Mini Car', 35.00, 210.00, 700.00, 'Petrol', 'Automatic', 2021, 'Red', '20 km/l', '660 cc', 3, '["economy","city"]', 0],
            ['Nissan Caravan', 'Van', 'Versatile passenger van for regional tours.', 'active', 'Seater Van', 98.00, 610.00, 2020.00, 'Diesel', 'Automatic', 2020, 'Silver', '12 km/l', '2500 cc', 8, '["family","group-travel"]', 0]
        ];

        $count = 0;
        foreach ($vehicles as $v) {
            \DB::table('vehicles')->insert([
                'name' => $v[0],
                'type' => $v[1],
                'description' => $v[2],
                'status' => $v[3],
                'category' => $v[4],
                'daily_rate' => $v[5],
                'weekly_rate' => $v[6],
                'monthly_rate' => $v[7],
                'fuel_type' => $v[8],
                'transmission' => $v[9],
                'year' => $v[10],
                'color' => $v[11],
                'mileage' => $v[12],
                'engine' => $v[13],
                'capacity' => $v[14],
                'tags' => $v[15],
                'featured' => $v[16],
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $count++;
        }

        return response()->json([
            'status' => 'success',
            'message' => "✅ Vehicles table created and $count vehicles imported!",
            'vehicles_added' => $count
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'line' => $e->getLine()
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





