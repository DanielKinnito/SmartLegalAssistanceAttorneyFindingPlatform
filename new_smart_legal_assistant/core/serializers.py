from rest_framework import serializers
from .models import CaseRequest, AttorneyApprovalRequest
from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer

class CaseRequestSerializer(serializers.ModelSerializer):
    client = CustomUserSerializer(read_only=True)
    attorney = CustomUserSerializer(read_only=True)
    attorney_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='attorney', is_approved=True), 
        source='attorney', 
        write_only=True
    )

    class Meta:
        model = CaseRequest
        fields = [
            'id', 'client', 'attorney', 'attorney_id', 'title', 
            'description', 'document', 'is_pro_bono', 'status', 'created_at'
        ]

    def validate(self, data):
        attorney = data.get('attorney')
        is_pro_bono = data.get('is_pro_bono', False)
        if is_pro_bono and attorney and not attorney.attorneyprofile.is_pro_bono_available:
            raise serializers.ValidationError(
                "This attorney does not offer pro bono services. Please confirm if you wish to proceed."
            )
        return data

class AttorneyApprovalRequestSerializer(serializers.ModelSerializer):
    attorney = CustomUserSerializer(read_only=True)
    attorney_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='attorney'), 
        source='attorney', 
        write_only=True
    )

    class Meta:
        model = AttorneyApprovalRequest
        fields = ['id', 'attorney', 'attorney_id', 'status', 'created_at']

    def validate(self, data):
        if data.get('attorney') and data['attorney'].role != 'attorney':
            raise serializers.ValidationError("User must be an attorney.")
        return data