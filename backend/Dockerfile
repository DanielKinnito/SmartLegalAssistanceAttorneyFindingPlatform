# Use Python 3.10 slim image
FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=auth_service.settings
# Fix for IPv6 vs IPv4 issues
ENV DOCKER_BUILDKIT=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev curl python3-dev libffi-dev rustc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install cryptography explicitly first
RUN pip install --upgrade pip \
    && pip install cryptography

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create media and static directories
RUN mkdir -p /app/media
RUN mkdir -p /app/staticfiles

# Expose port
EXPOSE 8000

# Create startup script
RUN echo '#!/bin/bash\n\
export DJANGO_SETTINGS_MODULE=auth_service.settings\n\
python manage.py migrate --noinput\n\
python manage.py collectstatic --noinput\n\
gunicorn --bind 0.0.0.0:8000 auth_service.wsgi:application' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Start server
CMD ["/app/entrypoint.sh"] 