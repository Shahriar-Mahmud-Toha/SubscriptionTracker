#!/bin/bash

set -e

# Replace .env with .env.docker always
# echo "Overwriting .env with .env.production..."
# rm -f .env
# cp .env.production .env

if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
fi

# Wait for database and Redis
echo "Waiting for database connection..."
echo "Running migrations..."
until php artisan migrate --force; do
  echo "Migration failed, retrying in 3 seconds..."
  sleep 3
done
echo "Migrations complete."

echo "Database is ready."

# Run migrations
php artisan migrate --force

# Cache and optimization
php artisan optimize:clear
php artisan config:cache
php artisan optimize

# Start queue workers in background
php artisan queue:work --queue=high,mid,default,low --tries=3 --sleep=3 &
php artisan queue:work --queue=reminder --tries=3 --sleep=3 &

# Start scheduler in background
php artisan schedule:work &

# Start PHP-FPM
echo "Starting PHP-FPM..."
exec php-fpm
