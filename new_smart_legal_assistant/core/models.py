from django.db import models
from accounts.models import CustomUser
from django.core.mail import send_mail

class CaseRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='case_requests')
    attorney = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_requests')
    title = models.CharField(max_length=100)
    description = models.TextField()
    document = models.FileField(upload_to='case_documents/', blank=True, null=True)
    is_pro_bono = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} from {self.client.email} to {self.attorney.email}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.status in ['accepted', 'rejected']:
            send_mail(
                subject=f"Case Request {self.status}",
                message=f"Your case request '{self.title}' has been {self.status} by {self.attorney.email}.",
                from_email='admin@smartlegal.com',
                recipient_list=[self.client.email],
            )

class AttorneyApprovalRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    )
    attorney = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'attorney'})
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Approval Request for {self.attorney.email}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.status in ['approved', 'declined']:
            self.attorney.is_approved = self.status == 'approved'
            self.attorney.save()
            send_mail(
                subject=f"Attorney Approval {self.status}",
                message=f"Your attorney account has been {self.status}.",
                from_email='admin@smartlegal.com',
                recipient_list=[self.attorney.email],
            )