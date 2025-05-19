from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from .models import UserActivity, ClientProfile, AttorneyProfile
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Base serializer for user registration."""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    phone_number = serializers.CharField(
        required=False,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ]
    )

    class Meta:
        model = User
        fields = ('email', 'password', 'confirm_password', 'phone_number', 'user_type')
        extra_kwargs = {
            'email': {'required': True},
            'user_type': {'required': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords don't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class ClientProfileSerializer(serializers.ModelSerializer):
    """Serializer for client profile data."""
    class Meta:
        model = ClientProfile
        fields = ('probono_requested', 'probono_reason', 'income_level', 'probono_document')

class ClientRegistrationSerializer(UserRegistrationSerializer):
    """Serializer for client registration."""
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    probono_requested = serializers.BooleanField(required=False, default=False)
    probono_reason = serializers.CharField(required=False, allow_blank=True)
    income_level = serializers.CharField(required=False, allow_blank=True)
    probono_document = serializers.FileField(required=False)

    class Meta(UserRegistrationSerializer.Meta):
        fields = UserRegistrationSerializer.Meta.fields + (
            'first_name', 'last_name', 'probono_requested', 
            'probono_reason', 'income_level', 'probono_document'
        )

    def create(self, validated_data):
        probono_requested = validated_data.pop('probono_requested', False)
        probono_reason = validated_data.pop('probono_reason', '')
        income_level = validated_data.pop('income_level', '')
        probono_document = validated_data.pop('probono_document', None)
        
        validated_data['user_type'] = 'CLIENT'
        user = super().create(validated_data)
        
        # Create client profile
        ClientProfile.objects.create(
            user=user,
            probono_requested=probono_requested,
            probono_reason=probono_reason,
            income_level=income_level,
            probono_document=probono_document
        )
        
        return user

class AttorneyProfileSerializer(serializers.ModelSerializer):
    """Serializer for attorney profile data."""
    class Meta:
        model = AttorneyProfile
        fields = ('bar_number', 'practice_areas', 'years_of_experience', 
                 'bio', 'accepts_probono', 'license_document', 'degree_document')

class AttorneyRegistrationSerializer(UserRegistrationSerializer):
    """Serializer for attorney registration."""
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    bar_number = serializers.CharField(required=True)
    practice_areas = serializers.ListField(
        child=serializers.CharField(),
        required=True
    )
    years_of_experience = serializers.IntegerField(required=True, min_value=0)
    bio = serializers.CharField(required=True, max_length=1000)
    accepts_probono = serializers.BooleanField(required=False, default=False)
    license_document = serializers.FileField(required=True)
    degree_document = serializers.FileField(required=True)

    class Meta(UserRegistrationSerializer.Meta):
        fields = UserRegistrationSerializer.Meta.fields + (
            'first_name', 'last_name', 'bar_number', 'practice_areas',
            'years_of_experience', 'bio', 'accepts_probono',
            'license_document', 'degree_document'
        )

    def create(self, validated_data):
        bar_number = validated_data.pop('bar_number')
        practice_areas = validated_data.pop('practice_areas')
        years_of_experience = validated_data.pop('years_of_experience')
        bio = validated_data.pop('bio')
        accepts_probono = validated_data.pop('accepts_probono', False)
        license_document = validated_data.pop('license_document')
        degree_document = validated_data.pop('degree_document')
        
        validated_data['user_type'] = 'ATTORNEY'
        user = super().create(validated_data)
        
        # Create attorney profile
        AttorneyProfile.objects.create(
            user=user,
            bar_number=bar_number,
            practice_areas=practice_areas,
            years_of_experience=years_of_experience,
            bio=bio,
            accepts_probono=accepts_probono,
            license_document=license_document,
            degree_document=degree_document
        )
        
        return user

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile data."""
    verification_status = serializers.CharField(read_only=True)
    client_profile = ClientProfileSerializer(read_only=True)
    attorney_profile = AttorneyProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number',
                 'user_type', 'profile_image', 'date_joined', 'last_login',
                 'mfa_enabled', 'email_verified', 'verification_status',
                 'client_profile', 'attorney_profile')
        read_only_fields = ('id', 'email', 'date_joined', 'last_login', 
                           'email_verified', 'verification_status')
        # Fix for swagger serializer conflict with djoser
        ref_name = "CustomUserSerializer"

class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for user activity logs."""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'activity_type', 'ip_address', 'user_agent', 'timestamp', 'details']
        read_only_fields = ['id', 'timestamp']

class CustomTokenObtainPairSerializer(serializers.Serializer):
    """Custom serializer for JWT token obtain pair."""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password')
        }
        
        if all(credentials.values()):
            user = authenticate(**credentials)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                return {
                    'user': user,
                    'token': self.get_token(user)
                }
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

    def get_token(self, user):
        return RefreshToken.for_user(user)

class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing user password."""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"new_password": "New password fields didn't match."})
        return attrs 