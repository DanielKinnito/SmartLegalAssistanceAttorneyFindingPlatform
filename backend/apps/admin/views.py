from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import PlatformStats, AdminNotification, SystemConfiguration
from .serializers import (
    PlatformStatsSerializer,
    AdminNotificationSerializer,
    SystemConfigurationSerializer,
    UserVerificationSerializer,
    AttorneyVerificationSerializer,
    ClientVerificationSerializer,
    AdminDashboardSerializer
)
from apps.users.permissions import IsAdmin
from apps.users.models import User
from apps.attorneys.models import Attorney
from apps.clients.models import Client, LegalRequest


class AdminDashboardViewSet(viewsets.ViewSet):
    """
    API endpoint for admin dashboard metrics.
    
    list:
    Return overview metrics for the admin dashboard.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def list(self, request):
        """Get dashboard overview metrics."""
        # Calculate counts for dashboard metrics
        total_users = User.objects.count()
        total_attorneys = Attorney.objects.count()
        total_clients = Client.objects.count()
        
        pending_attorney_verifications = User.objects.filter(
            user_type='ATTORNEY',
            verification_status='PENDING'
        ).count()
        
        pending_client_verifications = User.objects.filter(
            user_type='CLIENT',
            verification_status='PENDING'
        ).count()
        
        total_legal_requests = LegalRequest.objects.count()
        pending_legal_requests = LegalRequest.objects.filter(status='PENDING').count()
        completed_legal_requests = LegalRequest.objects.filter(status='COMPLETED').count()
        pro_bono_requests = LegalRequest.objects.filter(is_pro_bono=True).count()
        
        # Get recent registrations (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        recent_registrations = User.objects.filter(
            date_joined__gte=seven_days_ago
        ).order_by('-date_joined')[:10].values(
            'id', 'email', 'first_name', 'last_name', 'user_type', 
            'verification_status', 'date_joined'
        )
        
        # Get recent legal requests (last 7 days)
        recent_legal_requests = LegalRequest.objects.filter(
            created_at__gte=seven_days_ago
        ).order_by('-created_at')[:10].values(
            'id', 'title', 'status', 'is_pro_bono', 'created_at'
        )
        
        data = {
            'total_users': total_users,
            'total_attorneys': total_attorneys,
            'total_clients': total_clients,
            'pending_attorney_verifications': pending_attorney_verifications,
            'pending_client_verifications': pending_client_verifications,
            'total_legal_requests': total_legal_requests,
            'pending_legal_requests': pending_legal_requests,
            'completed_legal_requests': completed_legal_requests,
            'pro_bono_requests': pro_bono_requests,
            'recent_registrations': recent_registrations,
            'recent_legal_requests': recent_legal_requests,
        }
        
        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data)


class PlatformStatsViewSet(viewsets.ModelViewSet):
    """
    API endpoint for platform statistics.
    
    list:
    Return a list of all platform statistics.
    
    create:
    Create a new platform statistics record.
    
    retrieve:
    Return specific platform statistics.
    
    update:
    Update platform statistics.
    
    partial_update:
    Partially update platform statistics.
    """
    queryset = PlatformStats.objects.all()
    serializer_class = PlatformStatsSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date']
    ordering = ['-date']
    
    @action(detail=False, methods=['post'])
    def generate_today(self, request):
        """Generate platform statistics for today."""
        today = timezone.now().date()
        
        # Check if stats for today already exist
        if PlatformStats.objects.filter(date=today).exists():
            return Response(
                {"detail": "Statistics for today already exist"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate statistics
        total_users = User.objects.count()
        total_attorneys = Attorney.objects.count()
        total_clients = Client.objects.count()
        active_attorneys = Attorney.objects.filter(license_status='ACTIVE').count()
        
        # Active clients are those who have made a request in the last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        active_clients = Client.objects.filter(
            legal_requests__created_at__gte=thirty_days_ago
        ).distinct().count()
        
        total_requests = LegalRequest.objects.count()
        completed_requests = LegalRequest.objects.filter(status='COMPLETED').count()
        pro_bono_requests = LegalRequest.objects.filter(is_pro_bono=True).count()
        
        # Create new stats record
        stats = PlatformStats.objects.create(
            date=today,
            total_users=total_users,
            total_attorneys=total_attorneys,
            total_clients=total_clients,
            active_attorneys=active_attorneys,
            active_clients=active_clients,
            total_requests=total_requests,
            completed_requests=completed_requests,
            pro_bono_requests=pro_bono_requests
        )
        
        serializer = self.get_serializer(stats)
        return Response(serializer.data)


class AdminNotificationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for admin notifications.
    
    list:
    Return a list of all notifications for the current admin.
    
    create:
    Create a new notification.
    
    retrieve:
    Return a specific notification.
    
    update:
    Update a notification.
    
    partial_update:
    Partially update a notification.
    
    destroy:
    Delete a notification.
    """
    serializer_class = AdminNotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'message', 'category']
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return AdminNotification.objects.filter(admin=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read."""
        notifications = self.get_queryset().filter(is_read=False)
        notifications.update(is_read=True)
        return Response({"detail": f"{notifications.count()} notifications marked as read"})


class SystemConfigurationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for system configuration.
    
    list:
    Return a list of all system configurations.
    
    create:
    Create a new system configuration.
    
    retrieve:
    Return a specific system configuration.
    
    update:
    Update a system configuration.
    
    partial_update:
    Partially update a system configuration.
    """
    queryset = SystemConfiguration.objects.all()
    serializer_class = SystemConfigurationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['key', 'description']
    
    def perform_create(self, serializer):
        serializer.save(last_modified_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(last_modified_by=self.request.user)


class UserVerificationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user verification.
    
    list:
    Return a list of users pending verification.
    
    retrieve:
    Return a specific user for verification.
    
    partial_update:
    Update a user's verification status.
    """
    serializer_class = UserVerificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'verification_status']
    ordering = ['-date_joined']
    
    def get_queryset(self):
        queryset = User.objects.all()
        
        # Filter by verification status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(verification_status=status_filter)
        
        # Filter by user type
        user_type = self.request.query_params.get('user_type')
        if user_type:
            queryset = queryset.filter(user_type=user_type)
            
        return queryset
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a user's verification."""
        user = self.get_object()
        user.verification_status = 'VERIFIED'
        user.save()
        
        # If user is an attorney, update license status
        if user.user_type == 'ATTORNEY':
            try:
                attorney = Attorney.objects.get(user=user)
                attorney.license_status = 'ACTIVE'
                attorney.save()
            except Attorney.DoesNotExist:
                pass
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a user's verification."""
        user = self.get_object()
        
        # Get rejection notes from request data
        notes = request.data.get('verification_notes', '')
        if not notes:
            return Response(
                {"detail": "Verification notes are required for rejection"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user.verification_status = 'REJECTED'
        user.verification_notes = notes
        user.save()
        
        # If user is an attorney, update license status
        if user.user_type == 'ATTORNEY':
            try:
                attorney = Attorney.objects.get(user=user)
                attorney.license_status = 'SUSPENDED'
                attorney.save()
            except Attorney.DoesNotExist:
                pass
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)


class AttorneyVerificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for attorney verification details.
    
    list:
    Return a list of attorneys for verification.
    
    retrieve:
    Return a specific attorney for verification.
    """
    serializer_class = AttorneyVerificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'license_number']
    ordering_fields = ['user__date_joined', 'license_status']
    ordering = ['-user__date_joined']
    
    def get_queryset(self):
        queryset = Attorney.objects.all()
        
        # Filter by license status
        status_filter = self.request.query_params.get('license_status')
        if status_filter:
            queryset = queryset.filter(license_status=status_filter)
        
        # Filter by user verification status
        verification_status = self.request.query_params.get('verification_status')
        if verification_status:
            queryset = queryset.filter(user__verification_status=verification_status)
            
        return queryset


class ClientVerificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for client verification details.
    
    list:
    Return a list of clients for verification.
    
    retrieve:
    Return a specific client for verification.
    """
    serializer_class = ClientVerificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['user__date_joined']
    ordering = ['-user__date_joined']
    
    def get_queryset(self):
        queryset = Client.objects.all()
        
        # Filter by user verification status
        verification_status = self.request.query_params.get('verification_status')
        if verification_status:
            queryset = queryset.filter(user__verification_status=verification_status)
            
        return queryset 