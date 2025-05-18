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

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev curl python3-dev libffi-dev \
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
# Run environment setup check\n\
python setup_render.py\n\
\n\
# Print debugging info\n\
echo "DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"\n\
echo "ALLOWED_HOSTS: $ALLOWED_HOSTS"\n\
echo "DATABASE_URL: ${DATABASE_URL//\:*@/:***@}"\n\
\n\
# Check if we can connect to the database\n\
echo "Checking database connection..."\n\
DATABASE_OK=false\n\
if python -c "import sys; import django; django.setup(); from django.db import connection; connection.cursor(); sys.exit(0)" 2>/dev/null; then\n\
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
        echo "Trying migrations again with SQLite..."\n\
        python manage.py migrate --noinput || {\n\
            echo "⚠️ Migration still failed, but continuing deployment..."\n\
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