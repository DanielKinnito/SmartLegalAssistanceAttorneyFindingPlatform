# Use Python 3.12 slim image
FROM python

# Set work directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings.production
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
python manage.py migrate --noinput\n\
python manage.py collectstatic --noinput\n\
# Create a superuser if it does not exist\n\
python -c "import os; \
from django.contrib.auth import get_user_model; \
User = get_user_model(); \
User.objects.filter(email=os.environ.get('\''ADMIN_EMAIL'\'', '\''admin@legalassistance.com'\'')).exists() or \
User.objects.create_superuser(os.environ.get('\''ADMIN_EMAIL'\'', '\''admin@legalassistance.com'\''), \
                                os.environ.get('\''ADMIN_PASSWORD'\'', '\''admin@123'\''))" || true\n\
gunicorn --bind 0.0.0.0:8000 config.wsgi:application' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Start server
CMD ["/bin/bash", "/app/entrypoint.sh"] 