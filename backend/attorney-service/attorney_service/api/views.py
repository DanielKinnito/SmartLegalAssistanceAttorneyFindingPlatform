"""
API views for attorney_service.
"""
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Attorney, Specialty, AttorneyCredential
from .serializers import AttorneySerializer, SpecialtySerializer, AttorneyCredentialSerializer

class SpecialtyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for attorney specialties.
    """
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class AttorneyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for attorneys.
    """
    queryset = Attorney.objects.all()
    serializer_class = AttorneySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['first_name', 'last_name', 'email', 'bio', 'education', 'office_address']
    filterset_fields = ['license_status', 'years_of_experience', 'is_pro_bono', 'specialties']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search_by_specialty']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get the attorney profile for the authenticated user.
        """
        try:
            user_id = request.query_params.get('user_id')
            attorney = Attorney.objects.get(user_id=user_id)
            serializer = self.get_serializer(attorney)
            return Response(serializer.data)
        except Attorney.DoesNotExist:
            return Response({"detail": "Attorney profile not found."}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def search_by_specialty(self, request):
        """
        Search attorneys by specialty.
        """
        specialty_id = request.query_params.get('specialty_id')
        if not specialty_id:
            return Response({"detail": "specialty_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        attorneys = Attorney.objects.filter(specialties__id=specialty_id, license_status='ACTIVE')
        page = self.paginate_queryset(attorneys)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(attorneys, many=True)
        return Response(serializer.data)


class AttorneyCredentialViewSet(viewsets.ModelViewSet):
    """
    API endpoint for attorney credentials.
    """
    queryset = AttorneyCredential.objects.all()
    serializer_class = AttorneyCredentialSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return a list of all credentials for the attorney,
        or all credentials for admins.
        """
        user_id = self.request.query_params.get('user_id')
        if not user_id:
            return AttorneyCredential.objects.none()
        
        # Check if user is attorney
        try:
            attorney = Attorney.objects.get(user_id=user_id)
            return AttorneyCredential.objects.filter(attorney=attorney)
        except Attorney.DoesNotExist:
            # For now, return empty queryset if not attorney
            # In a real app, you might check if user is admin
            return AttorneyCredential.objects.none() 