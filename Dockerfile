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
    mysql-client \
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

# Create .env file and configure
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Configure .env with all required keys
RUN echo "DB_CONNECTION=sqlite" >> .env && \
    echo "DB_DATABASE=/var/www/html/database/database.sqlite" >> .env && \
    echo "APP_DEBUG=true" >> .env && \
    echo "APP_ENV=local" >> .env && \
    echo "APP_URL=https://cey-tripz.onrender.com" >> .env && \
    echo "LOG_CHANNEL=errorlog" >> .env && \
    echo "APP_KEY=otxC596AYZrnMLIOkpsmiSHdXK3PwU4f" >> .env

# Install composer dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev --prefer-dist

# Generate APP_KEY
RUN php artisan key:generate --force

# Generate JWT_SECRET (this fixes the JWT error)
RUN php artisan jwt:secret --force || echo "JWT secret generation failed"

# Create SQLite database
RUN mkdir -p /var/www/html/database && \
    touch /var/www/html/database/database.sqlite && \
    chmod -R 777 /var/www/html/database

# Import sample data
RUN echo "Importing sample dashboard data..." && \
    sqlite3 /var/www/html/database/database.sqlite < /var/www/html/database/cey_tripz_dashboard_demo_data.sql || \
    echo "Sample data import skipped or failed, continuing..."    

# Run migrations
RUN php artisan migrate --force || echo "Migrations failed, but continuing..."

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Clear all caches
RUN php artisan config:clear || true
RUN php artisan cache:clear || true
RUN php artisan view:clear || true
RUN php artisan route:clear || true

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

# Verify environment variables
RUN grep -E "APP_KEY|JWT_SECRET" .env || echo "Keys not found in .env"

EXPOSE 80

# Start Apache and tail logs
CMD ["sh", "-c", "apache2-foreground & tail -f /var/log/apache2/error.log"]
