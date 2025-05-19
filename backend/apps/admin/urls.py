from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminDashboardViewSet,
    PlatformStatsViewSet,
    AdminNotificationViewSet,
    SystemConfigurationViewSet,
    UserVerificationViewSet,
    AttorneyVerificationViewSet,
    ClientVerificationViewSet
)

app_name = 'admin_app'  # Use the same label as defined in apps.py

router = DefaultRouter()
router.register('dashboard', AdminDashboardViewSet, basename='dashboard')
router.register('stats', PlatformStatsViewSet, basename='stats')
router.register('notifications', AdminNotificationViewSet, basename='notification')
router.register('config', SystemConfigurationViewSet, basename='config')
router.register('verify/users', UserVerificationViewSet, basename='user-verification')
router.register('verify/attorneys', AttorneyVerificationViewSet, basename='attorney-verification')
router.register('verify/clients', ClientVerificationViewSet, basename='client-verification')

urlpatterns = [
    path('', include(router.urls)),
] 