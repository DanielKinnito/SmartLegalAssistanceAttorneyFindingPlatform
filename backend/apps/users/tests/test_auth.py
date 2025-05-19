from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import json
from ..models import User

User = get_user_model()

class TokenAuthenticationTests(TestCase):
    """Test token-based authentication."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User',
            user_type='CLIENT'
        )
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.me_url = reverse('user-me')
        self.logout_url = reverse('user-logout')
    
    def test_jwt_login_refresh_flow(self):
        """Test the complete JWT login and refresh flow."""
        # Step 1: Login with valid credentials
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': 'test@example.com',
                'password': 'testpassword123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        
        # Save tokens for later
        access_token = response.data['access']
        refresh_token = response.data['refresh']
        
        # Step 2: Use the access token to access a protected endpoint
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        
        # Step 3: Refresh the access token
        self.client.credentials()  # Clear credentials
        response = self.client.post(
            self.refresh_url,
            data=json.dumps({'refresh': refresh_token}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        
        # Step 4: Use the new access token
        new_access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access_token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_token_blacklisting_on_logout(self):
        """Test that tokens are blacklisted on logout."""
        # Step 1: Login to get tokens
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': 'test@example.com',
                'password': 'testpassword123'
            }),
            content_type='application/json'
        )
        refresh_token = response.data['refresh']
        access_token = response.data['access']
        
        # Step 2: Logout and blacklist the token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.post(
            self.logout_url,
            data=json.dumps({'refresh': refresh_token}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Step 3: Try to use the blacklisted refresh token
        self.client.credentials()  # Clear credentials
        response = self.client.post(
            self.refresh_url,
            data=json.dumps({'refresh': refresh_token}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_access_token_expiry(self):
        """Test that access token expiration is enforced."""
        # Get refresh token
        refresh = RefreshToken.for_user(self.user)
        
        # Create an expired access token
        from rest_framework_simplejwt.settings import api_settings
        from datetime import timedelta
        import time
        
        # Create a token that expires in 1 second
        refresh.access_token.set_exp(lifetime=timedelta(seconds=1))
        access_token = str(refresh.access_token)
        
        # Wait for token to expire
        time.sleep(2)
        
        # Try to use the expired token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EmailBasedLoginTests(TestCase):
    """Test email-based login functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )
        self.login_url = reverse('token_obtain_pair')
    
    def test_login_with_email(self):
        """Test that users can log in with email and password."""
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': 'test@example.com',
                'password': 'testpassword123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_login_rejects_invalid_email_format(self):
        """Test that login rejects invalid email formats."""
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': 'not-an-email',
                'password': 'testpassword123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_with_inactive_user(self):
        """Test that inactive users cannot log in."""
        # Set user to inactive
        self.user.is_active = False
        self.user.save()
        
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': 'test@example.com',
                'password': 'testpassword123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.client_registration_url = reverse('client-register')
        self.attorney_registration_url = reverse('attorney-register')
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.logout_url = reverse('logout')
        self.profile_url = reverse('user-profile')
        
        # Test data
        self.client_data = {
            'email': 'client@test.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Client',
            'phone_number': '+1234567890'
        }
        
        self.attorney_data = {
            'email': 'attorney@test.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Attorney',
            'phone_number': '+1234567890',
            'bar_number': 'BAR123456',
            'practice_areas': ['Family Law', 'Criminal Law'],
            'years_of_experience': 5,
            'bio': 'Experienced attorney specializing in family and criminal law.'
        }

    def test_client_registration(self):
        """Test client registration endpoint."""
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(self.client_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], self.client_data['email'])
        self.assertEqual(response.data['user']['user_type'], 'CLIENT')

    def test_attorney_registration(self):
        """Test attorney registration endpoint."""
        response = self.client.post(
            self.attorney_registration_url,
            data=json.dumps(self.attorney_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], self.attorney_data['email'])
        self.assertEqual(response.data['user']['user_type'], 'ATTORNEY')

    def test_login(self):
        """Test login endpoint."""
        # First register a client
        self.client.post(
            self.client_registration_url,
            data=json.dumps(self.client_data),
            content_type='application/json'
        )
        
        # Try to login
        login_data = {
            'email': self.client_data['email'],
            'password': self.client_data['password']
        }
        response = self.client.post(
            self.login_url,
            data=json.dumps(login_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_refresh(self):
        """Test token refresh endpoint."""
        # First register and get tokens
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(self.client_data),
            content_type='application/json'
        )
        refresh_token = response.data['refresh']
        
        # Try to refresh the token
        response = self.client.post(
            self.refresh_url,
            data={'refresh': refresh_token},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_logout(self):
        """Test logout endpoint."""
        # First register and get tokens
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(self.client_data),
            content_type='application/json'
        )
        refresh_token = response.data['refresh']
        
        # Try to logout
        response = self.client.post(
            self.logout_url,
            data={'refresh': refresh_token},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Try to refresh the token after logout
        response = self.client.post(
            self.refresh_url,
            data={'refresh': refresh_token},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_profile(self):
        """Test get profile endpoint."""
        # First register and get tokens
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(self.client_data),
            content_type='application/json'
        )
        access_token = response.data['access']
        
        # Set the authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        # Try to get profile
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.client_data['email'])
        self.assertEqual(response.data['user_type'], 'CLIENT')

    def test_invalid_registration(self):
        """Test registration with invalid data."""
        # Test with missing required fields
        invalid_data = self.client_data.copy()
        del invalid_data['email']
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with mismatched passwords
        invalid_data = self.client_data.copy()
        invalid_data['confirm_password'] = 'differentpass'
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with invalid phone number
        invalid_data = self.client_data.copy()
        invalid_data['phone_number'] = 'invalid'
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 