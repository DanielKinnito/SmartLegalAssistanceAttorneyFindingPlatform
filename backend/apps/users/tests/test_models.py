from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.models import UserActivity

User = get_user_model()

class UserModelTests(TestCase):
    """Test cases for the User model."""
    
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpassword123',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'CLIENT'
        }
        self.user = User.objects.create_user(**self.user_data)
    
    def test_create_user(self):
        """Test creating a regular user."""
        self.assertEqual(self.user.email, self.user_data['email'])
        self.assertEqual(self.user.first_name, self.user_data['first_name'])
        self.assertEqual(self.user.last_name, self.user_data['last_name'])
        self.assertEqual(self.user.user_type, self.user_data['user_type'])
        self.assertTrue(self.user.check_password(self.user_data['password']))
        self.assertTrue(self.user.is_active)
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)
    
    def test_create_superuser(self):
        """Test creating a superuser."""
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpassword123'
        )
        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertEqual(admin_user.user_type, 'ADMIN')
    
    def test_user_str_method(self):
        """Test the string representation of the User model."""
        self.assertEqual(str(self.user), self.user_data['email'])


class UserActivityModelTests(TestCase):
    """Test cases for the UserActivity model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )
        self.activity = UserActivity.objects.create(
            user=self.user,
            activity_type='LOGIN',
            ip_address='127.0.0.1',
            user_agent='Mozilla/5.0'
        )
    
    def test_user_activity_creation(self):
        """Test creating a user activity record."""
        self.assertEqual(self.activity.user, self.user)
        self.assertEqual(self.activity.activity_type, 'LOGIN')
        self.assertEqual(self.activity.ip_address, '127.0.0.1')
        self.assertEqual(self.activity.user_agent, 'Mozilla/5.0')
    
    def test_user_activity_str_method(self):
        """Test the string representation of the UserActivity model."""
        expected_str = f"{self.user.email} - LOGIN - {self.activity.timestamp}"
        self.assertEqual(str(self.activity), expected_str) 