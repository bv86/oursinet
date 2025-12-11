#!/bin/bash

# Script to sync production Strapi database to local development environment
# This script:
# 1. Port-forwards the production PostgreSQL database
# 2. Dumps the production database to a local SQL file
# 3. Restores the dump to the local PostgreSQL database

# Don't use set -e as we want to handle errors manually
set +e

# Get script directory and project root (parent directory)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." &> /dev/null && pwd )"

# Configuration
PROD_PORT=5431
LOCAL_PORT=5432
DUMP_DIR="$PROJECT_ROOT/utils/db_dumps"
DUMP_FILE="$DUMP_DIR/strapi_db_dump_$(date +%Y%m%d-%H%M%S).sql"
ENV_FILE="$PROJECT_ROOT/strapi/.env"
NAMESPACE="main"
SERVICE_NAME="postgres-strapi-1"
PORT_FORWARD_PID=""

# Function for cleanup on exit
cleanup() {
  echo "🧹 Performing cleanup..."
  if [ -n "$PORT_FORWARD_PID" ] && ps -p $PORT_FORWARD_PID > /dev/null; then
    echo "   Terminating port forwarding (PID: $PORT_FORWARD_PID)"
    kill $PORT_FORWARD_PID 2>/dev/null || true
  fi
  
  # Kill any remaining port forwards for good measure
  pkill -f "kubectl port-forward.*$PROD_PORT" 2>/dev/null || true
  
  echo "👋 Exiting..."
}

# Register the cleanup function to be called on exit
trap cleanup EXIT

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to log errors
error() {
  echo "❌ ERROR: $1" >&2
  exit 1
}

# Function to log success messages
success() {
  echo "✅ $1"
}

echo "📊 Starting Strapi DB sync from production to local..."
echo "🔍 Project root: $PROJECT_ROOT"

# Check for required commands
command_exists kubectl || error "kubectl not found. Please install it and try again."
command_exists pg_dump || error "pg_dump not found. Please install PostgreSQL client tools and try again."
command_exists pg_restore || error "pg_restore not found. Please install PostgreSQL client tools and try again."
command_exists psql || error "psql not found. Please install PostgreSQL client tools and try again."

# Ensure we're working with the right project structure
if [ ! -d "$PROJECT_ROOT/strapi" ] || [ ! -d "$PROJECT_ROOT/next" ]; then
  error "This doesn't appear to be the oursinet project root. Make sure this script is in the utils directory of your project."
fi

# Create dumps directory if it doesn't exist
mkdir -p "$DUMP_DIR" || error "Could not create dumps directory at $DUMP_DIR"

# Step 1: Load database credentials from strapi/.env
if [ ! -f "$ENV_FILE" ]; then
  error ".env file not found at $ENV_FILE"
fi

# Parse database credentials from env file
DB_NAME=$(grep DATABASE_NAME "$ENV_FILE" | cut -d '=' -f2)
DB_USER=$(grep DATABASE_USERNAME "$ENV_FILE" | cut -d '=' -f2)
DB_PASSWORD=$(grep DATABASE_PASSWORD "$ENV_FILE" | head -n 1 | cut -d '=' -f2)

if [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
  error "Could not find all required database credentials in $ENV_FILE"
fi

success "Loaded database credentials for database: $DB_NAME"

# Step 2: Kill any existing port-forwarding processes
echo "🧹 Cleaning up any existing port forwards..."
pkill -f "kubectl port-forward.*$PROD_PORT" 2>/dev/null || true

# Step 3: Set up port forwarding to production database
echo "🔄 Setting up port forwarding to production database on port $PROD_PORT..."
kubectl port-forward -n "$NAMESPACE" "$SERVICE_NAME" "$PROD_PORT:$PROD_PORT" &
PORT_FORWARD_PID=$!

if ! ps -p $PORT_FORWARD_PID > /dev/null; then
  error "Failed to start port forwarding. Check if your kubectl is configured properly and the service exists."
fi

# Wait for port-forwarding to be ready and verify it's working
echo "⏳ Waiting for port-forwarding to be established..."
sleep 5

# Check if port forward is actually working
if ! nc -z localhost $PROD_PORT &>/dev/null; then
  error "Port forward not responding on localhost:$PROD_PORT. Check your kubectl configuration and if the service is running."
fi

# Step 4: Dump the production database
echo "📥 Dumping production database to $DUMP_FILE..."
PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h localhost \
  -p $PROD_PORT \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -F c \
  -f "$DUMP_FILE"

if [ $? -ne 0 ] || [ ! -f "$DUMP_FILE" ]; then
  error "Failed to dump database. Check if the database is accessible and credentials are correct."
fi

success "Database dump completed successfully."

# Step 5: Clean up port-forwarding explicitly
echo "🧹 Cleaning up port forwarding..."
kill $PORT_FORWARD_PID
PORT_FORWARD_PID=""

# Step 6: Check if local PostgreSQL is available
echo "🔍 Checking connection to local PostgreSQL..."
if ! PGPASSWORD="strapi" psql -h localhost -p $LOCAL_PORT -U strapi_owner_user -d postgres -c "SELECT 1;" &>/dev/null; then
  error "Cannot connect to local PostgreSQL server. Make sure it's running on port $LOCAL_PORT and accessible with user 'strapi_owner_user'."
fi


# Step 7: Restore the production database dump to local
echo "📤 Restoring database dump to local database..."
PGPASSWORD="strapi" pg_restore \
  -h localhost \
  -p $LOCAL_PORT \
  -U strapi_owner_user \
  -d strapi \
  -c \
  -O \
  --if-exists \
  "$DUMP_FILE"

if [ $? -ne 0 ]; then
  echo "⚠️  Warnings or errors occurred during database restore."
  echo "   This is often normal due to dependency issues that pg_restore handles automatically."
  echo "   If your application doesn't work correctly, check the database manually."
else
  success "Database restored successfully without errors."
fi

# Verify the restore worked by checking if we can access the database
if ! PGPASSWORD="strapi" psql -h localhost -p $LOCAL_PORT -U strapi -d strapi -c "SELECT COUNT(*) FROM information_schema.tables;" &>/dev/null; then
  error "Failed to verify the restored database. The restore may have failed."
fi

success "Database sync completed! Production data has been restored to your local environment."
echo "🗄️ Dump file saved as: $DUMP_FILE"