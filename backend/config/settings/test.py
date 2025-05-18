from .base import *

# Test-specific settings
DEBUG = True
SECRET_KEY = 'django-insecure-test-key-for-testing-only'

# Use SQLite for tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',  # In-memory database for faster tests
    }
}

# Override CORS settings with proper formatting
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://smart-legal-assistance.onrender.com'  # No trailing slash
]

# Test-specific settings - disable security measures
SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Email settings for testing
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable celery tasks during testing
CELERY_TASK_ALWAYS_EAGER = True

# Simple password hasher for testing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Allow all hosts in tests
ALLOWED_HOSTS = ['*'] 