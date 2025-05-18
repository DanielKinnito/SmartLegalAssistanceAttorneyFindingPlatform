"""
Main settings file for the project that imports from production settings
and adds explicit ALLOWED_HOSTS to fix render.com deployment issues.
"""
import os
import sys
from pathlib import Path
import dj_database_url

# Import all settings from production except database settings
from config.settings.production import *

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Override the database settings for better fallback handling
print("Configuring database connection...")

try:
    # Try to parse the DATABASE_URL
    db_url = os.environ.get('DATABASE_URL', '')
    if db_url and 'postgres' in db_url:
        print(f"Attempting to connect to PostgreSQL at {db_url.split('@')[1].split('/')[0] if '@' in db_url else 'unknown host'}")
        db_config = dj_database_url.config(
            default=db_url,
            conn_max_age=600,
            conn_health_checks=True,
        )
        
        # Set a short timeout for the initial connection attempt
        if 'OPTIONS' not in db_config:
            db_config['OPTIONS'] = {}
        db_config['OPTIONS']['connect_timeout'] = 5
        
        DATABASES = {
            'default': db_config
        }
    else:
        # No valid DATABASE_URL, use SQLite
        print("No valid PostgreSQL DATABASE_URL found. Using SQLite instead.")
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
except Exception as e:
    print(f"⚠️ Database configuration error: {e}", file=sys.stderr)
    print("⚠️ Falling back to SQLite database", file=sys.stderr)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# EXPLICITLY set allowed hosts to fix the deployment issue
ALLOWED_HOSTS = [
    'smart-legal-assistance.onrender.com',
    'www.smart-legal-assistance.onrender.com',
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
]

# Also update CORS settings to match
CORS_ALLOWED_ORIGINS = [
    'https://smart-legal-assistance.onrender.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

print(f"Loaded settings.py with ALLOWED_HOSTS: {ALLOWED_HOSTS}") 