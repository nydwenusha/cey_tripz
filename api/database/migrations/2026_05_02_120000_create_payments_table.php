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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_code', 191)->nullable()->unique();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_email', 191);
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('USD');
            $table->enum('payment_method', ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash']);
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('transaction_id', 191)->nullable()->unique();
            $table->timestamp('payment_date')->nullable();
            $table->date('due_date')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();

            $table->index('customer_email');
            $table->index('status');
            $table->index('payment_method');
            $table->index('payment_date');
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
