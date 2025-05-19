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

def configure_for_existing_schema():
    """Configure Django to work with existing database schema."""
    print("\nConfiguring for existing database schema...")
    
    # Generate migrations_config.py
    with open('migrations_config.py', 'w') as f:
        f.write("""# Auto-generated file to skip migrations for tables that already exist
MIGRATION_MODULES = {
    'auth': 'fake_migrations',
    'admin': 'fake_migrations',
    'contenttypes': 'fake_migrations',
    'sessions': 'fake_migrations',
    'users': 'fake_migrations',
    'attorneys': 'fake_migrations',
    'clients': 'fake_migrations',
    'document_generation': 'fake_migrations',
    'chatbot': 'fake_migrations',
    'social_django': 'fake_migrations',
    'token_blacklist': 'fake_migrations',
    'oauth2_provider': 'fake_migrations'
}
""")

    # Create fake_migrations directory
    os.makedirs('fake_migrations', exist_ok=True)
    # Create __init__.py in fake_migrations
    with open('fake_migrations/__init__.py', 'w') as f:
        pass

    # Update settings.py to use migration_modules
    settings_fix = """
# Import migration modules config
try:
    from migrations_config import MIGRATION_MODULES
except ImportError:
    print("No migrations_config.py found, running with normal migrations")
"""
    
    # Create patch file
    with open('add_migrations_config.py', 'w') as f:
        f.write("""
import os

# Path to your settings file
settings_file = 'config/settings.py'

# Read the current settings
with open(settings_file, 'r') as f:
    content = f.read()

# Check if MIGRATION_MODULES import is already there
if 'from migrations_config import MIGRATION_MODULES' not in content:
    # Add the import after the last import statement
    import_section = "# Import migration modules config\\ntry:\\n    from migrations_config import MIGRATION_MODULES\\nexcept ImportError:\\n    print(\\"No migrations_config.py found, running with normal migrations\\")\\n"
    
    # Find a good position to insert (after imports but before variables)
    if 'BASE_DIR' in content:
        pos = content.find('BASE_DIR')
        content = content[:pos] + import_section + "\\n" + content[pos:]
    else:
        # Fall back to inserting after the last import
        last_import = max(content.rfind('import '), content.rfind('from '))
        if last_import != -1:
            insert_pos = content.find('\\n', last_import) + 1
            content = content[:insert_pos] + "\\n" + import_section + content[insert_pos:]
    
    # Write the modified content back
    with open(settings_file, 'w') as f:
        f.write(content)
    
    print("Added MIGRATION_MODULES import to settings.py")
else:
    print("MIGRATION_MODULES import already exists in settings.py")
""")
    
    # Apply the patch
    run_command("python add_migrations_config.py", "Adding migration config to settings.py")

def fix_swagger_issues():
    """Add scripts to fix Swagger documentation issues."""
    print("\nFix script for swagger documentation issues...")
    with open('fix_swagger.py', 'w') as f:
        f.write("""
from django.conf import settings

# Monkey patch drf-yasg to ignore duplicate serializer names
def patch_get_serializer_class():
    from drf_yasg.inspectors.field import get_serializer_class
    
    original_get_serializer_class = get_serializer_class
    
    def patched_get_serializer_class(field):
        try:
            return original_get_serializer_class(field)
        except Exception:
            # Fall back to a less strict check
            return field.serializer_class
    
    # Replace the original function
    from drf_yasg.inspectors import field
    field.get_serializer_class = patched_get_serializer_class
    
    print("Monkey patched drf-yasg to handle serializer name conflicts")

# Apply the patch if drf-yasg is installed
try:
    import drf_yasg
    patch_get_serializer_class()
except ImportError:
    print("drf-yasg not installed, skipping swagger patch")
""")

def main():
    print("\n" + "=" * 60)
    print("IMPROVED RENDER.COM DEPLOYMENT SCRIPT")
    print("=" * 60)
    
    # 1. Fix DATABASE_URL if needed
    fix_database_url()
    
    # 2. Debug DATABASE_URL format
    if os.path.exists('debug_database_url.py'):
        run_command("python debug_database_url.py", "Debugging DATABASE_URL")
    
    # 3. Configure for existing schema
    configure_for_existing_schema()
    
    # 4. Fix swagger issues
    fix_swagger_issues()
    
    # 5. Run setup_render.py to set up the environment
    run_command("python setup_render.py", "Setting up Render deployment environment")
    
    # 6. Test Supabase connection
    if os.path.exists('test_supabase_connection.py'):
        run_command("python test_supabase_connection.py --transaction", "Testing Supabase Transaction Pooler connection")
    
    # 7. Apply migrations (will skip tables that already exist)
    run_command("python manage.py migrate", "Applying migrations (skipping existing tables)")
    
    # 8. Collect static files
    run_command("python manage.py collectstatic --noinput", "Collecting static files")
    
    # 9. Create superuser if needed
    if os.environ.get('ADMIN_EMAIL') and os.environ.get('ADMIN_PASSWORD'):
        print("\n" + "=" * 60)
        print("Creating admin superuser if it doesn't exist")
        print("=" * 60)
        admin_script = f"""
import sys
from django.contrib.auth import get_user_model;
User = get_user_model();
try:
    if not User.objects.filter(email='{os.environ.get('ADMIN_EMAIL')}').exists():
        # First try with older API
        try:
            User.objects.create_superuser('{os.environ.get('ADMIN_EMAIL')}', '{os.environ.get('ADMIN_PASSWORD')}')
            print('Admin user created (using older API)')
        except TypeError:
            # If that fails, try with newer API that might require additional fields
            User.objects.create_superuser(
                email='{os.environ.get('ADMIN_EMAIL')}', 
                password='{os.environ.get('ADMIN_PASSWORD')}',
                user_type='ADMIN'
            )
            print('Admin user created (using newer API)')
        sys.exit(0)
    else:
        print('Admin user already exists')
        sys.exit(0)
except Exception as e:
    print(f'Error creating admin: {{e}}')
    sys.exit(1)
"""
        with open('create_admin.py', 'w') as f:
            f.write(admin_script)
        run_command("python manage.py shell < create_admin.py", "Creating admin user")
    
    # 10. Start the server with Gunicorn
    print("\n" + "=" * 60)
    print("Starting server on port 8000")
    print("=" * 60)
    os.execv('/usr/local/bin/gunicorn', ['gunicorn', 'config.wsgi:application', '--bind', '0.0.0.0:8000'])

if __name__ == "__main__":
    main() 