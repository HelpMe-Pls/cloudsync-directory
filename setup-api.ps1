# Setup Script for CloudSync API

# Ensure we're in the correct directory
Set-Location -Path "C:\Users\ASUS\CascadeProjects\cloudsync-directory"

# Install NestJS CLI if not already installed
Write-Host "Installing NestJS CLI..." -ForegroundColor Green
npm install -g @nestjs/cli

# Create a new NestJS project in the api directory
Write-Host "Creating NestJS project in api directory..." -ForegroundColor Green
nest new api --package-manager npm --skip-git

# Navigate to the api directory
Set-Location -Path "api"

# Install necessary dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install --save @nestjs/config @nestjs/graphql @nestjs/typeorm graphql apollo-server-express @nestjs/swagger
npm install --save @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
npm install --save @prisma/client @nestjs/swagger class-validator class-transformer
npm install --save amqplib @nestjs/microservices redis
npm install --save bcrypt
npm install --save-dev prisma @types/passport-jwt @types/passport-local @types/bcrypt @types/amqplib

# Initialize Prisma
Write-Host "Initializing Prisma..." -ForegroundColor Green
npx prisma init

# Return to the main directory
Set-Location -Path ".."

Write-Host "API setup complete!" -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. Configure Prisma schema in api/prisma/schema.prisma"
Write-Host "2. Configure environment variables in api/.env"
Write-Host "3. Run 'docker-compose up -d' to start the infrastructure services"
Write-Host "4. Run 'cd api && npm run start:dev' to start the API in development mode"
