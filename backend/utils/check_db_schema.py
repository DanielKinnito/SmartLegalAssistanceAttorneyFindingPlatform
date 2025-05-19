import sqlite3
import sys
import os

def check_table_schema(table_name, db_path=None):
    try:
        # Determine database path relative to this script
        if db_path is None:
            db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'db.sqlite3'))
            
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get table schema
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        
        print(f"Schema for table '{table_name}':")
        for column in columns:
            col_id, name, type_, notnull, default_value, pk = column
            print(f"{col_id}. {name} ({type_}), NOT NULL: {notnull}, PK: {pk}, DEFAULT: {default_value}")
            sys.stdout.flush()
        
        # Check if verification_status exists
        has_verification_status = any(col[1] == 'verification_status' for col in columns)
        print(f"\nHas verification_status column: {has_verification_status}")
        sys.stdout.flush()
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")
        sys.stdout.flush()

if __name__ == "__main__":
    check_table_schema("users") 