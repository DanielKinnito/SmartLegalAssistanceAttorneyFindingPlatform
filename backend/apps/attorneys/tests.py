from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from apps.users.models import User
from .models import Attorney, Specialty, AttorneyCredential, AvailabilitySlot
from django.core.files.uploadedfile import SimpleUploadedFile
import uuid
import datetime


class AttorneyModelTestCase(TestCase):
    """Test case for the Attorney model."""
    
    def setUp(self):
        # Create a user for the attorney
        self.user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            user_type='ATTORNEY'
        )
        
        # Create a specialty
        self.specialty = Specialty.objects.create(
            name='Family Law',
            description='Legal issues related to family relationships'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.user,
            license_number='ABC123',
            license_status='ACTIVE',
            years_of_experience=5,
            bio='Experienced family lawyer',
            education='JD from Harvard Law School',
            office_address='123 Legal St, Boston, MA',
            is_pro_bono=True
        )
        
        # Add specialty to attorney
        self.attorney.specialties.add(self.specialty)
    
    def test_attorney_creation(self):
        """Test attorney model instance creation."""
        self.assertEqual(self.attorney.user.email, 'attorney@example.com')
        self.assertEqual(self.attorney.license_number, 'ABC123')
        self.assertEqual(self.attorney.license_status, 'ACTIVE')
        self.assertEqual(self.attorney.years_of_experience, 5)
        self.assertEqual(self.attorney.bio, 'Experienced family lawyer')
        self.assertEqual(self.attorney.education, 'JD from Harvard Law School')
        self.assertEqual(self.attorney.is_pro_bono, True)
        self.assertEqual(str(self.attorney), 'Jane Smith (ABC123)')
        self.assertEqual(self.attorney.specialties.count(), 1)
        self.assertEqual(self.attorney.specialties.first().name, 'Family Law')


class SpecialtyModelTestCase(TestCase):
    """Test case for the Specialty model."""
    
    def setUp(self):
        self.specialty = Specialty.objects.create(
            name='Criminal Law',
            description='Legal issues related to criminal offenses'
        )
    
    def test_specialty_creation(self):
        """Test specialty model instance creation."""
        self.assertEqual(self.specialty.name, 'Criminal Law')
        self.assertEqual(self.specialty.description, 'Legal issues related to criminal offenses')
        self.assertEqual(str(self.specialty), 'Criminal Law')


class AttorneyCredentialTestCase(TestCase):
    """Test case for the AttorneyCredential model."""
    
    def setUp(self):
        # Create a user for the attorney
        self.user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            user_type='ATTORNEY'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.user,
            license_number='ABC123',
            license_status='ACTIVE'
        )
        
        # Create a simple file for testing
        self.document = SimpleUploadedFile("license.pdf", b"file content", content_type="application/pdf")
        
        # Create attorney credential
        self.credential = AttorneyCredential.objects.create(
            attorney=self.attorney,
            document_type='Bar License',
            document=self.document,
            is_verified=False
        )
    
    def test_credential_creation(self):
        """Test credential model instance creation."""
        self.assertEqual(self.credential.attorney, self.attorney)
        self.assertEqual(self.credential.document_type, 'Bar License')
        self.assertEqual(self.credential.is_verified, False)
        self.assertIsNone(self.credential.verified_by)
        self.assertIsNone(self.credential.verified_at)
        self.assertEqual(str(self.credential), 'attorney@example.com - Bar License')


class AvailabilitySlotTestCase(TestCase):
    """Test case for the AvailabilitySlot model."""
    
    def setUp(self):
        # Create a user for the attorney
        self.user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            user_type='ATTORNEY'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.user,
            license_number='ABC123',
            license_status='ACTIVE'
        )
        
        # Create an availability slot
        self.slot = AvailabilitySlot.objects.create(
            attorney=self.attorney,
            day_of_week=0,  # Monday
            start_time=datetime.time(9, 0),  # 9:00 AM
            end_time=datetime.time(17, 0),  # 5:00 PM
            is_available=True
        )
    
    def test_slot_creation(self):
        """Test availability slot model instance creation."""
        self.assertEqual(self.slot.attorney, self.attorney)
        self.assertEqual(self.slot.day_of_week, 0)
        self.assertEqual(self.slot.start_time, datetime.time(9, 0))
        self.assertEqual(self.slot.end_time, datetime.time(17, 0))
        self.assertEqual(self.slot.is_available, True)
        self.assertEqual(str(self.slot), 'attorney@example.com - Monday 09:00:00 to 17:00:00')


class AttorneyAPITestCase(APITestCase):
    """Test case for the Attorney API."""
    
    def setUp(self):
        # Create an attorney user
        self.attorney_user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            user_type='ATTORNEY'
        )
        
        # Create a specialty
        self.specialty = Specialty.objects.create(
            name='Family Law',
            description='Legal issues related to family relationships'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.attorney_user,
            license_number='ABC123',
            license_status='ACTIVE',
            years_of_experience=5,
            bio='Experienced family lawyer',
            education='JD from Harvard Law School',
            office_address='123 Legal St, Boston, MA',
            is_pro_bono=True
        )
        
        # Add specialty to attorney
        self.attorney.specialties.add(self.specialty)
        
        # Create an API client
        self.api_client = APIClient()
        
        # URL for attorney profile
        self.profile_url = reverse('attorneys:attorney-profile')
    
    def test_get_profile_unauthenticated(self):
        """Test that unauthenticated users cannot access attorney profile."""
        response = self.api_client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_profile_authenticated(self):
        """Test that authenticated attorney users can access their profile."""
        self.api_client.force_authenticate(user=self.attorney_user)
        response = self.api_client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], 'attorney@example.com')
        self.assertEqual(response.data['license_number'], 'ABC123')
        self.assertEqual(response.data['license_status'], 'ACTIVE')
    
    def test_update_profile(self):
        """Test that attorney users can update their profile."""
        self.api_client.force_authenticate(user=self.attorney_user)
        url = reverse('attorneys:attorney-detail', kwargs={'pk': self.attorney.id})
        data = {
            'bio': 'Updated bio information',
            'education': 'JD from Stanford Law School',
            'is_pro_bono': False,
            'years_of_experience': 7
        }
        response = self.api_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bio'], 'Updated bio information')
        self.assertEqual(response.data['education'], 'JD from Stanford Law School')
        self.assertEqual(response.data['is_pro_bono'], False)
        self.assertEqual(response.data['years_of_experience'], 7)


class SpecialtyAPITestCase(APITestCase):
    """Test case for the Specialty API."""
    
    def setUp(self):
        # Create specialties
        self.specialty1 = Specialty.objects.create(
            name='Family Law',
            description='Legal issues related to family relationships'
        )
        self.specialty2 = Specialty.objects.create(
            name='Criminal Law',
            description='Legal issues related to criminal offenses'
        )
        
        # Create an API client
        self.api_client = APIClient()
        
        # URL for specialties
        self.list_url = reverse('attorneys:specialty-list')
    
    def test_list_specialties(self):
        """Test that users can list all specialties."""
        response = self.api_client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Criminal Law')  # Alphabetical order
        self.assertEqual(response.data[1]['name'], 'Family Law')


class AttorneyCredentialAPITestCase(APITestCase):
    """Test case for the AttorneyCredential API."""
    
    def setUp(self):
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
        
        # Create an admin user
        self.admin_user = User.objects.create_user(
            email='admin@example.com',
            password='password123',
            first_name='Admin',
            last_name='User',
            user_type='ADMIN',
            is_staff=True,
            is_superuser=True
        )
        
        # Create a simple file for testing
        self.document = SimpleUploadedFile("license.pdf", b"file content", content_type="application/pdf")
        
        # Create attorney credential
        self.credential = AttorneyCredential.objects.create(
            attorney=self.attorney,
            document_type='Bar License',
            document=self.document,
            is_verified=False
        )
        
        # Create an API client
        self.api_client = APIClient()
        
        # URLs for credentials
        self.list_url = reverse('attorneys:credential-list')
        self.detail_url = reverse('attorneys:credential-detail', kwargs={'pk': self.credential.id})
        self.verify_url = reverse('attorneys:credential-verify', kwargs={'pk': self.credential.id})
        self.reject_url = reverse('attorneys:credential-reject', kwargs={'pk': self.credential.id})
    
    def test_list_credentials(self):
        """Test that attorney users can list their credentials."""
        self.api_client.force_authenticate(user=self.attorney_user)
        response = self.api_client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['document_type'], 'Bar License')
    
    def test_verify_credential(self):
        """Test that admin users can verify attorney credentials."""
        self.api_client.force_authenticate(user=self.admin_user)
        response = self.api_client.post(self.verify_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_verified'], True)
        
        # Refresh the credential from the database
        self.credential.refresh_from_db()
        self.assertEqual(self.credential.is_verified, True)
        self.assertEqual(self.credential.verified_by, self.admin_user)
    
    def test_reject_credential(self):
        """Test that admin users can reject attorney credentials."""
        self.api_client.force_authenticate(user=self.admin_user)
        response = self.api_client.post(self.reject_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_verified'], False)
        
        # Refresh the credential from the database
        self.credential.refresh_from_db()
        self.assertEqual(self.credential.is_verified, False)
        self.assertEqual(self.credential.verified_by, self.admin_user) 