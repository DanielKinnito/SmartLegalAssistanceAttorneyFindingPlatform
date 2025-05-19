#!/bin/bash

# Debug the DATABASE_URL environment variable
echo "Running DATABASE_URL debug script..."
python debug_database_url.py

# Set up the environment for Render
echo "Setting up Render deployment environment..."
python setup_render.py

# Test Supabase connection to ensure it's working
echo "Testing Supabase connection..."
python test_supabase_connection.py --transaction

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the server with Gunicorn
echo "Starting server on port 8000..."
gunicorn config.wsgi:application --bind 0.0.0.0:8000 