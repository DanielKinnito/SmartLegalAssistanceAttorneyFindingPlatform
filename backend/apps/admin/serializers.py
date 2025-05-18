from rest_framework import serializers
from .models import PlatformStats, AdminNotification, SystemConfiguration
from apps.users.models import User
from apps.attorneys.models import Attorney
from apps.clients.models import Client, LegalRequest


class PlatformStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformStats
        fields = [
            'id', 'date', 'total_users', 'total_attorneys', 'total_clients',
            'active_attorneys', 'active_clients', 'total_requests',
            'completed_requests', 'pro_bono_requests'
        ]
        read_only_fields = ['id']


class AdminNotificationSerializer(serializers.ModelSerializer):
    admin_email = serializers.EmailField(source='admin.email', read_only=True)
    
    class Meta:
        model = AdminNotification
        fields = [
            'id', 'admin', 'admin_email', 'title', 'message', 
            'category', 'is_read', 'reference_id', 'created_at'
        ]
        read_only_fields = ['id', 'admin', 'admin_email', 'created_at']


class SystemConfigurationSerializer(serializers.ModelSerializer):
    last_modified_by_email = serializers.EmailField(source='last_modified_by.email', read_only=True)
    
    class Meta:
        model = SystemConfiguration
        fields = [
            'id', 'key', 'value', 'description', 'is_editable',
            'last_modified_by', 'last_modified_by_email', 'last_modified_at'
        ]
        read_only_fields = ['id', 'last_modified_by', 'last_modified_by_email', 'last_modified_at']
    
    def validate(self, data):
        # Ensure we can't modify non-editable configurations
        if self.instance and not self.instance.is_editable and 'value' in data:
            raise serializers.ValidationError("This configuration cannot be modified")
        return data


class UserVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'user_type',
            'verification_status', 'verification_notes', 'email_verified',
            'date_joined'
        ]
        read_only_fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 
                            'email_verified', 'date_joined']


class AttorneyVerificationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    credentials = serializers.SerializerMethodField()
    
    class Meta:
        model = Attorney
        fields = [
            'id', 'user', 'license_number', 'license_status',
            'years_of_experience', 'is_pro_bono', 'credentials'
        ]
        read_only_fields = ['id', 'user', 'license_number', 'years_of_experience', 
                           'is_pro_bono', 'credentials']
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'verification_status': obj.user.verification_status,
            'date_joined': obj.user.date_joined
        }
    
    def get_credentials(self, obj):
        return [{
            'id': cred.id,
            'document_type': cred.document_type,
            'document': cred.document.url if cred.document else None,
            'is_verified': cred.is_verified,
            'uploaded_at': cred.uploaded_at
        } for cred in obj.credentials.all()]


class ClientVerificationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = ['id', 'user', 'address', 'preferred_language', 'date_of_birth']
        read_only_fields = ['id', 'user', 'address', 'preferred_language', 'date_of_birth']
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'verification_status': obj.user.verification_status,
            'date_joined': obj.user.date_joined
        }


class AdminDashboardSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_attorneys = serializers.IntegerField()
    total_clients = serializers.IntegerField()
    pending_attorney_verifications = serializers.IntegerField()
    pending_client_verifications = serializers.IntegerField()
    total_legal_requests = serializers.IntegerField()
    pending_legal_requests = serializers.IntegerField()
    completed_legal_requests = serializers.IntegerField()
    pro_bono_requests = serializers.IntegerField()
    recent_registrations = serializers.ListField(child=serializers.DictField())
    recent_legal_requests = serializers.ListField(child=serializers.DictField()) 