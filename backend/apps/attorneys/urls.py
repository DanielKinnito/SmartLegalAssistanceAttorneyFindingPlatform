from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AttorneyViewSet, 
    SpecialtyViewSet, 
    AttorneyCredentialViewSet,
    AvailabilitySlotViewSet
)

app_name = 'attorneys'

router = DefaultRouter()
router.register('profile', AttorneyViewSet, basename='attorney')
router.register('specialties', SpecialtyViewSet, basename='specialty')
router.register('credentials', AttorneyCredentialViewSet, basename='credential')
router.register('availability', AvailabilitySlotViewSet, basename='availability')

urlpatterns = [
    path('', include(router.urls)),
] 