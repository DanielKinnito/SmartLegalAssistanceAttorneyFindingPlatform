#!/usr/bin/env python
import os
import sys
import socket
import time
import psycopg2
import argparse
import subprocess
import re
from urllib.parse import urlparse, urlunparse

# Default connection parameters for Supabase
DEFAULT_HOST = "db.iubskuvezsqbqqjqnvla.supabase.co"
DEFAULT_PORT = 5432
DEFAULT_DB = "postgres"
DEFAULT_USER = "postgres"
DEFAULT_PASSWORD = "password"  # Replace with actual password when testing

def print_section(title):
    """Print a section header for better readability."""
    print("\n" + "=" * 60)
    print(f" {title} ".center(60, "="))
    print("=" * 60)

def try_command(command):
    """Try to run a shell command and return the output."""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        return result.stdout
    except Exception as e:
        return f"Error executing command: {e}"

def manual_dns_lookup(hostname):
    """Try to look up a hostname using various methods."""
    print_section("MANUAL DNS LOOKUP")
    print(f"Attempting to resolve {hostname} using alternative methods...")
    
    # Try 'nslookup' command
    print("\n1. Using nslookup command:")
    nslookup_result = try_command(f"nslookup {hostname}")
    print(nslookup_result or "No output")
    
    # Extract IP addresses from nslookup result
    ipv4_pattern = r"Address:\s+(\d+\.\d+\.\d+\.\d+)"
    ipv6_pattern = r"Address:\s+([0-9a-fA-F:]+)"
    
    ipv4_addresses = re.findall(ipv4_pattern, nslookup_result or "")
    ipv6_addresses = []
    
    # Find IPv6 addresses but exclude the ones that look like IPv4
    for ip in re.findall(ipv6_pattern, nslookup_result or ""):
        if ":" in ip and not any(ip in ipv4 for ipv4 in ipv4_addresses):
            ipv6_addresses.append(ip)
    
    if ipv4_addresses:
        print(f"\nFound IPv4 addresses: {', '.join(ipv4_addresses)}")
    if ipv6_addresses:
        print(f"Found IPv6 addresses: {', '.join(ipv6_addresses)}")
    
    # Try 'ping' command (just for DNS resolution)
    print("\n2. Using ping command (just for name resolution):")
    ping_result = try_command(f"ping -n 1 {hostname}")
    print(ping_result or "No output")
    
    # Try 'dig' command if available
    print("\n3. Using dig command (if available):")
    dig_result = try_command(f"dig {hostname}")
    print(dig_result or "dig command not available or no output")
    
    # Check if socket.getaddrinfo is working for other domains
    print("\n4. Testing socket.getaddrinfo with a known domain (google.com):")
    try:
        google_addrs = socket.getaddrinfo("google.com", None)
        print(f"✅ Successfully resolved google.com to {len(google_addrs)} addresses")
        for i, addr in enumerate(google_addrs[:3]):  # Show first 3 only
            family, _, _, _, sockaddr = addr
            print(f"  {i+1}. {sockaddr[0]} (Family: {'IPv4' if family == socket.AF_INET else 'IPv6'})")
        if len(google_addrs) > 3:
            print(f"  ... and {len(google_addrs) - 3} more addresses")
    except socket.gaierror as e:
        print(f"❌ Failed to resolve google.com: {e}")
    
    print("\nIf alternative methods show IP addresses but Python socket.getaddrinfo fails,")
    print("there may be an issue with the DNS configuration or Python socket library.")
    
    return ipv4_addresses, ipv6_addresses

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
        
        # If DNS resolution fails, try manual lookup
        print("Attempting manual lookup methods...")
        manual_ipv4, manual_ipv6 = manual_dns_lookup(hostname)
        
        # Add any IPs found through manual methods
        for ip in manual_ipv4:
            if ip not in ipv4_addresses:
                ipv4_addresses.append(ip)
        
        for ip in manual_ipv6:
            if ip not in ipv6_addresses:
                ipv6_addresses.append(ip)
    
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

def try_direct_ip_connection(host, port, timeout=5):
    """Try to connect directly to an IP if available."""
    # Check if host is already an IP address
    try:
        socket.inet_pton(socket.AF_INET, host)
        print(f"Host '{host}' is already an IPv4 address")
        return test_socket_connection_internal(host, port, socket.AF_INET, timeout)
    except socket.error:
        pass
    
    try:
        socket.inet_pton(socket.AF_INET6, host)
        print(f"Host '{host}' is already an IPv6 address")
        return test_socket_connection_internal(host, port, socket.AF_INET6, timeout)
    except socket.error:
        pass
    
    # Ask user for manual IP
    print("\n⚠️ Since hostname resolution failed, you can try connecting directly to an IP address.")
    ip_address = input("Enter IP address to try (or leave empty to skip): ").strip()
    
    if not ip_address:
        print("Skipping direct IP connection.")
        return False
    
    # Determine IP version and try connection
    try:
        socket.inet_pton(socket.AF_INET, ip_address)
        print(f"Trying direct connection to IPv4 address: {ip_address}:{port}")
        return test_socket_connection_internal(ip_address, port, socket.AF_INET, timeout)
    except socket.error:
        try:
            socket.inet_pton(socket.AF_INET6, ip_address)
            print(f"Trying direct connection to IPv6 address: [{ip_address}]:{port}")
            return test_socket_connection_internal(ip_address, port, socket.AF_INET6, timeout)
        except socket.error:
            print(f"❌ Invalid IP address format: {ip_address}")
            return False

def test_socket_connection_internal(ip, port, family, timeout=5):
    """Test a socket connection to a specific IP and family."""
    try:
        sock = socket.socket(family, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        
        start_time = time.time()
        if family == socket.AF_INET:
            result = sock.connect_ex((ip, port))
        else:  # AF_INET6
            result = sock.connect_ex((ip, port, 0, 0))
        elapsed = time.time() - start_time
        
        sock.close()
        
        if result == 0:
            print(f"✅ Connection successful to {ip}:{port} ({elapsed:.2f}s)")
            return True
        else:
            print(f"❌ Connection failed to {ip}:{port} with error code {result} ({elapsed:.2f}s)")
            return False
    except Exception as e:
        print(f"❌ Socket error: {e}")
        return False

def test_socket_connection(hostname, port, timeout=5):
    """Test TCP connection using both IPv4 and IPv6 if available."""
    print_section("TESTING SOCKET CONNECTION")
    print(f"Testing connection to {hostname}:{port}...")
    
    # Try to resolve hostname
    ipv4_addresses, ipv6_addresses = resolve_hostname(hostname)
    
    # If resolution failed completely, try direct IP connection
    if not ipv4_addresses and not ipv6_addresses:
        return try_direct_ip_connection(hostname, port, timeout)
    
    # Try IPv4 connection first if available
    if ipv4_addresses:
        for ip in ipv4_addresses:
            print(f"Trying IPv4 connection to {ip}:{port}...")
            if test_socket_connection_internal(ip, port, socket.AF_INET, timeout):
                return True
    
    # Try IPv6 connection if available
    if ipv6_addresses:
        for ip in ipv6_addresses:
            print(f"Trying IPv6 connection to [{ip}]:{port}...")
            if test_socket_connection_internal(ip, port, socket.AF_INET6, timeout):
                return True
    
    print("❌ All connection attempts failed")
    return False

def replace_ipv6_host_in_url(url, ipv6_addr):
    """Replace the hostname in a URL with an IPv6 address correctly."""
    parsed = urlparse(url)
    netloc = parsed.netloc
    
    # Extract username, password, and port from netloc
    auth = ""
    if "@" in netloc:
        auth, rest = netloc.split("@", 1)
        auth += "@"
    else:
        rest = netloc
    
    # Extract port if present
    port = ""
    if ":" in rest and "]:" not in rest:  # Normal port format
        host, port = rest.rsplit(":", 1)
        port = ":" + port
    else:
        host = rest
    
    # Create new netloc with IPv6 address in brackets
    new_netloc = f"{auth}[{ipv6_addr}]{port}"
    
    # Rebuild URL with new netloc
    new_parts = list(parsed)
    new_parts[1] = new_netloc
    return urlunparse(new_parts)

def test_postgres_connection(db_url):
    """Test if we can connect to PostgreSQL using the database URL."""
    print_section("TESTING POSTGRESQL CONNECTION")
    
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
        print("\nCheck your connection string format. For Supabase, it should be:")
        print("postgresql://postgres:password@db.iubskuvezsqbqqjqnvla.supabase.co:5432/postgres")
        
        # If hostname resolution is the issue, suggest using direct IP
        if "could not translate host name" in str(e) or "getaddrinfo failed" in str(e):
            print("\nIf you have a direct IP address for the database, you can try using that instead.")
            ip = input("Enter IP address (or leave empty to skip): ").strip()
            if ip:
                # Check if it's an IPv6 address
                try:
                    socket.inet_pton(socket.AF_INET6, ip)
                    # It's IPv6, need special formatting
                    new_url = replace_ipv6_host_in_url(db_url, ip)
                except socket.error:
                    # It's IPv4 or invalid
                    new_url = db_url.replace(parsed_url.hostname, ip)
                
                # Hide password in log output
                safe_new_url = new_url.replace(parsed_url.password or "", "***") if parsed_url.password else new_url
                print(f"Trying connection with IP address: {safe_new_url}")
                
                try:
                    conn = psycopg2.connect(new_url, connect_timeout=15)
                    print("✅ Connection with direct IP successful!")
                    conn.close()
                    return True
                except Exception as e2:
                    print(f"❌ Connection with direct IP failed: {e2}")
        
        return False

def get_database_url(args):
    """Get database URL from environment or build from defaults/args."""
    # First try to get from environment
    db_url = os.environ.get('DATABASE_URL', '')
    
    if db_url:
        print(f"Using DATABASE_URL from environment variable (credentials hidden)")
        return db_url
    
    # If not in environment, build from args or defaults
    host = args.host if args.host else DEFAULT_HOST
    port = args.port if args.port else DEFAULT_PORT
    user = args.user if args.user else DEFAULT_USER
    password = args.password if args.password else DEFAULT_PASSWORD
    dbname = args.dbname if args.dbname else DEFAULT_DB
    
    # Build the URL
    db_url = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
    print(f"No DATABASE_URL found in environment, using constructed URL: postgresql://{user}:***@{host}:{port}/{dbname}")
    return db_url

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Test PostgreSQL connections with IPv4/IPv6 support")
    parser.add_argument("--host", help=f"Database hostname (default: {DEFAULT_HOST})")
    parser.add_argument("--port", type=int, help=f"Database port (default: {DEFAULT_PORT})")
    parser.add_argument("--user", help=f"Database user (default: {DEFAULT_USER})")
    parser.add_argument("--password", help="Database password")
    parser.add_argument("--dbname", help=f"Database name (default: {DEFAULT_DB})")
    parser.add_argument("--manual-ip", help="Skip hostname resolution and try this IP address directly")
    args = parser.parse_args()
    
    print_section("SUPABASE CONNECTION TEST (IPv4/IPv6)")
    
    # Get database URL
    db_url = get_database_url(args)
    
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
        
        # If a manual IP was provided, try it directly
        if args.manual_ip:
            print(f"Using manual IP address: {args.manual_ip}")
            
            # Check if it's an IPv6 address
            try:
                socket.inet_pton(socket.AF_INET6, args.manual_ip)
                # It's IPv6, need special URL formatting with brackets
                direct_url = replace_ipv6_host_in_url(db_url, args.manual_ip)
            except socket.error:
                # Not IPv6, just replace hostname
                direct_url = db_url.replace(hostname, args.manual_ip)
                
            return test_postgres_connection(direct_url)
        
        # Test socket connection (handles both IPv4 and IPv6)
        if not test_socket_connection(hostname, port):
            print("\n🔍 Troubleshooting connection issues:")
            print("1. Check if the database server is running and accessible")
            print("2. Verify the hostname and port are correct")
            print("3. Check if there are firewalls blocking the connection")
            print("4. Try providing a direct IP address with --manual-ip option")
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