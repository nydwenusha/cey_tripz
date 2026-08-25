FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the entire api folder contents
COPY api/ /var/www/html/

# Create .env file properly
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Configure .env for SQLite
RUN echo "DB_CONNECTION=sqlite" >> .env && \
    echo "DB_DATABASE=/var/www/html/database/database.sqlite" >> .env && \
    echo "APP_DEBUG=true" >> .env && \
    echo "APP_ENV=local" >> .env && \
    echo "APP_URL=https://cey-tripz.onrender.com" >> .env

# Install composer dependencies with error handling
RUN composer install --no-interaction --optimize-autoloader --no-dev --prefer-dist || \
    (echo "Composer install failed" && exit 1)

# Generate APP_KEY (this will override the placeholder)
RUN php artisan key:generate --force

# Create SQLite database file and ensure directory is writable
RUN mkdir -p /var/www/html/database && \
    touch /var/www/html/database/database.sqlite && \
    chmod -R 777 /var/www/html/database

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Test if the application loads correctly
RUN php artisan config:clear
RUN php artisan cache:clear
RUN php artisan view:clear
RUN php artisan route:clear

# Cache for production (optional - can remove if causing issues)
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true

# Configure Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo "DocumentRoot /var/www/html/public" >> /etc/apache2/apache2.conf

# Enable error logging
RUN echo "log_errors = On" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "display_errors = On" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "error_log = /var/log/php_errors.log" >> /usr/local/etc/php/conf.d/errors.ini

# Create a health check script (optional)
RUN echo "<?php phpinfo(); ?>" > /var/www/html/public/info.php

EXPOSE 80

# Add this to see Apache error logs
CMD ["sh", "-c", "apache2-foreground & tail -f /var/log/apache2/error.log"]
