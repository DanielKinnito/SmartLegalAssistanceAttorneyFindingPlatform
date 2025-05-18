"""
Main settings file for the project that imports from production settings
and adds explicit ALLOWED_HOSTS to fix render.com deployment issues.
"""
import os
from pathlib import Path

# Import all settings from production
from config.settings.production import *

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# EXPLICITLY set allowed hosts to fix the deployment issue
ALLOWED_HOSTS = [
    'smart-legal-assistance.onrender.com',
    'www.smart-legal-assistance.onrender.com',
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
]

# Also update CORS settings to match
CORS_ALLOWED_ORIGINS = [
    'https://smart-legal-assistance.onrender.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

print(f"Loaded settings.py with ALLOWED_HOSTS: {ALLOWED_HOSTS}") 