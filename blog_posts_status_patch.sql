ALTER TABLE `blog_posts`
  ADD COLUMN `status` ENUM('draft', 'published', 'scheduled') NOT NULL DEFAULT 'draft' AFTER `category_id`,
  ADD COLUMN `scheduled_date` DATETIME DEFAULT NULL AFTER `status`,
  ADD COLUMN `is_featured` TINYINT(1) NOT NULL DEFAULT 0 AFTER `scheduled_date`,
  ADD COLUMN `meta_title` VARCHAR(255) DEFAULT NULL AFTER `is_featured`,
  ADD COLUMN `meta_description` TEXT DEFAULT NULL AFTER `meta_title`,
  ADD KEY `blog_posts_status_index` (`status`),
  ADD KEY `blog_posts_scheduled_date_index` (`scheduled_date`);

UPDATE `blog_posts`
SET `status` = 'published'
WHERE `status` IS NULL OR `status` = '';
