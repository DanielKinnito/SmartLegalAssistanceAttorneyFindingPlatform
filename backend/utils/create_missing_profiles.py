import os
import sys
import django
from django.core.files.base import ContentFile

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from apps.users.models import User, ClientProfile, AttorneyProfile

def create_missing_profiles():
    print("Creating missing profiles...")
    
    # Create missing client profiles
    for user in User.objects.filter(user_type='CLIENT'):
        try:
            # Check if profile exists
            profile = user.client_profile
            print(f"Client {user.email} already has profile: {profile.id}")
        except ClientProfile.DoesNotExist:
            # Create a profile if it doesn't exist
            profile = ClientProfile.objects.create(
                user=user,
                probono_requested=False,
                probono_reason='',
                income_level=''
            )
            print(f"Created profile for client {user.email}")
    
    # Create missing attorney profiles
    for user in User.objects.filter(user_type='ATTORNEY'):
        try:
            # Check if profile exists
            profile = user.attorney_profile
            print(f"Attorney {user.email} already has profile: {profile.id}")
        except AttorneyProfile.DoesNotExist:
            # Create empty placeholder files for required document fields
            placeholder_content = b"Placeholder document"
            
            # Create a profile if it doesn't exist
            profile = AttorneyProfile(
                user=user,
                bar_number='PLACEHOLDER',  # Use placeholder data
                practice_areas=['General'],
                years_of_experience=0,
                bio='Profile created automatically to fix missing profile',
                accepts_probono=False
            )
            
            # Add placeholder files (these are required fields)
            profile.license_document.save('placeholder_license.txt', ContentFile(placeholder_content), save=False)
            profile.degree_document.save('placeholder_degree.txt', ContentFile(placeholder_content), save=False)
            
            # Save the profile
            profile.save()
            
            print(f"Created profile for attorney {user.email}")
    
    print("Profile creation complete!")

if __name__ == "__main__":
    create_missing_profiles() 