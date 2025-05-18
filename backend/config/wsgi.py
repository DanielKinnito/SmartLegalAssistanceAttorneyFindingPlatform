"""
WSGI config for Smart Legal Assistance project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

try:
    # Try to load the settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    application = get_wsgi_application()
    
    # Test the database connection
    print("Testing database connection at application startup...")
    try:
        from django.db import connections
        from django.db.utils import OperationalError
        
        # Try to connect to the database
        db_conn = connections['default']
        db_conn.cursor()
        print("Database connection successful")
    except OperationalError as e:
        print(f"⚠️ Database connection error: {e}")
        print("⚠️ Switching to SQLite database")
        
        # Set the DATABASE_URL to use SQLite
        os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
        
        # Reload the application with the new database settings
        print("Reloading application with SQLite...")
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        application = get_wsgi_application()
except Exception as e:
    print(f"⚠️ Error loading WSGI application: {e}", file=sys.stderr)
    raise 