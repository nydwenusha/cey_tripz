CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `review_code` VARCHAR(191) DEFAULT NULL,
  `booking_id` BIGINT UNSIGNED DEFAULT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(191) DEFAULT NULL,
  `tour_name` VARCHAR(191) NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `comment` TEXT NOT NULL,
  `status` ENUM('pending', 'published', 'rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_review_code_unique` (`review_code`),
  KEY `reviews_booking_id_index` (`booking_id`),
  KEY `reviews_customer_email_index` (`customer_email`),
  KEY `reviews_tour_name_index` (`tour_name`),
  KEY `reviews_rating_index` (`rating`),
  KEY `reviews_status_index` (`status`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
