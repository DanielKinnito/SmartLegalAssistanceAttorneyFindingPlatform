from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.serializers import UserRegistrationSerializer, UserSerializer
from apps.users.models import UserActivity

User = get_user_model()

class UserRegistrationSerializerTests(TestCase):
    """Test cases for the UserRegistrationSerializer."""
    
    def setUp(self):
        self.valid_data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpassword123',
            'password_confirm': 'testpassword123',
            'user_type': 'CLIENT',
            'phone_number': '+251912345678'
        }
        self.invalid_data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpassword123',
            'password_confirm': 'differentpassword',
            'user_type': 'CLIENT'
        }
    
    def test_valid_registration_data(self):
        """Test that the serializer accepts valid registration data."""
        serializer = UserRegistrationSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
    
    def test_invalid_password_confirm(self):
        """Test that the serializer rejects non-matching password confirmation."""
        serializer = UserRegistrationSerializer(data=self.invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
    
    def test_missing_required_fields(self):
        """Test that the serializer rejects data with missing required fields."""
        # Remove required fields one by one and test
        required_fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm']
        
        for field in required_fields:
            invalid_data = self.valid_data.copy()
            invalid_data.pop(field)
            serializer = UserRegistrationSerializer(data=invalid_data)
            self.assertFalse(serializer.is_valid())
            self.assertIn(field, serializer.errors)
    
    def test_create_user(self):
        """Test that the serializer creates a user correctly."""
        serializer = UserRegistrationSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        
        self.assertEqual(user.email, self.valid_data['email'])
        self.assertEqual(user.first_name, self.valid_data['first_name'])
        self.assertEqual(user.last_name, self.valid_data['last_name'])
        self.assertEqual(user.user_type, self.valid_data['user_type'])
        self.assertEqual(user.phone_number, self.valid_data['phone_number'])
        self.assertTrue(user.check_password(self.valid_data['password']))


class UserSerializerTests(TestCase):
    """Test cases for the UserSerializer."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User',
            user_type='CLIENT',
            phone_number='+251912345678'
        )
    
    def test_user_serialization(self):
        """Test that the serializer correctly serializes user data."""
        serializer = UserSerializer(self.user)
        data = serializer.data
        
        self.assertEqual(data['email'], self.user.email)
        self.assertEqual(data['first_name'], self.user.first_name)
        self.assertEqual(data['last_name'], self.user.last_name)
        self.assertEqual(data['user_type'], self.user.user_type)
        self.assertEqual(data['phone_number'], self.user.phone_number)
        self.assertNotIn('password', data)  # Password should not be serialized
    
    def test_update_user(self):
        """Test that the serializer updates a user correctly."""
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone_number': '+251987654321'
        }
        
        serializer = UserSerializer(self.user, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        
        self.assertEqual(updated_user.first_name, update_data['first_name'])
        self.assertEqual(updated_user.last_name, update_data['last_name'])
        self.assertEqual(updated_user.phone_number, update_data['phone_number'])
        self.assertEqual(updated_user.email, self.user.email)  # Email should not change 