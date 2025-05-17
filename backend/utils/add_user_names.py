import os
import sys
import django

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from apps.users.models import User

def update_user_names():
    print("Updating user names...")
    
    # Update names for existing users
    users_updated = 0
    
    # Admin user
    try:
        admin = User.objects.get(email='admin@legalassistance.com')
        if not admin.first_name and not admin.last_name:
            admin.first_name = "Admin"
            admin.last_name = "User"
            admin.save()
            users_updated += 1
            print(f"Updated names for {admin.email}")
    except User.DoesNotExist:
        print("Admin user not found")
    
    # Client user
    try:
        client = User.objects.get(email='clientOne@gmail.com')
        if not client.first_name and not client.last_name:
            client.first_name = "Client"
            client.last_name = "One"
            client.save()
            users_updated += 1
            print(f"Updated names for {client.email}")
    except User.DoesNotExist:
        print("Client user not found")
    
    # Attorney user
    try:
        attorney = User.objects.get(email='attorneyOne@gmail.com')
        if not attorney.first_name and not attorney.last_name:
            attorney.first_name = "Attorney"
            attorney.last_name = "One"
            attorney.save()
            users_updated += 1
            print(f"Updated names for {attorney.email}")
    except User.DoesNotExist:
        print("Attorney user not found")
    
    print(f"Updated names for {users_updated} users")

if __name__ == "__main__":
    update_user_names() 