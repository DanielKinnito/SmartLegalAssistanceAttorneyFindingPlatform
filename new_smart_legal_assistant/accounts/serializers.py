from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, AttorneyProfile, ClientProBonoRequest
from core.models import AttorneyApprovalRequest

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role  # Add role to token
        return token

class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, required=True)
    location = serializers.CharField(max_length=100, required=False, allow_blank=True)
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            location=validated_data.get('location', ''),
            username = validated_data['email'],
        )
        if user.role == 'attorney':
            AttorneyApprovalRequest.objects.create(attorney=user)
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'role', 'is_approved', 'location', 'rating']

class AttorneyProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='attorney'),
        source='user',
        write_only=True
    )

    class Meta:
        model = AttorneyProfile
        fields = [
            'id', 'user', 'user_id', 'bio', 'education', 'experience',
            'expertise', 'is_pro_bono_available', 'is_available',
            'is_profile_complete', 'degree_document', 'license_document'
        ]

    def validate(self, data):
        if data.get('user') and data['user'].role != 'attorney':
            raise serializers.ValidationError("User must be an attorney.")
        return data

class ClientProBonoRequestSerializer(serializers.ModelSerializer):
    client = CustomUserSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='client'),
        source='client',
        write_only=True
    )

    class Meta:
        model = ClientProBonoRequest
        fields = ['id', 'client', 'client_id', 'document', 'status', 'created_at']

    def validate(self, data):
        if data.get('client') and data['client'].role != 'client':
            raise serializers.ValidationError("User must be a client.")
        return data