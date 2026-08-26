-- ============================================================================
-- CeyTripz professional portfolio data seed
-- Target: MySQL 8+ / MariaDB 10.4+
--
-- Purpose
--   Adds realistic, internally consistent records for the CeyTripz admin
--   dashboard, reports, booking operations, tour catalogue, reviews, and blog.
--
-- Safety
--   * Additive only: this script does not truncate or delete existing data.
--   * Repeat-safe: unique records use upserts and other records use seed markers.
--   * Laravel infrastructure tables (cache, sessions, jobs, migrations, password
--     reset tokens, and failed jobs) are intentionally not populated.
--
-- Usage
--   1. Back up the database.
--   2. Run all Laravel migrations/current schema first.
--   3. Select the cey_tripz database, then import this file.
--
-- Demo administrator: admin@gmail.com
-- Demo password (development/portfolio use only): Admin@123
-- ============================================================================

SET NAMES utf8mb4;
SET @seed_now = NOW();
SET @seed_today = CURDATE();

START TRANSACTION;

-- --------------------------------------------------------------------------
-- 1. USER (1 administrator account)
-- --------------------------------------------------------------------------
INSERT INTO `users` (
    `name`, `email`, `email_verified_at`, `phone_number`, `password`,
    `role`, `status`, `remember_token`, `created_at`, `updated_at`
) VALUES
    ('Administrator', 'admin@gmail.com', @seed_now, NULL, '$2y$10$/jo6Bh7v3uNZMnP.Is.oOeBEZP/LeJ5P2MDzuUARjB513cUuLJEam', 'admin', 'active', NULL, @seed_now, @seed_now)
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `email_verified_at` = VALUES(`email_verified_at`),
    `phone_number` = VALUES(`phone_number`),
    `password` = VALUES(`password`),
    `role` = VALUES(`role`),
    `status` = VALUES(`status`),
    `updated_at` = @seed_now;

-- --------------------------------------------------------------------------
-- 2. TOURS (12 rows: 10 active, 1 draft, 1 inactive)
-- --------------------------------------------------------------------------
INSERT INTO `tours` (
    `name`, `destination`, `price`, `status`, `category`, `photo_path`,
    `description`, `duration`, `max_participants`, `difficulty`, `inclusions`,
    `exclusions`, `tags`, `featured`, `highlights`, `meeting_point`,
    `requirements`, `cancellation_policy`, `created_at`, `updated_at`
)
SELECT
    seed.name, seed.destination, seed.price, seed.status, seed.category,
    seed.photo_path, seed.description, seed.duration, seed.max_participants,
    seed.difficulty, seed.inclusions, seed.exclusions, seed.tags, seed.featured,
    seed.highlights, seed.meeting_point, seed.requirements,
    seed.cancellation_policy, DATE_SUB(@seed_now, INTERVAL seed.age_days DAY), @seed_now
FROM (
    SELECT 'Sigiriya Sunrise & Village Discovery' name, 'Sigiriya' destination, 185.00 price, 'active' status, 'Cultural' category, 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85' photo_path, 'A private cultural journey combining an early Sigiriya Rock Fortress climb with a guided village experience and traditional lunch.' description, '2 Days / 1 Night' duration, 12 max_participants, 'Medium' difficulty, '["Licensed English-speaking guide","Air-conditioned transport","Breakfast and village lunch","Entrance tickets","Bottled water"]' inclusions, '["Travel insurance","Personal expenses","Alcoholic beverages"]' exclusions, '["sigiriya","culture","village","sunrise"]' tags, 1 featured, '["Sunrise climb before the crowds","UNESCO World Heritage interpretation","Traditional catamaran crossing","Farm-to-table Sri Lankan lunch"]' highlights, 'Hotel lobby in Colombo or Negombo' meeting_point, 'Comfortable walking shoes, sun protection, and a valid photo ID are recommended.' requirements, 'flexible' cancellation_policy, 210 age_days
    UNION ALL SELECT 'Kandy Heritage & Tea Country Escape', 'Kandy', 245.00, 'active', 'Historical', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85', 'A curated journey through the Temple of the Sacred Tooth Relic, Peradeniya gardens, and a working tea estate in the central highlands.', '3 Days / 2 Nights', 14, 'Easy', '["Private transport","Two nights accommodation","Daily breakfast","Cultural guide","Tea factory visit"]', '["Lunch and dinner","Camera permits","Tips"]', '["kandy","tea","heritage","highlands"]', 1, '["Temple of the Tooth","Royal Botanical Gardens","Tea tasting with an estate specialist","Scenic highland viewpoints"]', 'Kandy railway station main entrance', 'Modest clothing covering shoulders and knees is required for temple visits.', 'standard', 195
    UNION ALL SELECT 'Ella Highlands & Nine Arches Trail', 'Ella', 155.00, 'active', 'Hiking', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85', 'A guided highland adventure featuring Little Adams Peak, Nine Arches Bridge, local cuisine, and panoramic tea-country scenery.', '2 Days / 1 Night', 10, 'Medium', '["Resident hiking guide","Boutique guesthouse","Breakfast","Trail snacks","Local transfers"]', '["Train tickets to Ella","Dinner","Personal hiking equipment"]', '["ella","hiking","railway","nature"]', 1, '["Little Adams Peak sunrise","Nine Arches Bridge walk","Tea-country viewpoints","Ella village food experience"]', 'Ella railway station', 'Guests should be comfortable walking up to eight kilometres on uneven paths.', 'flexible', 180
    UNION ALL SELECT 'Yala Wildlife Safari Expedition', 'Yala', 295.00, 'active', 'Wildlife', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85', 'A responsibly operated safari with an experienced naturalist, private jeep, and carefully timed drives through Yala National Park.', '2 Days / 1 Night', 8, 'Easy', '["Private safari jeep","Naturalist guide","Eco-lodge stay","Breakfast and dinner","Park entrance fees"]', '["Travel insurance","Premium beverages","Gratuities"]', '["yala","wildlife","safari","leopard"]', 1, '["Dawn and afternoon game drives","Leopard habitat interpretation","Birdwatching stops","Small-group safari experience"]', 'Tissamaharama town centre', 'Neutral clothing, binoculars, and prescribed medication should be carried.', 'standard', 165
    UNION ALL SELECT 'Galle Fort, Coast & Culinary Journey', 'Galle', 210.00, 'active', 'Photography', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85', 'A relaxed south-coast itinerary combining Galle Fort architecture, local markets, a hands-on cooking session, and sunset photography.', '2 Days / 1 Night', 12, 'Easy', '["Fort specialist guide","Boutique hotel","Breakfast","Cooking workshop","Private transfers"]', '["Lunch outside the workshop","Personal shopping","Alcohol"]', '["galle","coast","food","photography"]', 1, '["Galle Fort walking tour","Market visit with a local host","Sri Lankan cooking workshop","Indian Ocean sunset"]', 'Galle Fort clock tower', 'Please advise dietary requirements at least 48 hours before departure.', 'flexible', 150
    UNION ALL SELECT 'Mirissa Ocean & Whale Watching Retreat', 'Mirissa', 265.00, 'active', 'Beach', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=85', 'A coastal escape with an ethical whale-watching operator, beach leisure, and a guided visit to the fishing harbour.', '3 Days / 2 Nights', 16, 'Easy', '["Two nights beachfront accommodation","Breakfast","Whale-watching ticket","Harbour transfer","Marine naturalist briefing"]', '["Lunch and dinner","Water sports","Travel insurance"]', '["mirissa","whales","beach","ocean"]', 0, '["Responsible whale watching","Secret Beach visit","Coconut Tree Hill sunset","Fresh seafood options"]', 'Mirissa harbour passenger entrance', 'Not recommended for guests with severe motion sickness without medical advice.', 'standard', 135
    UNION ALL SELECT 'Anuradhapura Sacred City Explorer', 'Anuradhapura', 175.00, 'active', 'Historical', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85', 'An expert-led exploration of ancient monasteries, monumental stupas, reservoirs, and living Buddhist heritage.', '2 Days / 1 Night', 15, 'Easy', '["Archaeology guide","Private transport","Hotel with breakfast","Site tickets","Bicycle option"]', '["Temple offerings","Lunch and dinner","Personal expenses"]', '["anuradhapura","unesco","history","buddhism"]', 0, '["Sri Maha Bodhi precinct","Ruwanwelisaya at dusk","Abhayagiri monastery","Ancient irrigation heritage"]', 'Anuradhapura new town railway station', 'Temple-appropriate clothing and easy-to-remove footwear are recommended.', 'standard', 120
    UNION ALL SELECT 'Knuckles Range Eco Adventure', 'Kandy', 325.00, 'active', 'Adventure', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85', 'A low-impact trekking programme through cloud forest, village landscapes, waterfalls, and biodiversity-rich sections of the Knuckles Range.', '3 Days / 2 Nights', 8, 'Challenging', '["Certified trek leader","Eco-lodge accommodation","All main meals","Trail permits","Safety equipment"]', '["Specialist footwear","Travel insurance","Personal porters"]', '["knuckles","trekking","eco","mountains"]', 1, '["Cloud-forest trails","Village homestay meal","Waterfall swim where conditions permit","Small-group conservation briefing"]', 'Kandy city hotel pickup', 'Good fitness, closed hiking footwear, and a reusable water bottle are required.', 'strict', 105
    UNION ALL SELECT 'Bentota Family River & Beach Holiday', 'Bentota', 390.00, 'active', 'Family', 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=85', 'A family-friendly coastal holiday with a calm river safari, beach time, turtle conservation visit, and flexible private transport.', '4 Days / 3 Nights', 18, 'Easy', '["Family resort stay","Daily breakfast","River safari","Turtle conservation visit","Private transfers"]', '["Optional water sports","Lunch and dinner","Childcare"]', '["bentota","family","river","beach"]', 0, '["Bentota River safari","Family beach day","Turtle conservation education","Flexible child-friendly schedule"]', 'Bandaranaike International Airport arrivals hall', 'Child seats must be requested during booking.', 'flexible', 90
    UNION ALL SELECT 'Nuwara Eliya Tea & Wellness Weekend', 'Nuwara Eliya', 285.00, 'active', 'Wellness', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=85', 'A restorative highland weekend with tea estate walks, gentle wellness sessions, seasonal cuisine, and time beside Gregory Lake.', '3 Days / 2 Nights', 10, 'Easy', '["Heritage bungalow stay","Daily breakfast","Guided tea walk","One wellness session","Private transfers"]', '["Spa upgrades","Lunch and dinner","Personal purchases"]', '["nuwara-eliya","tea","wellness","slow-travel"]', 0, '["Private tea tasting","Guided breathing session","Gregory Lake walk","Seasonal estate dinner option"]', 'Nanu Oya railway station', 'Warm layers are recommended for cool evenings.', 'flexible', 75
    UNION ALL SELECT 'Polonnaruwa Cycling Heritage Trail', 'Polonnaruwa', 145.00, 'draft', 'Cultural', 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=1400&q=85', 'A proposed guided cycling route linking the main monuments of medieval Polonnaruwa with shaded rest stops and local refreshments.', '1 Day', 12, 'Medium', '["Bicycle and helmet","Heritage guide","Entrance ticket","Refreshments"]', '["Hotel transfer","Lunch","Travel insurance"]', '["polonnaruwa","cycling","heritage"]', 0, '["Gal Vihara","Royal Palace complex","Parakrama Samudra viewpoints"]', 'Polonnaruwa museum entrance', 'Basic cycling confidence is required.', 'standard', 35
    UNION ALL SELECT 'Arugam Bay Surf & Lagoon Escape', 'Arugam Bay', 235.00, 'inactive', 'Beach', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=85', 'A seasonal surf and lagoon package designed for beginner and intermediate surfers, currently paused outside the operating season.', '3 Days / 2 Nights', 10, 'Medium', '["Guesthouse stay","Breakfast","Two surf lessons","Lagoon safari"]', '["Board rental outside lessons","Lunch and dinner","Insurance"]', '["arugam-bay","surf","lagoon"]', 0, '["Small-group surf coaching","Sunset lagoon safari","Beachside accommodation"]', 'Arugam Bay main junction', 'Swimming ability is required for surf sessions.', 'seasonal', 25
) AS seed
WHERE NOT EXISTS (
    SELECT 1 FROM `tours` existing
    WHERE existing.`name` = seed.name AND existing.`destination` = seed.destination
);

-- --------------------------------------------------------------------------
-- 3. VEHICLES (12 rows: 10 active, 2 inactive)
-- --------------------------------------------------------------------------
INSERT INTO `vehicles` (
    `name`, `type`, `description`, `status`, `category`, `daily_rate`,
    `weekly_rate`, `monthly_rate`, `fuel_type`, `transmission`, `year`,
    `color`, `mileage`, `engine`, `capacity`, `tags`, `featured`, `images`,
    `created_at`, `updated_at`
)
SELECT
    seed.name, seed.type, seed.description, seed.status, seed.category,
    seed.daily_rate, seed.weekly_rate, seed.monthly_rate, seed.fuel_type,
    seed.transmission, seed.year, seed.color, seed.mileage, seed.engine,
    seed.capacity, seed.tags, seed.featured, seed.images,
    DATE_SUB(@seed_now, INTERVAL seed.age_days DAY), @seed_now
FROM (
    SELECT 'Toyota Prius Hybrid' name, 'Car' type, 'Comfortable and fuel-efficient hybrid sedan for airport transfers and private touring.' description, 'active' status, 'Sedan Car' category, 58.00 daily_rate, 350.00 weekly_rate, 1180.00 monthly_rate, 'Hybrid' fuel_type, 'Automatic' transmission, 2022 year, 'Pearl White' color, '22 km/l' mileage, '1800 cc' engine, 4 capacity, '["air-conditioning","hybrid","airport-transfer"]' tags, 1 featured, '["https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=85"]' images, 300 age_days
    UNION ALL SELECT 'Toyota KDH High Roof', 'Van', 'Spacious high-roof van with luggage capacity for families and small tour groups.', 'active', 'Seater Van', 110.00, 690.00, 2250.00, 'Diesel', 'Automatic', 2021, 'Silver', '11 km/l', '3000 cc', 10, '["air-conditioning","large-luggage","group-travel"]', 1, '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85"]', 285
    UNION ALL SELECT 'Toyota Hiace Luxury', 'Van', 'Executive passenger van configured for premium multi-day tours and corporate groups.', 'active', 'Luxury Van', 135.00, 840.00, 2780.00, 'Diesel', 'Automatic', 2023, 'Black', '10 km/l', '2800 cc', 9, '["executive-seats","wifi","premium"]', 1, '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85"]', 250
    UNION ALL SELECT 'Suzuki Wagon R Hybrid', 'Car', 'Compact hybrid hatchback suited to city transfers and couples travelling with light luggage.', 'active', 'Hatchback Car', 42.00, 255.00, 850.00, 'Hybrid', 'Automatic', 2022, 'Blue', '24 km/l', '660 cc', 4, '["compact","hybrid","city"]', 0, '["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85"]', 230
    UNION ALL SELECT 'Honda Shuttle Hybrid', 'Car', 'Practical hybrid station wagon balancing passenger comfort with generous luggage space.', 'active', 'Station Wagon', 62.00, 380.00, 1260.00, 'Hybrid', 'Automatic', 2021, 'Grey', '21 km/l', '1500 cc', 4, '["hybrid","large-luggage","long-distance"]', 1, '["https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=85"]', 210
    UNION ALL SELECT 'Toyota Axio Hybrid', 'Car', 'Reliable sedan with a quiet cabin for business transfers and private island-wide journeys.', 'active', 'Sedan Car', 55.00, 335.00, 1120.00, 'Hybrid', 'Automatic', 2020, 'White', '23 km/l', '1500 cc', 4, '["business","hybrid","comfortable"]', 0, '["https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85"]', 190
    UNION ALL SELECT 'Mitsubishi Montero Sport', 'SUV', 'Four-wheel-drive SUV for hill-country roads, wildlife areas, and premium family touring.', 'active', 'SUV', 125.00, 770.00, 2520.00, 'Diesel', 'Automatic', 2021, 'Graphite', '10 km/l', '2400 cc', 6, '["4x4","family","adventure"]', 1, '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85"]', 170
    UNION ALL SELECT 'Toyota Coaster', 'Bus', 'Air-conditioned mini coach for organised groups, conferences, and extended round tours.', 'active', 'Mini Coach', 190.00, 1180.00, 3850.00, 'Diesel', 'Manual', 2019, 'White and Blue', '7 km/l', '4000 cc', 24, '["group-travel","microphone","large-luggage"]', 0, '["https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=85"]', 145
    UNION ALL SELECT 'Suzuki Alto', 'Car', 'Economical compact car for short city transfers and solo business travellers.', 'active', 'Mini Car', 35.00, 210.00, 700.00, 'Petrol', 'Automatic', 2021, 'Red', '20 km/l', '660 cc', 3, '["economy","city","compact"]', 0, '["https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=85"]', 125
    UNION ALL SELECT 'Nissan Caravan', 'Van', 'Versatile passenger van with strong air conditioning and flexible seating for regional tours.', 'active', 'Seater Van', 98.00, 610.00, 2020.00, 'Diesel', 'Automatic', 2020, 'Silver', '12 km/l', '2500 cc', 8, '["family","group-travel","luggage"]', 0, '["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1200&q=85"]', 105
    UNION ALL SELECT 'Toyota Land Cruiser Prado', 'SUV', 'Premium four-wheel-drive vehicle reserved for specialist and executive itineraries.', 'inactive', 'Luxury SUV', 165.00, 1010.00, 3300.00, 'Diesel', 'Automatic', 2018, 'Black', '8 km/l', '2800 cc', 6, '["4x4","executive","premium"]', 0, '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85"]', 85
    UNION ALL SELECT 'Mazda Bongo', 'Van', 'Compact passenger van currently held as a backup fleet vehicle during scheduled maintenance.', 'inactive', 'Mini Van', 72.00, 440.00, 1450.00, 'Petrol', 'Automatic', 2017, 'White', '12 km/l', '1800 cc', 7, '["backup","compact-van","family"]', 0, '["https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=1200&q=85"]', 65
) AS seed
WHERE NOT EXISTS (
    SELECT 1 FROM `vehicles` existing WHERE existing.`name` = seed.name
);

-- --------------------------------------------------------------------------
-- 4. CUSTOMERS (12 rows)
-- --------------------------------------------------------------------------
INSERT INTO `customers` (
    `customer_name`, `customer_email`, `customer_phone`, `total_bookings`,
    `status`, `join_date`, `last_activity`, `created_at`, `updated_at`
) VALUES
    ('Nimal Perera', 'nimal.perera@guest.ceytripz.test', '+94711234567', 2, 'active', DATE_SUB(@seed_today, INTERVAL 180 DAY), DATE_SUB(@seed_now, INTERVAL 2 DAY), DATE_SUB(@seed_now, INTERVAL 180 DAY), @seed_now),
    ('Amaya Silva', 'amaya.silva@guest.ceytripz.test', '+94772345678', 2, 'active', DATE_SUB(@seed_today, INTERVAL 160 DAY), DATE_SUB(@seed_now, INTERVAL 4 DAY), DATE_SUB(@seed_now, INTERVAL 160 DAY), @seed_now),
    ('Daniel Carter', 'daniel.carter@guest.ceytripz.test', '+447700900101', 2, 'active', DATE_SUB(@seed_today, INTERVAL 145 DAY), DATE_SUB(@seed_now, INTERVAL 6 DAY), DATE_SUB(@seed_now, INTERVAL 145 DAY), @seed_now),
    ('Emma Wilson', 'emma.wilson@guest.ceytripz.test', '+61412345001', 1, 'active', DATE_SUB(@seed_today, INTERVAL 120 DAY), DATE_SUB(@seed_now, INTERVAL 8 DAY), DATE_SUB(@seed_now, INTERVAL 120 DAY), @seed_now),
    ('Liam Murphy', 'liam.murphy@guest.ceytripz.test', '+353851230401', 1, 'active', DATE_SUB(@seed_today, INTERVAL 110 DAY), DATE_SUB(@seed_now, INTERVAL 10 DAY), DATE_SUB(@seed_now, INTERVAL 110 DAY), @seed_now),
    ('Aiko Tanaka', 'aiko.tanaka@guest.ceytripz.test', '+819012340501', 1, 'active', DATE_SUB(@seed_today, INTERVAL 95 DAY), DATE_SUB(@seed_now, INTERVAL 12 DAY), DATE_SUB(@seed_now, INTERVAL 95 DAY), @seed_now),
    ('Sofia Rossi', 'sofia.rossi@guest.ceytripz.test', '+393401230601', 1, 'active', DATE_SUB(@seed_today, INTERVAL 70 DAY), DATE_SUB(@seed_now, INTERVAL 5 DAY), DATE_SUB(@seed_now, INTERVAL 70 DAY), @seed_now),
    ('Oliver Schmidt', 'oliver.schmidt@guest.ceytripz.test', '+491512340701', 1, 'active', DATE_SUB(@seed_today, INTERVAL 50 DAY), DATE_SUB(@seed_now, INTERVAL 7 DAY), DATE_SUB(@seed_now, INTERVAL 50 DAY), @seed_now),
    ('Noor Rahman', 'noor.rahman@guest.ceytripz.test', '+971501230801', 1, 'active', DATE_SUB(@seed_today, INTERVAL 42 DAY), DATE_SUB(@seed_now, INTERVAL 1 DAY), DATE_SUB(@seed_now, INTERVAL 42 DAY), @seed_now),
    ('Maya Patel', 'maya.patel@guest.ceytripz.test', '+919810230901', 1, 'active', DATE_SUB(@seed_today, INTERVAL 35 DAY), DATE_SUB(@seed_now, INTERVAL 3 DAY), DATE_SUB(@seed_now, INTERVAL 35 DAY), @seed_now),
    ('Ethan Brown', 'ethan.brown@guest.ceytripz.test', '+14165550110', 1, 'active', DATE_SUB(@seed_today, INTERVAL 28 DAY), DATE_SUB(@seed_now, INTERVAL 9 DAY), DATE_SUB(@seed_now, INTERVAL 28 DAY), @seed_now),
    ('Ibrahim Hassan', 'ibrahim.hassan@guest.ceytripz.test', '+97455123111', 0, 'inactive', DATE_SUB(@seed_today, INTERVAL 20 DAY), DATE_SUB(@seed_now, INTERVAL 14 DAY), DATE_SUB(@seed_now, INTERVAL 20 DAY), @seed_now)
ON DUPLICATE KEY UPDATE
    `customer_name` = VALUES(`customer_name`),
    `customer_phone` = VALUES(`customer_phone`),
    `total_bookings` = VALUES(`total_bookings`),
    `status` = VALUES(`status`),
    `last_activity` = VALUES(`last_activity`),
    `updated_at` = @seed_now;

-- --------------------------------------------------------------------------
-- 5. BOOKINGS (15 rows distributed across the dashboard's last 30 days)
-- --------------------------------------------------------------------------
INSERT INTO `bookings` (
    `customer_name`, `customer_email`, `customer_phone`, `pickup_location`,
    `drop_location`, `pickup_date`, `return_date`, `vehicle_type`, `passengers`,
    `amount`, `notes`, `status`, `created_at`, `updated_at`
)
SELECT
    seed.customer_name, seed.customer_email, seed.customer_phone,
    seed.pickup_location, seed.drop_location,
    DATE_ADD(@seed_today, INTERVAL seed.pickup_days DAY),
    DATE_ADD(@seed_today, INTERVAL seed.return_days DAY), seed.vehicle_type,
    seed.passengers, seed.amount,
    CONCAT(seed.booking_ref, ' | ', seed.notes), seed.status,
    DATE_SUB(@seed_now, INTERVAL seed.created_days DAY),
    DATE_SUB(@seed_now, INTERVAL seed.updated_days DAY)
FROM (
    SELECT 'CT-DEMO-BKG-001' booking_ref, 'Nimal Perera' customer_name, 'nimal.perera@guest.ceytripz.test' customer_email, '+94711234567' customer_phone, 'Bandaranaike International Airport' pickup_location, 'Colombo Fort' drop_location, -27 pickup_days, -27 return_days, 'Toyota Prius Hybrid' vehicle_type, 2 passengers, 48.00 amount, 'Flight UL 308 arrival transfer; meet-and-greet requested.' notes, 'completed' status, 29 created_days, 27 updated_days
    UNION ALL SELECT 'CT-DEMO-BKG-002', 'Amaya Silva', 'amaya.silva@guest.ceytripz.test', '+94772345678', 'Colombo Fort', 'Sigiriya', -23, -20, 'Toyota KDH High Roof', 6, 420.00, 'Family cultural triangle transfer with two child seats.', 'completed', 25, 20
    UNION ALL SELECT 'CT-DEMO-BKG-003', 'Daniel Carter', 'daniel.carter@guest.ceytripz.test', '+447700900101', 'Kandy', 'Ella', -19, -17, 'Honda Shuttle Hybrid', 2, 185.00, 'Scenic highland transfer with a tea-factory stop.', 'completed', 22, 17
    UNION ALL SELECT 'CT-DEMO-BKG-004', 'Emma Wilson', 'emma.wilson@guest.ceytripz.test', '+61412345001', 'Ella', 'Yala National Park', -16, -14, 'Mitsubishi Montero Sport', 4, 310.00, 'Early departure requested for the afternoon safari check-in.', 'completed', 19, 14
    UNION ALL SELECT 'CT-DEMO-BKG-005', 'Liam Murphy', 'liam.murphy@guest.ceytripz.test', '+353851230401', 'Galle Fort', 'Mirissa', -12, -10, 'Toyota Axio Hybrid', 2, 145.00, 'Coastal transfer with a brief stop at Weligama Bay.', 'completed', 16, 10
    UNION ALL SELECT 'CT-DEMO-BKG-006', 'Aiko Tanaka', 'aiko.tanaka@guest.ceytripz.test', '+819012340501', 'Anuradhapura', 'Polonnaruwa', -9, -7, 'Toyota Prius Hybrid', 2, 195.00, 'Japanese-speaking guide coordination noted on the itinerary.', 'completed', 13, 7
    UNION ALL SELECT 'CT-DEMO-BKG-007', 'Sofia Rossi', 'sofia.rossi@guest.ceytripz.test', '+393401230601', 'Nuwara Eliya', 'Kandy', -6, -5, 'Honda Shuttle Hybrid', 3, 165.00, 'Hotel pickup with three medium suitcases.', 'completed', 10, 5
    UNION ALL SELECT 'CT-DEMO-BKG-008', 'Oliver Schmidt', 'oliver.schmidt@guest.ceytripz.test', '+491512340701', 'Bandaranaike International Airport', 'Colombo Fort', 2, 2, 'Toyota Prius Hybrid', 2, 52.00, 'Flight LH 754 arrival transfer; driver sign required.', 'confirmed', 8, 2
    UNION ALL SELECT 'CT-DEMO-BKG-009', 'Noor Rahman', 'noor.rahman@guest.ceytripz.test', '+971501230801', 'Colombo Fort', 'Sigiriya', 5, 8, 'Toyota Hiace Luxury', 7, 465.00, 'Private family journey with halal dining recommendations.', 'confirmed', 6, 1
    UNION ALL SELECT 'CT-DEMO-BKG-010', 'Maya Patel', 'maya.patel@guest.ceytripz.test', '+919810230901', 'Kandy', 'Ella', 8, 10, 'Honda Shuttle Hybrid', 3, 205.00, 'One railway viewpoint stop and vegetarian lunch recommendation.', 'confirmed', 4, 1
    UNION ALL SELECT 'CT-DEMO-BKG-011', 'Ethan Brown', 'ethan.brown@guest.ceytripz.test', '+14165550110', 'Galle Fort', 'Mirissa', 12, 14, 'Toyota Axio Hybrid', 2, 155.00, 'Surf luggage space required.', 'confirmed', 2, 0
    UNION ALL SELECT 'CT-DEMO-BKG-012', 'Nimal Perera', 'nimal.perera@guest.ceytripz.test', '+94711234567', 'Bandaranaike International Airport', 'Kandy', 4, 4, 'Suzuki Wagon R Hybrid', 2, 95.00, 'Evening airport pickup; mobile contact preferred.', 'pending', 3, 0
    UNION ALL SELECT 'CT-DEMO-BKG-013', 'Amaya Silva', 'amaya.silva@guest.ceytripz.test', '+94772345678', 'Colombo Fort', 'Bentota', 10, 12, 'Nissan Caravan', 6, 235.00, 'Family beach transfer pending final hotel confirmation.', 'pending', 1, 0
    UNION ALL SELECT 'CT-DEMO-BKG-014', 'Daniel Carter', 'daniel.carter@guest.ceytripz.test', '+447700900101', 'Ella', 'Yala National Park', 18, 20, 'Mitsubishi Montero Sport', 4, 335.00, 'Safari lodge booking reference to be supplied.', 'pending', 0, 0
    UNION ALL SELECT 'CT-DEMO-BKG-015', 'Ibrahim Hassan', 'ibrahim.hassan@guest.ceytripz.test', '+97455123111', 'Colombo Fort', 'Arugam Bay', 7, 11, 'Toyota KDH High Roof', 5, 520.00, 'Seasonal itinerary cancelled after flight schedule change.', 'cancelled', 14, 12
) AS seed
WHERE NOT EXISTS (
    SELECT 1 FROM `bookings` existing WHERE existing.`notes` LIKE CONCAT(seed.booking_ref, '%')
);

-- --------------------------------------------------------------------------
-- 6. PAYMENTS (15 rows linked to the seeded bookings)
-- --------------------------------------------------------------------------
INSERT INTO `payments` (
    `payment_code`, `booking_id`, `customer_name`, `customer_email`, `amount`,
    `currency`, `payment_method`, `status`, `transaction_id`, `payment_date`,
    `due_date`, `description`, `created_at`, `updated_at`
)
SELECT
    seed.payment_code,
    (SELECT MAX(b.`id`) FROM `bookings` b WHERE b.`notes` LIKE CONCAT(seed.booking_ref, '%')),
    seed.customer_name, seed.customer_email, seed.amount, 'USD',
    seed.payment_method, seed.status, seed.transaction_id,
    CASE WHEN seed.payment_days IS NULL THEN NULL ELSE DATE_SUB(@seed_now, INTERVAL seed.payment_days DAY) END,
    DATE_ADD(@seed_today, INTERVAL seed.due_days DAY), seed.description,
    DATE_SUB(@seed_now, INTERVAL seed.created_days DAY),
    DATE_SUB(@seed_now, INTERVAL seed.updated_days DAY)
FROM (
    SELECT 'CT-DEMO-PAY-001' payment_code, 'CT-DEMO-BKG-001' booking_ref, 'Nimal Perera' customer_name, 'nimal.perera@guest.ceytripz.test' customer_email, 48.00 amount, 'Credit Card' payment_method, 'completed' status, 'CTDEMO-TXN-001' transaction_id, 27 payment_days, -27 due_days, 'Airport transfer paid in full.' description, 29 created_days, 27 updated_days
    UNION ALL SELECT 'CT-DEMO-PAY-002', 'CT-DEMO-BKG-002', 'Amaya Silva', 'amaya.silva@guest.ceytripz.test', 420.00, 'Bank Transfer', 'completed', 'CTDEMO-TXN-002', 21, -20, 'Family cultural transfer paid in full.', 25, 21
    UNION ALL SELECT 'CT-DEMO-PAY-003', 'CT-DEMO-BKG-003', 'Daniel Carter', 'daniel.carter@guest.ceytripz.test', 185.00, 'Debit Card', 'completed', 'CTDEMO-TXN-003', 18, -17, 'Highland transfer payment.', 22, 18
    UNION ALL SELECT 'CT-DEMO-PAY-004', 'CT-DEMO-BKG-004', 'Emma Wilson', 'emma.wilson@guest.ceytripz.test', 310.00, 'Credit Card', 'completed', 'CTDEMO-TXN-004', 15, -14, 'Yala transfer and vehicle service.', 19, 15
    UNION ALL SELECT 'CT-DEMO-PAY-005', 'CT-DEMO-BKG-005', 'Liam Murphy', 'liam.murphy@guest.ceytripz.test', 145.00, 'PayPal', 'completed', 'CTDEMO-TXN-005', 11, -10, 'South-coast transfer payment.', 16, 11
    UNION ALL SELECT 'CT-DEMO-PAY-006', 'CT-DEMO-BKG-006', 'Aiko Tanaka', 'aiko.tanaka@guest.ceytripz.test', 195.00, 'Credit Card', 'completed', 'CTDEMO-TXN-006', 8, -7, 'Ancient-cities transfer payment.', 13, 8
    UNION ALL SELECT 'CT-DEMO-PAY-007', 'CT-DEMO-BKG-007', 'Sofia Rossi', 'sofia.rossi@guest.ceytripz.test', 165.00, 'Debit Card', 'completed', 'CTDEMO-TXN-007', 5, -5, 'Tea-country transfer payment.', 10, 5
    UNION ALL SELECT 'CT-DEMO-PAY-008', 'CT-DEMO-BKG-008', 'Oliver Schmidt', 'oliver.schmidt@guest.ceytripz.test', 52.00, 'Credit Card', 'completed', 'CTDEMO-TXN-008', 2, 0, 'Upcoming airport transfer paid in full.', 8, 2
    UNION ALL SELECT 'CT-DEMO-PAY-009', 'CT-DEMO-BKG-009', 'Noor Rahman', 'noor.rahman@guest.ceytripz.test', 465.00, 'Bank Transfer', 'completed', 'CTDEMO-TXN-009', 1, 2, 'Family cultural journey paid in full.', 6, 1
    UNION ALL SELECT 'CT-DEMO-PAY-010', 'CT-DEMO-BKG-010', 'Maya Patel', 'maya.patel@guest.ceytripz.test', 205.00, 'Credit Card', 'completed', 'CTDEMO-TXN-010', 0, 5, 'Kandy to Ella journey paid in full.', 4, 0
    UNION ALL SELECT 'CT-DEMO-PAY-011', 'CT-DEMO-BKG-011', 'Ethan Brown', 'ethan.brown@guest.ceytripz.test', 155.00, 'PayPal', 'pending', 'CTDEMO-TXN-011', NULL, 5, 'Awaiting payment for coastal transfer.', 2, 0
    UNION ALL SELECT 'CT-DEMO-PAY-012', 'CT-DEMO-BKG-012', 'Nimal Perera', 'nimal.perera@guest.ceytripz.test', 95.00, 'Cash', 'pending', NULL, NULL, 3, 'Cash payment due to driver before departure.', 3, 0
    UNION ALL SELECT 'CT-DEMO-PAY-013', 'CT-DEMO-BKG-013', 'Amaya Silva', 'amaya.silva@guest.ceytripz.test', 235.00, 'Credit Card', 'failed', 'CTDEMO-TXN-013', NULL, 4, 'Card authorisation failed; customer follow-up required.', 1, 0
    UNION ALL SELECT 'CT-DEMO-PAY-014', 'CT-DEMO-BKG-015', 'Ibrahim Hassan', 'ibrahim.hassan@guest.ceytripz.test', 520.00, 'Bank Transfer', 'refunded', 'CTDEMO-TXN-014', 12, -11, 'Refund completed after booking cancellation.', 14, 12
    UNION ALL SELECT 'CT-DEMO-PAY-015', 'CT-DEMO-BKG-014', 'Daniel Carter', 'daniel.carter@guest.ceytripz.test', 335.00, 'Bank Transfer', 'pending', 'CTDEMO-TXN-015', NULL, 10, 'Invoice issued; payment awaiting bank confirmation.', 0, 0
) AS seed
WHERE NOT EXISTS (
    SELECT 1 FROM `payments` existing WHERE existing.`payment_code` = seed.payment_code
);

-- --------------------------------------------------------------------------
-- 7. REVIEWS (12 rows linked to bookings and exact tour names)
-- --------------------------------------------------------------------------
INSERT INTO `reviews` (
    `review_code`, `booking_id`, `customer_name`, `customer_email`, `tour_name`,
    `rating`, `comment`, `status`, `created_at`, `updated_at`
)
SELECT
    seed.review_code,
    (SELECT MAX(b.`id`) FROM `bookings` b WHERE b.`notes` LIKE CONCAT(seed.booking_ref, '%')),
    seed.customer_name, seed.customer_email, seed.tour_name, seed.rating,
    seed.comment, seed.status,
    DATE_SUB(@seed_now, INTERVAL seed.age_days DAY),
    DATE_SUB(@seed_now, INTERVAL seed.update_days DAY)
FROM (
    SELECT 'CT-DEMO-REV-001' review_code, 'CT-DEMO-BKG-002' booking_ref, 'Amaya Silva' customer_name, 'amaya.silva@guest.ceytripz.test' customer_email, 'Sigiriya Sunrise & Village Discovery' tour_name, 5 rating, 'The sunrise timing was excellent and our guide explained the history clearly without rushing us. The village lunch was warm, genuine, and beautifully organised.' comment, 'published' status, 19 age_days, 18 update_days
    UNION ALL SELECT 'CT-DEMO-REV-002', 'CT-DEMO-BKG-003', 'Daniel Carter', 'daniel.carter@guest.ceytripz.test', 'Ella Highlands & Nine Arches Trail', 5, 'A well-paced highland experience with a knowledgeable local guide. Nine Arches Bridge and the tea-country walk were highlights of our holiday.', 'published', 16, 15
    UNION ALL SELECT 'CT-DEMO-REV-003', 'CT-DEMO-BKG-004', 'Emma Wilson', 'emma.wilson@guest.ceytripz.test', 'Yala Wildlife Safari Expedition', 4, 'The naturalist was outstanding and respectful of the animals. The early start was worthwhile, and the lodge team handled dietary needs professionally.', 'published', 13, 12
    UNION ALL SELECT 'CT-DEMO-REV-004', 'CT-DEMO-BKG-005', 'Liam Murphy', 'liam.murphy@guest.ceytripz.test', 'Galle Fort, Coast & Culinary Journey', 5, 'The fort walk and cooking session felt personal rather than commercial. We learned a great deal and left with recipes we have already used at home.', 'published', 9, 8
    UNION ALL SELECT 'CT-DEMO-REV-005', 'CT-DEMO-BKG-006', 'Aiko Tanaka', 'aiko.tanaka@guest.ceytripz.test', 'Anuradhapura Sacred City Explorer', 4, 'A thoughtful and informative introduction to the sacred city. The itinerary allowed quiet time at the main sites and included plenty of water breaks.', 'published', 7, 6
    UNION ALL SELECT 'CT-DEMO-REV-006', 'CT-DEMO-BKG-007', 'Sofia Rossi', 'sofia.rossi@guest.ceytripz.test', 'Nuwara Eliya Tea & Wellness Weekend', 5, 'The bungalow, tea tasting, and cool climate created exactly the restorative weekend we wanted. Transfers were punctual and very comfortable.', 'published', 4, 3
    UNION ALL SELECT 'CT-DEMO-REV-007', 'CT-DEMO-BKG-001', 'Nimal Perera', 'nimal.perera@guest.ceytripz.test', 'Kandy Heritage & Tea Country Escape', 4, 'A dependable itinerary with good local interpretation and smooth transport. The botanical garden visit was especially enjoyable.', 'published', 27, 26
    UNION ALL SELECT 'CT-DEMO-REV-008', 'CT-DEMO-BKG-002', 'Amaya Silva', 'amaya.silva@guest.ceytripz.test', 'Bentota Family River & Beach Holiday', 5, 'Our children loved the river safari and turtle conservation visit. The schedule was flexible and never felt exhausting for the family.', 'published', 21, 20
    UNION ALL SELECT 'CT-DEMO-REV-009', 'CT-DEMO-BKG-003', 'Daniel Carter', 'daniel.carter@guest.ceytripz.test', 'Knuckles Range Eco Adventure', 5, 'A challenging but rewarding trek. Safety, meals, and trail interpretation were handled to a very high standard throughout.', 'published', 11, 10
    UNION ALL SELECT 'CT-DEMO-REV-010', 'CT-DEMO-BKG-008', 'Oliver Schmidt', 'oliver.schmidt@guest.ceytripz.test', 'Mirissa Ocean & Whale Watching Retreat', 4, 'The pre-tour briefing was clear and the operator took a responsible approach to wildlife. Communication before arrival was very good.', 'pending', 2, 2
    UNION ALL SELECT 'CT-DEMO-REV-011', 'CT-DEMO-BKG-009', 'Noor Rahman', 'noor.rahman@guest.ceytripz.test', 'Kandy Heritage & Tea Country Escape', 3, 'The itinerary looks strong and the planning support has been helpful. I will update the rating after our family completes the trip.', 'pending', 1, 1
    UNION ALL SELECT 'CT-DEMO-REV-012', 'CT-DEMO-BKG-015', 'Ibrahim Hassan', 'ibrahim.hassan@guest.ceytripz.test', 'Arugam Bay Surf & Lagoon Escape', 2, 'The trip could not proceed because of the seasonal schedule. The refund was received, but earlier communication would have been helpful.', 'rejected', 10, 9
) AS seed
WHERE NOT EXISTS (
    SELECT 1 FROM `reviews` existing WHERE existing.`review_code` = seed.review_code
);

-- --------------------------------------------------------------------------
-- 8. REVIEW IMAGES (12 rows; remote URLs render without local seed assets)
-- --------------------------------------------------------------------------
INSERT INTO `review_images` (
    `review_id`, `image_path`, `image_title`, `sort_order`, `is_cover`,
    `created_at`, `updated_at`
)
SELECT
    (SELECT MAX(r.`id`) FROM `reviews` r WHERE r.`review_code` = seed.review_code),
    seed.image_path, seed.image_title, 0, 1,
    DATE_SUB(@seed_now, INTERVAL seed.age_days DAY),
    DATE_SUB(@seed_now, INTERVAL seed.age_days DAY)
FROM (
    SELECT 'CT-DEMO-REV-001' review_code, 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85' image_path, 'Sigiriya sunrise viewpoint' image_title, 18 age_days
    UNION ALL SELECT 'CT-DEMO-REV-002', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85', 'Ella highland trail', 15
    UNION ALL SELECT 'CT-DEMO-REV-003', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85', 'Yala wildlife landscape', 12
    UNION ALL SELECT 'CT-DEMO-REV-004', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85', 'Galle south coast sunset', 8
    UNION ALL SELECT 'CT-DEMO-REV-005', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85', 'Ancient city heritage site', 6
    UNION ALL SELECT 'CT-DEMO-REV-006', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85', 'Tea country morning', 3
    UNION ALL SELECT 'CT-DEMO-REV-007', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85', 'Kandy highland scenery', 26
    UNION ALL SELECT 'CT-DEMO-REV-008', 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=85', 'Bentota family coast', 20
    UNION ALL SELECT 'CT-DEMO-REV-009', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85', 'Knuckles trekking route', 10
    UNION ALL SELECT 'CT-DEMO-REV-010', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=85', 'Mirissa ocean morning', 2
    UNION ALL SELECT 'CT-DEMO-REV-011', 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=1200&q=85', 'Sri Lankan heritage detail', 1
    UNION ALL SELECT 'CT-DEMO-REV-012', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=85', 'Arugam Bay surf conditions', 9
) AS seed
WHERE NOT EXISTS (
    SELECT 1
    FROM `review_images` existing
    JOIN `reviews` review_record ON review_record.`id` = existing.`review_id`
    WHERE review_record.`review_code` = seed.review_code
      AND existing.`image_title` = seed.image_title
);

-- --------------------------------------------------------------------------
-- 9. BLOG POST CATEGORIES (10 rows)
-- --------------------------------------------------------------------------
INSERT INTO `blog_post_categories` (`name`, `created_at`, `updated_at`) VALUES
    ('Travel Planning', DATE_SUB(@seed_now, INTERVAL 180 DAY), @seed_now),
    ('Cultural Heritage', DATE_SUB(@seed_now, INTERVAL 175 DAY), @seed_now),
    ('Wildlife & Nature', DATE_SUB(@seed_now, INTERVAL 170 DAY), @seed_now),
    ('Beaches & Coast', DATE_SUB(@seed_now, INTERVAL 165 DAY), @seed_now),
    ('Hill Country', DATE_SUB(@seed_now, INTERVAL 160 DAY), @seed_now),
    ('Food & Culture', DATE_SUB(@seed_now, INTERVAL 155 DAY), @seed_now),
    ('Adventure Travel', DATE_SUB(@seed_now, INTERVAL 150 DAY), @seed_now),
    ('Family Holidays', DATE_SUB(@seed_now, INTERVAL 145 DAY), @seed_now),
    ('Wellness & Slow Travel', DATE_SUB(@seed_now, INTERVAL 140 DAY), @seed_now),
    ('Responsible Tourism', DATE_SUB(@seed_now, INTERVAL 135 DAY), @seed_now)
ON DUPLICATE KEY UPDATE `updated_at` = @seed_now;

-- --------------------------------------------------------------------------
-- 10. TAGS (15 rows)
-- --------------------------------------------------------------------------
INSERT INTO `tags` (`name`, `created_at`, `updated_at`) VALUES
    ('Sri Lanka', DATE_SUB(@seed_now, INTERVAL 180 DAY), @seed_now),
    ('Travel Guide', DATE_SUB(@seed_now, INTERVAL 175 DAY), @seed_now),
    ('Culture', DATE_SUB(@seed_now, INTERVAL 170 DAY), @seed_now),
    ('Wildlife', DATE_SUB(@seed_now, INTERVAL 165 DAY), @seed_now),
    ('Beaches', DATE_SUB(@seed_now, INTERVAL 160 DAY), @seed_now),
    ('Tea Country', DATE_SUB(@seed_now, INTERVAL 155 DAY), @seed_now),
    ('Hiking', DATE_SUB(@seed_now, INTERVAL 150 DAY), @seed_now),
    ('Food', DATE_SUB(@seed_now, INTERVAL 145 DAY), @seed_now),
    ('Family Travel', DATE_SUB(@seed_now, INTERVAL 140 DAY), @seed_now),
    ('Sustainable Travel', DATE_SUB(@seed_now, INTERVAL 135 DAY), @seed_now),
    ('Photography', DATE_SUB(@seed_now, INTERVAL 130 DAY), @seed_now),
    ('Itinerary', DATE_SUB(@seed_now, INTERVAL 125 DAY), @seed_now),
    ('Transport', DATE_SUB(@seed_now, INTERVAL 120 DAY), @seed_now),
    ('Wellness', DATE_SUB(@seed_now, INTERVAL 115 DAY), @seed_now),
    ('Travel Tips', DATE_SUB(@seed_now, INTERVAL 110 DAY), @seed_now)
ON DUPLICATE KEY UPDATE `updated_at` = @seed_now;

-- --------------------------------------------------------------------------
-- 11. BLOG POSTS (12 rows)
-- --------------------------------------------------------------------------
INSERT INTO `blog_posts` (
    `title`, `image`, `author`, `author_avatar`, `date`, `category`, `location`,
    `read_time`, `likes`, `excerpt`, `content`, `category_id`, `status`,
    `scheduled_date`, `is_featured`, `meta_title`, `meta_description`,
    `created_at`, `updated_at`
)
SELECT
    seed.title, seed.image, seed.author, NULL,
    DATE_SUB(@seed_today, INTERVAL seed.date_days DAY), seed.category,
    seed.location, seed.read_time, seed.likes, seed.excerpt, seed.content,
    (SELECT MAX(c.`id`) FROM `blog_post_categories` c WHERE c.`name` = seed.category),
    seed.status,
    CASE WHEN seed.scheduled_days IS NULL THEN NULL ELSE DATE_ADD(@seed_now, INTERVAL seed.scheduled_days DAY) END,
    seed.is_featured, seed.meta_title, seed.meta_description,
    DATE_SUB(@seed_now, INTERVAL seed.date_days DAY),
    DATE_SUB(@seed_now, INTERVAL seed.update_days DAY)
FROM (
    SELECT 'A Practical 10-Day Sri Lanka Itinerary for First-Time Visitors' title, 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85' image, 'Tharushi Fernando' author, 28 date_days, 'Travel Planning' category, 'Sri Lanka' location, '8 min read' read_time, 148 likes, 'A balanced route through the Cultural Triangle, hill country, wildlife parks, and the southern coast.' excerpt, 'A successful first journey through Sri Lanka balances travel time with meaningful local experiences. This ten-day route begins near Colombo, continues through Sigiriya and Kandy, follows the railway landscape toward Ella, and finishes on the south coast. Reserve key trains and national-park safaris in advance, while leaving enough flexibility for weather and local discoveries.' content, 'published' status, NULL scheduled_days, 1 is_featured, '10-Day Sri Lanka Itinerary for First-Time Visitors' meta_title, 'Plan a balanced ten-day Sri Lanka holiday covering heritage, tea country, wildlife, and the south coast.' meta_description, 26 update_days
    UNION ALL SELECT 'When to Visit Sri Lanka: A Region-by-Region Weather Guide', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=85', 'Ravindu Perera', 24, 'Travel Planning', 'Sri Lanka', '7 min read', 121, 'Understand the island weather patterns and choose the right coast, hills, and wildlife areas for each season.', 'Sri Lanka can be visited throughout the year because the two monsoon systems affect different regions at different times. The south and west are generally most settled from December to April, while the east coast often performs best from May to September. Hill-country temperatures remain cooler, so layers and flexible planning are useful in every season.', 'published', NULL, 0, 'Best Time to Visit Sri Lanka by Region', 'A clear month-by-month guide to Sri Lanka weather, coasts, hill country, and seasonal travel planning.', 23
    UNION ALL SELECT 'Sigiriya Beyond the Summit: History, Villages, and Responsible Visits', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85', 'Dinuka Bandara', 21, 'Cultural Heritage', 'Sigiriya', '6 min read', 96, 'Make a Sigiriya visit more meaningful with historical context and community-based experiences nearby.', 'Sigiriya is more than a dramatic rock climb. Early entry reduces heat and congestion, while a licensed guide can explain the water gardens, frescoes, and changing theories surrounding the citadel. After the climb, community-run village experiences and locally owned restaurants help distribute tourism income beyond the main monument.', 'published', NULL, 1, 'Responsible Sigiriya Travel Guide', 'Explore Sigiriya history, best visiting times, village experiences, and responsible travel advice.', 20
    UNION ALL SELECT 'How to Plan an Ethical Wildlife Safari in Sri Lanka', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85', 'Madhavi Senanayake', 18, 'Wildlife & Nature', 'Yala National Park', '7 min read', 134, 'Choose responsible operators, manage expectations, and enjoy wildlife without placing animals under pressure.', 'A responsible safari values habitat and animal behaviour above a checklist of sightings. Select operators that limit vehicle crowding, follow park rules, and employ trained naturalists. Keep noise low, never request off-road pursuit, and remember that patient observation often produces the most memorable encounters.', 'published', NULL, 1, 'Ethical Sri Lanka Wildlife Safari Guide', 'Practical guidance for choosing ethical safari operators and enjoying Sri Lankan wildlife responsibly.', 17
    UNION ALL SELECT 'Ella on Foot: Three Scenic Walks for Different Fitness Levels', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85', 'Dinuka Bandara', 15, 'Hill Country', 'Ella', '6 min read', 112, 'Compare Little Adams Peak, Nine Arches Bridge, and longer ridge walks around Ella.', 'Ella offers accessible walks as well as more demanding trails. Little Adams Peak works well for a short sunrise outing, Nine Arches Bridge combines railway heritage with forest paths, and longer guided ridge routes provide quieter views. Carry water, use sun protection, and respect railway safety signs at all times.', 'published', NULL, 0, 'Best Walks and Hikes in Ella, Sri Lanka', 'A practical guide to three Ella walks with timing, difficulty, safety, and route-planning advice.', 14
    UNION ALL SELECT 'A Food Lovers Guide to Galle and the Southern Coast', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85', 'Tharushi Fernando', 12, 'Food & Culture', 'Galle', '8 min read', 87, 'Discover markets, home kitchens, seafood traditions, and thoughtful dining experiences around Galle.', 'The southern coast combines maritime influences with distinctly Sri Lankan ingredients. Begin at a morning market, look for seasonal produce and freshly ground spices, and consider a small-group cooking workshop led by a local host. Responsible seafood choices and family-run restaurants create better meals and stronger community benefit.', 'published', NULL, 0, 'Galle and South Coast Food Guide', 'Explore Sri Lankan markets, cooking workshops, seafood, and locally owned dining around Galle.', 11
    UNION ALL SELECT 'Choosing the Right Vehicle for Your Sri Lanka Journey', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85', 'Ravindu Perera', 9, 'Travel Planning', 'Sri Lanka', '5 min read', 73, 'Match vehicle size, luggage space, road conditions, and group comfort to your itinerary.', 'A compact hybrid is efficient for couples and airport transfers, while families usually benefit from a station wagon or passenger van. Highland and wildlife routes may justify an SUV, and larger groups should prioritise properly licensed coaches. Confirm luggage volume, child-seat needs, and driver accommodation before finalising a multi-day booking.', 'published', NULL, 0, 'Sri Lanka Private Vehicle Selection Guide', 'Compare cars, vans, SUVs, and coaches for private tours, transfers, families, and groups in Sri Lanka.', 8
    UNION ALL SELECT 'Family Travel in Sri Lanka: Comfort, Safety, and Pace', 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=85', 'Tharushi Fernando', 6, 'Family Holidays', 'Bentota', '7 min read', 64, 'Build a child-friendly holiday with realistic travel times, flexible stops, and engaging local experiences.', 'Sri Lanka works especially well for families when the itinerary avoids daily hotel changes. Use private transport with confirmed child seats, alternate cultural visits with wildlife or beach time, and protect the hottest part of the day for rest. Guides should adapt explanations and walking distances to the ages in the group.', 'published', NULL, 1, 'Sri Lanka Family Travel Planning Guide', 'Plan a safe and comfortable Sri Lanka family holiday with child seats, pacing, suitable activities, and flexible routes.', 5
    UNION ALL SELECT 'Slow Travel in the Tea Country', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=85', 'Madhavi Senanayake', 3, 'Wellness & Slow Travel', 'Nuwara Eliya', '6 min read', 52, 'Stay longer, walk gently, and experience tea-country communities beyond a quick photo stop.', 'The central highlands reward travellers who spend at least two nights in one base. Estate walks, guided tastings, local produce, and unhurried railway journeys create more meaningful connections than a rushed transfer. Pack warm layers and choose properties that employ locally and manage water responsibly.', 'published', NULL, 0, 'Slow Travel Guide to Sri Lanka Tea Country', 'Discover a calmer way to explore Nuwara Eliya and the tea country through longer stays and local experiences.', 2
    UNION ALL SELECT 'Knuckles Range Trekking Checklist', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85', 'Dinuka Bandara', 1, 'Adventure Travel', 'Knuckles Mountain Range', '5 min read', 18, 'A concise equipment, fitness, weather, and safety checklist for guided Knuckles treks.', 'Conditions in the Knuckles Range can change quickly. Use a registered guide, carry a light rain shell, protect electronics, and wear footwear with reliable grip. Refill reusable bottles where safe, avoid single-use trail waste, and tell the guide about health conditions before departure.', 'pending', NULL, 0, 'Knuckles Range Trekking Checklist and Safety Tips', 'Prepare for a guided Knuckles trek with practical advice on equipment, weather, fitness, and responsible hiking.', 1
    UNION ALL SELECT 'Why Community-Based Tourism Matters', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85', 'Madhavi Senanayake', 0, 'Responsible Tourism', 'Sri Lanka', '7 min read', 0, 'How locally owned experiences can improve visitor understanding and keep tourism value within communities.', 'Community-based tourism is most effective when residents shape the experience, set fair prices, and retain meaningful control. Travellers should look for transparent operators, small groups, respectful photography, and genuine cultural exchange. Good partnerships protect dignity while creating dependable local income.', 'draft', NULL, 0, 'Community-Based Tourism in Sri Lanka', 'Learn how responsible community-based tourism supports local ownership, cultural respect, and stronger visitor experiences.', 0
    UNION ALL SELECT 'East Coast Season: Planning Arugam Bay and Beyond', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=85', 'Ravindu Perera', 0, 'Beaches & Coast', 'Arugam Bay', '6 min read', 0, 'Prepare for the east-coast season with surf, lagoon, wildlife, and transport planning advice.', 'Arugam Bay is best approached as more than a surf stop. Lagoon safaris, nearby heritage, and local food businesses add depth to a longer stay. Book transport early during peak surf months, choose qualified instructors, and confirm seasonal operating dates before paying deposits.', 'scheduled', 5, 1, 'Arugam Bay and Sri Lanka East Coast Travel Guide', 'Plan an Arugam Bay trip with seasonal advice for surf lessons, lagoons, transport, local food, and nearby attractions.', 0
) AS seed
WHERE NOT EXISTS (
    SELECT 1 FROM `blog_posts` existing WHERE existing.`title` = seed.title
);

-- --------------------------------------------------------------------------
-- 12. BLOG POST TAG LINKS (15 rows)
-- --------------------------------------------------------------------------
INSERT INTO `blog_post_tag` (`blog_post_id`, `tag_id`, `created_at`, `updated_at`)
SELECT
    (SELECT MAX(p.`id`) FROM `blog_posts` p WHERE p.`title` = seed.post_title),
    (SELECT MAX(t.`id`) FROM `tags` t WHERE t.`name` = seed.tag_name),
    @seed_now,
    @seed_now
FROM (
    SELECT 'A Practical 10-Day Sri Lanka Itinerary for First-Time Visitors' post_title, 'Itinerary' tag_name
    UNION ALL SELECT 'A Practical 10-Day Sri Lanka Itinerary for First-Time Visitors', 'Sri Lanka'
    UNION ALL SELECT 'When to Visit Sri Lanka: A Region-by-Region Weather Guide', 'Travel Tips'
    UNION ALL SELECT 'Sigiriya Beyond the Summit: History, Villages, and Responsible Visits', 'Culture'
    UNION ALL SELECT 'How to Plan an Ethical Wildlife Safari in Sri Lanka', 'Wildlife'
    UNION ALL SELECT 'How to Plan an Ethical Wildlife Safari in Sri Lanka', 'Sustainable Travel'
    UNION ALL SELECT 'Ella on Foot: Three Scenic Walks for Different Fitness Levels', 'Hiking'
    UNION ALL SELECT 'A Food Lovers Guide to Galle and the Southern Coast', 'Food'
    UNION ALL SELECT 'Choosing the Right Vehicle for Your Sri Lanka Journey', 'Transport'
    UNION ALL SELECT 'Family Travel in Sri Lanka: Comfort, Safety, and Pace', 'Family Travel'
    UNION ALL SELECT 'Slow Travel in the Tea Country', 'Tea Country'
    UNION ALL SELECT 'Slow Travel in the Tea Country', 'Wellness'
    UNION ALL SELECT 'Knuckles Range Trekking Checklist', 'Hiking'
    UNION ALL SELECT 'Why Community-Based Tourism Matters', 'Sustainable Travel'
    UNION ALL SELECT 'East Coast Season: Planning Arugam Bay and Beyond', 'Beaches'
) AS seed
WHERE NOT EXISTS (
    SELECT 1
    FROM `blog_post_tag` existing
    JOIN `blog_posts` post_record ON post_record.`id` = existing.`blog_post_id`
    JOIN `tags` tag_record ON tag_record.`id` = existing.`tag_id`
    WHERE post_record.`title` = seed.post_title
      AND tag_record.`name` = seed.tag_name
);

COMMIT;

-- --------------------------------------------------------------------------
-- Verification summary (returns the total rows currently in each app table)
-- --------------------------------------------------------------------------
SELECT 'users' AS table_name, COUNT(*) AS total_rows FROM `users`
UNION ALL SELECT 'tours', COUNT(*) FROM `tours`
UNION ALL SELECT 'vehicles', COUNT(*) FROM `vehicles`
UNION ALL SELECT 'customers', COUNT(*) FROM `customers`
UNION ALL SELECT 'bookings', COUNT(*) FROM `bookings`
UNION ALL SELECT 'payments', COUNT(*) FROM `payments`
UNION ALL SELECT 'reviews', COUNT(*) FROM `reviews`
UNION ALL SELECT 'review_images', COUNT(*) FROM `review_images`
UNION ALL SELECT 'blog_post_categories', COUNT(*) FROM `blog_post_categories`
UNION ALL SELECT 'blog_posts', COUNT(*) FROM `blog_posts`
UNION ALL SELECT 'tags', COUNT(*) FROM `tags`
UNION ALL SELECT 'blog_post_tag', COUNT(*) FROM `blog_post_tag`;

-- Dashboard-focused verification for the default 30-day filter.
SELECT
    (SELECT COUNT(*) FROM `bookings` WHERE `created_at` >= DATE_SUB(@seed_today, INTERVAL 29 DAY)) AS bookings_last_30_days,
    (SELECT COALESCE(SUM(`amount`), 0) FROM `payments` WHERE `status` = 'completed' AND COALESCE(`payment_date`, `created_at`) >= DATE_SUB(@seed_today, INTERVAL 29 DAY)) AS completed_revenue_last_30_days,
    (SELECT COUNT(*) FROM `tours` WHERE `status` = 'active') AS active_tours,
    (SELECT COUNT(*) FROM `customers` WHERE `status` = 'active') AS active_customers,
    (SELECT COUNT(*) FROM `bookings` WHERE `status` = 'pending') AS pending_bookings,
    (SELECT COUNT(*) FROM `bookings` WHERE `pickup_date` BETWEEN @seed_today AND DATE_ADD(@seed_today, INTERVAL 7 DAY) AND `status` IN ('pending', 'confirmed')) AS departures_next_7_days,
    (SELECT COALESCE(SUM(`amount`), 0) FROM `payments` WHERE `status` = 'pending') AS pending_collection_amount,
    (SELECT COUNT(*) FROM `vehicles` WHERE `status` = 'active') AS active_vehicles;
