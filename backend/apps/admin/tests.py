from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from apps.users.models import User
from apps.attorneys.models import Attorney
from apps.clients.models import Client, LegalRequest
from .models import PlatformStats, AdminNotification, SystemConfiguration
from django.utils import timezone
import uuid
import datetime


class PlatformStatsModelTestCase(TestCase):
    """Test case for the PlatformStats model."""
    
    def setUp(self):
        self.today = timezone.now().date()
        self.stats = PlatformStats.objects.create(
            date=self.today,
            total_users=100,
            total_attorneys=30,
            total_clients=70,
            active_attorneys=25,
            active_clients=50,
            total_requests=200,
            completed_requests=150,
            pro_bono_requests=40
        )
    
    def test_stats_creation(self):
        """Test platform stats model instance creation."""
        self.assertEqual(self.stats.date, self.today)
        self.assertEqual(self.stats.total_users, 100)
        self.assertEqual(self.stats.total_attorneys, 30)
        self.assertEqual(self.stats.total_clients, 70)
        self.assertEqual(self.stats.active_attorneys, 25)
        self.assertEqual(self.stats.active_clients, 50)
        self.assertEqual(self.stats.total_requests, 200)
        self.assertEqual(self.stats.completed_requests, 150)
        self.assertEqual(self.stats.pro_bono_requests, 40)
        self.assertEqual(str(self.stats), f"Platform Stats for {self.today}")


class AdminNotificationModelTestCase(TestCase):
    """Test case for the AdminNotification model."""
    
    def setUp(self):
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
        
        # Create a notification
        self.notification = AdminNotification.objects.create(
            admin=self.admin_user,
            title='New Attorney Registration',
            message='A new attorney has registered and needs verification',
            category='ATTORNEY_REGISTRATION',
            is_read=False
        )
    
    def test_notification_creation(self):
        """Test admin notification model instance creation."""
        self.assertEqual(self.notification.admin, self.admin_user)
        self.assertEqual(self.notification.title, 'New Attorney Registration')
        self.assertEqual(self.notification.message, 'A new attorney has registered and needs verification')
        self.assertEqual(self.notification.category, 'ATTORNEY_REGISTRATION')
        self.assertEqual(self.notification.is_read, False)
        self.assertIsNone(self.notification.reference_id)
        self.assertTrue('New Attorney Registration (ATTORNEY_REGISTRATION)' in str(self.notification))


class SystemConfigurationModelTestCase(TestCase):
    """Test case for the SystemConfiguration model."""
    
    def setUp(self):
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
        
        # Create a system configuration
        self.config = SystemConfiguration.objects.create(
            key='EMAIL_VERIFICATION_REQUIRED',
            value='true',
            description='Whether email verification is required for new users',
            is_editable=True,
            last_modified_by=self.admin_user
        )
    
    def test_config_creation(self):
        """Test system configuration model instance creation."""
        self.assertEqual(self.config.key, 'EMAIL_VERIFICATION_REQUIRED')
        self.assertEqual(self.config.value, 'true')
        self.assertEqual(self.config.description, 'Whether email verification is required for new users')
        self.assertEqual(self.config.is_editable, True)
        self.assertEqual(self.config.last_modified_by, self.admin_user)
        self.assertTrue('EMAIL_VERIFICATION_REQUIRED - true...' in str(self.config))


class AdminAPITestCase(APITestCase):
    """Test case for the Admin API."""
    
    def setUp(self):
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
        
        # Create a regular user
        self.regular_user = User.objects.create_user(
            email='user@example.com',
            password='password123',
            first_name='Regular',
            last_name='User',
            user_type='CLIENT'
        )
        
        # Create a client
        self.client_obj = Client.objects.create(
            user=self.regular_user,
            address='123 Main St',
            preferred_language='English'
        )
        
        # Create an attorney user with pending verification
        self.attorney_user = User.objects.create_user(
            email='attorney@example.com',
            password='password123',
            first_name='Attorney',
            last_name='User',
            user_type='ATTORNEY',
            verification_status='PENDING'
        )
        
        # Create an attorney
        self.attorney = Attorney.objects.create(
            user=self.attorney_user,
            license_number='ABC123',
            license_status='PENDING'
        )
        
        # Create a system configuration
        self.config = SystemConfiguration.objects.create(
            key='EMAIL_VERIFICATION_REQUIRED',
            value='true',
            description='Whether email verification is required for new users',
            is_editable=True,
            last_modified_by=self.admin_user
        )
        
        # Create a notification
        self.notification = AdminNotification.objects.create(
            admin=self.admin_user,
            title='New Attorney Registration',
            message='A new attorney has registered and needs verification',
            category='ATTORNEY_REGISTRATION',
            is_read=False
        )
        
        # Create an API client
        self.api_client = APIClient()
        
        # URLs for admin API
        self.dashboard_url = reverse('admin_app:dashboard-list')
        self.config_url = reverse('admin_app:config-list')
        self.config_detail_url = reverse('admin_app:config-detail', kwargs={'pk': self.config.id})
        self.notification_url = reverse('admin_app:notification-list')
        self.notification_mark_read_url = reverse('admin_app:notification-mark-read', kwargs={'pk': self.notification.id})
        self.verify_user_url = reverse('admin_app:user-verification-approve', kwargs={'pk': self.attorney_user.id})
        self.verify_attorney_url = reverse('admin_app:attorney-verification-list')
    
    def test_dashboard_access_admin(self):
        """Test that admin users can access the admin dashboard."""
        self.api_client.force_authenticate(user=self.admin_user)
        response = self.api_client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_users', response.data)
        self.assertIn('total_attorneys', response.data)
        self.assertIn('total_clients', response.data)
    
    def test_dashboard_access_non_admin(self):
        """Test that non-admin users cannot access the admin dashboard."""
        self.api_client.force_authenticate(user=self.regular_user)
        response = self.api_client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_config_update(self):
        """Test that admin users can update system configurations."""
        self.api_client.force_authenticate(user=self.admin_user)
        data = {
            'value': 'false'
        }
        response = self.api_client.patch(self.config_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['value'], 'false')
    
    def test_notification_mark_read(self):
        """Test that admin users can mark notifications as read."""
        self.api_client.force_authenticate(user=self.admin_user)
        response = self.api_client.post(self.notification_mark_read_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_read'], True)
        
        # Check in database
        self.notification.refresh_from_db()
        self.assertEqual(self.notification.is_read, True)
    
    def test_verify_user(self):
        """Test that admin users can verify attorney users."""
        self.api_client.force_authenticate(user=self.admin_user)
        response = self.api_client.post(self.verify_user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['verification_status'], 'VERIFIED')
        
        # Check if attorney's license status was updated
        self.attorney.refresh_from_db()
        self.assertEqual(self.attorney.license_status, 'ACTIVE')
        
        # Check if user's verification status was updated
        self.attorney_user.refresh_from_db()
        self.assertEqual(self.attorney_user.verification_status, 'VERIFIED') 