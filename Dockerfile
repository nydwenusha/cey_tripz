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
    nodejs \
    npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip pdo_sqlite

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the entire api folder contents
COPY api/ /var/www/html/

# Create .env file
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Configure .env for SQLite with debug enabled
RUN echo "DB_CONNECTION=sqlite" >> .env && \
    echo "DB_DATABASE=/var/www/html/database/database.sqlite" >> .env && \
    echo "APP_DEBUG=true" >> .env && \
    echo "APP_ENV=local" >> .env && \
    echo "APP_URL=https://cey-tripz.onrender.com" >> .env && \
    echo "LOG_CHANNEL=errorlog" >> .env

# Install composer dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev --prefer-dist

# Generate APP_KEY
RUN php artisan key:generate --force

# Create SQLite database
RUN mkdir -p /var/www/html/database && \
    touch /var/www/html/database/database.sqlite && \
    chmod -R 777 /var/www/html/database

# Run migrations
RUN php artisan migrate --force || echo "Migrations failed"

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Clear and cache config
RUN php artisan config:clear || true
RUN php artisan cache:clear || true
RUN php artisan view:clear || true
RUN php artisan route:clear || true

# Configure Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo "DocumentRoot /var/www/html/public" >> /etc/apache2/apache2.conf

# Enable error logging - redirect to Apache error log
RUN echo "log_errors = On" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "display_errors = On" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "display_startup_errors = On" >> /usr/local/etc/php/conf.d/errors.ini && \
    echo "error_log = /var/log/apache2/error.log" >> /usr/local/etc/php/conf.d/errors.ini

# Create a debug file to test Laravel
RUN echo "<?php phpinfo(); ?>" > /var/www/html/public/info.php

EXPOSE 80

# Start Apache and tail logs
CMD ["sh", "-c", "apache2-foreground & tail -f /var/log/apache2/error.log"]
