#!/usr/bin/env python
import os
import sys
import socket
import time
import psycopg2
import argparse
from urllib.parse import urlparse

# Supabase connection URLs
# Direct connection (IPv6 only)
SUPABASE_DIRECT = "postgresql://postgres:[YOUR-PASSWORD]@db.iubskuvezsqbqqjqnvla.supabase.co:5432/postgres"

# Transaction pooler (recommended for web apps, IPv4 compatible) - port 6543
TRANSACTION_POOLER = "postgresql://postgres.iubskuvezsqbqqjqnvla:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Session pooler (alternative IPv4 connection) - port 5432
SESSION_POOLER = "postgresql://postgres.iubskuvezsqbqqjqnvla:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

def print_section(title):
    """Print a section header for better readability."""
    print("\n" + "=" * 60)
    print(f" {title} ".center(60, "="))
    print("=" * 60)

def test_dns_resolution(hostname):
    """Test if the hostname can be resolved to an IP address."""
    print(f"Testing DNS resolution for {hostname}...")
    try:
        ip_address = socket.gethostbyname(hostname)
        print(f"✅ DNS resolution successful: {hostname} -> {ip_address}")
        return True
    except socket.gaierror as e:
        print(f"❌ DNS resolution failed: {e}")
        return False

def test_socket_connection(hostname, port, timeout=5):
    """Test if we can establish a TCP connection to the database server."""
    print(f"Testing TCP connection to {hostname}:{port}...")
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        start_time = time.time()
        result = sock.connect_ex((hostname, port))
        elapsed = time.time() - start_time
        sock.close()
        
        if result == 0:
            print(f"✅ TCP connection successful ({elapsed:.2f}s)")
            return True
        else:
            print(f"❌ TCP connection failed with error code {result} ({elapsed:.2f}s)")
            return False
    except Exception as e:
        print(f"❌ Socket error: {e}")
        return False

def test_postgres_connection(db_url):
    """Test if we can connect to PostgreSQL using the database URL."""
    print(f"Testing PostgreSQL connection...")
    
    # Parse the database URL but hide credentials in logs
    parsed_url = urlparse(db_url)
    safe_url = f"{parsed_url.scheme}://{parsed_url.hostname}:{parsed_url.port}/{parsed_url.path.lstrip('/')}"
    print(f"Connecting to: {safe_url}")
    
    try:
        start_time = time.time()
        conn = psycopg2.connect(db_url, connect_timeout=10)
        elapsed = time.time() - start_time
        
        print(f"✅ PostgreSQL connection successful ({elapsed:.2f}s)")
        
        # Get server version
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"PostgreSQL server version: {version}")
        
        # Test query execution
        try:
            cursor.execute("SELECT COUNT(*) FROM information_schema.tables;")
            table_count = cursor.fetchone()[0]
            print(f"Database contains {table_count} tables in information_schema")
        except Exception as e:
            print(f"⚠️ Could execute query but failed: {e}")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ PostgreSQL connection failed: {e}")
        return False

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Test Supabase database connections")
    parser.add_argument("--password", help="Supabase database password")
    parser.add_argument("--direct", action="store_true", help="Test direct connection only")
    parser.add_argument("--transaction", action="store_true", help="Test transaction pooler only")
    parser.add_argument("--session", action="store_true", help="Test session pooler only")
    args = parser.parse_args()
    
    print_section("SUPABASE CONNECTION TEST")
    
    # Get password from arguments or prompt
    password = args.password
    if not password:
        # Try to get from DATABASE_URL environment variable
        db_url = os.environ.get('DATABASE_URL', '')
        if db_url:
            print("Using credentials from DATABASE_URL environment variable")
            parsed = urlparse(db_url)
            password = parsed.password
        
        # If still no password, prompt the user
        if not password:
            password = input("Enter your Supabase database password: ")
    
    # Replace placeholders with the actual password
    direct_url = SUPABASE_DIRECT.replace('[YOUR-PASSWORD]', password)
    transaction_url = TRANSACTION_POOLER.replace('[YOUR-PASSWORD]', password)
    session_url = SESSION_POOLER.replace('[YOUR-PASSWORD]', password)
    
    results = {}
    
    # Test what was requested, or all connections if no specific test requested
    if not (args.direct or args.transaction or args.session):
        tests = [
            ("DIRECT CONNECTION (IPv6 only)", direct_url, "db.iubskuvezsqbqqjqnvla.supabase.co", 5432),
            ("TRANSACTION POOLER (IPv4 compatible, RECOMMENDED)", transaction_url, "aws-0-eu-central-1.pooler.supabase.com", 6543),
            ("SESSION POOLER (IPv4 alternative)", session_url, "aws-0-eu-central-1.pooler.supabase.com", 5432)
        ]
    else:
        tests = []
        if args.direct:
            tests.append(("DIRECT CONNECTION (IPv6 only)", direct_url, "db.iubskuvezsqbqqjqnvla.supabase.co", 5432))
        if args.transaction:
            tests.append(("TRANSACTION POOLER (IPv4 compatible, RECOMMENDED)", transaction_url, "aws-0-eu-central-1.pooler.supabase.com", 6543))
        if args.session:
            tests.append(("SESSION POOLER (IPv4 alternative)", session_url, "aws-0-eu-central-1.pooler.supabase.com", 5432))
    
    # Run the tests
    for name, url, host, port in tests:
        print_section(name)
        print(f"Testing connection to {host}:{port}")
        
        dns_ok = test_dns_resolution(host)
        
        if dns_ok:
            socket_ok = test_socket_connection(host, port)
            if socket_ok:
                db_ok = test_postgres_connection(url)
                results[name] = db_ok
            else:
                results[name] = False
        else:
            if "DIRECT" in name:
                print("⚠️ DNS resolution failed for direct connection. This is expected if your network doesn't support IPv6.")
            else:
                print("⚠️ DNS resolution failed. Check your network connection and DNS settings.")
            results[name] = False
    
    # Print summary
    print_section("RESULTS SUMMARY")
    
    for name, result in results.items():
        status = "✅ SUCCESS" if result else "❌ FAILED"
        print(f"{name}: {status}")
    
    # Provide recommendations based on results
    print_section("RECOMMENDATIONS")
    
    if results.get("TRANSACTION POOLER (IPv4 compatible, RECOMMENDED)", False):
        print("✅ Your Transaction Pooler connection is working correctly.")
        print("This is the RECOMMENDED connection for web applications.")
        print("Update your DATABASE_URL in environment variables to:")
        print(f"DATABASE_URL={TRANSACTION_POOLER.replace('[YOUR-PASSWORD]', '****')}")
        
        if not results.get("DIRECT CONNECTION (IPv6 only)", False):
            print("\nYour direct connection failed, but that's expected if your network")
            print("only supports IPv4 (common with many hosting providers like Render.com).")
        
        return 0
    elif results.get("SESSION POOLER (IPv4 alternative)", False):
        print("✅ Your Session Pooler connection is working correctly.")
        print("This is the ALTERNATIVE connection for IPv4 networks.")
        print("Update your DATABASE_URL in environment variables to:")
        print(f"DATABASE_URL={SESSION_POOLER.replace('[YOUR-PASSWORD]', '****')}")
        return 0
    elif results.get("DIRECT CONNECTION (IPv6 only)", False):
        print("✅ Your Direct Connection is working correctly.")
        print("This indicates your network supports IPv6.")
        print("Update your DATABASE_URL in environment variables to:")
        print(f"DATABASE_URL={SUPABASE_DIRECT.replace('[YOUR-PASSWORD]', '****')}")
        return 0
    else:
        print("❌ None of the connection methods succeeded.")
        print("This could be due to:")
        print("1. Incorrect database password")
        print("2. Network connectivity issues")
        print("3. Firewall blocking the connections")
        print("4. Database server being down or not accessible from your location")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 