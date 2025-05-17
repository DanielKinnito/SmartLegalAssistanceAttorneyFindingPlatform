import sqlite3
import sys
import os

def check_table_exists(table_name, db_path=None):
    try:
        # Determine database path relative to this script
        if db_path is None:
            db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'db.sqlite3'))
            
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
        table = cursor.fetchone()
        
        if table:
            print(f"Table '{table_name}' exists.")
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            print(f"Schema for table '{table_name}':")
            for column in columns:
                col_id, name, type_, notnull, default_value, pk = column
                print(f"{col_id}. {name} ({type_}), NOT NULL: {notnull}, PK: {pk}, DEFAULT: {default_value}")
        else:
            print(f"Table '{table_name}' does NOT exist!")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_table_exists("email_verification_tokens") 