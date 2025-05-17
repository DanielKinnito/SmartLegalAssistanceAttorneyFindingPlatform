from .base import *
import os
import dj_database_url

# Load environment variables if they're not already loaded
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Database configuration using environment variables
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

# Alternative: Using dj_database_url if DATABASE_URL is set
if os.environ.get('DATABASE_URL'):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=True,
        )
    }

# Disable all migrations - CRITICAL for using pre-created Supabase schema
MIGRATION_MODULES = {app.split('.')[-1]: 'smart_legal_assistance.migrations_not_used' 
                   for app in INSTALLED_APPS if '.' in app}

# Also disable migrations for Django's built-in apps
for app in ['admin', 'auth', 'contenttypes', 'sessions']:
    MIGRATION_MODULES[app] = 'smart_legal_assistance.migrations_not_used'

# File upload storage using Supabase (if configured)
if os.environ.get('SUPABASE_URL') and os.environ.get('SUPABASE_STORAGE_KEY'):
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    
    AWS_ACCESS_KEY_ID = os.environ.get('SUPABASE_STORAGE_KEY', '')
    AWS_SECRET_ACCESS_KEY = os.environ.get('SUPABASE_STORAGE_SECRET', '')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('SUPABASE_STORAGE_BUCKET', '')
    AWS_S3_ENDPOINT_URL = f"{os.environ.get('SUPABASE_URL')}/storage/v1"
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    AWS_DEFAULT_ACL = 'public-read'
    AWS_QUERYSTRING_AUTH = False 