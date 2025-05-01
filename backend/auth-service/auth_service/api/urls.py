"""
API URL patterns for auth_service.
"""
from django.urls import path
from .views import UserRegistrationView, UserDetailView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('users/me/', UserDetailView.as_view(), name='user-detail'),
] 