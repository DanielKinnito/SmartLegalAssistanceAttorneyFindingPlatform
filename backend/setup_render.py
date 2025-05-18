#!/usr/bin/env python
import os
import sys
import urllib.parse

def setup_render_environment():
    """
    Set up environment variables for Render deployment,
    including handling database fallback to SQLite if 
    PostgreSQL is unavailable.
    """
    print("Checking deployment environment...")
    
    # Check if we have a DATABASE_URL
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("WARNING: No DATABASE_URL found, will use SQLite")
        os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
    else:
        try:
            # Validate if the database URL is properly formatted
            parsed_url = urllib.parse.urlparse(database_url)
            if parsed_url.scheme not in ('postgres', 'postgresql'):
                print(f"WARNING: Invalid database URL scheme: {parsed_url.scheme}")
                print("Falling back to SQLite")
                os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
        except Exception as e:
            print(f"ERROR parsing DATABASE_URL: {e}")
            print("Falling back to SQLite")
            os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
    
    # Ensure DEBUG is set correctly
    os.environ['DEBUG'] = os.environ.get('DEBUG', 'False')
    
    # Set ALLOWED_HOSTS if not present
    if not os.environ.get('ALLOWED_HOSTS'):
        os.environ['ALLOWED_HOSTS'] = 'localhost,127.0.0.1,smart-legal-assistance.onrender.com'
    
    # Set CORS settings
    if not os.environ.get('CORS_ALLOWED_ORIGINS'):
        os.environ['CORS_ALLOWED_ORIGINS'] = 'http://localhost:3000,https://smart-legal-assistance.onrender.com'
    
    print("Environment check completed.")

if __name__ == "__main__":
    setup_render_environment() 