from django.db import models
from django.conf import settings
import uuid

class PlatformStats(models.Model):
    """Statistics for the platform."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField(unique=True)
    total_users = models.PositiveIntegerField(default=0)
    total_attorneys = models.PositiveIntegerField(default=0)
    total_clients = models.PositiveIntegerField(default=0)
    active_attorneys = models.PositiveIntegerField(default=0)
    active_clients = models.PositiveIntegerField(default=0)
    total_requests = models.PositiveIntegerField(default=0)
    completed_requests = models.PositiveIntegerField(default=0)
    pro_bono_requests = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = 'platform statistics'
        verbose_name_plural = 'platform statistics'
        db_table = 'platform_stats'
        ordering = ['-date']
    
    def __str__(self):
        return f"Platform Stats for {self.date}"


class AdminNotification(models.Model):
    """Notifications for administrators."""
    CATEGORY_CHOICES = (
        ('ATTORNEY_REGISTRATION', 'Attorney Registration'),
        ('USER_REPORT', 'User Report'),
        ('SYSTEM_ALERT', 'System Alert'),
        ('OTHER', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
    category = models.CharField(max_length=25, choices=CATEGORY_CHOICES)
    is_read = models.BooleanField(default=False)
    reference_id = models.UUIDField(blank=True, null=True)  # Reference to related object
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'admin notification'
        verbose_name_plural = 'admin notifications'
        db_table = 'admin_notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.category}) - {self.created_at}"


class SystemConfiguration(models.Model):
    """System configuration settings."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True, null=True)
    is_editable = models.BooleanField(default=True)
    last_modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'system configuration'
        verbose_name_plural = 'system configurations'
        db_table = 'system_configurations'
        ordering = ['key']
    
    def __str__(self):
        return f"{self.key} - {self.value[:50]}..." 