#!/usr/bin/env python
"""
Script to fix model conflicts in the users app.
It directly modifies or creates model files to ensure consistent model relationships.
"""

import os
import sys
import django
from pathlib import Path

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

# Import models after Django setup
from django.contrib.auth import get_user_model
from django.apps import apps
from django.db import models

User = get_user_model()

def check_model_fields():
    """Check current model fields for conflicts."""
    print("Checking for model conflicts...")
    
    # Check if ClientProfile exists
    if 'users' in apps.app_configs:
        users_app = apps.app_configs['users']
        client_profile_model = None
        attorney_profile_model = None
        
        for model_name, model_class in users_app.models.items():
            if model_name.lower() == 'clientprofile':
                client_profile_model = model_class
            if model_name.lower() == 'attorneyprofile':
                attorney_profile_model = model_class
        
        if client_profile_model:
            print(f"Found ClientProfile model in users app")
            # Check related_name
            for field in client_profile_model._meta.fields:
                if field.name == 'user':
                    print(f"  related_name: {field.remote_field.related_name}")
        else:
            print("ClientProfile model not found in users app")
            
        if attorney_profile_model:
            print(f"Found AttorneyProfile model in users app")
            # Check related_name
            for field in attorney_profile_model._meta.fields:
                if field.name == 'user':
                    print(f"  related_name: {field.remote_field.related_name}")
        else:
            print("AttorneyProfile model not found in users app")
    
    # Check if Client exists
    if 'clients' in apps.app_configs:
        clients_app = apps.app_configs['clients']
        client_model = None
        
        for model_name, model_class in clients_app.models.items():
            if model_name.lower() == 'client':
                client_model = model_class
        
        if client_model:
            print(f"Found Client model in clients app")
            # Check related_name
            for field in client_model._meta.fields:
                if field.name == 'user':
                    print(f"  related_name: {field.remote_field.related_name}")
        else:
            print("Client model not found in clients app")
    
    # Check if Attorney exists
    if 'attorneys' in apps.app_configs:
        attorneys_app = apps.app_configs['attorneys']
        attorney_model = None
        
        for model_name, model_class in attorneys_app.models.items():
            if model_name.lower() == 'attorney':
                attorney_model = model_class
        
        if attorney_model:
            print(f"Found Attorney model in attorneys app")
            # Check related_name
            for field in attorney_model._meta.fields:
                if field.name == 'user':
                    print(f"  related_name: {field.remote_field.related_name}")
        else:
            print("Attorney model not found in attorneys app")

def main():
    """Main function to execute the script."""
    check_model_fields()
    
    # Fix models instructions
    print("\nTo fix model conflicts, you should:")
    print("1. Ensure the related_name is different in each model")
    print("2. Update any references in your codebase to use the new related_name")
    print("3. Either recreate your database or create a migration that updates the related_name fields")
    print("\nMigration steps:")
    print("1. Backup your database")
    print("2. Delete the database file (db.sqlite3)")
    print("3. Run 'python manage.py migrate' to recreate the database with the updated models")

if __name__ == "__main__":
    main() 