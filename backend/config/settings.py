"""
Main settings file for the project that imports from production settings
and adds explicit ALLOWED_HOSTS to fix render.com deployment issues.
"""
import os
import sys
import socket
from pathlib import Path
import dj_database_url
from urllib.parse import urlparse

# Import all settings from production except database settings
from config.settings.production import *

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Supabase connection URLs
# Direct connection (IPv6 only)
SUPABASE_DIRECT_TEMPLATE = "postgresql://postgres:[password]@db.iubskuvezsqbqqjqnvla.supabase.co:5432/postgres"

# Transaction pooler (recommended for web apps, IPv4 compatible)
SUPABASE_TRANSACTION_POOLER_TEMPLATE = "postgresql://postgres.iubskuvezsqbqqjqnvla:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Session pooler (alternative for IPv4 compatibility)
SUPABASE_SESSION_POOLER_TEMPLATE = "postgresql://postgres.iubskuvezsqbqqjqnvla:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Override the database settings for better fallback handling
print("Configuring database connection...")

def convert_to_pooler_url(db_url):
    """Convert a direct Supabase connection URL to a pooler URL if possible."""
    try:
        parsed = urlparse(db_url)
        
        # Check if this is a Supabase direct connection
        if parsed.hostname and 'iubskuvezsqbqqjqnvla.supabase.co' in parsed.hostname:
            print("Converting direct Supabase URL to IPv4-compatible transaction pooler URL...")
            
            # Extract password from original URL
            password = parsed.password
            
            if password:
                # Construct the transaction pooler URL with the same password
                pooler_url = SUPABASE_TRANSACTION_POOLER_TEMPLATE.format(password=password)
                return pooler_url
    except Exception as e:
        print(f"⚠️ Error converting to pooler URL: {e}")
    
    # Return original URL if conversion failed or not needed
    return db_url

def check_host_connectivity(hostname, port=5432, timeout=3):
    """Check if we can connect to the database host."""
    try:
        # Try to resolve the hostname first
        socket.getaddrinfo(hostname, port)
        
        # Try to establish a socket connection
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            sock.connect((hostname, port))
        return True
    except (socket.gaierror, socket.timeout, ConnectionRefusedError, OSError) as e:
        print(f"⚠️ Connection failed to {hostname}:{port} - {e}")
        return False

try:
    # Try to parse the DATABASE_URL
    db_url = os.environ.get('DATABASE_URL', '')
    
    use_postgres = False
    
    if db_url and 'postgres' in db_url:
        # Check if this is a direct Supabase connection that might need conversion
        if 'iubskuvezsqbqqjqnvla.supabase.co' in db_url and 'pooler.supabase.com' not in db_url:
            # Convert to pooler URL for IPv4 compatibility
            db_url = convert_to_pooler_url(db_url)
            print(f"Using IPv4-compatible transaction pooler connection")
        
        # Try to extract the host from the URL for connectivity testing
        try:
            parsed_url = urlparse(db_url)
            db_host = parsed_url.hostname
            db_port = parsed_url.port or 5432
            
            print(f"Testing connectivity to PostgreSQL at {db_host}:{db_port}...")
            host_reachable = check_host_connectivity(db_host, db_port)
            
            if host_reachable:
                print(f"✅ Host {db_host} is reachable")
                use_postgres = True
            else:
                print(f"⚠️ Host {db_host} is not reachable, will use SQLite")
        except Exception as e:
            print(f"⚠️ Error checking database host: {e}")
    
    if use_postgres:
        print(f"Configuring PostgreSQL connection...")
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
        # No valid DATABASE_URL or connectivity issues, use SQLite
        print("Using SQLite database for better reliability.")
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
        
        # Make sure the SQLite file directory exists
        sqlite_dir = os.path.dirname(os.path.join(BASE_DIR, 'db.sqlite3'))
        os.makedirs(sqlite_dir, exist_ok=True)
        
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

# Override CORS settings to ensure they have proper URL formatting
CORS_ALLOWED_ORIGINS = [
    'https://smart-legal-assistance.onrender.com',
    'https://www.smart-legal-assistance.onrender.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

# Get any additional CORS origins from environment and ensure they're properly formatted
if os.environ.get('CORS_ALLOWED_ORIGINS'):
    try:
        for origin in os.environ.get('CORS_ALLOWED_ORIGINS').split(','):
            origin = origin.strip()
            # Only add origins with proper formatting to avoid CORS errors
            if origin and '://' in origin and origin not in CORS_ALLOWED_ORIGINS:
                CORS_ALLOWED_ORIGINS.append(origin)
    except Exception as e:
        print(f"⚠️ Error parsing CORS_ALLOWED_ORIGINS: {e}", file=sys.stderr)

print(f"Loaded settings.py with ALLOWED_HOSTS: {ALLOWED_HOSTS}")
print(f"CORS_ALLOWED_ORIGINS: {CORS_ALLOWED_ORIGINS}") 