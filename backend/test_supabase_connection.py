#!/usr/bin/env python
import os
import sys
import socket
import time
import psycopg2
from urllib.parse import urlparse

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
    print(f"Testing PostgreSQL connection with DATABASE_URL...")
    
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
    print("=== Supabase Connection Test ===")
    
    # Get database URL from environment
    db_url = os.environ.get('DATABASE_URL', '')
    if not db_url:
        print("❌ No DATABASE_URL environment variable found")
        return False
    
    # Parse the URL
    try:
        parsed_url = urlparse(db_url)
        if parsed_url.scheme not in ('postgres', 'postgresql'):
            print(f"❌ Invalid database URL scheme: {parsed_url.scheme}")
            return False
        
        hostname = parsed_url.hostname
        port = parsed_url.port or 5432
        
        if not hostname:
            print("❌ No hostname found in DATABASE_URL")
            return False
        
        print(f"Database host: {hostname}")
        print(f"Database port: {port}")
        
        # Test DNS resolution
        if not test_dns_resolution(hostname):
            print("\n🔍 Troubleshooting DNS issues:")
            print("1. Check if the hostname is correct")
            print("2. Try pinging the hostname from your local machine")
            print("3. Check if Render.com can access your Supabase instance")
            print("4. Ensure your Supabase database is not in maintenance mode")
            return False
        
        # Test socket connection
        if not test_socket_connection(hostname, port):
            print("\n🔍 Troubleshooting connection issues:")
            print("1. Check if the database server is running")
            print("2. Check if the port is correct")
            print("3. Check if there's a firewall blocking the connection")
            print("4. Check if the database allows connections from Render.com's IP range")
            return False
        
        # Test PostgreSQL connection
        if not test_postgres_connection(db_url):
            print("\n🔍 Troubleshooting PostgreSQL issues:")
            print("1. Check if the username and password are correct")
            print("2. Check if the database name exists")
            print("3. Check if the user has appropriate permissions")
            return False
        
        print("\n✅ All connection tests passed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error parsing DATABASE_URL: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 