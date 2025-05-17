#!/usr/bin/env python3
"""
Simple script to check Supabase connection status.
Run this script to verify your connection to Supabase.
"""
import os
import sys

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.supabase.connect_supabase import connect_supabase_client, load_environment

def check_connection():
    """Check the connection to Supabase"""
    print("\n=== Supabase Connection Check ===")
    print("================================")
    
    # Load environment variables
    if not load_environment():
        print("❌ Failed to load environment variables.")
        print("   Make sure you have a .env file with SUPABASE_URL and SUPABASE_KEY.")
        return 1
    
    # Connect to Supabase using the client
    print("Attempting to connect to Supabase...")
    client = connect_supabase_client()
    
    if not client:
        print("❌ Failed to connect to Supabase.")
        print("\nTroubleshooting tips:")
        print("1. Check that SUPABASE_URL and SUPABASE_KEY are correct in your .env file")
        print("2. Verify your internet connection")
        print("3. Make sure your API key has the necessary permissions")
        return 1
    
    print("✅ Successfully connected to Supabase!")
    print(f"   URL: {os.environ.get('SUPABASE_URL')}")
    
    # Try to check if auth_user table exists (Django's user table)
    try:
        response = client.from_('auth_user').select('count').execute()
        user_count = response.data[0]['count'] if response.data else 0
        print("\n✅ Django auth_user table exists")
        print(f"   Current user count: {user_count}")
    except Exception as e:
        print("\n⚠️ Could not access auth_user table")
        print(f"   Error: {str(e)}")
    
    print("\nConnection check completed.")
    print("================================")
    return 0

if __name__ == "__main__":
    sys.exit(check_connection()) 