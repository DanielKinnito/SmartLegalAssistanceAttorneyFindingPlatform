from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.documentation import include_docs_urls
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.views.generic import RedirectView

schema_view = get_schema_view(
    openapi.Info(
        title="Smart Legal Assistance API",
        default_version='v1',
        description="API documentation for the Smart Legal Assistance Platform",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication URLs
    path('api/auth/', include('djoser.urls')),
    path('oauth/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('auth/', include('social_django.urls', namespace='social')),
    
    # API endpoints for different apps
    path('api/users/', include('apps.users.urls')),
    path('api/attorneys/', include('apps.attorneys.urls')),
    path('api/clients/', include('apps.clients.urls')),
    path('api/admin/', include('apps.admin.urls', namespace='admin_app')),
    path('api/chatbot/', include('apps.chatbot.urls')),
    path('api/documents/', include('apps.document_generation.urls')),
    
    # API documentation
    path('api/docs/', include_docs_urls(title='Smart Legal Assistance API')),
    
    # Swagger documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Redirect root to Swagger UI
    path('', RedirectView.as_view(url='/swagger/', permanent=False), name='index'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 