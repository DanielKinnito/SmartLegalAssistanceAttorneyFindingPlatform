#!/usr/bin/env python3
"""
Script to connect to the Supabase PostgreSQL database using environment variables.
This script can be used to test connection or to perform database operations directly.
"""
import os
import sys
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

def load_environment():
    """Load environment variables from .env file"""
    # Try to find .env file in multiple locations
    possible_env_files = [
        '.env',                                           # Root directory
        '../.env',                                         # Parent directory
        'database/supabase/.env',                          # Supabase directory
        os.path.join(os.path.dirname(__file__), '.env'),   # Current script directory
    ]
    
    # Try each possible location
    for env_file in possible_env_files:
        if os.path.exists(env_file):
            print(f"Loading environment from {env_file}")
            load_dotenv(env_file)
            return True
    
    # If no .env found, try the example file
    example_env = os.path.join(os.path.dirname(__file__), 'env.example')
    if os.path.exists(example_env):
        print(f"No .env file found. Loading from {example_env} as fallback")
        load_dotenv(example_env)
        return True
    
    print("❌ No .env or env.example file found")
    return False

def get_connection_params():
    """Get database connection parameters from environment variables"""
    # First try direct connection parameters
    params = {
        'dbname': os.environ.get('DB_NAME', 'postgres'),
        'user': os.environ.get('DB_USER', 'postgres'),
        'password': os.environ.get('DB_PASSWORD', ''),
        'host': os.environ.get('DB_HOST', ''),
        'port': os.environ.get('DB_PORT', '5432'),
        'sslmode': 'require'
    }
    
    # If any essential params are missing, return None
    if not params['host'] or not params['password']:
        print("❌ Missing essential database connection parameters")
        return None
    
    return params

def connect_to_supabase():
    """Connect to the Supabase PostgreSQL database"""
    params = get_connection_params()
    if not params:
        return None
    
    try:
        print(f"Connecting to Supabase PostgreSQL at {params['host']}...")
        connection = psycopg2.connect(**params)
        return connection
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return None

def test_connection():
    """Test the connection and run a simple query"""
    connection = connect_to_supabase()
    if not connection:
        print("❌ Failed to connect to Supabase")
        return False
    
    try:
        with connection.cursor() as cursor:
            # Get PostgreSQL version
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            print(f"✅ Successfully connected to PostgreSQL:\n{version}")
            
            # List tables
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            
            tables = cursor.fetchall()
            if tables:
                print("\nAvailable tables:")
                for table in tables:
                    print(f"- {table[0]}")
            else:
                print("\nNo tables found in the public schema.")
            
        connection.close()
        return True
    except Exception as e:
        print(f"❌ Query error: {e}")
        if connection:
            connection.close()
        return False

def run_custom_query(query):
    """Run a custom SQL query"""
    connection = connect_to_supabase()
    if not connection:
        return None
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            
            # For SELECT queries
            if query.strip().upper().startswith("SELECT"):
                results = cursor.fetchall()
                if cursor.description:
                    columns = [desc[0] for desc in cursor.description]
                    return {"columns": columns, "rows": results}
                return {"rows": results}
            
            # For other queries (INSERT, UPDATE, etc.)
            connection.commit()
            return {"affected_rows": cursor.rowcount}
    except Exception as e:
        print(f"❌ Query error: {e}")
        return None
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    # Load environment variables
    if not load_environment():
        sys.exit(1)
    
    # Test connection
    if not test_connection():
        sys.exit(1)
    
    print("\n✅ Connection test successful!")
    print("\nUsage examples:")
    print("1. Import this module in your scripts:")
    print("   from database.supabase.connect_supabase import connect_to_supabase, run_custom_query")
    print("   connection = connect_to_supabase()")
    print("   result = run_custom_query('SELECT * FROM auth_user LIMIT 5')")
    
    sys.exit(0) 