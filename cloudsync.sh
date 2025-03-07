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
  echo "  help          - Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./cloudsync.sh start:dev"
  echo "  ./cloudsync.sh logs api"
}

# Function to start services in development mode
function start_dev {
  echo "Starting CloudSync services in development mode..."
  docker-compose -f docker-compose.dev.yml up -d
  echo "Services started! Access points:"
  echo "- API: http://localhost:3000"
  echo "- Dashboard: http://localhost:3001"
  echo "- RabbitMQ Management: http://localhost:15672 (Username: cloudsync, Password: rabbitmq_password)"
}

# Function to start services in production mode
function start_prod {
  echo "Starting CloudSync services in production mode..."
  docker-compose -f docker-compose.prod.yml up -d
  echo "Services started! Access points:"
  echo "- API: http://localhost:3000"
  echo "- Dashboard: http://localhost:3001"
  echo "- RabbitMQ Management: http://localhost:15672 (Username: cloudsync, Password: rabbitmq_password)"
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
