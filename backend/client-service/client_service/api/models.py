"""
Models for client_service API.
"""
from django.db import models
import uuid

class Client(models.Model):
    """Client profile model."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(editable=False)  # Reference to user in auth service
    address = models.TextField(blank=True, null=True)
    preferred_language = models.CharField(max_length=50, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)  # Cached from auth service
    first_name = models.CharField(max_length=150, blank=True, null=True)  # Cached from auth service
    last_name = models.CharField(max_length=150, blank=True, null=True)  # Cached from auth service
    
    class Meta:
        verbose_name = 'client'
        verbose_name_plural = 'clients'
        db_table = 'clients'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


class LegalRequest(models.Model):
    """Client requests for legal assistance."""
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('DECLINED', 'Declined'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='legal_requests')
    attorney_id = models.UUIDField()  # Reference to attorney in attorney service
    attorney_name = models.CharField(max_length=255, blank=True, null=True)  # Cached from attorney service
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    is_pro_bono = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'legal request'
        verbose_name_plural = 'legal requests'
        db_table = 'legal_requests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.client.email} - {self.title} ({self.status})"


class ClientAttorneyReview(models.Model):
    """Client reviews for attorneys."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='reviews')
    attorney_id = models.UUIDField()  # Reference to attorney in attorney service
    attorney_name = models.CharField(max_length=255, blank=True, null=True)  # Cached from attorney service
    legal_request = models.OneToOneField(LegalRequest, on_delete=models.CASCADE, related_name='review', blank=True, null=True)
    rating = models.PositiveSmallIntegerField()  # 1-5 stars
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'client attorney review'
        verbose_name_plural = 'client attorney reviews'
        db_table = 'client_attorney_reviews'
        ordering = ['-created_at']
        unique_together = ['client', 'attorney_id', 'legal_request']
    
    def __str__(self):
        return f"{self.client.email} - {self.attorney_name} ({self.rating} stars)" 