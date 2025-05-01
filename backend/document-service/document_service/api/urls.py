"""
API URL patterns for document_service.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentTemplateViewSet, GeneratedDocumentViewSet

router = DefaultRouter()
router.register(r'templates', DocumentTemplateViewSet)
router.register(r'documents', GeneratedDocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 