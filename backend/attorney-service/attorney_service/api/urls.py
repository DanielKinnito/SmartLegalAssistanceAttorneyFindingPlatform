"""
API URL patterns for attorney_service.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttorneyViewSet, SpecialtyViewSet, AttorneyCredentialViewSet

router = DefaultRouter()
router.register(r'attorneys', AttorneyViewSet)
router.register(r'specialties', SpecialtyViewSet)
router.register(r'credentials', AttorneyCredentialViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 