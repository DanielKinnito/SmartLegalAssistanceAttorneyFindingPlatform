from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from ..models import EmailVerificationToken
import json
from django.core import mail

User = get_user_model()

class EmailVerificationTests(TestCase):
    """Test email verification functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.client_registration_url = reverse('client-register')
        self.verify_email_url = reverse('verify-email')
        self.resend_verification_url = reverse('resend-verification')
        
        # Test user data
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpassword123',
            'confirm_password': 'testpassword123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+1234567890'
        }
    
    def test_user_created_with_unverified_email(self):
        """Test that new users are created with unverified email."""
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that the user was created with unverified email
        user = User.objects.get(email=self.user_data['email'])
        self.assertFalse(user.email_verified)
    
    def test_verification_email_sent_on_registration(self):
        """Test that a verification email is sent when a user registers."""
        # Clear the email outbox
        mail.outbox = []
        
        response = self.client.post(
            self.client_registration_url,
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that one email was sent
        self.assertEqual(len(mail.outbox), 1)
        
        # Check email subject and recipient
        email = mail.outbox[0]
        self.assertEqual(email.subject, "Verify Your Email - Smart Legal Assistance Platform")
        self.assertEqual(email.to, [self.user_data['email']])
    
    def test_email_verification_with_valid_token(self):
        """Test email verification with a valid token."""
        # First register a user
        self.client.post(
            self.client_registration_url,
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        
        # Get the token from the database
        user = User.objects.get(email=self.user_data['email'])
        token = EmailVerificationToken.objects.filter(user=user).first()
        
        # Verify the email with the token
        response = self.client.post(
            self.verify_email_url,
            data=json.dumps({'token': token.token}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Check that the user's email is now verified
        user.refresh_from_db()
        self.assertTrue(user.email_verified)
        
        # Check that the token is now used
        token.refresh_from_db()
        self.assertTrue(token.is_used)
    
    def test_email_verification_with_invalid_token(self):
        """Test email verification with an invalid token."""
        response = self.client.post(
            self.verify_email_url,
            data=json.dumps({'token': 'invalid-token'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_resend_verification_email(self):
        """Test resending verification email."""
        # First register a user
        self.client.post(
            self.client_registration_url,
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        
        # Clear the email outbox
        mail.outbox = []
        
        # Resend verification email
        response = self.client.post(
            self.resend_verification_url,
            data=json.dumps({'email': self.user_data['email']}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Check that one email was sent
        self.assertEqual(len(mail.outbox), 1)
        
        # Check email subject and recipient
        email = mail.outbox[0]
        self.assertEqual(email.subject, "Verify Your Email - Smart Legal Assistance Platform")
        self.assertEqual(email.to, [self.user_data['email']])
    
    def test_resend_verification_for_verified_email(self):
        """Test resending verification for an already verified email."""
        # First register a user
        self.client.post(
            self.client_registration_url,
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        
        # Verify the user's email
        user = User.objects.get(email=self.user_data['email'])
        user.email_verified = True
        user.save()
        
        # Clear the email outbox
        mail.outbox = []
        
        # Try to resend verification email
        response = self.client.post(
            self.resend_verification_url,
            data=json.dumps({'email': self.user_data['email']}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        
        # Check that no email was sent
        self.assertEqual(len(mail.outbox), 0) 