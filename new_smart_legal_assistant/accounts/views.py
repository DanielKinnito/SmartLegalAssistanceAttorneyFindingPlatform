from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import AttorneyProfile, ClientProBonoRequest, CustomUser
from .serializers import (
    SignupSerializer,
    CustomUserSerializer,
    AttorneyProfileSerializer,
    ClientProBonoRequestSerializer,
)

class SignupView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),  # Contains role
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

class AttorneyProfileViewSet(viewsets.ModelViewSet):
    queryset = AttorneyProfile.objects.all()
    serializer_class = AttorneyProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow attorneys to view/edit their own profile
        if self.request.user.role == 'attorney':
            return AttorneyProfile.objects.filter(user=self.request.user)
        return AttorneyProfile.objects.none()

    def perform_create(self, serializer):
        # Ensure the profile is linked to the authenticated attorney
        serializer.save(user=self.request.user)

class ClientProBonoRequestViewSet(viewsets.ModelViewSet):
    queryset = ClientProBonoRequest.objects.all()
    serializer_class = ClientProBonoRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Clients see their own requests, admins see all
        if self.request.user.role == 'client':
            return ClientProBonoRequest.objects.filter(client=self.request.user)
        elif self.request.user.is_superuser or self.request.user.role == 'admin':
            return ClientProBonoRequest.objects.all()
        return ClientProBonoRequest.objects.none()

    def perform_create(self, serializer):
        # Ensure the request is linked to the authenticated client
        serializer.save(client=self.request.user)

class SignInView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Please provide both email and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = authenticate(email=email, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        if not user.is_active:
            return Response(
                {'error': 'User account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        refresh = RefreshToken.for_user(user)
        serializer = CustomUserSerializer(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data
        })