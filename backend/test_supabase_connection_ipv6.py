#!/usr/bin/env python
import os
import sys
import socket
import time
import psycopg2
from urllib.parse import urlparse

def resolve_hostname(hostname):
    """Try to resolve hostname to both IPv4 and IPv6 addresses."""
    print(f"Resolving hostname {hostname}...")
    
    ipv4_addresses = []
    ipv6_addresses = []
    
    try:
        # Try to get all available address info
        addrinfo = socket.getaddrinfo(hostname, None)
        for addr in addrinfo:
            family, _, _, _, sockaddr = addr
            ip = sockaddr[0]
            if family == socket.AF_INET:
                ipv4_addresses.append(ip)
            elif family == socket.AF_INET6:
                ipv6_addresses.append(ip)
    except socket.gaierror as e:
        print(f"❌ Failed to resolve hostname: {e}")
        return None, None
    
    # Print results
    if ipv4_addresses:
        print(f"✅ Found IPv4 addresses: {', '.join(ipv4_addresses)}")
    else:
        print("⚠️ No IPv4 addresses found")
    
    if ipv6_addresses:
        print(f"✅ Found IPv6 addresses: {', '.join(ipv6_addresses)}")
    else:
        print("⚠️ No IPv6 addresses found")
    
    return ipv4_addresses, ipv6_addresses

def test_socket_connection(hostname, port, timeout=5):
    """Test TCP connection using both IPv4 and IPv6 if available."""
    print(f"Testing connection to {hostname}:{port}...")
    
    # Try to resolve hostname
    ipv4_addresses, ipv6_addresses = resolve_hostname(hostname)
    
    # Try IPv4 connection first if available
    if ipv4_addresses:
        for ip in ipv4_addresses:
            print(f"Trying IPv4 connection to {ip}:{port}...")
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(timeout)
                start_time = time.time()
                result = sock.connect_ex((ip, port))
                elapsed = time.time() - start_time
                sock.close()
                
                if result == 0:
                    print(f"✅ IPv4 connection successful ({elapsed:.2f}s)")
                    return True
                else:
                    print(f"❌ IPv4 connection failed with error code {result} ({elapsed:.2f}s)")
            except Exception as e:
                print(f"❌ IPv4 socket error: {e}")
    
    # Try IPv6 connection if available
    if ipv6_addresses:
        for ip in ipv6_addresses:
            print(f"Trying IPv6 connection to [{ip}]:{port}...")
            try:
                sock = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
                sock.settimeout(timeout)
                start_time = time.time()
                result = sock.connect_ex((ip, port, 0, 0))  # IPv6 address format
                elapsed = time.time() - start_time
                sock.close()
                
                if result == 0:
                    print(f"✅ IPv6 connection successful ({elapsed:.2f}s)")
                    return True
                else:
                    print(f"❌ IPv6 connection failed with error code {result} ({elapsed:.2f}s)")
            except Exception as e:
                print(f"❌ IPv6 socket error: {e}")
    
    print("❌ All connection attempts failed")
    return False

def test_postgres_connection(db_url):
    """Test if we can connect to PostgreSQL using the database URL."""
    print(f"Testing PostgreSQL connection with DATABASE_URL...")
    
    # Parse the database URL but hide credentials in logs
    parsed_url = urlparse(db_url)
    safe_url = f"{parsed_url.scheme}://{parsed_url.hostname}:{parsed_url.port}/{parsed_url.path.lstrip('/')}"
    print(f"Connecting to: {safe_url}")
    
    try:
        # Try PostgreSQL connection with a longer timeout
        start_time = time.time()
        conn = psycopg2.connect(db_url, connect_timeout=15)
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
    print("=== Supabase Connection Test (IPv4/IPv6) ===")
    
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
        
        # Test socket connection (handles both IPv4 and IPv6)
        if not test_socket_connection(hostname, port):
            print("\n🔍 Troubleshooting connection issues:")
            print("1. Check if the database server is running and accessible")
            print("2. Verify the hostname and port are correct")
            print("3. Check if there are firewalls blocking the connection")
            print("4. Verify that Render.com can access your Supabase instance")
            print("5. Check if your database allows external connections")
            return False
        
        # Test PostgreSQL connection
        if not test_postgres_connection(db_url):
            print("\n🔍 Troubleshooting PostgreSQL issues:")
            print("1. Verify username and password are correct")
            print("2. Check if the database user has network access permissions")
            print("3. Check if the database name exists")
            print("4. Verify SSL requirements (if applicable)")
            return False
        
        print("\n✅ All connection tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Error during connection test: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 