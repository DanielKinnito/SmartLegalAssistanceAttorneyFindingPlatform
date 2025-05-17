"""
Development settings for Supabase integration.
"""
from .development import *
import os
import dj_database_url
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration - using direct connection parameters instead of URL
DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.environ.get('DB_NAME', 'postgres'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}

# Create migrations_not_used directory if it doesn't exist
os.makedirs('smart_legal_assistance/migrations_not_used', exist_ok=True)
open('smart_legal_assistance/migrations_not_used/__init__.py', 'a').close()

# Disable all migrations
MIGRATION_MODULES = {app.split('.')[-1]: 'smart_legal_assistance.migrations_not_used' 
                    for app in INSTALLED_APPS if '.' in app}

# Also disable migrations for Django's built-in apps
for app in ['admin', 'auth', 'contenttypes', 'sessions', 'messages']:
    MIGRATION_MODULES[app] = 'smart_legal_assistance.migrations_not_used'

# Tell Django not to create tables that already exist
SILENCED_SYSTEM_CHECKS = ['models.E005']

# Set DEBUG to True for development
DEBUG = True 