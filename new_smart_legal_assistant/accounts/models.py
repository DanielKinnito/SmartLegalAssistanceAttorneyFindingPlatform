from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.mail import send_mail

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_approved', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('attorney', 'Attorney'),
        ('admin', 'Admin'),
    )
    email = models.EmailField(unique=True)  # Add unique=True
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    is_approved = models.BooleanField(default=False)
    location = models.CharField(max_length=100, blank=True)
    rating = models.FloatField(default=0.0)


    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class AttorneyProfile(models.Model):
    EXPERTISE_CHOICES = (
        ('criminal', 'Criminal Law'),
        ('family', 'Family Law'),
        ('corporate', 'Corporate Law'),
        ('other', 'Other'),
    )
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'attorney'})
    bio = models.TextField(blank=True)
    education = models.TextField()
    experience = models.TextField()
    expertise = models.CharField(max_length=20, choices=EXPERTISE_CHOICES, blank=True)
    is_pro_bono_available = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    is_profile_complete = models.BooleanField(default=False)
    degree_document = models.FileField(upload_to='probono_documents/', blank=True, null=True)
    license_document = models.FileField(upload_to='probono_documents/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.email}'s Profile"

class ClientProBonoRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    )
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'client'})
    document = models.FileField(upload_to='probono_documents/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pro Bono Request from {self.client.email}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.status in ['approved', 'declined']:
            send_mail(
                subject=f"Pro Bono Request {self.status}",
                message=f"Your pro bono request has been {self.status}.",
                from_email='admin@smartlegal.com',
                recipient_list=[self.client.email],
            )