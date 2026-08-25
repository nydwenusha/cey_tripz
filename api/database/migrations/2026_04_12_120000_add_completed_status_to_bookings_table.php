<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE bookings
            MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'completed')
            DEFAULT 'pending'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('bookings')
            ->where('status', 'completed')
            ->update(['status' => 'confirmed']);

        DB::statement("
            ALTER TABLE bookings
            MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled')
            DEFAULT 'pending'
        ");
    }
};
