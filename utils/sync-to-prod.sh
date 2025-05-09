#!/bin/bash

# Script to sync local Strapi database to production environment
# This script:
# 1. Dumps the local PostgreSQL database to a SQL file
# 2. Port-forwards the production PostgreSQL database
# 3. Restores the dump to the production database

# Don't use set -e as we want to handle errors manually
set +e

# Get script directory and project root (parent directory)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." &> /dev/null && pwd )"

# Configuration
PROD_PORT=5431
LOCAL_PORT=5432
DUMP_DIR="$PROJECT_ROOT/utils/db_dumps"
DUMP_FILE="$DUMP_DIR/strapi_local_dump_$(date +%Y%m%d-%H%M%S).sql"
ENV_FILE="$PROJECT_ROOT/strapi/.env"
NAMESPACE="main"
SERVICE_NAME="acid-strapi-0"
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

# Function to ask for confirmation
confirm() {
  echo -e "\n⚠️  WARNING: You are about to overwrite the PRODUCTION database with your local data! ⚠️"
  echo "    This action cannot be undone and may result in data loss."
  read -p "Are you sure you want to continue? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Operation cancelled by user."
  fi
}

echo "📊 Starting Strapi DB sync from local to production..."
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

# Ask for confirmation before proceeding
confirm

# Create dumps directory if it doesn't exist
mkdir -p "$DUMP_DIR" || error "Could not create dumps directory at $DUMP_DIR"

# Step 1: Load database credentials from strapi/.env
if [ ! -f "$ENV_FILE" ]; then
  error ".env file not found at $ENV_FILE"
fi

# Parse database credentials from env file
DB_NAME=$(grep DATABASE_NAME "$ENV_FILE" | cut -d '=' -f2)
DB_USER=$(grep DATABASE_USERNAME "$ENV_FILE" | cut -d '=' -f2)
DB_PASSWORD=$(grep DATABASE_PASSWORD "$ENV_FILE" | cut -d '=' -f2)

if [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
  error "Could not find all required database credentials in $ENV_FILE"
fi

success "Loaded database credentials for database: $DB_NAME"

# Step 2: Check if local PostgreSQL is available
echo "🔍 Checking connection to local PostgreSQL..."
if ! PGPASSWORD="strapi" psql -h localhost -p $LOCAL_PORT -U strapi_owner_user -d postgres -c "SELECT 1;" &>/dev/null; then
  error "Cannot connect to local PostgreSQL server. Make sure it's running on port $LOCAL_PORT and accessible with user 'strapi_owner_user'."
fi

# Step 3: Dump the local database
echo "📥 Dumping local database to $DUMP_FILE..."
PGPASSWORD="strapi" pg_dump \
  -h localhost \
  -p $LOCAL_PORT \
  -U strapi_owner_user \
  -d strapi \
  -F c \
  -f "$DUMP_FILE"

if [ $? -ne 0 ] || [ ! -f "$DUMP_FILE" ]; then
  error "Failed to dump local database. Check if the database is accessible and credentials are correct."
fi

success "Local database dump completed successfully."

# Step 4: Kill any existing port-forwarding processes
echo "🧹 Cleaning up any existing port forwards..."
pkill -f "kubectl port-forward.*$PROD_PORT" 2>/dev/null || true

# Step 5: Set up port forwarding to production database
echo "🔄 Setting up port forwarding to production database on port $PROD_PORT..."
kubectl port-forward -n "$NAMESPACE" "$SERVICE_NAME" "$PROD_PORT:5432" &
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

# Step 6: Ask for final confirmation before restoring to production
echo -e "\n🚨 FINAL WARNING: You are about to overwrite the PRODUCTION database with your local data!"
read -p "Type 'RESTORE' to confirm this action: " -r
if [[ ! $REPLY == "RESTORE" ]]; then
  error "Operation cancelled by user. The correct confirmation text was not provided."
fi

# Step 7: Restore the local database dump to production
echo "📤 Restoring database dump to production database..."
PGPASSWORD="$DB_PASSWORD" pg_restore \
  -h localhost \
  -p $PROD_PORT \
  -U "$DB_USER" \
  -d "$DB_NAME" \
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
if ! PGPASSWORD="$DB_PASSWORD" psql -h localhost -p $PROD_PORT -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) FROM information_schema.tables;" &>/dev/null; then
  error "Failed to verify the restored database. The restore may have failed."
fi

success "Database sync completed! Local data has been restored to your production environment."
echo "🗄️ Dump file saved as: $DUMP_FILE"