from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import UserActivity
from .serializers import (
    UserSerializer, 
    UserRegistrationSerializer, 
    UserActivitySerializer,
)
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for user management."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
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
        deprecated=True,
        operation_description="DEPRECATED: Please use the /api/users/register/ endpoint instead"
    )
    def create(self, request, *args, **kwargs):
        """
        DEPRECATED: Please use the /api/users/register/ endpoint instead.
        
        This method is maintained for backward compatibility.
        """
        from .auth_views import RegisterView
        return RegisterView().post(request)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing user activity logs."""
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAdminUser]
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('user_id', openapi.IN_QUERY, description="Filter by user ID", type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
            openapi.Parameter('activity_type', openapi.IN_QUERY, description="Filter by activity type", type=openapi.TYPE_STRING),
            openapi.Parameter('start_date', openapi.IN_QUERY, description="Filter by start date (YYYY-MM-DD)", type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE),
            openapi.Parameter('end_date', openapi.IN_QUERY, description="Filter by end date (YYYY-MM-DD)", type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE),
        ],
        responses={
            200: UserActivitySerializer(many=True),
            401: "Unauthorized",
            403: "Forbidden"
        },
        operation_description="Get user activity logs with optional filters"
    )
    def get_queryset(self):
        """Get the queryset for user activities."""
        queryset = UserActivity.objects.all()
        
        # Filter by user ID if provided
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user__id=user_id)
        
        # Filter by activity type if provided
        activity_type = self.request.query_params.get('activity_type')
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(timestamp__range=[start_date, end_date])
        
        return queryset.order_by('-timestamp') 