"""
API serializers for client_service.
"""
from rest_framework import serializers
from .models import Client, LegalRequest, ClientAttorneyReview

class ClientSerializer(serializers.ModelSerializer):
    """
    Serializer for Client model.
    """
    class Meta:
        model = Client
        fields = ['id', 'user_id', 'address', 'preferred_language', 'date_of_birth', 
                 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'user_id', 'email', 'first_name', 'last_name']


class LegalRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for LegalRequest model.
    """
    class Meta:
        model = LegalRequest
        fields = ['id', 'client', 'attorney_id', 'attorney_name', 'title', 'description', 
                 'status', 'is_pro_bono', 'created_at', 'updated_at']
        read_only_fields = ['id', 'client', 'created_at', 'updated_at', 'attorney_name']
    
    def create(self, validated_data):
        # Ensure the client is set to the current client
        request = self.context.get('request')
        user_id = request.query_params.get('user_id')
        
        try:
            client = Client.objects.get(user_id=user_id)
            validated_data['client'] = client
            return super().create(validated_data)
        except Client.DoesNotExist:
            raise serializers.ValidationError({"detail": "Client profile not found."})


class ClientAttorneyReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for ClientAttorneyReview model.
    """
    class Meta:
        model = ClientAttorneyReview
        fields = ['id', 'client', 'attorney_id', 'attorney_name', 'legal_request', 
                 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'client', 'created_at', 'attorney_name']
    
    def validate(self, attrs):
        # Ensure rating is between 1 and 5
        if attrs.get('rating') and (attrs['rating'] < 1 or attrs['rating'] > 5):
            raise serializers.ValidationError({"rating": "Rating must be between 1 and 5."})
        return attrs
    
    def create(self, validated_data):
        # Ensure the client is set to the current client
        request = self.context.get('request')
        user_id = request.query_params.get('user_id')
        
        try:
            client = Client.objects.get(user_id=user_id)
            validated_data['client'] = client
            return super().create(validated_data)
        except Client.DoesNotExist:
            raise serializers.ValidationError({"detail": "Client profile not found."}) 