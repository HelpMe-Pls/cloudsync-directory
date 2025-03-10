#!/bin/sh

echo "🔄 Waiting for database to be ready..."
# Wait for PostgreSQL to be ready
while ! nc -z postgres 5432; do
  sleep 0.5
done
echo "✅ Database is ready!"

echo "🔄 Running database migrations..."
bunx prisma migrate dev --name init --preview-feature

echo "🔄 Seeding database..."
bunx prisma db seed

# Skip cleaning dist directory as it's now a volume
echo "🚀 Starting API in development mode..."
bun run start:dev
