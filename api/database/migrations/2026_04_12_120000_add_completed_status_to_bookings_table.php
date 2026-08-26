<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite doesn't support MODIFY COLUMN or ENUM
        // Check if we're using SQLite
        if (DB::connection()->getDriverName() === 'sqlite') {
            // For SQLite, just ensure the column exists with proper type
            if (Schema::hasTable('bookings') && !Schema::hasColumn('bookings', 'status')) {
                Schema::table('bookings', function ($table) {
                    $table->string('status')->default('pending');
                });
            }
        } else {
            // For MySQL/PostgreSQL, use the original syntax
            DB::statement("
                ALTER TABLE bookings
                MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'completed')
                DEFAULT 'pending'
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Skip rollback for SQLite
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

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
