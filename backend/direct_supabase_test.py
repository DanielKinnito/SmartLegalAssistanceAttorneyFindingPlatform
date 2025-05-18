#!/usr/bin/env python
"""
Direct Supabase Connection Test
This script tests direct connections to Supabase using different 
connection parameters and methods to diagnose connectivity issues.
"""
import os
import sys
import socket
import time
import urllib.parse
from contextlib import closing

# Common connection parameters for Supabase
SUPABASE_HOST = "db.iubskuvezsqbqqjqnvla.supabase.co"
SUPABASE_PORT = 5432
SUPABASE_DB = "postgres"
SUPABASE_USER = "postgres"  # Default user
SUPABASE_PASSWORD = "password"  # Replace with actual password if needed

# Connection timeout in seconds
TIMEOUT = 10

def print_section(title):
    """Print a section header for better readability."""
    print("\n" + "=" * 60)
    print(f" {title} ".center(60, "="))
    print("=" * 60)

def get_db_url():
    """Get the database URL from environment or use default."""
    db_url = os.environ.get('DATABASE_URL', '')
    if not db_url:
        # Construct a default URL if none is provided
        db_url = f"postgresql://{SUPABASE_USER}:{SUPABASE_PASSWORD}@{SUPABASE_HOST}:{SUPABASE_PORT}/{SUPABASE_DB}"
    return db_url

def parse_db_url(db_url):
    """Parse the database URL into components."""
    print(f"Parsing database URL: {db_url.replace(urllib.parse.urlparse(db_url).password or '', '***')}")
    try:
        parsed = urllib.parse.urlparse(db_url)
        return {
            'scheme': parsed.scheme,
            'user': parsed.username,
            'password': '***' if parsed.password else None,
            'host': parsed.hostname,
            'port': parsed.port or 5432,
            'path': parsed.path.lstrip('/') or 'postgres',
        }
    except Exception as e:
        print(f"Error parsing URL: {e}")
        return None

def test_socket_direct():
    """Test direct socket connection to the database host."""
    print_section("TESTING DIRECT SOCKET CONNECTION")
    
    print(f"Connecting to {SUPABASE_HOST}:{SUPABASE_PORT}...")
    start_time = time.time()
    
    try:
        # Try IPv4 connection
        with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            sock.settimeout(TIMEOUT)
            result = sock.connect_ex((SUPABASE_HOST, SUPABASE_PORT))
        
        elapsed = time.time() - start_time
        
        if result == 0:
            print(f"✅ Direct socket connection succeeded ({elapsed:.2f}s)")
            return True
        else:
            print(f"❌ Direct socket connection failed with error {result} ({elapsed:.2f}s)")
            
            # Try IPv6 as fallback
            print("Attempting IPv6 connection...")
            try:
                with closing(socket.socket(socket.AF_INET6, socket.SOCK_STREAM)) as sock:
                    sock.settimeout(TIMEOUT)
                    result = sock.connect_ex((SUPABASE_HOST, SUPABASE_PORT, 0, 0))
                
                if result == 0:
                    print(f"✅ IPv6 socket connection succeeded")
                    return True
                else:
                    print(f"❌ IPv6 socket connection failed with error {result}")
            except Exception as e:
                print(f"❌ IPv6 connection error: {e}")
            
            return False
    except Exception as e:
        print(f"❌ Socket connection error: {e}")
        elapsed = time.time() - start_time
        print(f"Failed after {elapsed:.2f}s")
        return False

def test_dns_resolution():
    """Test DNS resolution for the database hostname."""
    print_section("TESTING DNS RESOLUTION")
    
    print(f"Resolving hostname {SUPABASE_HOST}...")
    start_time = time.time()
    
    try:
        ip_addresses = socket.getaddrinfo(SUPABASE_HOST, None)
        elapsed = time.time() - start_time
        
        if ip_addresses:
            print(f"✅ DNS resolution succeeded ({elapsed:.2f}s)")
            print("Resolved addresses:")
            for i, addr in enumerate(ip_addresses):
                family, _, _, _, sockaddr = addr
                print(f"  {i+1}. {sockaddr[0]} (Family: {'IPv4' if family == socket.AF_INET else 'IPv6'})")
            return True
        else:
            print(f"❌ No addresses returned for {SUPABASE_HOST}")
            return False
    except socket.gaierror as e:
        elapsed = time.time() - start_time
        print(f"❌ DNS resolution failed: {e} ({elapsed:.2f}s)")
        return False

def test_psycopg_connection():
    """Test connection using psycopg."""
    print_section("TESTING PSYCOPG CONNECTION")
    
    try:
        import psycopg2
        print("psycopg2 module is available")
    except ImportError:
        print("❌ psycopg2 module is not installed")
        return False
    
    db_url = get_db_url()
    conn_info = parse_db_url(db_url)
    
    if not conn_info:
        print("❌ Could not parse database URL")
        return False
    
    print(f"Connecting to {conn_info['host']}:{conn_info['port']} as user {conn_info['user']}...")
    start_time = time.time()
    
    try:
        conn = psycopg2.connect(
            host=conn_info['host'],
            port=conn_info['port'],
            dbname=conn_info['path'],
            user=conn_info['user'],
            password=conn_info['password'].replace('***', SUPABASE_PASSWORD),
            connect_timeout=TIMEOUT
        )
        
        elapsed = time.time() - start_time
        print(f"✅ psycopg2 connection succeeded ({elapsed:.2f}s)")
        
        # Try a simple query
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"PostgreSQL version: {version}")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ psycopg2 connection failed: {e} ({elapsed:.2f}s)")
        return False

def test_alternative_database_url():
    """Test connection using a standardized connection string format."""
    print_section("TESTING ALTERNATIVE CONNECTION STRING")
    
    try:
        import psycopg2
    except ImportError:
        print("❌ psycopg2 module is not installed")
        return False
    
    # Try alternative format with explicit sslmode
    alt_url = f"postgresql://{SUPABASE_USER}:{SUPABASE_PASSWORD}@{SUPABASE_HOST}:{SUPABASE_PORT}/{SUPABASE_DB}?sslmode=require"
    print(f"Trying alternative URL format: postgresql://{SUPABASE_USER}:***@{SUPABASE_HOST}:{SUPABASE_PORT}/{SUPABASE_DB}?sslmode=require")
    
    start_time = time.time()
    try:
        conn = psycopg2.connect(alt_url, connect_timeout=TIMEOUT)
        elapsed = time.time() - start_time
        print(f"✅ Alternative connection succeeded ({elapsed:.2f}s)")
        conn.close()
        return True
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ Alternative connection failed: {e} ({elapsed:.2f}s)")
        return False

def run_all_tests():
    """Run all connection tests."""
    print_section("SUPABASE CONNECTION DIAGNOSTICS")
    print(f"Target: {SUPABASE_HOST}:{SUPABASE_PORT}")
    print(f"Timeout: {TIMEOUT} seconds")
    
    results = {
        "DNS Resolution": test_dns_resolution(),
        "Direct Socket": test_socket_direct(),
        "Psycopg Connection": test_psycopg_connection(),
        "Alternative URL": test_alternative_database_url()
    }
    
    print_section("SUMMARY")
    for test, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test}: {status}")
    
    if any(results.values()):
        print("\n✅ At least one connection method succeeded!")
        return 0
    else:
        print("\n❌ All connection methods failed!")
        print("\nPossible issues:")
        print("1. Network connectivity to Supabase is blocked")
        print("2. Incorrect hostname or credentials")
        print("3. Database server is down or not accepting connections")
        print("4. Firewall is blocking the connection")
        return 1

if __name__ == "__main__":
    sys.exit(run_all_tests()) 