from .base import *
import os

# Debug settings
DEBUG = True

# Development-specific settings
CORS_ALLOW_ALL_ORIGINS = True

# Email settings for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Use SQLite for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
} 