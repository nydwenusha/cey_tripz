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
        Schema::table('blog_post_tag', function (Blueprint $table) {
            Schema::rename('blo_post_tag', 'blog_post_tag');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_post_tag', function (Blueprint $table) {
            Schema::rename('blo_post_tag', 'blog_post_tag');
        });
    }
};
