from django.db import models
from django.conf import settings
from apps.clients.models import Client
import uuid

class DocumentTemplate(models.Model):
    """Document templates for generating legal documents."""
    TEMPLATE_CATEGORY_CHOICES = (
        ('CONTRACT', 'Contract'),
        ('AGREEMENT', 'Agreement'),
        ('DECLARATION', 'Declaration'),
        ('PETITION', 'Petition'),
        ('POWER_OF_ATTORNEY', 'Power of Attorney'),
        ('OTHER', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField()
    template_content = models.TextField()  # HTML or Markdown template
    template_fields = models.JSONField()  # JSON schema defining required fields
    category = models.CharField(max_length=20, choices=TEMPLATE_CATEGORY_CHOICES)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'document template'
        verbose_name_plural = 'document templates'
        db_table = 'document_templates'
        ordering = ['category', 'title']
    
    def __str__(self):
        return f"{self.title} ({self.category})"


class GeneratedDocument(models.Model):
    """Generated legal documents from templates."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='documents')
    template = models.ForeignKey(DocumentTemplate, on_delete=models.CASCADE, related_name='generated_documents')
    document_name = models.CharField(max_length=100)
    document_file = models.FileField(upload_to='generated_documents/')
    field_values = models.JSONField()  # Values used to generate the document
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'generated document'
        verbose_name_plural = 'generated documents'
        db_table = 'generated_documents'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.client.user.email} - {self.document_name} ({self.created_at})" 