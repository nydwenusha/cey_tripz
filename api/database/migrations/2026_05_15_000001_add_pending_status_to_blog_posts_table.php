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
        if (Schema::hasTable('blog_posts') && Schema::hasColumn('blog_posts', 'status')) {
            DB::statement("ALTER TABLE `blog_posts` MODIFY `status` ENUM('pending', 'draft', 'published', 'scheduled') NOT NULL DEFAULT 'draft'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('blog_posts') && Schema::hasColumn('blog_posts', 'status')) {
            DB::table('blog_posts')
                ->where('status', 'pending')
                ->update(['status' => 'draft']);

            DB::statement("ALTER TABLE `blog_posts` MODIFY `status` ENUM('draft', 'published', 'scheduled') NOT NULL DEFAULT 'draft'");
        }
    }
};
