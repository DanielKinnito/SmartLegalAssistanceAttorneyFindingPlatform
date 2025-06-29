from .base import *
import os
import dj_database_url
import sys

# Security settings
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-fallback-key-for-render')

# Parse ALLOWED_HOSTS with special handling for the render.com domain
allowed_hosts_str = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1,smart-legal-assistance.onrender.com')

# Clean up the hosts - remove any URL scheme and paths
cleaned_hosts = []
for host in allowed_hosts_str.split(','):
    host = host.strip()
    # Remove any protocol and path if present
    if '://' in host:
        try:
            from urllib.parse import urlparse
            parsed = urlparse(host)
            host = parsed.netloc
        except Exception:
            pass
    if host and host not in cleaned_hosts:
        cleaned_hosts.append(host)

ALLOWED_HOSTS = cleaned_hosts

# Make sure required host is in ALLOWED_HOSTS
if 'smart-legal-assistance.onrender.com' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('smart-legal-assistance.onrender.com')

# Add www subdomain as well
if 'www.smart-legal-assistance.onrender.com' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('www.smart-legal-assistance.onrender.com')

print(f"Production ALLOWED_HOSTS: {ALLOWED_HOSTS}")

# Database configuration
try:
    # Get and fix the DATABASE_URL if needed
    database_url = os.environ.get('DATABASE_URL', '')
    
    # Fix malformed DATABASE_URL that includes "DATABASE_URL=" prefix
    if database_url.startswith('DATABASE_URL='):
        print("Removing 'DATABASE_URL=' prefix from connection string")
        database_url = database_url[len('DATABASE_URL='):]
        os.environ['DATABASE_URL'] = database_url
    
    # Fix DATABASE_URL with missing or improper scheme
    if database_url and not (database_url.startswith('postgresql://') or database_url.startswith('postgres://')):
        if '@' in database_url:
            # If it has scheme without slashes (postgresql: instead of postgresql://)
            if database_url.startswith('postgresql:') and not database_url.startswith('postgresql://'):
                print("DATABASE_URL has improper scheme format, fixing it")
                database_url = database_url.replace('postgresql:', 'postgresql://')
            elif database_url.startswith('postgres:') and not database_url.startswith('postgres://'):
                print("DATABASE_URL has improper scheme format, fixing it")
                database_url = database_url.replace('postgres:', 'postgres://')
            # If it's missing the scheme completely
            elif not database_url.startswith('postgresql:') and not database_url.startswith('postgres:'):
                print("DATABASE_URL is missing scheme, adding 'postgresql://'")
                database_url = 'postgresql://' + database_url
                
            os.environ['DATABASE_URL'] = database_url
    
    db_config = dj_database_url.config(
        default=database_url or None,
        conn_max_age=600,
        conn_health_checks=True,
    )
    
    if db_config:
        DATABASES = {
            'default': db_config
        }
    else:
        # Fallback to SQLite if no DATABASE_URL or empty config
        print("WARNING: No valid database configuration found. Falling back to SQLite.")
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
except Exception as e:
    print(f"DATABASE CONFIG ERROR: {e}", file=sys.stderr)
    print("Falling back to SQLite database", file=sys.stderr)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Static files configuration
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files configuration
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS settings
CORS_ALLOW_ALL_ORIGINS = False

# Parse CORS_ALLOWED_ORIGINS
cors_origins_str = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,https://smart-legal-assistance.onrender.com')

# Clean up the origins - make sure they have a scheme
cleaned_origins = []
for origin in cors_origins_str.split(','):
    origin = origin.strip()
    if not origin:
        continue
        
    # Skip origins with leading spaces in domain part (common error)
    if ' ' in origin and '://' in origin:
        parts = origin.split('://', 1)
        if ' ' in parts[1]:
            continue
    
    # Add scheme if missing for non-localhost origins
    if origin not in ['localhost', '127.0.0.1'] and '://' not in origin:
        origin = 'https://' + origin
        
    if origin and origin not in cleaned_origins:
        cleaned_origins.append(origin)

CORS_ALLOWED_ORIGINS = cleaned_origins

# Make sure required origin is in CORS_ALLOWED_ORIGINS
if 'https://smart-legal-assistance.onrender.com' not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append('https://smart-legal-assistance.onrender.com')

# Add www subdomain as well
if 'https://www.smart-legal-assistance.onrender.com' not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append('https://www.smart-legal-assistance.onrender.com')

print(f"Production CORS_ALLOWED_ORIGINS: {CORS_ALLOWED_ORIGINS}")

# Email settings
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.environ.get('EMAIL_HOST', '')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')

# Redis settings
REDIS_URL = os.environ.get('REDIS_URL', '')

# Celery settings
if REDIS_URL:
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = REDIS_URL
else:
    # Disable Celery if Redis is not available
    CELERY_TASK_ALWAYS_EAGER = True

# Swagger settings
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    'USE_SESSION_AUTH': False,
    'VALIDATOR_URL': None,
    'OPERATIONS_SORTER': 'alpha',
    'TAGS_SORTER': 'alpha',
    'DOC_EXPANSION': 'list',
    'DEFAULT_MODEL_RENDERING': 'model',
    'UI_DOC_EXPANSION': 'list',
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}

# Production security settings - disable if there are issues with TLS
SECURE_SSL_REDIRECT = not DEBUG
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
X_FRAME_OPTIONS = 'DENY' 