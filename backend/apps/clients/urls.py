from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, LegalRequestViewSet, ClientAttorneyReviewViewSet

app_name = 'clients'

router = DefaultRouter()
router.register('profile', ClientViewSet, basename='client')
router.register('legal-requests', LegalRequestViewSet, basename='legal-request')
router.register('reviews', ClientAttorneyReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
] 