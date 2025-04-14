from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
import json
from oauth2_provider.models import Application

User = get_user_model()

class GoogleOAuthTests(TestCase):
    """Test Google OAuth authentication."""
    
    def setUp(self):
        self.client = APIClient()
        self.google_login_url = '/auth/login/google/'
        self.google_callback_url = '/auth/complete/google/'
        
        # Create OAuth application
        self.application = Application.objects.create(
            name='Test Application',
            client_type=Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=Application.GRANT_AUTHORIZATION_CODE,
            redirect_uris='http://localhost:3000/oauth/callback/google',
            client_id='test-client-id',
            client_secret='test-client-secret',
            skip_authorization=True
        )
    
    @patch('social_core.backends.google.GoogleOAuth2.do_auth')
    def test_google_oauth_flow(self, mock_do_auth):
        """Test the complete Google OAuth flow."""
        # Mock the Google OAuth response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'id': '12345',
            'email': 'test@gmail.com',
            'verified_email': True,
            'name': 'Test User',
            'given_name': 'Test',
            'family_name': 'User',
            'picture': 'https://example.com/photo.jpg'
        }
        
        # Mock the do_auth method to return a user
        user = User.objects.create(
            email='test@gmail.com',
            first_name='Test',
            last_name='User',
            user_type='CLIENT'
        )
        mock_do_auth.return_value = user
        
        # Step 1: Start OAuth flow
        response = self.client.get(self.google_login_url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        
        # Step 2: Handle callback with authorization code
        response = self.client.get(
            f"{self.google_callback_url}?code=test-auth-code&state=test-state"
        )
        
        # Verify the user is authenticated
        self.assertTrue(User.objects.filter(email='test@gmail.com').exists())
        
        # Verify activity is logged
        self.assertEqual(user.activities.filter(activity_type='LOGIN').count(), 1)
    
    @patch('social_core.backends.google.GoogleOAuth2.do_auth')
    def test_google_oauth_new_user_creation(self, mock_do_auth):
        """Test that a new user is created during Google OAuth if they don't exist yet."""
        # Mock the Google OAuth response for a new user
        email = 'new_user@gmail.com'
        
        # Configure mock to create a new user
        def side_effect(*args, **kwargs):
            user = User.objects.create(
                email=email,
                first_name='New',
                last_name='User',
                user_type='CLIENT'
            )
            return user
            
        mock_do_auth.side_effect = side_effect
        
        # Verify user doesn't exist yet
        self.assertFalse(User.objects.filter(email=email).exists())
        
        # Start OAuth flow and callback
        self.client.get(self.google_login_url)
        response = self.client.get(
            f"{self.google_callback_url}?code=new-user-code&state=test-state"
        )
        
        # Verify new user was created
        self.assertTrue(User.objects.filter(email=email).exists())
        user = User.objects.get(email=email)
        self.assertEqual(user.first_name, 'New')
        self.assertEqual(user.last_name, 'User')
        self.assertEqual(user.user_type, 'CLIENT')
        
        # Verify registration activity is logged
        self.assertEqual(user.activities.filter(activity_type='REGISTRATION').count(), 1)
    
    @patch('social_core.backends.google.GoogleOAuth2.do_auth')
    def test_google_oauth_error_handling(self, mock_do_auth):
        """Test error handling during Google OAuth."""
        # Mock an authentication error
        mock_do_auth.side_effect = Exception("Authentication failed")
        
        # Start OAuth flow
        self.client.get(self.google_login_url)
        
        # Handle callback with error
        response = self.client.get(
            f"{self.google_callback_url}?error=access_denied"
        )
        
        # Verify the error is handled
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        

class GitHubOAuthTests(TestCase):
    """Test GitHub OAuth authentication."""
    
    def setUp(self):
        self.client = APIClient()
        self.github_login_url = '/auth/login/github/'
        self.github_callback_url = '/auth/complete/github/'
        
        # Create OAuth application
        self.application = Application.objects.create(
            name='GitHub Test Application',
            client_type=Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=Application.GRANT_AUTHORIZATION_CODE,
            redirect_uris='http://localhost:3000/oauth/callback/github',
            client_id='github-client-id',
            client_secret='github-client-secret',
            skip_authorization=True
        )
    
    @patch('social_core.backends.github.GithubOAuth2.do_auth')
    def test_github_oauth_flow(self, mock_do_auth):
        """Test the complete GitHub OAuth flow."""
        # Mock the GitHub OAuth response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'id': '54321',
            'login': 'testuser',
            'name': 'Test User',
            'email': 'test@github.com',
            'avatar_url': 'https://example.com/avatar.jpg'
        }
        
        # Mock the do_auth method to return a user
        user = User.objects.create(
            email='test@github.com',
            first_name='Test',
            last_name='User',
            user_type='CLIENT'
        )
        mock_do_auth.return_value = user
        
        # Step 1: Start OAuth flow
        response = self.client.get(self.github_login_url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        
        # Step 2: Handle callback with authorization code
        response = self.client.get(
            f"{self.github_callback_url}?code=github-test-code&state=test-state"
        )
        
        # Verify the user is authenticated
        self.assertTrue(User.objects.filter(email='test@github.com').exists())
        
        # Verify activity is logged
        self.assertEqual(user.activities.filter(activity_type='LOGIN').count(), 1)
    
    @patch('social_core.backends.github.GithubOAuth2.do_auth')
    def test_github_oauth_user_with_empty_email(self, mock_do_auth):
        """Test GitHub OAuth when user has no public email."""
        # Some GitHub users have private emails
        github_id = 'github_54321'
        
        # Configure mock to create a new user with GitHub ID as email prefix
        def side_effect(*args, **kwargs):
            email = f"{github_id}@github.noreply.com"
            user = User.objects.create(
                email=email,
                first_name='GitHub',
                last_name='User',
                user_type='CLIENT'
            )
            return user
            
        mock_do_auth.side_effect = side_effect
        
        # Start OAuth flow and callback
        self.client.get(self.github_login_url)
        response = self.client.get(
            f"{self.github_callback_url}?code=github-no-email-code&state=test-state"
        )
        
        # Verify new user was created with placeholder email
        expected_email = f"{github_id}@github.noreply.com"
        self.assertTrue(User.objects.filter(email__contains="github.noreply.com").exists())
        
class OAuthIntegrationTests(TestCase):
    """Test general OAuth integration."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User',
            user_type='CLIENT'
        )
        
    @patch('oauth2_provider.views.TokenView.post')
    def test_token_exchange(self, mock_token_view):
        """Test exchanging OAuth authorization code for tokens."""
        # Mock the token response
        mock_token_view.return_value = MagicMock(
            status_code=200,
            content=json.dumps({
                'access_token': 'mock-access-token',
                'token_type': 'Bearer',
                'expires_in': 3600,
                'refresh_token': 'mock-refresh-token'
            }).encode()
        )
        
        # Exchange code for token
        response = self.client.post(
            reverse('oauth2_provider:token'),
            {
                'grant_type': 'authorization_code',
                'code': 'test-auth-code',
                'redirect_uri': 'http://localhost:3000/oauth/callback',
                'client_id': 'test-client-id',
                'client_secret': 'test-client-secret'
            }
        )
        
        # Verify token response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.json())
        self.assertIn('refresh_token', response.json())
    
    def test_protected_resource_access_with_oauth(self):
        """Test accessing protected resources with OAuth token."""
        # Create an OAuth application
        application = Application.objects.create(
            name='Test Application',
            client_type=Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=Application.GRANT_AUTHORIZATION_CODE,
            redirect_uris='http://localhost:3000/oauth/callback',
            user=self.user,
            client_id='test-client-id',
            client_secret='test-client-secret',
            skip_authorization=True
        )
        
        # Create an access token
        from oauth2_provider.models import AccessToken
        from django.utils import timezone
        from datetime import timedelta
        
        access_token = AccessToken.objects.create(
            user=self.user,
            application=application,
            token='test-access-token',
            expires=timezone.now() + timedelta(hours=1),
            scope='read write'
        )
        
        # Access protected resource with OAuth token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token.token}')
        response = self.client.get(reverse('user-me'))
        
        # Verify resource access
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email) 