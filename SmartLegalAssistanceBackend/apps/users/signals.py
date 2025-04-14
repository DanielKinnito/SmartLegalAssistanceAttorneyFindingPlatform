from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import UserActivity
from apps.clients.models import Client
from apps.attorneys.models import Attorney

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to create corresponding profile when a user is created,
    based on user_type.
    """
    if created:
        # Create profile based on user type
        if instance.user_type == 'CLIENT':
            Client.objects.create(user=instance)
        elif instance.user_type == 'ATTORNEY':
            Attorney.objects.create(
                user=instance,
                license_number=f"TEMP-{instance.id}"  # Temporary license number
            )
        
        # Log user creation activity
        UserActivity.objects.create(
            user=instance,
            activity_type='USER_CREATED',
            details={
                'user_type': instance.user_type
            }
        )