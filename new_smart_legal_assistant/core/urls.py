from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CaseRequestViewSet, AttorneySearchViewSet, AttorneyApprovalRequestViewSet, law_search, ai_bot

router = DefaultRouter()
router.register(r'case-requests', CaseRequestViewSet, basename='case-request')
router.register(r'attorney-search', AttorneySearchViewSet, basename='attorney-search')
router.register(r'attorney-approvals', AttorneyApprovalRequestViewSet, basename='attorney-approval')

urlpatterns = [
    path('', include(router.urls)),
    path('law-search/', law_search, name='law-search'),
    path('ai-bot/', ai_bot, name='ai-bot'),
]