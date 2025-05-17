from .base import *
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Use SQLite for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Debug settings
DEBUG = True

# Development-specific settings
CORS_ALLOW_ALL_ORIGINS = True 