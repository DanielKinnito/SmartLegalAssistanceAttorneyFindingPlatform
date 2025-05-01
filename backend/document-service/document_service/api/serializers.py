"""
API serializers for document_service.
"""
from rest_framework import serializers
from .models import DocumentTemplate, GeneratedDocument

class DocumentTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for DocumentTemplate model.
    """
    class Meta:
        model = DocumentTemplate
        fields = [
            'id', 'title', 'description', 'template_content', 'template_fields',
            'category', 'is_active', 'created_by_id', 'created_by_name', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name']
    
    def create(self, validated_data):
        # Add user information from the auth service
        request = self.context.get('request')
        if request:
            user_id = request.query_params.get('user_id')
            user_name = request.query_params.get('user_name')
            if user_id:
                validated_data['created_by_id'] = user_id
            if user_name:
                validated_data['created_by_name'] = user_name
        
        return super().create(validated_data)


class GeneratedDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for GeneratedDocument model.
    """
    template_details = DocumentTemplateSerializer(source='template', read_only=True)
    
    class Meta:
        model = GeneratedDocument
        fields = [
            'id', 'client_id', 'client_name', 'client_email', 'template', 
            'template_details', 'document_name', 'document_file', 'field_values', 
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'client_name', 'client_email']
    
    def create(self, validated_data):
        # Ensure client information is included
        request = self.context.get('request')
        
        # This would typically come from the client service
        # but we're using query params for simplicity in this example
        if request:
            client_id = request.query_params.get('client_id')
            client_name = request.query_params.get('client_name')
            client_email = request.query_params.get('client_email')
            
            if client_id:
                validated_data['client_id'] = client_id
            if client_name:
                validated_data['client_name'] = client_name
            if client_email:
                validated_data['client_email'] = client_email
        
        return super().create(validated_data) 