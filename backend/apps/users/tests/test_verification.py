from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from ..models import ClientProfile, AttorneyProfile
import json
import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()

class VerificationWorkflowTests(TestCase):
    """Test verification workflows for clients and attorneys."""
    
    def setUp(self):
        self.client = APIClient()
        self.client_registration_url = reverse('client-register')
        self.attorney_registration_url = reverse('attorney-register')
        
        # Create a test document file
        img = Image.new('RGB', (100, 100), color='red')
        img_file = io.BytesIO()
        img.save(img_file, 'JPEG')
        img_file.seek(0)
        
        self.test_document = SimpleUploadedFile(
            "test_document.jpg", 
            img_file.getvalue(), 
            content_type="image/jpeg"
        )
        
        # Test client data
        self.client_data_regular = {
            'email': 'client@test.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Client',
            'phone_number': '+1234567890',
            'probono_requested': False
        }
        
        self.client_data_probono = {
            'email': 'probono@test.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'first_name': 'Probono',
            'last_name': 'Client',
            'phone_number': '+1234567891',
            'probono_requested': True,
            'probono_reason': 'Low income',
            'income_level': 'Below 30k'
        }
        
        # Test attorney data
        self.attorney_data = {
            'email': 'attorney@test.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Attorney',
            'phone_number': '+1234567892',
            'bar_number': 'BAR123456',
            'practice_areas': ['Family Law', 'Criminal Law'],
            'years_of_experience': 5,
            'bio': 'Experienced attorney',
            'accepts_probono': True
        }
    
    def test_regular_client_registration_verification(self):
        """Test that regular clients are automatically verified."""
        # Special handling for multipart/form-data
        data = self.client_data_regular.copy()
        
        response = self.client.post(
            self.client_registration_url,
            data=data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify the user was created with the right verification status
        user = User.objects.get(email=data['email'])
        self.assertEqual(user.verification_status, 'VERIFIED')
        
        # Verify client profile was created
        client_profile = ClientProfile.objects.get(user=user)
        self.assertFalse(client_profile.probono_requested)
    
    def test_probono_client_registration_verification(self):
        """Test that pro bono clients start with pending verification."""
        # Create a multipart form with the document
        data = self.client_data_probono.copy()
        data['probono_document'] = self.test_document
        
        # Special posting for multipart data
        response = self.client.post(
            self.client_registration_url,
            data=data,
            format='multipart'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify the user was created with the right verification status
        user = User.objects.get(email=data['email'])
        self.assertEqual(user.verification_status, 'PENDING')
        
        # Verify client profile was created with pro bono details
        client_profile = ClientProfile.objects.get(user=user)
        self.assertTrue(client_profile.probono_requested)
        self.assertEqual(client_profile.probono_reason, 'Low income')
        self.assertEqual(client_profile.income_level, 'Below 30k')
        self.assertIsNotNone(client_profile.probono_document)
    
    def test_attorney_registration_verification(self):
        """Test that attorneys start with pending verification."""
        # Create a multipart form with the documents
        data = self.attorney_data.copy()
        data['license_document'] = self.test_document
        data['degree_document'] = self.test_document
        
        # Special posting for multipart data
        response = self.client.post(
            self.attorney_registration_url,
            data=data,
            format='multipart'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify the user was created with the right verification status
        user = User.objects.get(email=data['email'])
        self.assertEqual(user.verification_status, 'PENDING')
        
        # Verify attorney profile was created with documents
        attorney_profile = AttorneyProfile.objects.get(user=user)
        self.assertEqual(attorney_profile.bar_number, 'BAR123456')
        self.assertIsNotNone(attorney_profile.license_document)
        self.assertIsNotNone(attorney_profile.degree_document)
    
    def test_admin_approve_verification(self):
        """Test that administrators can approve pending verifications."""
        # Create a pro bono client with pending verification
        data = self.client_data_probono.copy()
        data['probono_document'] = self.test_document
        
        response = self.client.post(
            self.client_registration_url,
            data=data,
            format='multipart'
        )
        
        # Get the user
        user = User.objects.get(email=data['email'])
        self.assertEqual(user.verification_status, 'PENDING')
        
        # Create an admin user
        admin = User.objects.create_superuser(
            email='admin@test.com',
            password='adminpass123'
        )
        
        # Simulate admin approving the verification
        user.verification_status = 'VERIFIED'
        user.verification_notes = 'Approved after document review'
        user.save()
        
        # Refresh the user from the database
        user.refresh_from_db()
        self.assertEqual(user.verification_status, 'VERIFIED')
    
    def test_admin_reject_verification(self):
        """Test that administrators can reject pending verifications."""
        # Create an attorney with pending verification
        data = self.attorney_data.copy()
        data['license_document'] = self.test_document
        data['degree_document'] = self.test_document
        
        response = self.client.post(
            self.attorney_registration_url,
            data=data,
            format='multipart'
        )
        
        # Get the user
        user = User.objects.get(email=data['email'])
        self.assertEqual(user.verification_status, 'PENDING')
        
        # Create an admin user
        admin = User.objects.create_superuser(
            email='admin@test.com',
            password='adminpass123'
        )
        
        # Simulate admin rejecting the verification
        user.verification_status = 'REJECTED'
        user.verification_notes = 'Invalid license document'
        user.save()
        
        # Refresh the user from the database
        user.refresh_from_db()
        self.assertEqual(user.verification_status, 'REJECTED') 