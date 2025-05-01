from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import json

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