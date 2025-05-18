from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from apps.users.models import User
from .models import Client, LegalRequest, ClientAttorneyReview
from apps.attorneys.models import Attorney
import uuid


class ClientModelTestCase(TestCase):
    """Test case for the Client model."""
    
    def setUp(self):
        # Create a user for the client
        self.user = User.objects.create_user(
            email='client@example.com',
            password='password123',
            first_name='John',
            last_name='Doe',
            user_type='CLIENT'
        )
        
        # Create a client
        self.client_obj = Client.objects.create(
            user=self.user,
            address='123 Main St',
            preferred_language='English'
        )
    
    def test_client_creation(self):
        """Test client model instance creation."""
        self.assertEqual(self.client_obj.user.email, 'client@example.com')
        self.assertEqual(self.client_obj.address, '123 Main St')
        self.assertEqual(self.client_obj.preferred_language, 'English')
        self.assertEqual(str(self.client_obj), 'John Doe (client@example.com)')


class LegalRequestModelTestCase(TestCase):
    """Test case for the LegalRequest model."""
    
    def setUp(self):
        # Create a client user
        self.client_user = User.objects.create_user(
            email='client@example.com',
            password='password123',
            first_name='John',
            last_name='Doe',
            user_type='CLIENT'
        )
        
        # Create a client
        self.client_obj = Client.objects.create(
            user=self.client_user,
            address='123 Main St'
        )
        
        # Create an attorney user
        self.attorney_user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            user_type='ATTORNEY'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.attorney_user,
            license_number='ABC123',
            license_status='ACTIVE'
        )
        
        # Create a legal request
        self.legal_request = LegalRequest.objects.create(
            client=self.client_obj,
            attorney=self.attorney,
            title='Contract Review',
            description='I need help reviewing a contract',
            status='PENDING',
            is_pro_bono=False
        )
    
    def test_legal_request_creation(self):
        """Test legal request model instance creation."""
        self.assertEqual(self.legal_request.client, self.client_obj)
        self.assertEqual(self.legal_request.attorney, self.attorney)
        self.assertEqual(self.legal_request.title, 'Contract Review')
        self.assertEqual(self.legal_request.status, 'PENDING')
        self.assertEqual(self.legal_request.is_pro_bono, False)


class ClientReviewModelTestCase(TestCase):
    """Test case for the ClientAttorneyReview model."""
    
    def setUp(self):
        # Create a client user
        self.client_user = User.objects.create_user(
            email='client@example.com',
            password='password123',
            first_name='John',
            last_name='Doe',
            user_type='CLIENT'
        )
        
        # Create a client
        self.client_obj = Client.objects.create(
            user=self.client_user,
            address='123 Main St'
        )
        
        # Create an attorney user
        self.attorney_user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            user_type='ATTORNEY'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.attorney_user,
            license_number='ABC123',
            license_status='ACTIVE'
        )
        
        # Create a legal request
        self.legal_request = LegalRequest.objects.create(
            client=self.client_obj,
            attorney=self.attorney,
            title='Contract Review',
            description='I need help reviewing a contract',
            status='COMPLETED',
            is_pro_bono=False
        )
        
        # Create a review
        self.review = ClientAttorneyReview.objects.create(
            client=self.client_obj,
            attorney=self.attorney,
            legal_request=self.legal_request,
            rating=5,
            comment='Excellent service!'
        )
    
    def test_review_creation(self):
        """Test review model instance creation."""
        self.assertEqual(self.review.client, self.client_obj)
        self.assertEqual(self.review.attorney, self.attorney)
        self.assertEqual(self.review.legal_request, self.legal_request)
        self.assertEqual(self.review.rating, 5)
        self.assertEqual(self.review.comment, 'Excellent service!')
    
    def test_review_updates_attorney_rating(self):
        """Test that creating a review updates the attorney's rating."""
        self.attorney.refresh_from_db()
        self.assertEqual(self.attorney.ratings_count, 1)
        self.assertEqual(self.attorney.ratings_average, 5.0)


class ClientAPITestCase(APITestCase):
    """Test case for the Client API."""
    
    def setUp(self):
        # Create a client user
        self.client_user = User.objects.create_user(
            email='client@example.com',
            password='password123',
            first_name='John',
            last_name='Doe',
            user_type='CLIENT'
        )
        
        # Create a client
        self.client_obj = Client.objects.create(
            user=self.client_user,
            address='123 Main St',
            preferred_language='English'
        )
        
        # Create an API client
        self.api_client = APIClient()
        
        # URL for client profile
        self.profile_url = reverse('clients:client-profile')
    
    def test_get_profile_unauthenticated(self):
        """Test that unauthenticated users cannot access client profile."""
        response = self.api_client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_profile_authenticated(self):
        """Test that authenticated client users can access their profile."""
        self.api_client.force_authenticate(user=self.client_user)
        response = self.api_client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], 'client@example.com')
        self.assertEqual(response.data['address'], '123 Main St')
    
    def test_update_profile(self):
        """Test that client users can update their profile."""
        self.api_client.force_authenticate(user=self.client_user)
        url = reverse('clients:client-detail', kwargs={'pk': self.client_obj.id})
        data = {
            'address': '456 New St',
            'preferred_language': 'Spanish'
        }
        response = self.api_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['address'], '456 New St')
        self.assertEqual(response.data['preferred_language'], 'Spanish')


class LegalRequestAPITestCase(APITestCase):
    """Test case for the LegalRequest API."""
    
    def setUp(self):
        # Create a client user
        self.client_user = User.objects.create_user(
            email='client@example.com',
            password='password123',
            first_name='John',
            last_name='Doe',
            user_type='CLIENT'
        )
        
        # Create a client
        self.client_obj = Client.objects.create(
            user=self.client_user,
            address='123 Main St'
        )
        
        # Create an attorney user
        self.attorney_user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            user_type='ATTORNEY'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.attorney_user,
            license_number='ABC123',
            license_status='ACTIVE'
        )
        
        # Create a legal request
        self.legal_request = LegalRequest.objects.create(
            client=self.client_obj,
            attorney=self.attorney,
            title='Contract Review',
            description='I need help reviewing a contract',
            status='PENDING',
            is_pro_bono=False
        )
        
        # Create an API client
        self.api_client = APIClient()
        
        # URLs for legal requests
        self.list_url = reverse('clients:legal-request-list')
        self.detail_url = reverse('clients:legal-request-detail', kwargs={'pk': self.legal_request.id})
        self.cancel_url = reverse('clients:legal-request-cancel', kwargs={'pk': self.legal_request.id})
    
    def test_list_legal_requests(self):
        """Test that client users can list their legal requests."""
        self.api_client.force_authenticate(user=self.client_user)
        response = self.api_client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Contract Review')
    
    def test_create_legal_request(self):
        """Test that client users can create a legal request."""
        self.api_client.force_authenticate(user=self.client_user)
        data = {
            'title': 'New Request',
            'description': 'This is a new legal request',
            'attorney': self.attorney.id,
            'is_pro_bono': True
        }
        response = self.api_client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Request')
        self.assertEqual(response.data['status'], 'PENDING')
        self.assertEqual(response.data['is_pro_bono'], True)
    
    def test_cancel_legal_request(self):
        """Test that client users can cancel their legal requests."""
        self.api_client.force_authenticate(user=self.client_user)
        response = self.api_client.post(self.cancel_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'CANCELLED')


class ClientAttorneyReviewAPITestCase(APITestCase):
    """Test case for the ClientAttorneyReview API."""
    
    def setUp(self):
        # Create a client user
        self.client_user = User.objects.create_user(
            email='client@example.com',
            password='password123',
            first_name='John',
            last_name='Doe',
            user_type='CLIENT'
        )
        
        # Create a client
        self.client_obj = Client.objects.create(
            user=self.client_user,
            address='123 Main St'
        )
        
        # Create an attorney user
        self.attorney_user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            user_type='ATTORNEY'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.attorney_user,
            license_number='ABC123',
            license_status='ACTIVE'
        )
        
        # Create a completed legal request
        self.legal_request = LegalRequest.objects.create(
            client=self.client_obj,
            attorney=self.attorney,
            title='Contract Review',
            description='I need help reviewing a contract',
            status='COMPLETED',
            is_pro_bono=False
        )
        
        # Create an API client
        self.api_client = APIClient()
        
        # URLs for reviews
        self.list_url = reverse('clients:review-list')
    
    def test_create_review(self):
        """Test that client users can create a review for a completed legal request."""
        self.api_client.force_authenticate(user=self.client_user)
        data = {
            'attorney': self.attorney.id,
            'legal_request': self.legal_request.id,
            'rating': 4,
            'comment': 'Good service!'
        }
        response = self.api_client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rating'], 4)
        self.assertEqual(response.data['comment'], 'Good service!')
        
        # Check that attorney's rating was updated
        self.attorney.refresh_from_db()
        self.assertEqual(self.attorney.ratings_count, 1)
        self.assertEqual(self.attorney.ratings_average, 4.0)
    
    def test_create_review_invalid_rating(self):
        """Test that reviews with invalid ratings are rejected."""
        self.api_client.force_authenticate(user=self.client_user)
        data = {
            'attorney': self.attorney.id,
            'legal_request': self.legal_request.id,
            'rating': 6,  # Invalid rating (should be 1-5)
            'comment': 'Excellent service!'
        }
        response = self.api_client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 