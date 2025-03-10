#!/bin/bash

# CloudSync Service Manager
# This script provides a simple interface to manage CloudSync services

# Function to display usage information
function show_help {
  echo "CloudSync Service Manager"
  echo "Usage: ./cloudsync.sh [command]"
  echo ""
  echo "Commands:"
  echo "  start:dev     - Start all services in development mode with hot reload"
  echo "  start:prod    - Start all services in production mode"
  echo "  stop          - Stop all running services"
  echo "  status        - Show status of all services"
  echo "  logs [service]- Show logs for all or specific service"
  echo "  verify        - Verify all services are running correctly"
  echo "  verify:api    - Verify API service"
  echo "  verify:db     - Verify PostgreSQL database"
  echo "  verify:redis  - Verify Redis service"
  echo "  verify:rabbitmq - Verify RabbitMQ service"
  echo "  verify:dashboard - Verify Dashboard service"
  echo "  db:migrate    - Run database migrations"
  echo "  db:seed       - Seed the database with initial data"
  echo "  db:reset      - Reset the database (WARNING: This will delete all data)"
  echo "  help          - Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./cloudsync.sh start:dev"
  echo "  ./cloudsync.sh logs api"
  echo "  ./cloudsync.sh verify"
}

# Function to start services in development mode
function start_dev {
  echo "Starting CloudSync services in development mode..."
  
  # Build the API service with latest changes
  echo "Building API service with latest changes..."
  docker compose -f docker-compose.dev.yml build api
  
  # Start all services
  docker compose -f docker-compose.dev.yml up -d
  
  # Wait for services to be healthy
  echo "Waiting for services to initialize..."
  sleep 5
  
  # Verify API service is running
  echo "Verifying API service..."
  API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health || echo "000")
  
  # If API is not responding, check logs
  if [ "$API_STATUS" != "200" ]; then
    echo "❌ API service is not responding correctly. Status code: $API_STATUS"
    echo "Checking API logs for errors..."
    docker logs cloudsync-api
    
    # Attempt to fix common Prisma issues
    echo "Attempting to fix Prisma client issues..."
    docker exec cloudsync-api sh -c "cd /app && bunx prisma generate"
    
    # Wait a bit and check again
    sleep 5
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health || echo "000")
    
    if [ "$API_STATUS" == "200" ]; then
      echo "✅ API service is now running correctly!"
    else
      echo "❌ API service is still not responding correctly. You may need to check the logs for more details."
    fi
  else
    echo "✅ API service is running correctly!"
  fi
  
  # Display access information
  echo "Services started! Access points:"
  echo "- API: http://localhost:3000"
  echo "- Dashboard: http://localhost:3001"
  echo "- RabbitMQ Management: http://localhost:15672 (Username: cloudsync, Password: rabbitmq_password)"
}

# Function to start services in production mode
function start_prod {
  export MODE=production
  echo "Starting CloudSync services in production mode..."
  if docker-compose -f docker-compose.prod.yml up -d; then
    echo "Services started! Access points:"
    echo "- API: http://localhost:8000"
    echo "- Dashboard: http://localhost:8001"
    echo "- RabbitMQ Management: http://localhost:18672 (Username: cloudsync, Password: environment variable or default)"
  else
    echo "Failed to start services. Check docker-compose logs for details." >&2
    exit 1
  fi
}

# Function to stop all services
function stop_services {
  echo "Stopping all CloudSync services..."
  docker-compose -f docker-compose.dev.yml down 2>/dev/null
  docker-compose -f docker-compose.prod.yml down 2>/dev/null
  echo "All services stopped."
}

# Function to show service status
function show_status {
  echo "Development services status:"
  docker-compose -f docker-compose.dev.yml ps
  echo ""
  echo "Production services status:"
  docker-compose -f docker-compose.prod.yml ps
}

# Function to show logs
function show_logs {
  if [ -z "$1" ]; then
    echo "Showing logs for all services..."
    docker-compose -f docker-compose.dev.yml logs -f
  else
    echo "Showing logs for $1 service..."
    docker-compose -f docker-compose.dev.yml logs -f "$1"
  fi
}

# Function to verify API service
function verify_api {
  echo "Verifying API service..."
  
  # Check if container is running
  if docker ps | grep -q cloudsync-api; then
    # Check if API is responding
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
    
    if [ "$response" == "200" ]; then
      echo "✅ API service is running correctly"
      
      # Show API health info
      echo "API health information:"
      curl -s http://localhost:3000/health | grep -v "}"
    else
      echo "❌ API service is not responding correctly. Status code: $response"
      
      # Show API logs to help diagnose the issue
      echo "Recent API logs:"
      docker logs --tail 20 cloudsync-api
    fi
  else
    echo "❌ API container is not running"
  fi
}

# Function to verify PostgreSQL database
function verify_db {
  echo "Verifying PostgreSQL database..."
  
  # Check if container is running
  if docker ps | grep -q cloudsync-postgres; then
    # Check if PostgreSQL is accepting connections
    if docker exec cloudsync-postgres pg_isready -h localhost; then
      echo "✅ PostgreSQL database is running correctly"
      
      # Ensure database schema is properly set up
      echo "Ensuring database schema is properly set up..."
      
      # Run migrations to ensure tables are created
      echo "Running Prisma migrations..."
      docker exec cloudsync-api bunx prisma migrate deploy
      
      # Check if User table exists and has records
      echo "Database information:"
      docker exec cloudsync-postgres psql -U cloudsync -d cloudsync -c "SELECT count(*) as user_count FROM \"User\";"
    else
      echo "❌ PostgreSQL database is not responding correctly"
    fi
  else
    echo "❌ PostgreSQL container is not running"
  fi
}

# Function to verify Redis service
function verify_redis {
  echo "Verifying Redis service..."
  
  # Get the container name
  container=$(docker ps | grep redis | awk '{print $1}')
  
  if [ -z "$container" ]; then
    echo "❌ Redis container is not running"
    return
  fi
  
  # Check if Redis is responding
  result=$(docker exec $container redis-cli ping)
  
  if [ "$result" == "PONG" ]; then
    echo "✅ Redis service is running correctly"
    
    # Show Redis info
    echo "Redis information:"
    docker exec $container redis-cli info | grep connected_clients
  else
    echo "❌ Redis service is not responding correctly"
  fi
}

# Function to verify RabbitMQ service
function verify_rabbitmq {
  echo "Verifying RabbitMQ service..."
  
  # Check if container is running
  if docker ps | grep -q cloudsync-rabbitmq; then
    # Check if RabbitMQ is responding
    if docker exec cloudsync-rabbitmq rabbitmq-diagnostics -q ping; then
      echo "✅ RabbitMQ service is running correctly"
      
      # Ensure management plugin is enabled
      echo "Ensuring RabbitMQ management plugin is enabled..."
      docker exec cloudsync-rabbitmq rabbitmq-plugins enable rabbitmq_management
      
      # Show RabbitMQ info
      echo "RabbitMQ information:"
      docker exec cloudsync-rabbitmq rabbitmqctl status | grep -m1 "cluster_name"
    else
      echo "❌ RabbitMQ service is not responding correctly"
    fi
  else
    echo "❌ RabbitMQ container is not running"
  fi
}

# Function to verify Dashboard service
function verify_dashboard {
  echo "Verifying Dashboard service..."
  
  # First check if the container is running
  container=$(docker ps | grep cloudsync-dashboard | awk '{print $1}')
  
  if [ -z "$container" ]; then
    echo "❌ Dashboard container is not running"
    return
  fi
  
  echo "Dashboard container is running: $container"
  
  # Check container logs for binding information
  binding=$(docker logs $container 2>&1 | grep -o "Local:.*http://.*:[0-9]*" | tail -1)
  echo "Dashboard binding: $binding"
  
  # Try to connect with timeout to prevent hanging
  if [ "$MODE" == "production" ]; then
    port=8001
  else
    port=3001
  fi
  response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:${port})
  
  if [ "$response" == "200" ]; then
    echo "✅ Dashboard service is running correctly"
  else
    echo "❌ Dashboard service is not responding correctly. Status code: $response"
    echo "Possible reasons:"
    echo "  - The service might be binding only to localhost inside the container"
    echo "  - There might be a port mapping issue in docker-compose.yml"
    echo "  - The application might still be starting up"
    
    # Show additional diagnostic information
    echo "Container port mapping:"
    docker port $container
    
    echo "Try accessing the dashboard directly in your browser: http://localhost:${port}"
  fi
}

# Function to verify all services
function verify_all {
  echo "Verifying all CloudSync services..."
  verify_api
  echo "=================================="
  verify_dashboard
  echo "=================================="
  verify_db
  echo "=================================="
  verify_redis
  echo "=================================="
  verify_rabbitmq
  echo "=================================="
  echo "Verification complete!"
}

# Function to run database migrations
function run_migrations {
  echo "Running database migrations..."
  
  # Check if the database container is running
  if ! docker ps | grep -q postgres; then
    echo "Database container is not running. Starting it now..."
    docker-compose -f docker-compose.dev.yml up -d postgres
    # Wait for the database to be ready
    sleep 5
  fi
  
  cd api
  docker exec cloudsync-api bunx prisma db push --accept-data-loss
  docker exec cloudsync-api bunx prisma generate
  bunx prisma migrate dev
  cd ..
  echo "Migrations completed successfully."
}

# Function to seed the database
function seed_database {
  echo "Seeding the database with initial data..."
  
  # Check if the database container is running
  if ! docker ps | grep -q postgres; then
    echo "Database container is not running. Starting it now..."
    docker-compose -f docker-compose.dev.yml up -d postgres
    # Wait for the database to be ready
    sleep 5
  fi
  
  cd api
  bunx prisma db seed
  cd ..
  echo "Database seeded successfully."
}

# Function to reset the database
function reset_database {
  echo "WARNING: This will delete all data in the database."
  read -p "Are you sure you want to proceed? (y/n) " -n 1 -r
  echo
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Resetting database..."
    cd api
    bunx prisma migrate reset --force
    cd ..
    echo "Database reset completed successfully."
  else
    echo "Database reset cancelled."
  fi
}

# Main command processing
case "$1" in
  start:dev)
    start_dev
    ;;
  start:prod)
    start_prod
    ;;
  stop)
    stop_services
    ;;
  status)
    show_status
    ;;
  logs)
    show_logs "$2"
    ;;
  verify)
    verify_all
    ;;
  verify:api)
    verify_api
    ;;
  verify:db)
    verify_db
    ;;
  verify:redis)
    verify_redis
    ;;
  verify:rabbitmq)
    verify_rabbitmq
    ;;
  verify:dashboard)
    verify_dashboard
    ;;
  db:migrate)
    run_migrations
    ;;
  db:seed)
    seed_database
    ;;
  db:reset)
    reset_database
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo "Unknown command: $1"
    show_help
    exit 1
    ;;
esac

exit 0
