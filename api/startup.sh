#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database to be ready..."
/bin/nc -z postgres 5432
while [ $? -ne 0 ]; do
  echo "Database is not ready yet, retrying in 2 seconds..."
  sleep 2
  /bin/nc -z postgres 5432
done
echo "Database is ready!"

# Apply database migrations
echo "Applying database migrations..."
bunx prisma migrate deploy

# Seed the database if needed
if [ "$SEED_DATABASE" = "true" ]; then
  echo "Seeding database..."
  bunx prisma db seed
fi

# Start the application
echo "Starting the application..."
if [ "$NODE_ENV" = "development" ]; then
  bun run start:dev
else
  bun run start:prod
fi
