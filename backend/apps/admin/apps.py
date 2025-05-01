from django.apps import AppConfig


class AdminAppConfig(AppConfig):
    name = 'apps.admin'
    label = 'admin_app'  # Using a unique label to avoid conflict with Django's admin
    default_auto_field = 'django.db.models.BigAutoField'
    verbose_name = 'Platform Administration' 