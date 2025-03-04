# CloudSync Directory Service - Single Command Launcher
# This script starts all components of the CloudSync system for easy demonstration

# Check if Docker is running
$dockerStatus = (docker info 2>&1)
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker does not appear to be running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Ensure we're in the correct directory
Set-Location -Path "D:\Junior\MVP\cloudsync-directory"

# Function to check if a port is in use
function Test-PortInUse {
    param (
        [int]$Port
    )
    
    $tcpConnection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return ($null -ne $tcpConnection)
}

# Check if required ports are available
$requiredPorts = @(3000, 3001, 5432, 6379, 5672, 15672)
$portsInUse = @()

foreach ($port in $requiredPorts) {
    if (Test-PortInUse -Port $port) {
        $portsInUse += $port
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host "Error: The following ports are already in use: $($portsInUse -join ', ')" -ForegroundColor Red
    Write-Host "Please free these ports before starting CloudSync." -ForegroundColor Red
    exit 1
}

# Start the infrastructure services with Docker Compose
Write-Host "Starting infrastructure services (PostgreSQL, Redis, RabbitMQ)..." -ForegroundColor Green
docker-compose up -d

# Check if the API directory exists and has been initialized
if (-not (Test-Path -Path "api/node_modules")) {
    Write-Host "API project not initialized. Please run setup-api.ps1 first." -ForegroundColor Yellow
    exit 1
}

# Check if the Dashboard directory exists and has been initialized
if (-not (Test-Path -Path "dashboard/node_modules")) {
    Write-Host "Dashboard project not initialized. Please run setup-dashboard.ps1 first." -ForegroundColor Yellow
    exit 1
}

# Start the API service in the background
Write-Host "Starting API service..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-Command", "Set-Location -Path D:\Junior\MVP\cloudsync-directory\api; npm run start:dev"

# Start the Dashboard in the background
Write-Host "Starting Dashboard..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-Command", "Set-Location -Path D:\Junior\MVP\cloudsync-directory\dashboard; npm start"

# All services are now running
Write-Host "CloudSync Directory Service is now running!" -ForegroundColor Green
Write-Host "Access points:" -ForegroundColor Green
Write-Host "- API: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- API Documentation: http://localhost:3000/api" -ForegroundColor Cyan
Write-Host "- Dashboard: http://localhost:3001" -ForegroundColor Cyan
Write-Host "- RabbitMQ Management: http://localhost:15672 (Username: cloudsync, Password: rabbitmq_password)" -ForegroundColor Cyan

Write-Host ""
Write-Host "Press Ctrl+C to shut down CloudSync." -ForegroundColor Yellow
Write-Host "To stop all services, run 'docker-compose down' after closing this window." -ForegroundColor Yellow

# Keep the script running
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
