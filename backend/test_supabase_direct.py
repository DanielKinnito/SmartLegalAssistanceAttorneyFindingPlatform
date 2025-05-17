#!/usr/bin/env python3
"""
Simple script to test the Supabase connection modules.
This script imports and uses the modules we created to connect to Supabase.
"""
import os
import sys
from database.supabase.connect_supabase import connect_to_supabase, run_custom_query, load_environment

def main():
    """Test Supabase connection and run a simple query"""
    print("Testing Supabase Connection")
    print("==========================")
    
    # Load environment variables
    if not load_environment():
        print("Failed to load environment variables.")
        return 1
    
    # Test connection
    connection = connect_to_supabase()
    if not connection:
        print("Failed to connect to Supabase database.")
        return 1
    
    print("✅ Successfully connected to Supabase!")
    
    # List tables
    print("\nTables in database:")
    result = run_custom_query("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    
    if result and result['rows']:
        for i, row in enumerate(result['rows']):
            print(f"{i+1}. {row[0]}")
    else:
        print("No tables found or error running query.")
    
    # Check for auth_user table
    result = run_custom_query("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'auth_user'
        );
    """)
    
    if result and result['rows']:
        if result['rows'][0][0]:
            print("\nThe auth_user table exists. Fetching user data...")
            
            # Query users
            users = run_custom_query("SELECT id, username, email, is_active FROM auth_user LIMIT 5;")
            if users and users['rows']:
                print("\nUsers:")
                for user in users['rows']:
                    print(f"ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Active: {user[3]}")
            else:
                print("No users found or error querying users.")
        else:
            print("\nThe auth_user table does not exist.")
    
    print("\nTest completed successfully!")
    return 0

if __name__ == "__main__":
    sys.exit(main()) 