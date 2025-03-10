#!/bin/sh

set -e

# Start the NestJS application with hot reloading
echo " Starting API server with hot reloading..."
# Set environment variables for better file watching in Docker
export CHOKIDAR_USEPOLLING=true
export WATCHPACK_POLLING=true
export FORCE_COLOR=1

# Use exec to ensure signals are properly passed to the Node process
exec bun start:dev
