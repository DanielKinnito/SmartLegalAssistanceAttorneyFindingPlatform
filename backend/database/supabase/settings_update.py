"""
This file contains updates to be applied to your Django settings file.
Copy these sections to the appropriate settings files in your project.
"""

# Add to your base.py or production.py settings file

# Database configuration for Supabase
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

# Alternative: Using dj_database_url (recommended for production)
import dj_database_url
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=True,
    )
}

# File storage configuration using Supabase Storage
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'  # For static files

# Add your AWS/Supabase Storage configurations
AWS_ACCESS_KEY_ID = os.environ.get('SUPABASE_STORAGE_KEY', '')
AWS_SECRET_ACCESS_KEY = os.environ.get('SUPABASE_STORAGE_SECRET', '')
AWS_STORAGE_BUCKET_NAME = os.environ.get('SUPABASE_STORAGE_BUCKET', '')
AWS_S3_ENDPOINT_URL = f"{os.environ.get('SUPABASE_URL')}/storage/v1"
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_DEFAULT_ACL = 'public-read'
AWS_QUERYSTRING_AUTH = False

# Optional: Add a custom storage class for Supabase
"""
from storages.backends.s3boto3 import S3Boto3Storage

class SupabaseStorage(S3Boto3Storage):
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = False
    custom_domain = f"{os.environ.get('SUPABASE_PROJECT_ID')}.supabase.co/storage/v1/object/public"
"""

# Stop Django from running migrations since we're using a pre-created schema
MIGRATION_MODULES = {app.split('.')[-1]: 'smart_legal_assistance.migrations_not_used' 
                   for app in INSTALLED_APPS if '.' in app} 