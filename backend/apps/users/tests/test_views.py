from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.users.models import UserActivity
import json

User = get_user_model()

class UserRegistrationViewTests(TestCase):
    """Test cases for user registration API views."""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user-list')
        self.valid_payload = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpassword123',
            'password_confirm': 'testpassword123',
            'user_type': 'CLIENT',
            'phone_number': '+251912345678'
        }
    
    def test_valid_registration(self):
        """Test valid user registration."""
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)
        
        # Check that the user was created in the database
        self.assertTrue(User.objects.filter(email=self.valid_payload['email']).exists())
    
    def test_invalid_registration_missing_fields(self):
        """Test registration with missing required fields."""
        invalid_payload = self.valid_payload.copy()
        invalid_payload.pop('email')
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_invalid_registration_password_mismatch(self):
        """Test registration with mismatched passwords."""
        invalid_payload = self.valid_payload.copy()
        invalid_payload['password_confirm'] = 'differentpassword'
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_duplicate_email_registration(self):
        """Test registration with an email that already exists."""
        # Create a user with the same email
        User.objects.create_user(
            email=self.valid_payload['email'],
            password='password123',
            first_name='Existing',
            last_name='User'
        )
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


class UserLoginTests(TestCase):
    """Test cases for user login API views."""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('token_obtain_pair')
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User',
            user_type='CLIENT'
        )
    
    def test_valid_login(self):
        """Test valid user login."""
        payload = {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        
        response = self.client.post(
            self.login_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_invalid_login_wrong_password(self):
        """Test login with wrong password."""
        payload = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(
            self.login_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_invalid_login_user_not_found(self):
        """Test login with non-existent user."""
        payload = {
            'email': 'nonexistent@example.com',
            'password': 'testpassword123'
        }
        
        response = self.client.post(
            self.login_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserProfileTests(TestCase):
    """Test cases for user profile API views."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User',
            user_type='CLIENT',
            phone_number='+251912345678'
        )
        self.me_url = reverse('user-me')
        self.user_detail_url = reverse('user-detail', kwargs={'pk': self.user.id})
    
    def test_get_own_profile_authenticated(self):
        """Test authenticated user can get their own profile."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        self.assertEqual(response.data['last_name'], self.user.last_name)
    
    def test_get_own_profile_unauthenticated(self):
        """Test unauthenticated user cannot get profile."""
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_own_profile(self):
        """Test user can update their own profile."""
        self.client.force_authenticate(user=self.user)
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone_number': '+251987654321'
        }
        
        response = self.client.patch(
            self.user_detail_url,
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, update_data['first_name'])
        self.assertEqual(self.user.last_name, update_data['last_name'])
        self.assertEqual(self.user.phone_number, update_data['phone_number'])
    
    def test_change_password(self):
        """Test user can change their password."""
        self.client.force_authenticate(user=self.user)
        change_password_url = reverse('user-change-password')
        
        password_data = {
            'old_password': 'testpassword123',
            'new_password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        
        response = self.client.post(
            change_password_url,
            data=json.dumps(password_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(password_data['new_password']))
        
        # Check that a UserActivity record was created
        self.assertTrue(UserActivity.objects.filter(
            user=self.user,
            activity_type='PASSWORD_CHANGE'
        ).exists())
    
    def test_toggle_mfa(self):
        """Test user can toggle multi-factor authentication."""
        self.client.force_authenticate(user=self.user)
        toggle_mfa_url = reverse('user-toggle-mfa')
        
        # Initially MFA should be disabled
        self.assertFalse(self.user.mfa_enabled)
        
        # Enable MFA
        response = self.client.post(toggle_mfa_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.mfa_enabled)
        
        # Disable MFA
        response = self.client.post(toggle_mfa_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertFalse(self.user.mfa_enabled) 