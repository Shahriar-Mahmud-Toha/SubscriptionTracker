#!/bin/bash

set -e

if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
fi

# Wait for MySQL to be ready
echo "Waiting for database connection..."
until php -r "new PDO(getenv('DB_CONNECTION') . ':host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));" 2>/dev/null; do
  echo "Database not ready. Retrying in 3 seconds..."
  sleep 3
done
echo "Database is ready."

# Check if migration table exists before migrating
echo "Checking if migrations table exists..."
MIGRATED=$(php -r "
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
\$kernel = \$app->make(Illuminate\Contracts\Console\Kernel::class);
\$kernel->bootstrap();
try {
    \$exists = \Illuminate\Support\Facades\Schema::hasTable('migrations');
    echo \$exists ? '1' : '0';
} catch (Exception \$e) {
    echo '0';
}
")

if [ "$MIGRATED" = "0" ]; then
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