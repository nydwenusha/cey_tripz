FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the entire api folder contents
COPY api/ /var/www/html/

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Create .env file from example
RUN cp .env.example .env || echo "APP_KEY=base64:placeholder" > .env

# Override database connection to sqlite (so Laravel doesn't try to connect to MySQL)
RUN echo "DB_CONNECTION=sqlite" >> .env && \
    echo "DB_DATABASE=/var/www/html/database/database.sqlite" >> .env

# Generate APP_KEY
RUN php artisan key:generate --force

# Create SQLite database file
RUN touch /var/www/html/database/database.sqlite

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 777 /var/www/html/storage
RUN chmod -R 777 /var/www/html/bootstrap/cache
RUN chmod -R 777 /var/www/html/database

# Clear Laravel cache (skip database errors)
RUN php artisan config:clear || true && \
    php artisan cache:clear || true && \
    php artisan view:clear || true

# Configure Apache to serve from public directory
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo "DocumentRoot /var/www/html/public" >> /etc/apache2/apache2.conf

EXPOSE 80
