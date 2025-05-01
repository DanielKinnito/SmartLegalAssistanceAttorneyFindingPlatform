from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.models import UserActivity
from apps.clients.models import Client
from apps.attorneys.models import Attorney

User = get_user_model()

class UserSignalsTests(TestCase):
    """Test signal handlers for user-related events."""
    
    def test_client_profile_creation(self):
        """Test that a Client profile is created when a user with user_type=CLIENT is created."""
        user = User.objects.create_user(
            email='client@example.com',
            password='password123',
            first_name='Client',
            last_name='User',
            user_type='CLIENT'
        )
        
        # Check that a Client profile was created
        self.assertTrue(hasattr(user, 'client_profile'))
        self.assertIsInstance(user.client_profile, Client)
        
        # Check that a UserActivity record was created
        activity = UserActivity.objects.get(user=user, activity_type='USER_CREATED')
        self.assertEqual(activity.details['user_type'], 'CLIENT')
    
    def test_attorney_profile_creation(self):
        """Test that an Attorney profile is created when a user with user_type=ATTORNEY is created."""
        user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Attorney',
            last_name='User',
            user_type='ATTORNEY'
        )
        
        # Check that an Attorney profile was created
        self.assertTrue(hasattr(user, 'attorney_profile'))
        self.assertIsInstance(user.attorney_profile, Attorney)
        
        # Check that the attorney has a temporary license number
        self.assertTrue(user.attorney_profile.license_number.startswith('TEMP-'))
        
        # Check that a UserActivity record was created
        activity = UserActivity.objects.get(user=user, activity_type='USER_CREATED')
        self.assertEqual(activity.details['user_type'], 'ATTORNEY')
    
    def test_no_profile_for_admin(self):
        """Test that no profile is created for admins."""
        user = User.objects.create_user(
            email='admin@example.com',
            password='password123',
            first_name='Admin',
            last_name='User',
            user_type='ADMIN'
        )
        
        # Check that no Client or Attorney profile was created
        self.assertFalse(hasattr(user, 'client_profile'))
        self.assertFalse(hasattr(user, 'attorney_profile'))
        
        # Check that a UserActivity record was still created
        activity = UserActivity.objects.get(user=user, activity_type='USER_CREATED')
        self.assertEqual(activity.details['user_type'], 'ADMIN') 