# Deployment Troubleshooting Guide

This document contains solutions to common issues that may arise when deploying the Smart Legal Assistance Platform.

## Django Settings Configuration

### Issue: 'Settings' object has no attribute 'ROOT_URLCONF'

**Error message:**
```
val = getattr(_wrapped, name)
AttributeError: 'Settings' object has no attribute 'ROOT_URLCONF'
```

**Cause:**
This error occurs when Django cannot properly load the settings module. In our project structure, we use a settings package with multiple modules (base.py, production.py, etc.), but when the `__init__.py` file in the settings directory is empty, Django cannot locate the settings.

**Solution:**
Ensure that the `config/settings/__init__.py` file contains the following code:

```python
import os

# Default to production settings, can be overridden by setting DJANGO_SETTINGS_MODULE
# environment variable to 'config.settings.development' or another module
from .production import *
```

This fix has been applied to:
1. The codebase directly
2. The GitHub workflow (which checks and fixes this issue automatically)
3. The Dockerfile (which ensures the file is properly configured during the build)

## Environment Variable Issues

### Missing Required Environment Variables

Make sure you've set the following required environment variables in your deployment environment:

- `SECRET_KEY`: A secure secret key for Django
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts (e.g., `your-app.onrender.com,your-domain.com`)
- `DATABASE_URL`: The PostgreSQL database URL
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

### Setting Environment Variables on Render.com

1. Go to your Dashboard in Render
2. Select your web service
3. Go to the "Environment" tab
4. Add each environment variable in the key-value form
5. Click "Save Changes"

## Database Migration Issues

If you encounter database migration issues:

1. Connect to your Render instance or use the Shell feature
2. Run the migrations manually:
   ```bash
   python manage.py migrate
   ```

## Static Files Issues

If static files are not serving correctly:

1. Make sure `STATIC_ROOT` is set to `/app/staticfiles` in your settings
2. Ensure the `collectstatic` command is running during deployment
3. Check that the `STATIC_URL` is set to '/static/'

## Media Files Issues

If uploaded media files are not accessible:

1. Configure proper media storage (for production, consider using cloud storage like AWS S3)
2. Make sure `MEDIA_ROOT` and `MEDIA_URL` are properly configured
3. Ensure the media directory has proper permissions 