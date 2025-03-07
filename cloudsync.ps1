# CloudSync Service Manager
# This script provides a simple interface to manage CloudSync services

# Function to display usage information
function Show-Help {
    Write-Host "CloudSync Service Manager"
    Write-Host "Usage: .\cloudsync.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  start:dev     - Start all services in development mode with hot reload"
    Write-Host "  start:prod    - Start all services in production mode"
    Write-Host "  stop          - Stop all running services"
    Write-Host "  status        - Show status of all services"
    Write-Host "  logs [service]- Show logs for all or specific service"
    Write-Host "  db:migrate    - Run database migrations"
    Write-Host "  db:seed       - Seed the database with initial data"
    Write-Host "  db:reset      - Reset the database (WARNING: This will delete all data)"
    Write-Host "  db:studio     - Open Prisma Studio to view and edit database data"
    Write-Host "  help          - Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\cloudsync.ps1 start:dev"
    Write-Host "  .\cloudsync.ps1 logs api"
    Write-Host "  .\cloudsync.ps1 db:migrate"
}

# Function to start services in development mode
function Start-DevServices {
    Write-Host "Starting CloudSync services in development mode..."
    docker-compose -f docker-compose.dev.yml up -d
    Write-Host "Services started! Access points:"
    Write-Host "- API: http://localhost:3000"
    Write-Host "- Dashboard: http://localhost:3001"
    Write-Host "- RabbitMQ Management: http://localhost:15672 (Username: cloudsync, Password: rabbitmq_password)"
    Write-Host "- Prisma Studio: Run '.\cloudsync.ps1 db:studio' to access the database UI"
}

# Function to start services in production mode
function Start-ProdServices {
    Write-Host "Starting CloudSync services in production mode..."
    docker-compose -f docker-compose.prod.yml up -d
    Write-Host "Services started! Access points:"
    Write-Host "- API: http://localhost:3000"
    Write-Host "- Dashboard: http://localhost:3001"
    Write-Host "- RabbitMQ Management: http://localhost:15672 (Username: cloudsync, Password: rabbitmq_password)"
}

# Function to stop all services
function Stop-Services {
    Write-Host "Stopping all CloudSync services..."
    docker-compose -f docker-compose.dev.yml down 2>$null
    docker-compose -f docker-compose.prod.yml down 2>$null
    Write-Host "All services stopped."
}

# Function to show service status
function Show-Status {
    Write-Host "Development services status:"
    docker-compose -f docker-compose.dev.yml ps
    Write-Host ""
    Write-Host "Production services status:"
    docker-compose -f docker-compose.prod.yml ps
}

# Function to show logs
function Show-Logs {
    param (
        [string]$Service
    )
    
    if ([string]::IsNullOrEmpty($Service)) {
        Write-Host "Showing logs for all services..."
        docker-compose -f docker-compose.dev.yml logs -f
    } else {
        Write-Host "Showing logs for $Service service..."
        docker-compose -f docker-compose.dev.yml logs -f $Service
    }
}

# Function to run database migrations
function Run-Migrations {
    Write-Host "Running database migrations..."
    
    # Check if the database container is running
    $dbRunning = docker ps | Select-String -Pattern "cloudsync-postgres"
    if (-not $dbRunning) {
        Write-Host "Database container is not running. Starting it now..."
        docker-compose -f docker-compose.dev.yml up -d postgres
        # Wait for the database to be ready
        Start-Sleep -Seconds 5
    }
    
    cd api
    bunx prisma migrate dev
    cd ..
    Write-Host "Migrations completed successfully."
}

# Function to seed the database
function Seed-Database {
    Write-Host "Seeding the database with initial data..."
    
    # Check if the database container is running
    $dbRunning = docker ps | Select-String -Pattern "cloudsync-postgres"
    if (-not $dbRunning) {
        Write-Host "Database container is not running. Starting it now..."
        docker-compose -f docker-compose.dev.yml up -d postgres
        # Wait for the database to be ready
        Start-Sleep -Seconds 5
    }
    
    cd api
    bunx prisma db seed
    cd ..
    Write-Host "Database seeded successfully."
}

# Function to reset the database
function Reset-Database {
    Write-Host "WARNING: This will delete all data in the database."
    $confirmation = Read-Host "Are you sure you want to proceed? (y/n)"
    
    if ($confirmation -eq "y") {
        Write-Host "Resetting database..."
        cd api
        bunx prisma migrate reset --force
        cd ..
        Write-Host "Database reset completed successfully."
    } else {
        Write-Host "Database reset cancelled."
    }
}

# Function to open Prisma Studio
function Open-PrismaStudio {
    Write-Host "Opening Prisma Studio..."
    
    # Check if the database container is running
    $dbRunning = docker ps | Select-String -Pattern "cloudsync-postgres"
    if (-not $dbRunning) {
        Write-Host "Database container is not running. Starting it now..."
        docker-compose -f docker-compose.dev.yml up -d postgres
        # Wait for the database to be ready
        Start-Sleep -Seconds 5
    }
    
    cd api
    Start-Process powershell -ArgumentList "bunx prisma studio"
    cd ..
    Write-Host "Prisma Studio started at http://localhost:5555"
}

# Main command processing
$command = $args[0]
$serviceArg = $args[1]

switch ($command) {
    "start:dev" { Start-DevServices }
    "start:prod" { Start-ProdServices }
    "stop" { Stop-Services }
    "status" { Show-Status }
    "logs" { Show-Logs -Service $serviceArg }
    "db:migrate" { Run-Migrations }
    "db:seed" { Seed-Database }
    "db:reset" { Reset-Database }
    "db:studio" { Open-PrismaStudio }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $command"
        Show-Help
        exit 1
    }
}

exit 0
