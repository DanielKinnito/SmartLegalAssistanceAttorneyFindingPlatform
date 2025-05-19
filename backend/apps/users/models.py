from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
import uuid
from django.utils import timezone
from datetime import timedelta

class UserManager(BaseUserManager):
    """Custom user manager for the User model."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('user_type', 'ADMIN')
        extra_fields.setdefault('verification_status', 'VERIFIED')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom User model."""
    
    USER_TYPE_CHOICES = (
        ('ADMIN', 'Administrator'),
        ('ATTORNEY', 'Attorney'),
        ('CLIENT', 'Client'),
    )
    
    VERIFICATION_STATUS_CHOICES = (
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None  # Remove username field
    email = models.EmailField(_('email address'), unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='CLIENT')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Verification status
    verification_status = models.CharField(
        max_length=10, 
        choices=VERIFICATION_STATUS_CHOICES, 
        default='PENDING'
    )
    verification_notes = models.TextField(blank=True, null=True)
    
    # Email verification
    email_verified = models.BooleanField(default=False)
    
    # Multi-Factor Authentication
    mfa_enabled = models.BooleanField(default=False)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        db_table = 'users'


class ClientProfile(models.Model):
    """
    Extended profile for client users.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    probono_requested = models.BooleanField(default=False)
    probono_reason = models.TextField(blank=True, null=True)
    income_level = models.CharField(max_length=50, blank=True, null=True)
    probono_document = models.FileField(
        upload_to='client_documents/probono/',
        blank=True, 
        null=True,
        help_text='Document supporting probono request (e.g., income proof)'
    )
    
    def __str__(self):
        return f"Client Profile: {self.user.email}"
    
    class Meta:
        db_table = 'client_profiles'


class AttorneyProfile(models.Model):
    """
    Extended profile for attorney users.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='attorney_profile')
    bar_number = models.CharField(max_length=50)
    practice_areas = models.JSONField(default=list)
    years_of_experience = models.IntegerField(default=0)
    bio = models.TextField(blank=True, null=True)
    accepts_probono = models.BooleanField(default=False)
    license_document = models.FileField(
        upload_to='attorney_documents/licenses/',
        help_text='Legal license or bar membership document'
    )
    degree_document = models.FileField(
        upload_to='attorney_documents/degrees/',
        help_text='Law degree or equivalent qualification'
    )
    
    def __str__(self):
        return f"Attorney Profile: {self.user.email}"
    
    class Meta:
        db_table = 'attorney_profiles'


class UserActivity(models.Model):
    """Model to track user activity."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(blank=True, null=True)
    
    class Meta:
        verbose_name = _('user activity')
        verbose_name_plural = _('user activities')
        db_table = 'user_activities'
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"{self.user.email} - {self.activity_type} - {self.timestamp}" 


class EmailVerificationToken(models.Model):
    """Model for storing email verification tokens."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_verification_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Verification token for {self.user.email}"
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Token expires after 24 hours by default
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    @property
    def is_valid(self):
        """Check if the token is valid (not used and not expired)."""
        return not self.is_used and self.expires_at > timezone.now()
    
    class Meta:
        verbose_name = _('email verification token')
        verbose_name_plural = _('email verification tokens')
        db_table = 'email_verification_tokens' 