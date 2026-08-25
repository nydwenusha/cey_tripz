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

# Create .env file
RUN if [ -f .env.example ]; then cp .env.example .env; else echo "APP_KEY=" > .env; fi && \
    echo "APP_ENV=" >> .env && \
    echo "APP_DEBUG=" >> .env && \
    echo "APP_URL=" >> .env && \
    echo "DB_CONNECTION=" >> .env

# Generate APP_KEY
RUN php artisan key:generate --force || true

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 777 /var/www/html/storage
RUN chmod -R 777 /var/www/html/bootstrap/cache

# Clear Laravel cache
RUN php artisan config:clear && \
    php artisan cache:clear && \
    php artisan view:clear

# Configure Apache to serve from public directory
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo "DocumentRoot /var/www/html/public" >> /etc/apache2/apache2.conf

EXPOSE 80
