#!/usr/bin/env python
import os
import sys
import urllib.parse
import socket
import time
import ipaddress
import sqlite3

# Supabase connection URLs
# Direct connection (IPv6 only)
SUPABASE_DIRECT_TEMPLATE = "postgresql://postgres:[password]@db.iubskuvezsqbqqjqnvla.supabase.co:5432/postgres"

# Transaction pooler (recommended for web apps, IPv4 compatible)
SUPABASE_TRANSACTION_POOLER_TEMPLATE = "postgresql://postgres.iubskuvezsqbqqjqnvla:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Session pooler (alternative for IPv4 compatibility)
SUPABASE_SESSION_POOLER_TEMPLATE = "postgresql://postgres.iubskuvezsqbqqjqnvla:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

def is_valid_ip(ip_str):
    """Check if a string is a valid IP address (IPv4 or IPv6)."""
    try:
        ipaddress.ip_address(ip_str)
        return True
    except ValueError:
        return False

def test_dns_resolution(hostname):
    """Test if hostname can be resolved through DNS."""
    print(f"Testing DNS resolution for {hostname}...")
    try:
        # Try to resolve the hostname to an IP address
        ip_addresses = socket.getaddrinfo(hostname, None)
        if ip_addresses:
            print(f"✅ Hostname resolution successful")
            return True
        return False
    except socket.gaierror as e:
        print(f"❌ Hostname resolution failed: {e}")
        return False

def test_database_connection(host, port, timeout=3):
    """Test if we can reach the database server."""
    print(f"Testing connection to {host}:{port}...")
    
    # First check if host is already an IP address
    is_ip = is_valid_ip(host)
    
    # If not an IP, try to resolve it
    if not is_ip and not test_dns_resolution(host):
        print(f"❌ Could not resolve hostname: {host}")
        print("Checking with alternative DNS servers...")
        # We failed to resolve using system DNS, but we'll still try to connect
        # in case there are issues with DNS resolution
    
    try:
        # Try IPv4 connection
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        
        if result == 0:
            print(f"✅ IPv4 connection successful")
            return True
        else:
            print(f"❌ IPv4 connection failed with error {result}")
            
            # Try IPv6 connection as fallback
            try:
                sock = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
                sock.settimeout(timeout)
                result = sock.connect_ex((host, port, 0, 0))
                sock.close()
                
                if result == 0:
                    print(f"✅ IPv6 connection successful")
                    return True
                else:
                    print(f"❌ IPv6 connection also failed with error {result}")
            except Exception as e:
                print(f"❌ IPv6 connection error: {e}")
            
            return False
    except Exception as e:
        print(f"❌ Connection test error: {e}")
        return False

def convert_to_pooler_url(db_url):
    """Convert a direct Supabase connection URL to a pooler URL for IPv4 compatibility."""
    try:
        parsed_url = urllib.parse.urlparse(db_url)
        
        # Check if this is a Supabase direct connection
        if parsed_url.hostname and 'iubskuvezsqbqqjqnvla.supabase.co' in parsed_url.hostname:
            print("Converting direct Supabase URL to IPv4-compatible Transaction pooler URL...")
            
            # Extract password from original URL
            password = parsed_url.password
            
            if password:
                # Construct the transaction pooler URL with the same password
                pooler_url = SUPABASE_TRANSACTION_POOLER_TEMPLATE.format(password=password)
                return pooler_url
    except Exception as e:
        print(f"Error converting to pooler URL: {e}")
    
    # Return original URL if conversion failed or not needed
    return db_url

def setup_render_environment():
    """
    Set up environment variables for Render deployment,
    including explicitly setting ALLOWED_HOSTS for the Render.com domain.
    """
    print("Setting up Render deployment environment...")
    
    # Define required hosts with proper formatting (no spaces, correct URL format)
    required_hosts = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        'smart-legal-assistance.onrender.com',
        'www.smart-legal-assistance.onrender.com'
    ]
    
    # Build allowed hosts string, ensuring no duplicate entries
    existing_hosts = os.environ.get('ALLOWED_HOSTS', '').split(',') if os.environ.get('ALLOWED_HOSTS') else []
    allowed_hosts = []
    
    # Clean existing hosts (remove spaces, empty entries)
    for host in existing_hosts:
        host = host.strip()
        # Remove any protocol and path from URLs
        if '://' in host:
            # Extract domain part from URL
            try:
                parsed = urllib.parse.urlparse(host)
                host = parsed.netloc
                print(f"Converted URL to domain: {host} (from {host})")
            except Exception:
                print(f"Skipping invalid host URL: {host}")
                continue
        
        if host and host not in allowed_hosts:
            allowed_hosts.append(host)
    
    # Add required hosts if not already present
    for host in required_hosts:
        if host not in allowed_hosts:
            allowed_hosts.append(host)
    
    # Set the ALLOWED_HOSTS environment variable
    os.environ['ALLOWED_HOSTS'] = ','.join(allowed_hosts)
    print(f"ALLOWED_HOSTS set to: {os.environ['ALLOWED_HOSTS']}")
    
    # Define required CORS origins with proper formatting
    required_cors = [
        'https://smart-legal-assistance.onrender.com',
        'https://www.smart-legal-assistance.onrender.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ]
    
    # Build CORS allowed origins string, ensuring no duplicate entries
    existing_cors = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',') if os.environ.get('CORS_ALLOWED_ORIGINS') else []
    cors_origins = []
    
    # Clean existing CORS origins (remove spaces, empty entries, ensure valid URLs)
    for origin in existing_cors:
        origin = origin.strip()
        if origin and origin not in cors_origins:
            # Only add origins with a valid scheme or localhost/127.0.0.1
            if '://' in origin or origin in ['localhost', '127.0.0.1']:
                cors_origins.append(origin)
            else:
                print(f"Skipping invalid CORS origin (missing scheme): {origin}")
    
    # Add required CORS origins if not already present
    for origin in required_cors:
        if origin not in cors_origins:
            cors_origins.append(origin)
    
    # Set the CORS_ALLOWED_ORIGINS environment variable
    os.environ['CORS_ALLOWED_ORIGINS'] = ','.join(cors_origins)
    print(f"CORS_ALLOWED_ORIGINS set to: {os.environ['CORS_ALLOWED_ORIGINS']}")
    
    # Check if we have a DATABASE_URL
    database_url = os.environ.get('DATABASE_URL', '')
    if not database_url:
        print("WARNING: No DATABASE_URL found, will use SQLite")
        os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
        
        # Ensure SQLite file is properly created
        try:
            if not os.path.exists('db.sqlite3'):
                print("Creating new SQLite database file...")
                conn = sqlite3.connect('db.sqlite3')
                conn.close()
                print("✅ SQLite database file created")
        except Exception as e:
            print(f"Error creating SQLite database: {e}")
    else:
        try:
            print(f"Original DATABASE_URL: {database_url.replace(database_url.split('@')[0] if '@' in database_url else database_url, '***')}")
            
            # Fix malformed DATABASE_URL that includes "DATABASE_URL=" prefix
            if database_url.startswith('DATABASE_URL='):
                print("Removing 'DATABASE_URL=' prefix from connection string")
                database_url = database_url[len('DATABASE_URL='):]
                os.environ['DATABASE_URL'] = database_url
            
            # Fix DATABASE_URL with missing scheme
            if not database_url.startswith('postgresql://') and not database_url.startswith('postgres://'):
                if '@' in database_url and ':' in database_url:
                    print("DATABASE_URL is missing scheme, adding 'postgresql://'")
                    database_url = 'postgresql://' + database_url
                    os.environ['DATABASE_URL'] = database_url
            
            # Make sure the DATABASE_URL specifically uses the Transaction pooler for Render
            if 'iubskuvezsqbqqjqnvla' in database_url and 'aws-0-eu-central-1.pooler.supabase.com:6543' not in database_url:
                print("Supabase URL detected but not using Transaction pooler, converting URL...")
                
                # Try to extract credentials from the existing URL
                try:
                    parsed = urllib.parse.urlparse(database_url)
                    username = parsed.username
                    password = parsed.password
                    
                    if username and password:
                        # Construct the correct pooler URL
                        if 'postgres.iubskuvezsqbqqjqnvla' not in username:
                            pooler_username = 'postgres.iubskuvezsqbqqjqnvla'
                        else:
                            pooler_username = username
                            
                        new_url = f"postgresql://{pooler_username}:{password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
                        print(f"Using correct Transaction pooler URL (credentials masked)")
                        database_url = new_url
                        os.environ['DATABASE_URL'] = database_url
                except Exception as e:
                    print(f"Error extracting credentials: {e}")
            
            # Validate if the database URL is properly formatted
            parsed_url = urllib.parse.urlparse(database_url)
            print(f"Parsed URL scheme: {parsed_url.scheme}, netloc: {parsed_url.netloc}")
            
            if parsed_url.scheme not in ('postgres', 'postgresql'):
                print(f"WARNING: Invalid database URL scheme: {parsed_url.scheme}")
                print("Falling back to SQLite")
                os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
            else:
                # Extract host and port
                db_host = parsed_url.hostname
                db_port = parsed_url.port or 5432
                
                if not db_host:
                    print("WARNING: No hostname found in DATABASE_URL")
                    print("Falling back to SQLite")
                    os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
                    return
                
                # Test connection to database server
                print(f"Testing connection to PostgreSQL at {db_host}:{db_port}...")
                connection_successful = test_database_connection(db_host, db_port)
                
                if not connection_successful:
                    print(f"WARNING: Could not connect to database at {db_host}:{db_port}")
                    print("Falling back to SQLite")
                    os.environ['DATABASE_URL'] = 'sqlite:///db.sqlite3'
                else:
                    print(f"Successfully connected to database at {db_host}:{db_port}")
                    
                    # Add a diagnostic log entry about the database host
                    try:
                        with open('db_connection_test.log', 'w') as f:
                            f.write(f"Database host: {db_host}\n")
                            f.write(f"Database port: {db_port}\n")
                            
                            # Try to get IP address for the hostname
                            try:
                                ip_addresses = socket.getaddrinfo(db_host, None)
                                for family, _, _, _, addr in ip_addresses:
                                    f.write(f"Resolved IP ({family}): {addr[0]}\n")
                            except Exception as e:
                                f.write(f"Failed to resolve hostname: {e}\n")
                    except Exception as e:
                        print(f"Error writing connection log: {e}")
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