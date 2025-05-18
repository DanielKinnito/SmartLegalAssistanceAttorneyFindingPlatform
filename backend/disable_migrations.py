#!/usr/bin/env python
"""
This script configures Django to skip creating tables that already exist.
Run this before migrations to avoid duplicate table errors.
"""
import os
import sys
from pathlib import Path

# Set up the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.conf import settings
from django.db import connection

def disable_migrations():
    """
    Configure Django to skip migrations for existing tables.
    Use when your database schema is already established.
    """
    print("Checking for existing tables and configuring migrations...")
    
    # Get all existing tables in the database
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        existing_tables = {row[0] for row in cursor.fetchall()}
    
    print(f"Found {len(existing_tables)} existing tables in database")
    
    # Create directory for fake migrations if needed
    migrations_dir = Path(settings.BASE_DIR) / 'fake_migrations'
    migrations_dir.mkdir(exist_ok=True)
    init_file = migrations_dir / '__init__.py'
    init_file.touch(exist_ok=True)
    
    # Create dictionary to disable migrations for existing apps/models
    from django.apps import apps
    migration_modules = {}
    
    for app_config in apps.get_app_configs():
        app_label = app_config.label
        
        # Check if any models from this app have tables
        has_tables = any(
            model._meta.db_table in existing_tables
            for model in app_config.get_models()
        )
        
        if has_tables:
            print(f"Disabling migrations for app: {app_label} (tables exist)")
            migration_modules[app_label] = 'fake_migrations'

    # Save the configuration to a file that can be imported
    with open(Path(settings.BASE_DIR) / 'migrations_config.py', 'w') as f:
        f.write("# Auto-generated file to handle existing tables\n\n")
        f.write("MIGRATION_MODULES = {\n")
        for app, module in migration_modules.items():
            f.write(f"    '{app}': '{module}',\n")
        f.write("}\n\n")
        f.write("# Add these settings to your settings.py:\n")
        f.write("# from migrations_config import MIGRATION_MODULES\n")
    
    print("Created migrations_config.py - import this in your settings files")
    return migration_modules

if __name__ == '__main__':
    disable_migrations() 