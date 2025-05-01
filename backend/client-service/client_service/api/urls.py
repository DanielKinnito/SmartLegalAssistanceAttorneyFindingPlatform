"""
API URL patterns for client_service.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, LegalRequestViewSet, ClientAttorneyReviewViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'legal-requests', LegalRequestViewSet)
router.register(r'reviews', ClientAttorneyReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 