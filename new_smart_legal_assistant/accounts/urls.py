from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SignupView,
    SignInView,
    UserInfoView,
    AttorneyProfileViewSet,
    ClientProBonoRequestViewSet,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer  # Import the serializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

router = DefaultRouter()
router.register(r'profiles', AttorneyProfileViewSet, basename='profile')
router.register(r'probono-requests', ClientProBonoRequestViewSet, basename='probono-request')

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('me/', UserInfoView.as_view(), name='user-info'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('', include(router.urls)),
]