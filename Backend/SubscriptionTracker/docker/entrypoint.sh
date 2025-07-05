#!/bin/bash

set -e

if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
fi

# Wait until MySQL is accepting connections
echo "Waiting for MySQL to be ready at $DB_HOST:$DB_PORT..."
until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" --silent; do
  echo "MySQL is unavailable - sleeping"
  sleep 3
done
echo "MySQL is up - continuing"

# Check if migration table exists before migrating
echo "Checking if migrations table exists..."
if php artisan migrate:status | grep -q "Migration table not found"; then
  echo "Migrations not found. Running migrations..."
  until php artisan migrate --force; do
    echo "Migration failed, retrying in 3 seconds..."
    sleep 3
  done
  echo "Migrations completed."
else
  echo "Migrations already done. Skipping."
fi

# Cache and optimization
php artisan optimize:clear || echo "optimize:clear failed: $?"
php artisan config:cache || echo "config:cache failed: $?"
php artisan optimize || echo "optimize failed: $?"

# Start queue workers in background
php artisan queue:work --queue=high,mid,default,low --tries=3 --sleep=3 &
php artisan queue:work --queue=reminder --tries=3 --sleep=3 &

# Start scheduler in background
php artisan schedule:work &

# Start PHP-FPM
echo "Starting PHP-FPM..."
exec php-fpm
