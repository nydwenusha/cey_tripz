<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('review_code', 191)->nullable()->unique();
            $table->unsignedBigInteger('booking_id')->nullable();
            $table->string('customer_name');
            $table->string('customer_email', 191)->nullable();
            $table->string('tour_name', 191);
            $table->unsignedTinyInteger('rating');
            $table->text('comment');
            $table->enum('status', ['pending', 'published', 'rejected'])->default('pending');
            $table->timestamps();

            $table->index('booking_id');
            $table->index('customer_email');
            $table->index('tour_name');
            $table->index('rating');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

