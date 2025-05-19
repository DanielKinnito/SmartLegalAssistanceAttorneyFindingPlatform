from rest_framework import serializers
from .models import Client, LegalRequest, ClientAttorneyReview
from apps.users.serializers import UserSerializer
from apps.attorneys.serializers import AttorneySerializer


class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Client
        fields = ['id', 'user', 'address', 'preferred_language', 'date_of_birth']
        read_only_fields = ['id', 'user']


class ClientDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    legal_requests_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = ['id', 'user', 'address', 'preferred_language', 'date_of_birth', 'legal_requests_count']
        read_only_fields = ['id', 'user']
    
    def get_legal_requests_count(self, obj):
        return obj.legal_requests.count()


class LegalRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalRequest
        fields = ['id', 'title', 'description', 'attorney', 'is_pro_bono']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Set the client from the current user
        client = self.context['request'].user.client_details
        validated_data['client'] = client
        # Set initial status to PENDING
        validated_data['status'] = 'PENDING'
        return super().create(validated_data)


class LegalRequestSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    attorney = AttorneySerializer(read_only=True)
    
    class Meta:
        model = LegalRequest
        fields = ['id', 'client', 'attorney', 'title', 'description', 
                  'status', 'is_pro_bono', 'created_at', 'updated_at']
        read_only_fields = ['id', 'client', 'created_at', 'updated_at']


class LegalRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalRequest
        fields = ['id', 'title', 'description', 'status']
        read_only_fields = ['id', 'client', 'attorney', 'is_pro_bono', 'created_at', 'updated_at']
    
    def validate_status(self, value):
        # Only certain status transitions are allowed for client users
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.user_type == 'CLIENT':
            current_status = self.instance.status
            allowed_transitions = {
                'PENDING': ['CANCELLED'],
                'ACCEPTED': ['CANCELLED'],
                'IN_PROGRESS': ['CANCELLED'],
            }
            
            if current_status in allowed_transitions and value not in allowed_transitions[current_status]:
                raise serializers.ValidationError(
                    f"Clients can only change status from {current_status} to {allowed_transitions[current_status]}")
                
        return value


class ClientAttorneyReviewSerializer(serializers.ModelSerializer):
    client = serializers.StringRelatedField(read_only=True)
    attorney = serializers.StringRelatedField(read_only=True)
    legal_request = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ClientAttorneyReview
        fields = ['id', 'client', 'attorney', 'legal_request', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'client', 'created_at']
    
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def create(self, validated_data):
        # Set the client from the current user
        client = self.context['request'].user.client_details
        validated_data['client'] = client
        
        # Validate that the legal request has been completed before allowing a review
        legal_request = validated_data.get('legal_request')
        if legal_request and legal_request.status != 'COMPLETED':
            raise serializers.ValidationError("Can only review completed legal requests")
            
        return super().create(validated_data) 