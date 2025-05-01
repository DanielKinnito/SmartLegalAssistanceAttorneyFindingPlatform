"""
API views for document_service.
"""
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import requests
import json
from django.conf import settings
from django.template import Template, Context
from .models import DocumentTemplate, GeneratedDocument
from .serializers import DocumentTemplateSerializer, GeneratedDocumentSerializer

class DocumentTemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint for document templates.
    """
    queryset = DocumentTemplate.objects.all()
    serializer_class = DocumentTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'category']
    filterset_fields = ['category', 'is_active', 'created_by_id']
    
    def get_queryset(self):
        """
        Return active templates or all templates for admins.
        """
        # For now, just filter for active templates
        # In a real app, you would check user roles
        return DocumentTemplate.objects.filter(is_active=True)


class GeneratedDocumentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for generated documents.
    """
    queryset = GeneratedDocument.objects.all()
    serializer_class = GeneratedDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return documents for the current client or user.
        """
        client_id = self.request.query_params.get('client_id')
        if client_id:
            return GeneratedDocument.objects.filter(client_id=client_id)
        
        # In a real app, you might also check if the user is an admin or attorney
        # and return documents they have access to
        return GeneratedDocument.objects.none()
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        Generate a document from a template with provided field values.
        """
        template_id = request.data.get('template_id')
        field_values = request.data.get('field_values', {})
        client_id = request.query_params.get('client_id')
        document_name = request.data.get('document_name')
        
        if not template_id or not client_id or not document_name:
            return Response(
                {"detail": "template_id, client_id, and document_name are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            template = DocumentTemplate.objects.get(id=template_id)
            
            # Verify all required fields are provided
            required_fields = set(template.template_fields.keys())
            provided_fields = set(field_values.keys())
            
            if not required_fields.issubset(provided_fields):
                missing_fields = required_fields - provided_fields
                return Response(
                    {"detail": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate document content using Django's template engine
            template_content = Template(template.template_content)
            context = Context(field_values)
            document_content = template_content.render(context)
            
            # Get client information from client service
            try:
                client_response = requests.get(
                    f"{settings.CLIENT_SERVICE_URL}/clients/{client_id}/",
                    timeout=5
                )
                client_response.raise_for_status()
                client_data = client_response.json()
                client_name = f"{client_data.get('first_name', '')} {client_data.get('last_name', '')}"
                client_email = client_data.get('email', '')
            except requests.RequestException:
                # Use placeholder values if client service is unavailable
                client_name = "Unknown Client"
                client_email = "unknown@example.com"
            
            # In a real app, you would save the document content to a file
            # For this example, we'll create a placeholder document
            document = GeneratedDocument.objects.create(
                client_id=client_id,
                client_name=client_name,
                client_email=client_email,
                template=template,
                document_name=document_name,
                field_values=field_values,
                # In a real app, you would create a real document file here
                # document_file=document_file
            )
            
            serializer = GeneratedDocumentSerializer(document)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except DocumentTemplate.DoesNotExist:
            return Response(
                {"detail": "Template not found."},
                status=status.HTTP_404_NOT_FOUND
            ) 