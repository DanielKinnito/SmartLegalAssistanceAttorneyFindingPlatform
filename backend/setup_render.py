#!/usr/bin/env python
import os
import sys

def check_environment():
    """Check and verify required environment variables for Render deployment."""
    print("Checking deployment environment...")
    
    # Required environment variables
    required_vars = [
        'SECRET_KEY', 
        'ALLOWED_HOSTS',
        'DATABASE_URL'
    ]
    
    # Optional environment variables with defaults
    optional_vars = {
        'PORT': '8000',
        'CORS_ALLOWED_ORIGINS': 'https://smart-legal-assistance.onrender.com',
        'ADMIN_EMAIL': 'admin@legalassistance.com',
        'ADMIN_PASSWORD': 'admin@123'
    }
    
    # Check required variables
    missing_vars = [var for var in required_vars if not os.environ.get(var)]
    if missing_vars:
        print(f"WARNING: Missing required environment variables: {', '.join(missing_vars)}")
        print("These should be set in the Render dashboard.")
    
    # Set defaults for optional variables if not present
    for var, default in optional_vars.items():
        if not os.environ.get(var):
            os.environ[var] = default
            print(f"Set default for {var}: {default}")
    
    # Ensure ALLOWED_HOSTS includes render.com domains
    allowed_hosts = os.environ.get('ALLOWED_HOSTS', '')
    if 'render.com' not in allowed_hosts:
        if allowed_hosts:
            os.environ['ALLOWED_HOSTS'] = f"{allowed_hosts},*.render.com,render.com"
        else:
            os.environ['ALLOWED_HOSTS'] = "*.render.com,render.com"
        print(f"Updated ALLOWED_HOSTS to include render.com domains: {os.environ['ALLOWED_HOSTS']}")
    
    # Ensure CORS_ALLOWED_ORIGINS is properly formatted
    cors_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '')
    if cors_origins and not any(origin.startswith(('http://', 'https://')) for origin in cors_origins.split(',')):
        formatted_origins = []
        for origin in cors_origins.split(','):
            origin = origin.strip()
            if origin and not origin.startswith(('http://', 'https://')):
                formatted_origins.append(f"https://{origin}")
            elif origin:
                formatted_origins.append(origin)
        
        os.environ['CORS_ALLOWED_ORIGINS'] = ','.join(formatted_origins)
        print(f"Updated CORS_ALLOWED_ORIGINS with proper formatting: {os.environ['CORS_ALLOWED_ORIGINS']}")
    
    print("Environment check completed.")

if __name__ == "__main__":
    check_environment() 