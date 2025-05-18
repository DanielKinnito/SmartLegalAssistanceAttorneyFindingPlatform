#!/usr/bin/env python
import os
import sys
import urllib.parse
import socket
import time

def test_database_connection(host, port, timeout=3):
    """Test if we can reach the database server."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception as e:
        print(f"Connection test error: {e}")
        return False

def setup_render_environment():
    """
    Set up environment variables for Render deployment,
    including explicitly setting ALLOWED_HOSTS for the Render.com domain.
    """
    print("Setting up Render deployment environment...")
    
    # Explicitly set the allowed hosts to include the render.com domain
    # This overrides any environment variable that might be set
    allowed_hosts = os.environ.get('ALLOWED_HOSTS', '')
    required_host = 'smart-legal-assistance.onrender.com'
    
    # Make sure our required host is in the ALLOWED_HOSTS
    if required_host not in allowed_hosts:
        if allowed_hosts:
            allowed_hosts = f"{allowed_hosts},{required_host}"
        else:
            allowed_hosts = required_host
    
    # Add some other common values
    for host in ['localhost', '127.0.0.1', '0.0.0.0', 'www.smart-legal-assistance.onrender.com']:
        if host not in allowed_hosts:
            allowed_hosts = f"{allowed_hosts},{host}"
    
    # Set the ALLOWED_HOSTS environment variable
    os.environ['ALLOWED_HOSTS'] = allowed_hosts
    print(f"ALLOWED_HOSTS set to: {allowed_hosts}")
    
    # Set up CORS settings
    cors_hosts = os.environ.get('CORS_ALLOWED_ORIGINS', '')
    required_cors = 'https://smart-legal-assistance.onrender.com'
    
    # Make sure our required CORS host is in the CORS_ALLOWED_ORIGINS
    if required_cors not in cors_hosts:
        if cors_hosts:
            cors_hosts = f"{cors_hosts},{required_cors}"
        else:
            cors_hosts = required_cors
    
    # Add localhost for development
    for cors in ['http://localhost:3000', 'http://127.0.0.1:3000']:
        if cors not in cors_hosts:
            cors_hosts = f"{cors_hosts},{cors}"
    
    os.environ['CORS_ALLOWED_ORIGINS'] = cors_hosts
    print(f"CORS_ALLOWED_ORIGINS set to: {cors_hosts}")
    
    # Check if we have a DATABASE_URL
    database_url = os.environ.get('DATABASE_URL', '')
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
            else:
                # Try to connect to the database server
                db_host = parsed_url.hostname
                db_port = parsed_url.port or 5432
                
                print(f"Testing connection to PostgreSQL at {db_host}:{db_port}...")
                if not test_database_connection(db_host, db_port):
                    print(f"WARNING: Could not connect to database at {db_host}:{db_port}")
                    print("Falling back to SQLite")
                    os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
                else:
                    print(f"Successfully connected to database at {db_host}:{db_port}")
        except Exception as e:
            print(f"ERROR parsing DATABASE_URL: {e}")
            print("Falling back to SQLite")
            os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
    
    # Set other environment variables with sensible defaults
    os.environ['DEBUG'] = os.environ.get('DEBUG', 'False')
    os.environ['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'django-insecure-fallback-key-for-render')
    
    # Set admin credentials if not present
    if not os.environ.get('ADMIN_EMAIL'):
        os.environ['ADMIN_EMAIL'] = 'admin@legalassistance.com'
    if not os.environ.get('ADMIN_PASSWORD'):
        os.environ['ADMIN_PASSWORD'] = 'admin@123'
    
    # Create .env file with the environment variables for development
    try:
        with open('.env', 'w') as f:
            f.write(f"ALLOWED_HOSTS={os.environ['ALLOWED_HOSTS']}\n")
            f.write(f"CORS_ALLOWED_ORIGINS={os.environ['CORS_ALLOWED_ORIGINS']}\n")
            f.write(f"DATABASE_URL={os.environ['DATABASE_URL']}\n")
            f.write(f"DEBUG={os.environ['DEBUG']}\n")
            f.write(f"SECRET_KEY={os.environ['SECRET_KEY']}\n")
            f.write(f"ADMIN_EMAIL={os.environ['ADMIN_EMAIL']}\n")
            f.write(f"ADMIN_PASSWORD={os.environ['ADMIN_PASSWORD']}\n")
        print("Created .env file with environment variables")
    except Exception as e:
        print(f"Could not create .env file: {e}")
    
    print("Environment setup completed.\n")
    print(f"Using DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE', 'config.settings')}")

if __name__ == "__main__":
    setup_render_environment() 