"""
API views for auth_service.
"""
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import UserSerializer

class UserRegistrationView(generics.CreateAPIView):
    """
    API view for user registration.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class UserDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve authenticated user's details.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user 