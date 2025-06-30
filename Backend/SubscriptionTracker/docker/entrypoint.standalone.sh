#!/bin/bash

set -e

if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
fi


# Start Redis with password from ENV
echo "Starting Redis with password..."
echo "requirepass $REDIS_PASSWORD" > /etc/redis/redis.conf
echo "appendonly yes" >> /etc/redis/redis.conf
redis-server /etc/redis/redis.conf &

# Copying MySQL CA file only if SSL is required
if [ "$DB_SSL_MODE" = "REQUIRED" ]; then
  echo "DB_SSL_MODE is REQUIRED. Setting up MySQL CA certificate..."
  echo "$DB_SSL_CA_BASE64" | base64 -d > /tmp/ca.pem
  echo /tmp/ca.pem
  export DB_SSL_CA=/tmp/ca.pem
else
  echo "DB_SSL_MODE is not REQUIRED. Skipping MySQL CA certificate setup."
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
php artisan optimize:clear
php artisan config:cache
php artisan optimize

# Start queue workers in background
php artisan queue:work --queue=high,mid,default,low --tries=3 --sleep=3 &
php artisan queue:work --queue=reminder --tries=3 --sleep=3 &

# Start scheduler in background
php artisan schedule:work &

# Start PHP-FPM
echo "Starting PHP-FPM in background..."
php-fpm -D
echo "Starting Nginx in foreground..."
nginx -g 'daemon off;'