from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer, UserSerializer, CustomTokenObtainPairSerializer,
    ClientRegistrationSerializer, AttorneyRegistrationSerializer
)
from .models import UserActivity
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

User = get_user_model()

class RegisterView(APIView):
    """
    User registration view.
    """
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        request_body=UserRegistrationSerializer,
        responses={
            201: openapi.Response(
                description="User created successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'user': openapi.Schema(type=openapi.TYPE_OBJECT, description="User data"),
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING, description="JWT refresh token"),
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description="JWT access token"),
                    }
                )
            ),
            400: "Bad Request"
        },
        operation_description="Register a new user and return authentication tokens"
    )
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create tokens for the user
            refresh = RefreshToken.for_user(user)
            
            # Log the activity
            UserActivity.objects.create(
                user=user,
                activity_type='REGISTRATION',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Get the client's IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain pair view that uses email instead of username.
    """
    serializer_class = CustomTokenObtainPairSerializer

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email', 'password'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL, description="User email"),
                'password': openapi.Schema(type=openapi.TYPE_STRING, format="password", description="User password"),
            }
        ),
        responses={
            200: openapi.Response(
                description="Login successful",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING, description="JWT refresh token"),
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description="JWT access token"),
                    }
                )
            ),
            401: "Unauthorized"
        },
        operation_description="Login with email and password to obtain JWT tokens"
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            
            # Log the login activity
            client_ip = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            UserActivity.objects.create(
                user=user,
                activity_type='LOGIN',
                ip_address=client_ip,
                user_agent=user_agent
            )
        
        return response
    
    def get_client_ip(self, request):
        """Get the client's IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view with Swagger documentation.
    """
    
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh'],
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING, description="JWT refresh token"),
            }
        ),
        responses={
            200: openapi.Response(
                description="Token refresh successful",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description="New JWT access token"),
                    }
                )
            ),
            401: "Unauthorized"
        },
        operation_description="Use refresh token to obtain a new access token"
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    """
    Logout view (blacklist the refresh token).
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh'],
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING, description="JWT refresh token"),
            }
        ),
        responses={
            200: openapi.Response(
                description="Successfully logged out",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(type=openapi.TYPE_STRING, description="Success message"),
                    }
                )
            ),
            400: "Bad Request"
        },
        operation_description="Logout user by blacklisting the refresh token"
    )
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
                
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            # Log the activity
            UserActivity.objects.create(
                user=request.user,
                activity_type='LOGOUT',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "Invalid token or token already blacklisted."}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Get the client's IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@swagger_auto_schema(
    method='get',
    responses={
        200: UserSerializer,
        401: "Unauthorized"
    },
    operation_description="Get current user profile information"
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    """
    Get the current user's profile.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['old_password', 'new_password', 'confirm_password'],
        properties={
            'old_password': openapi.Schema(type=openapi.TYPE_STRING, description="User's current password"),
            'new_password': openapi.Schema(type=openapi.TYPE_STRING, description="New password"),
            'confirm_password': openapi.Schema(type=openapi.TYPE_STRING, description="Confirm new password")
        }
    ),
    responses={
        200: openapi.Response(
            description="Password changed successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(type=openapi.TYPE_STRING, description="Success message"),
                }
            )
        ),
        400: "Bad Request"
    },
    operation_description="Change user password"
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """
    Change the user's password.
    """
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    if not old_password or not new_password or not confirm_password:
        return Response({'detail': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(old_password):
        return Response({'detail': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if new_password != confirm_password:
        return Response({'detail': 'New passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    # Log the activity
    client_ip = get_client_ip(request)
    UserActivity.objects.create(
        user=user,
        activity_type='PASSWORD_CHANGE',
        ip_address=client_ip,
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    responses={
        200: openapi.Response(
            description="MFA status toggled",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'mfa_enabled': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="New MFA status"),
                }
            )
        ),
        401: "Unauthorized"
    },
    operation_description="Toggle multi-factor authentication for the current user"
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_mfa(request):
    """
    Toggle multi-factor authentication for the user.
    """
    user = request.user
    user.mfa_enabled = not user.mfa_enabled
    user.save()
    
    # Log the activity
    client_ip = get_client_ip(request)
    UserActivity.objects.create(
        user=user,
        activity_type=f"MFA_{'ENABLED' if user.mfa_enabled else 'DISABLED'}",
        ip_address=client_ip,
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    return Response({
        'mfa_enabled': user.mfa_enabled
    }, status=status.HTTP_200_OK)


def get_client_ip(request):
    """Helper function to get the client's IP address."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class ClientRegistrationView(APIView):
    """
    Client registration view.
    """
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        request_body=ClientRegistrationSerializer,
        responses={
            201: openapi.Response(
                description="Client registered successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'user': openapi.Schema(type=openapi.TYPE_OBJECT, description="User data"),
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING, description="JWT refresh token"),
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description="JWT access token"),
                    }
                )
            ),
            400: "Bad Request"
        },
        operation_description="Register a new client and return authentication tokens"
    )
    def post(self, request):
        serializer = ClientRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create tokens for the user
            refresh = RefreshToken.for_user(user)
            
            # Log the activity
            UserActivity.objects.create(
                user=user,
                activity_type='CLIENT_REGISTRATION',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Get the client's IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class AttorneyRegistrationView(APIView):
    """
    Attorney registration view.
    """
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        request_body=AttorneyRegistrationSerializer,
        responses={
            201: openapi.Response(
                description="Attorney registered successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'user': openapi.Schema(type=openapi.TYPE_OBJECT, description="User data"),
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING, description="JWT refresh token"),
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description="JWT access token"),
                    }
                )
            ),
            400: "Bad Request"
        },
        operation_description="Register a new attorney and return authentication tokens"
    )
    def post(self, request):
        serializer = AttorneyRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create tokens for the user
            refresh = RefreshToken.for_user(user)
            
            # Log the activity
            UserActivity.objects.create(
                user=user,
                activity_type='ATTORNEY_REGISTRATION',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Get the client's IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip 