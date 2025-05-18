# Use Python 3.12 slim image
FROM python

# Set work directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings
ENV PORT=8000
# Fix for IPv6 vs IPv4 issues
ENV DOCKER_BUILDKIT=1

# Install system dependencies including network tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev curl python3-dev libffi-dev \
    dnsutils iputils-ping net-tools iproute2 traceroute netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install cryptography explicitly first
RUN pip install --upgrade pip \
    && pip install cryptography

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Explicitly install coreapi for API schema documentation
RUN pip install coreapi coreschema

# Copy project files
COPY . .

# Ensure settings/__init__.py is properly configured
RUN echo 'import os' > /app/config/settings/__init__.py \
    && echo '# Default to production settings, can be overridden by DJANGO_SETTINGS_MODULE env var' >> /app/config/settings/__init__.py \
    && echo 'from .production import *' >> /app/config/settings/__init__.py

# Create media and static directories
RUN mkdir -p /app/media
RUN mkdir -p /app/staticfiles

# Expose port
EXPOSE 8000

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting deployment process..."\n\
\n\
# Run environment setup check\n\
python setup_render.py\n\
\n\
# Print debugging info\n\
echo "DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"\n\
echo "ALLOWED_HOSTS: $ALLOWED_HOSTS"\n\
echo "DATABASE_URL: ${DATABASE_URL//\:*@/:***@}"\n\
\n\
# Test DNS resolution and network connectivity\n\
if [[ $DATABASE_URL == postgresql* ]]; then\n\
  DB_HOST=$(echo $DATABASE_URL | sed -n "s/.*@\\([^:]*\\).*/\\1/p")\n\
  DB_PORT=$(echo $DATABASE_URL | sed -n "s/.*:\\([0-9]*\\)\\/.*/\\1/p")\n\
  echo "Testing DNS resolution for $DB_HOST..."\n\
  if host $DB_HOST > /dev/null 2>&1; then\n\
    echo "DNS resolution successful. IP addresses:"\n\
    host $DB_HOST\n\
  else\n\
    echo "⚠️ DNS resolution failed for $DB_HOST"\n\
    echo "Trying alternate lookups:"\n\
    nslookup $DB_HOST || echo "nslookup failed"\n\
    dig $DB_HOST || echo "dig failed"\n\
  fi\n\
\n\
  echo "Testing network connectivity to $DB_HOST:$DB_PORT..."\n\
  if nc -z -w5 $DB_HOST $DB_PORT; then\n\
    echo "✅ Network connectivity test successful"\n\
  else\n\
    echo "⚠️ Network connectivity test failed"\n\
    echo "Running traceroute (may not complete):"\n\
    traceroute -w 2 -m 15 $DB_HOST || echo "traceroute failed"\n\
  fi\n\
fi\n\
\n\
# Prepare SQLite database directory and file\n\
echo "Preparing SQLite database fallback..."\n\
mkdir -p $(dirname /app/db.sqlite3)\n\
touch /app/db.sqlite3\n\
chmod 666 /app/db.sqlite3\n\
\n\
# Check if we can connect to the database\n\
echo "Checking database connection..."\n\
DATABASE_OK=false\n\
\n\
# Try connection with increased timeout\n\
if PGCONNECT_TIMEOUT=15 python -c "import sys; import django; django.setup(); from django.db import connection; connection.cursor(); sys.exit(0)" 2>/dev/null; then\n\
    echo "Database connection successful."\n\
    DATABASE_OK=true\n\
else\n\
    echo "⚠️ Database connection failed. Will continue with SQLite."\n\
    export DATABASE_URL="sqlite:///db.sqlite3"\n\
    echo "Now using: sqlite:///db.sqlite3"\n\
fi\n\
\n\
# Run migrations with error handling\n\
echo "Running migrations..."\n\
if ! python manage.py migrate --noinput; then\n\
    echo "⚠️ Migration failed. Checking if we need to fall back to SQLite..."\n\
    if [ "$DATABASE_OK" = true ]; then\n\
        echo "Database was previously confirmed as working. This is a different issue."\n\
    else\n\
        echo "Falling back to SQLite database"\n\
        export DATABASE_URL="sqlite:///db.sqlite3"\n\
        echo "Trying migrations again with SQLite and run-syncdb..."\n\
        python manage.py migrate --noinput --run-syncdb || {\n\
            echo "⚠️ Migration still failed. Trying to initialize database..."\n\
            rm -f /app/db.sqlite3\n\
            echo "Created fresh SQLite database"\n\
            python manage.py migrate --noinput --run-syncdb || {\n\
                echo "⚠️ Database initialization failed, but continuing deployment..."\n\
            }\n\
        }\n\
    fi\n\
fi\n\
\n\
# Collect static files\n\
python manage.py collectstatic --noinput\n\
\n\
# Create a superuser if it does not exist\n\
{\n\
  echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='\''$ADMIN_EMAIL'\'').exists() or User.objects.create_superuser('\''$ADMIN_EMAIL'\'', '\''$ADMIN_PASSWORD'\'')" | python manage.py shell\n\
} || {\n\
  echo "Could not create superuser, but continuing..."\n\
}\n\
\n\
# Start Gunicorn with the PORT environment variable\n\
echo "Starting server on port $PORT..."\n\
echo "Using settings module: $DJANGO_SETTINGS_MODULE"\n\
gunicorn --bind 0.0.0.0:$PORT config.wsgi:application' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Start server
CMD ["/bin/bash", "/app/entrypoint.sh"] 