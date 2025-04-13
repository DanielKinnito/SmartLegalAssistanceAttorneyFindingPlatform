from .base import *

# Debug settings
DEBUG = True

# Development-specific settings
CORS_ALLOW_ALL_ORIGINS = True

# Email settings for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' 