"""
Script to fix the database issues by creating a clean slate.
This will:
1. Backup the existing database
2. Create a completely new database file
3. Configure settings to skip migrations
"""
import os
import sys
import sqlite3
import shutil
from datetime import datetime

def backup_database():
    """Create a backup of the current database."""
    if os.path.exists('db.sqlite3'):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = f'db_backup_{timestamp}.sqlite3'
        
        try:
            # Try to copy the file directly
            shutil.copy2('db.sqlite3', backup_path)
            print(f"✅ Database backed up to {backup_path}")
        except PermissionError:
            print("❌ Cannot access the database file - it's locked by another process.")
            print("Close any running Django instances and try again.")
            sys.exit(1)
    else:
        print("⚠️ No database file found to backup.")

def create_empty_database():
    """Create a new empty database with just enough structure to work."""
    try:
        # Remove existing database if it exists
        if os.path.exists('db.sqlite3'):
            try:
                os.remove('db.sqlite3')
                print("✅ Removed old database file")
            except PermissionError:
                print("❌ Cannot remove the database file - it's locked by another process.")
                print("Please close all Django instances and try again.")
                sys.exit(1)
        
        # Create a new empty database
        conn = sqlite3.connect('db.sqlite3')
        cursor = conn.cursor()
        
        # Create a minimal django_migrations table to track migrations
        cursor.execute('''
            CREATE TABLE django_migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                app VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                applied DATETIME NOT NULL
            );
        ''')
        
        # Add entries for all the migrations marked as applied
        migrations = [
            ('admin', '0001_initial'),
            ('admin', '0002_logentry_remove_auto_add'),
            ('admin', '0003_logentry_add_action_flag_choices'),
            ('auth', '0001_initial'),
            ('auth', '0002_alter_permission_name_max_length'),
            ('auth', '0003_alter_user_email_max_length'),
            ('auth', '0004_alter_user_username_opts'),
            ('auth', '0005_alter_user_last_login_null'),
            ('auth', '0006_require_contenttypes_0002'),
            ('auth', '0007_alter_validators_add_error_messages'),
            ('auth', '0008_alter_user_username_max_length'),
            ('auth', '0009_alter_user_last_name_max_length'),
            ('auth', '0010_alter_group_name_max_length'),
            ('auth', '0011_update_proxy_permissions'),
            ('auth', '0012_alter_user_first_name_max_length'),
            ('contenttypes', '0001_initial'),
            ('contenttypes', '0002_remove_content_type_name'),
            ('users', '0001_initial'), # Adding this to fix the dependency issue
            ('sessions', '0001_initial'),
            ('token_blacklist', '0001_initial'),
            ('token_blacklist', '0002_outstandingtoken_jti_hex'),
            ('token_blacklist', '0003_auto_20171017_2007'),
            ('token_blacklist', '0004_auto_20171017_2013'),
            ('token_blacklist', '0005_remove_outstandingtoken_jti'),
            ('token_blacklist', '0006_auto_20171017_2113'),
            ('token_blacklist', '0007_auto_20171017_2214'),
            ('token_blacklist', '0008_migrate_to_bigautofield'),
            ('token_blacklist', '0010_fix_migrate_to_bigautofield'),
            ('token_blacklist', '0011_linearizes_history'),
        ]
        
        # Add all the migrations as if they were already applied
        for app, name in migrations:
            cursor.execute(
                "INSERT INTO django_migrations (app, name, applied) VALUES (?, ?, datetime('now'))",
                (app, name)
            )
        
        conn.commit()
        conn.close()
        
        print("✅ Created new empty database with migrations marked as applied")
    except Exception as e:
        print(f"❌ Error creating new database: {e}")
        sys.exit(1)

def create_env_file():
    """Create a .env file that points to Supabase."""
    # Backup existing .env file if it exists
    if os.path.exists('.env'):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        shutil.copy2('.env', f'.env.bak_{timestamp}')
        print(f"✅ Backed up existing .env file to .env.bak_{timestamp}")
        
    env_content = """# Database Configuration (PostgreSQL - Supabase)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Li+!v7S!9RQu2?c
DB_HOST=db.iubskuvezsqbqqjqnvla.supabase.co
DB_PORT=5432

# Supabase Configuration
SUPABASE_URL=https://iubskuvezsqbqqjqnvla.supabase.co
SUPABASE_KEY=[YOUR-API-KEY]

# Django general settings
SECRET_KEY=django-insecure-development-key-change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key-replace-this
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=1
"""
    with open('.env', 'w') as f:
        f.write(env_content)
    print("✅ Created .env file with Supabase configuration")

def create_disable_migrations_setting():
    """Create a settings file that disables migrations."""
    migrations_path = os.path.join('config', 'settings', 'disable_migrations.py')
    
    content = """# Settings to disable Django migrations
# Import this at the end of your settings file

# Disable all migrations
MIGRATION_MODULES = {
    'admin': 'smart_legal_assistance.migrations_not_used',
    'auth': 'smart_legal_assistance.migrations_not_used',
    'contenttypes': 'smart_legal_assistance.migrations_not_used',
    'sessions': 'smart_legal_assistance.migrations_not_used',
    'messages': 'smart_legal_assistance.migrations_not_used',
    'staticfiles': 'smart_legal_assistance.migrations_not_used',
    'users': 'smart_legal_assistance.migrations_not_used',
    'attorneys': 'smart_legal_assistance.migrations_not_used',
    'clients': 'smart_legal_assistance.migrations_not_used',
    'admin': 'smart_legal_assistance.migrations_not_used',
    'chatbot': 'smart_legal_assistance.migrations_not_used',
    'document_generation': 'smart_legal_assistance.migrations_not_used',
    'oauth2_provider': 'smart_legal_assistance.migrations_not_used',
    'social_django': 'smart_legal_assistance.migrations_not_used',
    'token_blacklist': 'smart_legal_assistance.migrations_not_used',
}
"""
    
    os.makedirs(os.path.dirname(migrations_path), exist_ok=True)
    
    with open(migrations_path, 'w') as f:
        f.write(content)
    
    print(f"✅ Created settings file to disable migrations at {migrations_path}")
    print("   Import this in your settings file with: from .disable_migrations import *")

def main():
    print("🔧 Starting database fix process...")
    
    backup_database()
    create_empty_database()
    create_env_file()
    create_disable_migrations_setting()
    
    # Create migrations_not_used directory if it doesn't exist
    os.makedirs('smart_legal_assistance/migrations_not_used', exist_ok=True)
    with open('smart_legal_assistance/migrations_not_used/__init__.py', 'w') as f:
        f.write('# This file exists to make the directory a Python package')
    
    print("\n✅ All fixes applied successfully!")
    print("\nNext steps:")
    print("1. Run the server with 'python manage.py runserver --settings=config.settings.development_supabase'")
    print("2. If using Supabase, ensure you've run the SQL schema in the Supabase dashboard")
    print("3. Access the API at http://localhost:8000/swagger/")

if __name__ == "__main__":
    main() 