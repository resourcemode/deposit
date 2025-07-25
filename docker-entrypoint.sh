#!/bin/sh
set -e

# Force the DATABASE_HOST to be "postgres" in Docker environment
export DATABASE_HOST=postgres
export DATABASE_PORT=5432
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=postgres
export DATABASE_NAME=timedeposits

# Print the environment variables for debugging
echo "Using database connection: ${DATABASE_HOST}:${DATABASE_PORT}"

# Wait for the database to be ready
nc -z $DATABASE_HOST $DATABASE_PORT
while [ $? -ne 0 ]
do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
  nc -z $DATABASE_HOST $DATABASE_PORT
done
echo "PostgreSQL is up - executing command"

# Run the command passed to docker-entrypoint.sh
exec "$@"
