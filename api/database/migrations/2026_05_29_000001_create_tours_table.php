<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('name', 191);
            $table->string('destination', 191);
            $table->decimal('price', 10, 2)->default(0);
            $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
            $table->string('category', 191);
            $table->string('photo_path')->nullable();
            $table->text('description')->nullable();
            $table->string('duration')->nullable();
            $table->unsignedInteger('max_participants')->default(1);
            $table->string('difficulty')->default('Medium');
            $table->json('inclusions')->nullable();
            $table->json('exclusions')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('featured')->default(false);
            $table->json('highlights')->nullable();
            $table->string('meeting_point')->nullable();
            $table->text('requirements')->nullable();
            $table->string('cancellation_policy')->default('standard');
            $table->timestamps();

            $table->index('status');
            $table->index('featured');
            $table->index('destination');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
