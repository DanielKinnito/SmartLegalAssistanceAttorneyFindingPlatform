from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from .models import UserActivity
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework.tokens import RefreshToken

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

class ClientRegistrationSerializer(UserRegistrationSerializer):
    """Serializer for client registration."""
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta(UserRegistrationSerializer.Meta):
        fields = UserRegistrationSerializer.Meta.fields + ('first_name', 'last_name')

    def create(self, validated_data):
        validated_data['user_type'] = 'CLIENT'
        return super().create(validated_data)

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

    class Meta(UserRegistrationSerializer.Meta):
        fields = UserRegistrationSerializer.Meta.fields + (
            'first_name', 'last_name', 'bar_number', 'practice_areas',
            'years_of_experience', 'bio'
        )

    def create(self, validated_data):
        validated_data['user_type'] = 'ATTORNEY'
        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile data."""
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number',
                 'user_type', 'profile_image', 'date_joined', 'last_login',
                 'mfa_enabled')
        read_only_fields = ('id', 'email', 'date_joined', 'last_login')

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