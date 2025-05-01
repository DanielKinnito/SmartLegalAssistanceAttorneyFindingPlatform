"""
Models for attorney_service API.
"""
from django.db import models
import uuid

class Specialty(models.Model):
    """Attorney legal specialties."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'specialty'
        verbose_name_plural = 'specialties'
        db_table = 'attorney_specialties'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Attorney(models.Model):
    """Attorney profile model."""
    LICENSE_STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('SUSPENDED', 'Suspended'),
        ('REVOKED', 'Revoked'),
        ('PENDING', 'Pending Verification'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(editable=False)  # Reference to user in auth service
    license_number = models.CharField(max_length=50, unique=True)
    license_status = models.CharField(max_length=20, choices=LICENSE_STATUS_CHOICES, default='PENDING')
    specialties = models.ManyToManyField(Specialty, related_name='attorneys')
    years_of_experience = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    office_address = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    is_pro_bono = models.BooleanField(default=False)
    ratings_average = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    ratings_count = models.PositiveIntegerField(default=0)
    email = models.EmailField(max_length=255, blank=True, null=True)  # Cached from auth service
    first_name = models.CharField(max_length=150, blank=True, null=True)  # Cached from auth service
    last_name = models.CharField(max_length=150, blank=True, null=True)  # Cached from auth service
    
    class Meta:
        verbose_name = 'attorney'
        verbose_name_plural = 'attorneys'
        db_table = 'attorneys'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.license_number})"


class AttorneyCredential(models.Model):
    """Attorney credentials and documents."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attorney = models.ForeignKey(Attorney, on_delete=models.CASCADE, related_name='credentials')
    document_type = models.CharField(max_length=50)
    document = models.FileField(upload_to='attorney_credentials/')
    is_verified = models.BooleanField(default=False)
    verified_by = models.UUIDField(blank=True, null=True)  # Reference to admin user in auth service
    verified_at = models.DateTimeField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'attorney credential'
        verbose_name_plural = 'attorney credentials'
        db_table = 'attorney_credentials'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.attorney.email} - {self.document_type}" 