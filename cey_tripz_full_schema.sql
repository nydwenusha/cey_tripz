-- Full schema export for cey_tripz
-- Generated from current migrations and SQL table definitions on 2026-05-09

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

CREATE DATABASE IF NOT EXISTS `cey_tripz` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `cey_tripz`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `review_images`;

DROP TABLE IF EXISTS `reviews`;

DROP TABLE IF EXISTS `payments`;

DROP TABLE IF EXISTS `customers`;

DROP TABLE IF EXISTS `vehicles`;

DROP TABLE IF EXISTS `blog_post_tag`;

DROP TABLE IF EXISTS `tags`;

DROP TABLE IF EXISTS `blog_posts`;

DROP TABLE IF EXISTS `blog_post_categories`;

DROP TABLE IF EXISTS `bookings`;

DROP TABLE IF EXISTS `sessions`;

DROP TABLE IF EXISTS `password_reset_tokens`;

DROP TABLE IF EXISTS `failed_jobs`;

DROP TABLE IF EXISTS `job_batches`;

DROP TABLE IF EXISTS `jobs`;

DROP TABLE IF EXISTS `cache_locks`;

DROP TABLE IF EXISTS `cache`;

DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `phone_number` VARCHAR(255) DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM(
        'admin',
        'tourist',
        'guide',
        'agent'
    ) NOT NULL DEFAULT 'admin',
    `status` ENUM(
        'active',
        'deactive',
        'banned'
    ) NOT NULL DEFAULT 'active',
    `remember_token` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` BIGINT UNSIGNED DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `payload` LONGTEXT NOT NULL,
    `last_activity` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `sessions_user_id_index` (`user_id`),
    KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `cache` (
    `key` VARCHAR(255) NOT NULL,
    `value` MEDIUMTEXT NOT NULL,
    `expiration` INT NOT NULL,
    PRIMARY KEY (`key`),
    KEY `cache_expiration_index` (`expiration`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
    `key` VARCHAR(255) NOT NULL,
    `owner` VARCHAR(255) NOT NULL,
    `expiration` INT NOT NULL,
    PRIMARY KEY (`key`),
    KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `queue` VARCHAR(255) NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `attempts` TINYINT UNSIGNED NOT NULL,
    `reserved_at` INT UNSIGNED DEFAULT NULL,
    `available_at` INT UNSIGNED NOT NULL,
    `created_at` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    KEY `jobs_queue_index` (`queue`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `total_jobs` INT NOT NULL,
    `pending_jobs` INT NOT NULL,
    `failed_jobs` INT NOT NULL,
    `failed_job_ids` LONGTEXT NOT NULL,
    `options` MEDIUMTEXT DEFAULT NULL,
    `cancelled_at` INT DEFAULT NULL,
    `created_at` INT NOT NULL,
    `finished_at` INT DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `bookings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `customer_phone` VARCHAR(255) DEFAULT NULL,
    `pickup_location` VARCHAR(255) NOT NULL,
    `drop_location` VARCHAR(255) NOT NULL,
    `pickup_date` DATE NOT NULL,
    `return_date` DATE NOT NULL,
    `vehicle_type` VARCHAR(255) NOT NULL,
    `passengers` INT NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `notes` TEXT DEFAULT NULL,
    `status` ENUM(
        'pending',
        'confirmed',
        'cancelled',
        'completed'
    ) NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `vehicles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `category` VARCHAR(100) NOT NULL,
    `daily_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `weekly_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `monthly_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `fuel_type` VARCHAR(50) NOT NULL,
    `transmission` VARCHAR(50) NOT NULL,
    `year` SMALLINT UNSIGNED DEFAULT NULL,
    `color` VARCHAR(100) DEFAULT NULL,
    `mileage` VARCHAR(50) DEFAULT NULL,
    `engine` VARCHAR(50) NOT NULL,
    `capacity` INT UNSIGNED NOT NULL DEFAULT 1,
    `tags` JSON DEFAULT NULL,
    `featured` TINYINT(1) NOT NULL DEFAULT 0,
    `images` JSON DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `vehicles_status_index` (`status`),
    KEY `vehicles_featured_index` (`featured`),
    KEY `vehicles_type_index` (`type`),
    KEY `vehicles_category_index` (`category`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `blog_post_categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `blog_post_categories_name_unique` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `blog_posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) DEFAULT NULL,
    `author` VARCHAR(255) NOT NULL,
    `author_avatar` VARCHAR(255) DEFAULT NULL,
    `date` DATE NOT NULL,
    `category` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) DEFAULT NULL,
    `read_time` VARCHAR(255) DEFAULT NULL,
    `likes` INT NOT NULL DEFAULT 0,
    `excerpt` VARCHAR(255) DEFAULT NULL,
    `content` LONGTEXT NOT NULL,
    `category_id` BIGINT UNSIGNED DEFAULT NULL,
    `status` ENUM(
        'pending',
        'draft',
        'published',
        'scheduled'
    ) NOT NULL DEFAULT 'draft',
    `scheduled_date` DATETIME DEFAULT NULL,
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `meta_title` VARCHAR(255) DEFAULT NULL,
    `meta_description` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `blog_posts_category_id_foreign` (`category_id`),
    KEY `blog_posts_status_index` (`status`),
    KEY `blog_posts_scheduled_date_index` (`scheduled_date`),
    CONSTRAINT `blog_posts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `blog_post_categories` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `tags` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `tags_name_unique` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `blog_post_tag` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `blog_post_id` BIGINT UNSIGNED NOT NULL,
    `tag_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `blog_post_tag_blog_post_id_foreign` (`blog_post_id`),
    KEY `blog_post_tag_tag_id_foreign` (`tag_id`),
    CONSTRAINT `blog_post_tag_blog_post_id_foreign` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `blog_post_tag_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `customers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `customer_phone` VARCHAR(20) DEFAULT NULL,
    `total_bookings` INT UNSIGNED NOT NULL DEFAULT 0,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `join_date` DATE NOT NULL,
    `last_activity` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `customers_customer_email_unique` (`customer_email`),
    KEY `customers_customer_phone_index` (`customer_phone`),
    KEY `customers_status_index` (`status`),
    KEY `customers_join_date_index` (`join_date`),
    KEY `customers_last_activity_index` (`last_activity`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `payments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `payment_code` VARCHAR(191) DEFAULT NULL,
    `booking_id` BIGINT UNSIGNED DEFAULT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
    `payment_method` ENUM(
        'Credit Card',
        'Debit Card',
        'PayPal',
        'Bank Transfer',
        'Cash'
    ) NOT NULL,
    `status` ENUM(
        'pending',
        'completed',
        'failed',
        'refunded'
    ) NOT NULL DEFAULT 'pending',
    `transaction_id` VARCHAR(191) DEFAULT NULL,
    `payment_date` DATETIME DEFAULT NULL,
    `due_date` DATE DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `payments_payment_code_unique` (`payment_code`),
    UNIQUE KEY `payments_transaction_id_unique` (`transaction_id`),
    KEY `payments_booking_id_index` (`booking_id`),
    KEY `payments_customer_email_index` (`customer_email`),
    KEY `payments_status_index` (`status`),
    KEY `payments_payment_method_index` (`payment_method`),
    KEY `payments_payment_date_index` (`payment_date`),
    KEY `payments_due_date_index` (`due_date`),
    CONSTRAINT `payments_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `review_code` VARCHAR(191) DEFAULT NULL,
    `booking_id` BIGINT UNSIGNED DEFAULT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(191) DEFAULT NULL,
    `tour_name` VARCHAR(191) NOT NULL,
    `rating` TINYINT UNSIGNED NOT NULL,
    `comment` TEXT NOT NULL,
    `status` ENUM(
        'pending',
        'published',
        'rejected'
    ) NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `reviews_review_code_unique` (`review_code`),
    KEY `reviews_booking_id_index` (`booking_id`),
    KEY `reviews_customer_email_index` (`customer_email`),
    KEY `reviews_tour_name_index` (`tour_name`),
    KEY `reviews_rating_index` (`rating`),
    KEY `reviews_status_index` (`status`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `review_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `review_id` BIGINT UNSIGNED NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `image_title` VARCHAR(255) DEFAULT NULL,
    `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
    `is_cover` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `review_images_review_id_sort_order_index` (`review_id`, `sort_order`),
    KEY `review_images_is_cover_index` (`is_cover`),
    CONSTRAINT `review_images_review_id_foreign` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

COMMIT;

-- Seed two active admin accounts for CeyTripz.
-- The owner is stored with role "admin" because the users.role enum does not include "owner".
-- Password hashes are bcrypt hashes compatible with Laravel.

INSERT INTO
    `users` (
        `name`,
        `email`,
        `email_verified_at`,
        `phone_number`,
        `password`,
        `role`,
        `status`,
        `remember_token`,
        `created_at`,
        `updated_at`
    )
VALUES (
        'CeyTripz Admin',
        'admin@ceytripz.com',
        NULL,
        '94710000001',
        '$2y$12$jlRWdVT/YpH8.RPHNtF6keDX1C2QjUKh4yxsku.5RulpFniQT57hO',
        'admin',
        'active',
        NULL,
        NOW(),
        NOW()
    ),
    (
        'T.G ISURU PRIYASHANTHA GAMAGE',
        'info@ceytripz.com',
        NULL,
        '+94710877100',
        '$2y$12$TYmuEnvre9myRPV73zk2DOa0V6UZX1yJCdqBROOdczdcFW2PgzOPm',
        'admin',
        'active',
        NULL,
        NOW(),
        NOW()
    )
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `phone_number` = VALUES(`phone_number`),
    `password` = VALUES(`password`),
    `role` = VALUES(`role`),
    `status` = VALUES(`status`),
    `remember_token` = VALUES(`remember_token`),
    `updated_at` = NOW();

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;