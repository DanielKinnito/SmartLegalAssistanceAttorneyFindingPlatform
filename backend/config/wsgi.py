"""
WSGI config for Smart Legal Assistance project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
import sys
import socket
import time
from pathlib import Path
from django.core.wsgi import get_wsgi_application

def test_db_connection(db_config, max_retries=3, retry_delay=2):
    """Test database connection with retries."""
    from django.db import connections
    from django.db.utils import OperationalError
    
    print(f"Testing database connection (engine: {db_config['ENGINE']})...")
    
    for attempt in range(1, max_retries + 1):
        try:
            db_conn = connections['default']
            db_conn.ensure_connection()
            
            # If we got here, the connection is working
            print(f"✅ Database connection successful (attempt {attempt})")
            return True
        except OperationalError as e:
            print(f"⚠️ Database connection error (attempt {attempt}/{max_retries}): {e}")
            
            if attempt < max_retries:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
    
    # If we get here, all retries failed
    return False

try:
    # Try to load the settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    application = get_wsgi_application()
    
    # Import database settings
    from django.conf import settings
    
    # Test the database connection with retries
    if test_db_connection(settings.DATABASES['default']):
        print("Database connection confirmed working")
    else:
        # All connection attempts failed, switch to SQLite if not already using it
        if not settings.DATABASES['default']['ENGINE'].endswith('sqlite3'):
            print("⚠️ Switching to SQLite database")
            
            # Set the DATABASE_URL to use SQLite
            os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
            
            # Prepare the SQLite database file
            BASE_DIR = Path(__file__).resolve().parent.parent
            sqlite_path = BASE_DIR / 'db.sqlite3'
            
            if not sqlite_path.exists():
                print(f"Creating SQLite database at {sqlite_path}")
                sqlite_path.touch(exist_ok=True)
            
            # Reload the application with the new database settings
            print("Reloading application with SQLite...")
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
            application = get_wsgi_application()
except Exception as e:
    print(f"⚠️ Error loading WSGI application: {e}", file=sys.stderr)
    raise 