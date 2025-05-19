from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Client, LegalRequest, ClientAttorneyReview
from .serializers import (
    ClientSerializer, 
    ClientDetailSerializer,
    LegalRequestSerializer, 
    LegalRequestCreateSerializer,
    LegalRequestUpdateSerializer,
    ClientAttorneyReviewSerializer
)
from apps.users.permissions import IsClient, IsClientOwner, IsAttorney


class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint for client profile management.
    
    retrieve:
    Return a specific client profile.
    
    update:
    Update a client profile.
    
    partial_update:
    Partially update a client profile.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClientDetailSerializer
        return ClientSerializer
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsClientOwner()]
        return super().get_permissions()
    
    def get_queryset(self):
        # Check if this is being called for Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            # Return empty queryset for schema generation
            return Client.objects.none()
            
        user = self.request.user
        if user.is_superuser or user.user_type == 'ADMIN':
            return Client.objects.all()
        elif user.user_type == 'CLIENT':
            return Client.objects.filter(user=user)
        return Client.objects.none()
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current client's own profile."""
        if request.user.user_type != 'CLIENT':
            return Response(
                {"detail": "User is not a client"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            client = Client.objects.get(user=request.user)
            serializer = ClientDetailSerializer(client)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response(
                {"detail": "Client profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class LegalRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint for legal requests management.
    
    list:
    Return a list of all legal requests for current client.
    
    create:
    Create a new legal request.
    
    retrieve:
    Return a specific legal request.
    
    update:
    Update a legal request.
    
    partial_update:
    Partially update a legal request.
    """
    serializer_class = LegalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'status']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LegalRequestCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return LegalRequestUpdateSerializer
        return LegalRequestSerializer
    
    def get_queryset(self):
        # Check if this is being called for Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            # Return empty queryset for schema generation
            return LegalRequest.objects.none()
            
        user = self.request.user
        if user.is_superuser or user.user_type == 'ADMIN':
            return LegalRequest.objects.all()
        elif user.user_type == 'CLIENT':
            return LegalRequest.objects.filter(client__user=user)
        elif user.user_type == 'ATTORNEY':
            return LegalRequest.objects.filter(attorney__user=user)
        return LegalRequest.objects.none()
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get current client's pending legal requests."""
        queryset = self.get_queryset().filter(status='PENDING')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def accepted(self, request):
        """Get current client's accepted legal requests."""
        queryset = self.get_queryset().filter(status='ACCEPTED')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def in_progress(self, request):
        """Get current client's in-progress legal requests."""
        queryset = self.get_queryset().filter(status='IN_PROGRESS')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Get current client's completed legal requests."""
        queryset = self.get_queryset().filter(status='COMPLETED')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def cancelled(self, request):
        """Get current client's cancelled legal requests."""
        queryset = self.get_queryset().filter(status='CANCELLED')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a legal request."""
        legal_request = self.get_object()
        
        # Validate that the request can be cancelled by the client
        if request.user.user_type == 'CLIENT' and legal_request.status in ['COMPLETED', 'CANCELLED', 'DECLINED']:
            return Response(
                {"detail": f"Cannot cancel a request with status '{legal_request.status}'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        legal_request.status = 'CANCELLED'
        legal_request.save()
        
        serializer = self.get_serializer(legal_request)
        return Response(serializer.data)


class ClientAttorneyReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for client reviews of attorneys.
    
    list:
    Return a list of all reviews by the current client.
    
    create:
    Create a new attorney review.
    
    retrieve:
    Return a specific review.
    
    update:
    Update a review.
    
    partial_update:
    Partially update a review.
    """
    serializer_class = ClientAttorneyReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsClient]
    
    def get_queryset(self):
        # Check if this is being called for Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            # Return empty queryset for schema generation
            return ClientAttorneyReview.objects.none()
            
        user = self.request.user
        if user.is_superuser or user.user_type == 'ADMIN':
            return ClientAttorneyReview.objects.all()
        elif user.user_type == 'CLIENT':
            return ClientAttorneyReview.objects.filter(client__user=user)
        elif user.user_type == 'ATTORNEY':
            return ClientAttorneyReview.objects.filter(attorney__user=user)
        return ClientAttorneyReview.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(client=self.request.user.client_details)
    
    @action(detail=False, methods=['get'])
    def for_attorney(self, request):
        """Get reviews for a specific attorney."""
        attorney_id = request.query_params.get('attorney_id')
        if not attorney_id:
            return Response(
                {"detail": "Attorney ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = ClientAttorneyReview.objects.filter(attorney_id=attorney_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data) 