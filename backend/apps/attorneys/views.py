from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.shortcuts import get_object_or_404
from .models import Attorney, Specialty, AttorneyCredential, AvailabilitySlot
from .serializers import (
    AttorneySerializer,
    AttorneyDetailSerializer,
    AttorneyUpdateSerializer,
    AttorneySearchSerializer,
    SpecialtySerializer,
    AttorneyCredentialSerializer,
    AvailabilitySlotSerializer
)
from apps.users.permissions import IsAttorney, IsAttorneyOwner, IsAdmin, IsOwnerOrAdmin
from apps.clients.models import ClientAttorneyReview
from apps.clients.serializers import ClientAttorneyReviewSerializer


class SpecialtyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for attorney specialties.
    
    list:
    Return a list of all specialties.
    
    retrieve:
    Return a specific specialty.
    """
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class AttorneyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for attorney profile management.
    
    list:
    Return a list of all attorneys.
    
    create:
    Create a new attorney (admin only).
    
    retrieve:
    Return a specific attorney profile.
    
    update:
    Update an attorney profile (attorney owner or admin only).
    
    partial_update:
    Partially update an attorney profile (attorney owner or admin only).
    """
    queryset = Attorney.objects.all()
    serializer_class = AttorneySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'bio', 'education', 'office_address']
    ordering_fields = ['user__last_name', 'ratings_average', 'years_of_experience']
    ordering = ['user__last_name']
    
    def get_queryset(self):
        queryset = Attorney.objects.all()
        
        # Filter by active status
        active_only = self.request.query_params.get('active_only')
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(license_status='ACTIVE')
        
        # Filter by specialty
        specialty = self.request.query_params.get('specialty')
        if specialty:
            queryset = queryset.filter(specialties__id=specialty)
        
        # Filter by pro bono
        pro_bono = self.request.query_params.get('pro_bono')
        if pro_bono and pro_bono.lower() == 'true':
            queryset = queryset.filter(is_pro_bono=True)
        
        # Filter by rating (minimum rating)
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(ratings_average__gte=float(min_rating))
        
        # Filter by experience (minimum years)
        min_experience = self.request.query_params.get('min_experience')
        if min_experience:
            queryset = queryset.filter(years_of_experience__gte=int(min_experience))
            
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AttorneyDetailSerializer
        elif self.action in ['update', 'partial_update']:
            return AttorneyUpdateSerializer
        elif self.action == 'search':
            return AttorneySearchSerializer
        return AttorneySerializer
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        elif self.action == 'create':
            return [permissions.IsAuthenticated(), IsAdmin()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current attorney's own profile."""
        if request.user.user_type != 'ATTORNEY':
            return Response(
                {"detail": "User is not an attorney"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            attorney = Attorney.objects.get(user=request.user)
            serializer = AttorneyDetailSerializer(attorney)
            return Response(serializer.data)
        except Attorney.DoesNotExist:
            return Response(
                {"detail": "Attorney profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search for attorneys with various filters."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get reviews for a specific attorney."""
        attorney = self.get_object()
        reviews = ClientAttorneyReview.objects.filter(attorney=attorney)
        serializer = ClientAttorneyReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class AttorneyCredentialViewSet(viewsets.ModelViewSet):
    """
    API endpoint for attorney credentials management.
    
    list:
    Return a list of all credentials for the current attorney.
    
    create:
    Upload a new credential document.
    
    retrieve:
    Return a specific credential.
    
    update:
    Update a credential (admin only).
    
    partial_update:
    Partially update a credential (admin only).
    
    destroy:
    Delete a credential (attorney owner or admin only).
    """
    serializer_class = AttorneyCredentialSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Check if this is being called for Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            # Return empty queryset for schema generation
            return AttorneyCredential.objects.none()
            
        user = self.request.user
        if user.is_superuser or user.user_type == 'ADMIN':
            return AttorneyCredential.objects.all()
        elif user.user_type == 'ATTORNEY':
            return AttorneyCredential.objects.filter(attorney__user=user)
        return AttorneyCredential.objects.none()
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsAdmin()]
        elif self.action == 'destroy':
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        try:
            attorney = Attorney.objects.get(user=self.request.user)
            serializer.save(attorney=attorney)
        except Attorney.DoesNotExist:
            raise serializers.ValidationError("Attorney profile not found for this user")
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a credential (admin only)."""
        if not (request.user.is_superuser or request.user.user_type == 'ADMIN'):
            return Response(
                {"detail": "Only administrators can verify credentials"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        credential = self.get_object()
        credential.is_verified = True
        credential.verified_by = request.user
        credential.save()
        
        serializer = self.get_serializer(credential)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a credential (admin only)."""
        if not (request.user.is_superuser or request.user.user_type == 'ADMIN'):
            return Response(
                {"detail": "Only administrators can reject credentials"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        credential = self.get_object()
        credential.is_verified = False
        credential.verified_by = request.user
        credential.save()
        
        serializer = self.get_serializer(credential)
        return Response(serializer.data)


class AvailabilitySlotViewSet(viewsets.ModelViewSet):
    """
    API endpoint for attorney availability slots management.
    
    list:
    Return a list of all availability slots for the current attorney.
    
    create:
    Create a new availability slot.
    
    retrieve:
    Return a specific availability slot.
    
    update:
    Update an availability slot.
    
    partial_update:
    Partially update an availability slot.
    
    destroy:
    Delete an availability slot.
    """
    serializer_class = AvailabilitySlotSerializer
    permission_classes = [permissions.IsAuthenticated, IsAttorney]
    
    def get_queryset(self):
        # Check if this is being called for Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            # Return empty queryset for schema generation
            return AvailabilitySlot.objects.none()
            
        user = self.request.user
        if user.is_superuser or user.user_type == 'ADMIN':
            # For admin, allow filtering by attorney
            attorney_id = self.request.query_params.get('attorney_id')
            if attorney_id:
                return AvailabilitySlot.objects.filter(attorney_id=attorney_id)
            return AvailabilitySlot.objects.all()
        elif user.user_type == 'ATTORNEY':
            return AvailabilitySlot.objects.filter(attorney__user=user)
        return AvailabilitySlot.objects.none()
    
    def perform_create(self, serializer):
        try:
            attorney = Attorney.objects.get(user=self.request.user)
            serializer.save(attorney=attorney)
        except Attorney.DoesNotExist:
            raise serializers.ValidationError("Attorney profile not found for this user")
    
    @action(detail=False, methods=['get'])
    def attorney_slots(self, request):
        """Get availability slots for a specific attorney."""
        attorney_id = request.query_params.get('attorney_id')
        if not attorney_id:
            return Response(
                {"detail": "Attorney ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        slots = AvailabilitySlot.objects.filter(attorney_id=attorney_id, is_available=True)
        serializer = self.get_serializer(slots, many=True)
        return Response(serializer.data) 