import os
import sys
import django

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from apps.users.models import User, ClientProfile, AttorneyProfile

def check_profiles():
    # Count users by type
    total_users = User.objects.count()
    client_users = User.objects.filter(user_type='CLIENT').count()
    attorney_users = User.objects.filter(user_type='ATTORNEY').count()
    admin_users = User.objects.filter(user_type='ADMIN').count()
    
    # Count profiles
    client_profiles = ClientProfile.objects.count()
    attorney_profiles = AttorneyProfile.objects.count()
    
    print(f"Total users: {total_users}")
    print(f"Clients: {client_users}")
    print(f"Attorneys: {attorney_users}")
    print(f"Admins: {admin_users}")
    print(f"Client profiles: {client_profiles}")
    print(f"Attorney profiles: {attorney_profiles}")
    
    # Check for mismatches
    print("\nChecking for issues...")
    
    if client_users > client_profiles:
        print(f"WARNING: {client_users - client_profiles} clients don't have profiles!")
        for user in User.objects.filter(user_type='CLIENT'):
            try:
                profile = user.client_profile
                print(f"Client {user.email} has profile: {profile.id}")
            except ClientProfile.DoesNotExist:
                print(f"Client {user.email} is missing profile")
    
    if attorney_users > attorney_profiles:
        print(f"WARNING: {attorney_users - attorney_profiles} attorneys don't have profiles!")
        for user in User.objects.filter(user_type='ATTORNEY'):
            try:
                profile = user.attorney_profile
                print(f"Attorney {user.email} has profile: {profile.id}")
            except AttorneyProfile.DoesNotExist:
                print(f"Attorney {user.email} is missing profile")

if __name__ == "__main__":
    check_profiles() 