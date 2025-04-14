from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserActivityViewSet
from .auth_views import (
    RegisterView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
    get_user_profile,
    change_password,
    toggle_mfa
)

router = DefaultRouter()
router.register(r'', UserViewSet)
router.register(r'activities', UserActivityViewSet, basename='user-activities')

urlpatterns = [
    # Main viewsets
    path('', include(router.urls)),
    
    # Authentication and user profile endpoints with clear Swagger docs
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', get_user_profile, name='me'),
    path('change-password/', change_password, name='change_password'),
    path('toggle-mfa/', toggle_mfa, name='toggle_mfa'),
] 