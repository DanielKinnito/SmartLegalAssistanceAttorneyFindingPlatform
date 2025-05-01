"""
URL configuration for client_service project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('client_service.api.urls')),
] 