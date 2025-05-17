"""
Test script to verify connection to Supabase.
"""
import os
import sys
import django
from dotenv import load_dotenv

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load .env file
load_dotenv()

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.supabase')
django.setup()

def test_connection():
    """Test the database connection to Supabase."""
    print("Testing Supabase database connection...")
    
    try:
        from django.db import connection
        cursor = connection.cursor()
        
        # Check database version
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"Successfully connected to PostgreSQL:\n{version}")
        
        # Check if the schema exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'auth_user'
            );
        """)
        
        table_exists = cursor.fetchone()[0]
        if table_exists:
            print("The auth_user table exists.")
            
            # Check if the schema is complete
            tables = ['auth_user', 'attorneys', 'clients', 'attorney_specialties', 
                     'attorney_credentials', 'legal_requests']
            
            for table in tables:
                cursor.execute(f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = '{table}'
                    );
                """)
                
                exists = cursor.fetchone()[0]
                print(f"Table {table}: {'✅ Exists' if exists else '❌ Missing'}")
        else:
            print("❌ Schema not found. Did you run the schema.sql script in Supabase?")
            
        return True
    
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    
    if success:
        print("\n✅ Connection test successful!")
        print("\nNext steps:")
        print("1. Run 'start_with_supabase.bat' to start the server")
        print("2. Access the API at http://localhost:8000/swagger/")
    else:
        print("\n❌ Connection test failed!")
        print("\nTroubleshooting steps:")
        print("1. Verify your database credentials in .env")
        print("2. Make sure your IP is allowed in Supabase")
        print("3. Check if the Supabase database is up and running")
    
    sys.exit(0 if success else 1) 