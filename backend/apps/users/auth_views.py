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
from .utils import create_verification_token, send_verification_email, verify_email_token
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import logging

# Get a named logger for this module
logger = logging.getLogger('django')

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
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description="Registration message"),
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
            
            # Create and send verification token
            token = create_verification_token(user)
            send_verification_email(user, token)
            
            logger.info(f"User registered successfully: {user.email}")
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Registration successful. Please check your email to verify your account.'
            }, status=status.HTTP_201_CREATED)
        
        logger.warning(f"User registration failed: {serializer.errors}")
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
        try:
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
                
                logger.info(f"User logged in successfully: {user.email}")
            else:
                logger.warning(f"Login failed with status {response.status_code}")
            
            return response
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            raise
    
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
                logger.warning(f"Logout failed: No refresh token provided - User: {request.user.email}")
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
            
            logger.info(f"User logged out successfully: {request.user.email}")
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Logout error for user {request.user.email}: {str(e)}")
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
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
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
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description="Registration message"),
                    }
                )
            ),
            400: "Bad Request"
        },
        operation_description="Register a new client and return authentication tokens"
    )
    def post(self, request):
        # Handle both JSON and form data
        if request.content_type == 'application/json':
            serializer = ClientRegistrationSerializer(data=request.data)
        else:
            serializer = ClientRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Create tokens for the user
            refresh = RefreshToken.for_user(user)
            
            # Set verification status based on probono request
            client_profile = user.client_details
            if client_profile.probono_requested:
                verification_message = "Your account has been created successfully. Your probono request is pending verification by administrators. Please check your email to verify your account."
            else:
                user.verification_status = 'VERIFIED'
                user.save()
                verification_message = "Your account has been created successfully. Please check your email to verify your account."
            
            # Log the activity
            UserActivity.objects.create(
                user=user,
                activity_type='CLIENT_REGISTRATION',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                details={
                    'probono_requested': client_profile.probono_requested,
                    'verification_status': user.verification_status
                }
            )
            
            # Create and send verification token
            token = create_verification_token(user)
            send_verification_email(user, token)
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': verification_message
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
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
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
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description="Registration message"),
                    }
                )
            ),
            400: "Bad Request"
        },
        operation_description="Register a new attorney and return authentication tokens"
    )
    def post(self, request):
        # Handle both JSON and form data
        if request.content_type == 'application/json':
            serializer = AttorneyRegistrationSerializer(data=request.data)
        else:
            serializer = AttorneyRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Create tokens for the user
            refresh = RefreshToken.for_user(user)
            
            # Attorney accounts always start with pending verification
            verification_message = "Your account has been created successfully. Your credentials are pending verification by administrators. Please check your email to verify your account."
            
            # Log the activity
            UserActivity.objects.create(
                user=user,
                activity_type='ATTORNEY_REGISTRATION',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                details={
                    'verification_status': user.verification_status,
                    'documents_submitted': True
                }
            )
            
            # Create and send verification token
            token = create_verification_token(user)
            send_verification_email(user, token)
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': verification_message
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


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['token'],
        properties={
            'token': openapi.Schema(type=openapi.TYPE_STRING, description="Email verification token"),
        }
    ),
    responses={
        200: openapi.Response(
            description="Email verification successful",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Success status"),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description="Success or error message"),
                }
            )
        ),
        400: "Bad Request"
    },
    operation_description="Verify email with verification token"
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    """
    Verify user email with a verification token.
    """
    token_string = request.data.get('token')
    if not token_string:
        logger.warning(f"Email verification failed: No token provided")
        return Response(
            {'success': False, 'message': 'Token is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    logger.debug(f"Processing email verification with token: {token_string[:5]}...")
    success, message = verify_email_token(token_string)
    
    if success:
        logger.info(f"Email verification successful for token: {token_string[:5]}...")
        return Response(
            {'success': True, 'message': message},
            status=status.HTTP_200_OK
        )
    else:
        logger.warning(f"Email verification failed: {message}")
        return Response(
            {'success': False, 'message': message},
            status=status.HTTP_400_BAD_REQUEST
        )


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['email'],
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL, description="User email"),
        }
    ),
    responses={
        200: openapi.Response(
            description="Verification email sent",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Success status"),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description="Success or error message"),
                }
            )
        ),
        400: "Bad Request"
    },
    operation_description="Resend verification email"
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_verification(request):
    """
    Resend verification email to the user.
    """
    email = request.data.get('email')
    if not email:
        logger.warning("Resend verification failed: No email provided")
        return Response(
            {'success': False, 'message': 'Email is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        
        # Don't resend if already verified
        if user.email_verified:
            logger.info(f"Resend verification skipped: Email already verified ({email})")
            return Response(
                {'success': False, 'message': 'Email is already verified.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create and send verification token
        token = create_verification_token(user)
        send_verification_email(user, token)
        
        # Log the activity
        client_ip = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        UserActivity.objects.create(
            user=user,
            activity_type='VERIFICATION_EMAIL_RESENT',
            ip_address=client_ip,
            user_agent=user_agent
        )
        
        logger.info(f"Verification email resent successfully to {email}")
        return Response(
            {'success': True, 'message': 'Verification email sent successfully.'},
            status=status.HTTP_200_OK
        )
    
    except User.DoesNotExist:
        # For security reasons, don't reveal that the email doesn't exist
        logger.info(f"Resend verification requested for non-existent email: {email}")
        return Response(
            {'success': True, 'message': 'If this email exists in our system, a verification email has been sent.'},
            status=status.HTTP_200_OK
        )


def get_client_ip(request):
    """Get the client's IP address."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip 