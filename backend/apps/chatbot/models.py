from django.db import models
from django.conf import settings
import uuid

class ChatSession(models.Model):
    """Chat session between a user and the AI chatbot."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_sessions')
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'chat session'
        verbose_name_plural = 'chat sessions'
        db_table = 'chat_sessions'
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.started_at}"


class ChatMessage(models.Model):
    """Individual chat message in a session."""
    MESSAGE_TYPE_CHOICES = (
        ('USER', 'User Message'),
        ('BOT', 'Bot Message'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=4, choices=MESSAGE_TYPE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'chat message'
        verbose_name_plural = 'chat messages'
        db_table = 'chat_messages'
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.session.user.email} - {self.message_type} - {self.timestamp}"


class LegalResource(models.Model):
    """Legal resources and information for the chatbot."""
    RESOURCE_TYPE_CHOICES = (
        ('ARTICLE', 'Article'),
        ('FAQ', 'Frequently Asked Question'),
        ('DEFINITION', 'Legal Definition'),
        ('PROCEDURE', 'Legal Procedure'),
        ('LAW', 'Law Reference'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    content = models.TextField()
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPE_CHOICES)
    tags = models.JSONField(default=list)  # Keywords for search
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'legal resource'
        verbose_name_plural = 'legal resources'
        db_table = 'legal_resources'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} ({self.resource_type})"


class ChatFeedback(models.Model):
    """User feedback on chatbot responses."""
    RATING_CHOICES = (
        ('HELPFUL', 'Helpful'),
        ('SOMEWHAT_HELPFUL', 'Somewhat Helpful'),
        ('NOT_HELPFUL', 'Not Helpful'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='feedback')
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name='feedback', blank=True, null=True)
    rating = models.CharField(max_length=16, choices=RATING_CHOICES)
    comment = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'chat feedback'
        verbose_name_plural = 'chat feedback'
        db_table = 'chat_feedback'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.session.user.email} - {self.rating} - {self.timestamp}" 