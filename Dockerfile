FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libsqlite3-dev \
    sqlite3 \
    zip \
    unzip \
    default-mysql-client \
    nodejs \
    npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (REMOVED pdo_sqlite)
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the entire api folder contents
COPY api/ /var/www/html/

# Install composer dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev --prefer-dist

# Generate APP_KEY (if needed)
RUN php artisan key:generate --force || echo "Key generation skipped"

# Skip the problematic migration (run migrations during setup)
RUN php artisan migrate --force --pretend || echo "Migrations will run during setup"

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo "DocumentRoot /var/www/html/public" >> /etc/apache2/apache2.conf

# Enable error logging
RUN echo "log_errors = On" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "display_errors = On" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "display_startup_errors = On" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "error_log = /var/log/apache2/error.log" >> /usr/local/etc/php/conf.d/errors.ini

# Create info.php for testing
RUN echo "<?php phpinfo(); ?>" > /var/www/html/public/info.php

EXPOSE 80

# Start Apache and tail logs
CMD ["sh", "-c", "apache2-foreground & tail -f /var/log/apache2/error.log"]
