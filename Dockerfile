FROM php:8.2-apache

# Install dependencies (including SQLite3 dev libraries)
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

# Install PHP extensions (including SQLite)
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip pdo_sqlite

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

# Generate APP_KEY
RUN php artisan key:generate --force

# Create SQLite database file and ensure directory is writable
RUN mkdir -p /var/www/html/database && \
    touch /var/www/html/database/database.sqlite && \
    chmod -R 777 /var/www/html/database

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Run migrations to create all tables
RUN php artisan migrate --force || echo "Migrations failed, but continuing..."

# Clear caches (with error handling)
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
    echo "error_log = /var/log/php_errors.log" >> /usr/local/etc/php/conf.d/errors.ini

EXPOSE 80

# Run Apache with error logging
CMD ["sh", "-c", "apache2-foreground & tail -f /var/log/apache2/error.log /var/log/php_errors.log"]
