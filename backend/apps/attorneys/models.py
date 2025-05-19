from django.db import models
from django.conf import settings
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
    """Attorney profile model extending the User model."""
    LICENSE_STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('SUSPENDED', 'Suspended'),
        ('REVOKED', 'Revoked'),
        ('PENDING', 'Pending Verification'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attorney_details')
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
    
    class Meta:
        verbose_name = 'attorney'
        verbose_name_plural = 'attorneys'
        db_table = 'attorneys'
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.license_number})"


class AttorneyCredential(models.Model):
    """Attorney credentials and documents."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attorney = models.ForeignKey(Attorney, on_delete=models.CASCADE, related_name='credentials')
    document_type = models.CharField(max_length=50)
    document = models.FileField(upload_to='attorney_credentials/')
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='verified_credentials')
    verified_at = models.DateTimeField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'attorney credential'
        verbose_name_plural = 'attorney credentials'
        db_table = 'attorney_credentials'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.attorney.user.email} - {self.document_type}"


class AvailabilitySlot(models.Model):
    """Attorney availability scheduling."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attorney = models.ForeignKey(Attorney, on_delete=models.CASCADE, related_name='availability_slots')
    day_of_week = models.PositiveSmallIntegerField()  # 0=Monday, 6=Sunday
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'availability slot'
        verbose_name_plural = 'availability slots'
        db_table = 'attorney_availability_slots'
        ordering = ['day_of_week', 'start_time']
    
    def __str__(self):
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        return f"{self.attorney.user.email} - {days[self.day_of_week]} {self.start_time} to {self.end_time}" 