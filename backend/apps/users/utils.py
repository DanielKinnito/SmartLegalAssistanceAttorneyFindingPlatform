import secrets
import string
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import EmailVerificationToken
from django.utils import timezone
from datetime import timedelta


def generate_verification_token(length=32):
    """Generate a random token for email verification."""
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))


def create_verification_token(user):
    """Create and save a verification token for a user."""
    token = generate_verification_token()
    
    # Check if token already exists
    while EmailVerificationToken.objects.filter(token=token).exists():
        token = generate_verification_token()
    
    # Create token with 24-hour expiry
    expires_at = timezone.now() + timedelta(hours=24)
    token_obj = EmailVerificationToken.objects.create(
        user=user,
        token=token,
        expires_at=expires_at
    )
    
    return token_obj


def send_verification_email(user, token):
    """Send verification email to the user."""
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{token.token}"
    
    # Email content
    context = {
        'user': user,
        'verification_url': verification_url,
        'expires_at': token.expires_at.strftime('%Y-%m-%d %H:%M:%S UTC'),
    }
    
    html_message = render_to_string('email/verify_email.html', context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject="Verify Your Email - Smart Legal Assistance Platform",
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def verify_email_token(token_string):
    """Verify an email verification token."""
    try:
        token = EmailVerificationToken.objects.get(token=token_string)
        
        # Check if token is valid
        if not token.is_valid:
            return False, "Invalid or expired token."
        
        # Mark token as used
        token.is_used = True
        token.save()
        
        # Mark user's email as verified
        user = token.user
        user.email_verified = True
        user.save()
        
        return True, "Email successfully verified."
    
    except EmailVerificationToken.DoesNotExist:
        return False, "Invalid token." 