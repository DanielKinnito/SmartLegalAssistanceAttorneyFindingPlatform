import os
import sys
import time
import random
import string
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras
import json

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load environment variables
load_dotenv()

def get_connection_params():
    """Get database connection parameters from environment variables."""
    try:
        # Get values from environment
        db_host = os.environ.get('DB_HOST')
        db_name = os.environ.get('DB_NAME')
        db_user = os.environ.get('DB_USER')
        db_password = os.environ.get('DB_PASSWORD')
        db_port = os.environ.get('DB_PORT')
        
        if not all([db_host, db_name, db_user, db_password, db_port]):
            print("❌ Error: Missing database environment variables in .env file")
            print("Required: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT")
            return None
            
        return {
            'host': db_host,
            'dbname': db_name,
            'user': db_user,
            'password': db_password,
            'port': db_port
        }
    except Exception as e:
        print(f"❌ Error getting connection parameters: {e}")
        return None

def direct_connection_test():
    """Test direct PostgreSQL connection to Supabase."""
    print("\n=== Direct PostgreSQL Connection Test ===")
    print("========================================")
    
    # Get connection parameters
    params = get_connection_params()
    if not params:
        return False
    
    try:
        print(f"Connecting to PostgreSQL on {params['host']}...")
        
        # Try to connect directly without SSL verification
        conn = psycopg2.connect(**params)
        
        # Create a cursor
        cur = conn.cursor()
        
        # Execute a version query
        cur.execute('SELECT version()')
        db_version = cur.fetchone()
        print("✅ Database connection successful!")
        print(f"PostgreSQL server information: {db_version[0]}\n")
        
        # Test schema
        try:
            # Check if our tables exist
            print("Checking database schema...")
            cur.execute("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name;
            """)
            tables = cur.fetchall()
            print(f"Found {len(tables)} tables:")
            for table in tables:
                print(f"  - {table[0]}")
        except Exception as schema_error:
            print(f"❌ Error checking schema: {schema_error}")
        
        # Close cursor and connection
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        print("\nTroubleshooting Tips:")
        print("1. Verify your database credentials in .env")
        print("2. Check if your IP address is whitelisted in Supabase settings")
        print("3. Make sure the database server is running")
        return False

if __name__ == "__main__":
    # Try to load environment
    if not os.path.exists('.env'):
        print("❌ No .env file found! Please create one with database credentials.")
        sys.exit(1)
        
    # Run the test
    success = direct_connection_test()
    
    # Show final status
    if success:
        print("\n✅ Direct database connection test completed successfully!")
    else:
        print("\n❌ Direct database connection test failed!")
        
    sys.exit(0 if success else 1) 