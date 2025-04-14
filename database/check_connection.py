#!/usr/bin/env python
"""
Database Connection Test Script

This script tests the connection to the PostgreSQL database
configured in the .env file. It's useful for verifying your
Supabase connection is working properly.

Usage:
    python check_connection.py
"""

import os
import sys
import psycopg2
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Add the parent directory to sys.path to import Django settings
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def test_connection():
    """Test the database connection using credentials from .env file."""
    try:
        # Load environment variables from .env file
        env_path = os.path.join(os.path.dirname(__file__), '..', 'SmartLegalAssistanceBackend', '.env')
        if not os.path.exists(env_path):
            logger.error(f"Error: .env file not found at {env_path}")
            return False
            
        load_dotenv(env_path)
        logger.info("Successfully loaded environment variables from .env file")
        
        # Get database credentials from environment variables
        db_host = os.getenv('DB_HOST')
        db_name = os.getenv('DB_NAME')
        db_user = os.getenv('DB_USER')
        db_pass = os.getenv('DB_PASSWORD')
        db_port = os.getenv('DB_PORT')
        
        if not all([db_host, db_name, db_user, db_pass, db_port]):
            logger.error("Error: Missing database credentials in .env file")
            logger.info(f"DB_HOST: {'set' if db_host else 'missing'}")
            logger.info(f"DB_NAME: {'set' if db_name else 'missing'}")
            logger.info(f"DB_USER: {'set' if db_user else 'missing'}")
            logger.info(f"DB_PASSWORD: {'set' if db_pass else 'missing'}")
            logger.info(f"DB_PORT: {'set' if db_port else 'missing'}")
            return False
        
        logger.info(f"Connecting to database {db_name} on {db_host}:{db_port} as {db_user}...")
        
        # Connect to the database
        conn = psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_pass,
            port=db_port
        )
        
        # Get database server version
        cursor = conn.cursor()
        cursor.execute('SELECT version();')
        db_version = cursor.fetchone()
        logger.info(f"Connection successful!")
        logger.info(f"PostgreSQL version: {db_version[0]}")
        
        # Test that we can create a table
        try:
            logger.info("Testing database write permissions...")
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS connection_test (
                id SERIAL PRIMARY KEY,
                test_name VARCHAR(100) NOT NULL,
                timestamp TIMESTAMP NOT NULL DEFAULT NOW()
            );
            """)
            conn.commit()
            
            # Insert a test record
            cursor.execute("""
            INSERT INTO connection_test (test_name) 
            VALUES ('Connection test');
            """)
            conn.commit()
            
            # Get the record
            cursor.execute("SELECT * FROM connection_test ORDER BY id DESC LIMIT 1;")
            test_record = cursor.fetchone()
            logger.info(f"Test record created: {test_record}")
            
            # Clean up - drop the test table
            cursor.execute("DROP TABLE connection_test;")
            conn.commit()
            logger.info("Test table cleaned up successfully")
            
        except Exception as e:
            logger.warning(f"Warning: Could not perform full test: {e}")
            conn.rollback()
        
        # Check if any schemas from our design exist
        try:
            cursor.execute("""
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name IN ('auth', 'legal', 'audit');
            """)
            schemas = cursor.fetchall()
            if schemas:
                logger.info(f"Found existing schemas: {', '.join([s[0] for s in schemas])}")
            else:
                logger.info("No application schemas found yet. The database is empty and ready for schema creation.")
        except Exception as e:
            logger.warning(f"Warning: Could not check for existing schemas: {e}")
        
        cursor.close()
        conn.close()
        
        return True
        
    except psycopg2.OperationalError as e:
        if "could not translate host name" in str(e) or "could not connect to server" in str(e):
            logger.error(f"Error connecting to the database: Connection failed")
            logger.error(f"Detail: {e}")
            logger.error(f"Check that your host '{os.getenv('DB_HOST')}' is correct and accessible")
            logger.error(f"For Supabase, remember to use format: 'your-project-ref.supabase.co' (not 'db.your-project-ref.supabase.co')")
        else:
            logger.error(f"Error connecting to the database: {e}")
        return False
    except Exception as e:
        logger.error(f"Error connecting to the database: {e}")
        return False

if __name__ == "__main__":
    logger.info("Database Connection Test")
    logger.info("========================")
    success = test_connection()
    
    if success:
        logger.info("\n✅ Database connection is working correctly!")
        sys.exit(0)
    else:
        logger.error("\n❌ Database connection failed. Check your credentials and network settings.")
        sys.exit(1) 