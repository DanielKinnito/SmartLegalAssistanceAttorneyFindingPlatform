"""
Settings package initialization.
The actual settings are loaded based on DJANGO_SETTINGS_MODULE.

Possible values:
- config.settings (default, uses the main settings.py file)
- config.settings.production 
- config.settings.development
- config.settings.test
"""

# This file intentionally left empty since settings are loaded
# through the DJANGO_SETTINGS_MODULE environment variable

import os

# Default to production settings, can be overridden by setting DJANGO_SETTINGS_MODULE
# environment variable to 'config.settings.development' or another module
from .production import * 