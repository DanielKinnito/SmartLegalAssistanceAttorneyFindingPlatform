#!/usr/bin/env python
import os
import sys
import subprocess
import time
import urllib.parse

def run_command(command, description=None):
    """Run a command and print its output."""
    if description:
        print(f"\n{'=' * 60}")
        print(f"{description}")
        print(f"{'=' * 60}")
    
    try:
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            shell=True
        )
        
        # Print output in real-time
        for line in process.stdout:
            print(line, end='')
        
        # Wait for process to complete
        process.wait()
        
        if process.returncode != 0:
            print(f"Command failed with exit code {process.returncode}")
            return False
        return True
    except Exception as e:
        print(f"Error executing command: {e}")
        return False

def fix_database_url():
    """Fix common DATABASE_URL formatting issues."""
    database_url = os.environ.get('DATABASE_URL', '')
    if not database_url:
        print("WARNING: No DATABASE_URL found in environment.")
        return
    
    modified = False
    
    # Fix malformed DATABASE_URL that includes "DATABASE_URL=" prefix
    if database_url.startswith('DATABASE_URL='):
        print("Removing 'DATABASE_URL=' prefix from connection string")
        database_url = database_url[len('DATABASE_URL='):]
        modified = True
    
    # Fix DATABASE_URL with missing or improper scheme
    if not (database_url.startswith('postgresql://') or database_url.startswith('postgres://')):
        if '@' in database_url:
            # If it has scheme without slashes (postgresql: instead of postgresql://)
            if database_url.startswith('postgresql:') and not database_url.startswith('postgresql://'):
                print("DATABASE_URL has improper scheme format, fixing it")
                database_url = database_url.replace('postgresql:', 'postgresql://')
                modified = True
            elif database_url.startswith('postgres:') and not database_url.startswith('postgres://'):
                print("DATABASE_URL has improper scheme format, fixing it")
                database_url = database_url.replace('postgres:', 'postgres://')
                modified = True
            # If it's missing the scheme completely
            elif not database_url.startswith('postgresql:') and not database_url.startswith('postgres:'):
                print("DATABASE_URL is missing scheme, adding 'postgresql://'")
                database_url = 'postgresql://' + database_url
                modified = True
    
    # Update environment if changes were made
    if modified:
        os.environ['DATABASE_URL'] = database_url
        masked_url = database_url
        if '@' in database_url:
            prefix, suffix = database_url.split('@', 1)
            masked_url = f"***@{suffix}"
        print(f"Fixed DATABASE_URL: {masked_url}")

def main():
    print("\n" + "=" * 60)
    print("RENDER.COM DEPLOYMENT SCRIPT")
    print("=" * 60)
    
    # 1. Fix DATABASE_URL if needed
    fix_database_url()
    
    # 2. Debug DATABASE_URL format
    if os.path.exists('debug_database_url.py'):
        run_command("python debug_database_url.py", "Debugging DATABASE_URL")
    
    # 3. Run setup_render.py to set up the environment
    run_command("python setup_render.py", "Setting up Render deployment environment")
    
    # 4. Test Supabase connection
    if os.path.exists('test_supabase_connection.py'):
        run_command("python test_supabase_connection.py --transaction", "Testing Supabase Transaction Pooler connection")
    
    # 5. Run migrations
    run_command("python manage.py migrate", "Applying database migrations")
    
    # 6. Collect static files
    run_command("python manage.py collectstatic --noinput", "Collecting static files")
    
    # 7. Create superuser if needed
    if os.environ.get('ADMIN_EMAIL') and os.environ.get('ADMIN_PASSWORD'):
        print("\n" + "=" * 60)
        print("Creating admin superuser if it doesn't exist")
        print("=" * 60)
        admin_script = f"""
from django.contrib.auth import get_user_model;
User = get_user_model();
try:
    if not User.objects.filter(email='{os.environ.get('ADMIN_EMAIL')}').exists():
        User.objects.create_superuser('{os.environ.get('ADMIN_EMAIL')}', '{os.environ.get('ADMIN_PASSWORD')}')
        print('Admin user created')
    else:
        print('Admin user already exists')
except Exception as e:
    print(f'Error creating admin: {{e}}')
"""
        with open('create_admin.py', 'w') as f:
            f.write(admin_script)
        run_command("python manage.py shell < create_admin.py")
    
    # 8. Start the server with Gunicorn
    print("\n" + "=" * 60)
    print("Starting server on port 8000")
    print("=" * 60)
    os.execv('/usr/local/bin/gunicorn', ['gunicorn', 'config.wsgi:application', '--bind', '0.0.0.0:8000'])

if __name__ == "__main__":
    main() 