import os

# Default to production settings, can be overridden by setting DJANGO_SETTINGS_MODULE
# environment variable to 'config.settings.development' or another module
from .production import * 