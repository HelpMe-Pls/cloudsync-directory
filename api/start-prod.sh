#!/bin/sh

echo "🔄 Waiting for database to be ready..."
# Wait for PostgreSQL to be ready
while ! nc -z postgres 5432; do
  sleep 0.5
done
echo "✅ Database is ready!"

echo "🔄 Running database migrations..."
bunx prisma migrate deploy

echo "🚀 Starting API in production mode..."
bun run start:prod
