from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserViewSet, UserActivityViewSet
from .auth_views import (
    ClientRegistrationView, AttorneyRegistrationView,
    CustomTokenObtainPairView, LogoutView, get_user_profile,
    change_password, toggle_mfa
)

router = DefaultRouter()
router.register(r'', UserViewSet)
router.register(r'activities', UserActivityViewSet, basename='user-activities')

urlpatterns = [
    # Main viewsets
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('auth/register/client/', ClientRegistrationView.as_view(), name='client-register'),
    path('auth/register/attorney/', AttorneyRegistrationView.as_view(), name='attorney-register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    
    # User profile endpoints
    path('auth/profile/', get_user_profile, name='user-profile'),
    path('auth/change-password/', change_password, name='change-password'),
    path('auth/toggle-mfa/', toggle_mfa, name='toggle-mfa'),
] 