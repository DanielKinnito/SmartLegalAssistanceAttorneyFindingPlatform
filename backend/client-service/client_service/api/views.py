"""
API views for client_service.
"""
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import requests
from django.conf import settings
from .models import Client, LegalRequest, ClientAttorneyReview
from .serializers import ClientSerializer, LegalRequestSerializer, ClientAttorneyReviewSerializer

class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint for clients.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return a list of all clients for admins,
        or just the current client for regular users.
        """
        user_id = self.request.query_params.get('user_id')
        if not user_id:
            return Client.objects.none()
        
        # For now, return only the client matching the user ID
        return Client.objects.filter(user_id=user_id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get the client profile for the authenticated user.
        """
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"detail": "user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            client = Client.objects.get(user_id=user_id)
            serializer = self.get_serializer(client)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response({"detail": "Client profile not found."}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Create a client profile for a new user.
        """
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if client already exists
        if Client.objects.filter(user_id=user_id).exists():
            return Response({"detail": "Client profile already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user data from auth service
        try:
            auth_response = requests.get(f"{settings.AUTH_SERVICE_URL}/users/{user_id}/", timeout=5)
            auth_response.raise_for_status()
            user_data = auth_response.json()
            
            # Create client profile
            client_data = {
                'user_id': user_id,
                'email': user_data.get('email'),
                'first_name': user_data.get('first_name'),
                'last_name': user_data.get('last_name'),
                'address': request.data.get('address'),
                'preferred_language': request.data.get('preferred_language'),
                'date_of_birth': request.data.get('date_of_birth')
            }
            
            serializer = self.get_serializer(data=client_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except requests.RequestException as e:
            return Response({"detail": f"Error communicating with auth service: {str(e)}"}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LegalRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint for legal requests.
    """
    queryset = LegalRequest.objects.all()
    serializer_class = LegalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description']
    filterset_fields = ['status', 'is_pro_bono', 'attorney_id']
    
    def get_queryset(self):
        """
        This view should return legal requests for the current client.
        """
        user_id = self.request.query_params.get('user_id')
        if not user_id:
            return LegalRequest.objects.none()
        
        # Get client
        try:
            client = Client.objects.get(user_id=user_id)
            return LegalRequest.objects.filter(client=client)
        except Client.DoesNotExist:
            return LegalRequest.objects.none()
    
    def perform_create(self, serializer):
        # Get attorney info from attorney service
        attorney_id = serializer.validated_data.get('attorney_id')
        if attorney_id:
            try:
                attorney_response = requests.get(f"{settings.ATTORNEY_SERVICE_URL}/attorneys/{attorney_id}/", timeout=5)
                attorney_response.raise_for_status()
                attorney_data = attorney_response.json()
                
                # Add attorney name to the legal request
                attorney_name = f"{attorney_data.get('first_name', '')} {attorney_data.get('last_name', '')}"
                serializer.save(attorney_name=attorney_name)
            except requests.RequestException:
                # Still save the request even if we can't get attorney info
                serializer.save()
        else:
            serializer.save()


class ClientAttorneyReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for client attorney reviews.
    """
    queryset = ClientAttorneyReview.objects.all()
    serializer_class = ClientAttorneyReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return reviews created by the current client.
        """
        user_id = self.request.query_params.get('user_id')
        if not user_id:
            return ClientAttorneyReview.objects.none()
        
        # Get client
        try:
            client = Client.objects.get(user_id=user_id)
            return ClientAttorneyReview.objects.filter(client=client)
        except Client.DoesNotExist:
            return ClientAttorneyReview.objects.none()
    
    def perform_create(self, serializer):
        # Get attorney info from attorney service
        attorney_id = serializer.validated_data.get('attorney_id')
        if attorney_id:
            try:
                attorney_response = requests.get(f"{settings.ATTORNEY_SERVICE_URL}/attorneys/{attorney_id}/", timeout=5)
                attorney_response.raise_for_status()
                attorney_data = attorney_response.json()
                
                # Add attorney name to the review
                attorney_name = f"{attorney_data.get('first_name', '')} {attorney_data.get('last_name', '')}"
                serializer.save(attorney_name=attorney_name)
                
                # Notify attorney service about the new review
                try:
                    review_data = serializer.data
                    requests.post(
                        f"{settings.ATTORNEY_SERVICE_URL}/attorneys/{attorney_id}/ratings/",
                        json={
                            'rating': review_data.get('rating'),
                            'review_id': str(review_data.get('id'))
                        },
                        timeout=5
                    )
                except requests.RequestException:
                    # Continue even if we can't notify the attorney service
                    pass
            except requests.RequestException:
                # Save without attorney name
                serializer.save()
        else:
            serializer.save() 