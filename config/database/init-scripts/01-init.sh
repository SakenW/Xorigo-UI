#!/bin/bash
# Xorigo UI Database Initialization Script
# Initializes PostgreSQL database with required schema

set -e

DB_NAME="${DB_NAME:-xorigo_ui}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "Initializing Xorigo UI database..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "PostgreSQL is ready!"

# Create database if it doesn't exist
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME || \
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

# Run schema initialization
echo "Creating database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f /docker-entrypoint-initdb.d/schema.sql

# Create indexes for better performance
echo "Creating database indexes..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f /docker-entrypoint-initdb.d/indexes.sql

# Seed initial data
echo "Seeding initial data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f /docker-entrypoint-initdb.d/seed.sql

echo "Database initialization complete!"
