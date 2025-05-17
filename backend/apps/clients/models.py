from django.db import models
from django.conf import settings
from apps.attorneys.models import Attorney
import uuid

class Client(models.Model):
    """Client profile model extending the User model."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_details')
    address = models.TextField(blank=True, null=True)
    preferred_language = models.CharField(max_length=50, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'client'
        verbose_name_plural = 'clients'
        db_table = 'clients'
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.user.email})"


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
    attorney = models.ForeignKey(Attorney, on_delete=models.CASCADE, related_name='legal_requests')
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
        return f"{self.client.user.email} - {self.title} ({self.status})"


class ClientAttorneyReview(models.Model):
    """Client reviews for attorneys."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='reviews')
    attorney = models.ForeignKey(Attorney, on_delete=models.CASCADE, related_name='reviews')
    legal_request = models.OneToOneField(LegalRequest, on_delete=models.CASCADE, related_name='review', blank=True, null=True)
    rating = models.PositiveSmallIntegerField()  # 1-5 stars
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'client attorney review'
        verbose_name_plural = 'client attorney reviews'
        db_table = 'client_attorney_reviews'
        ordering = ['-created_at']
        unique_together = ['client', 'attorney', 'legal_request']
    
    def __str__(self):
        return f"{self.client.user.email} - {self.attorney.user.email} ({self.rating} stars)"
    
    def save(self, *args, **kwargs):
        # Update attorney rating when a review is saved
        super().save(*args, **kwargs)
        attorney = self.attorney
        reviews = ClientAttorneyReview.objects.filter(attorney=attorney)
        attorney.ratings_count = reviews.count()
        attorney.ratings_average = reviews.aggregate(models.Avg('rating'))['rating__avg'] or 0.0
        attorney.save() 