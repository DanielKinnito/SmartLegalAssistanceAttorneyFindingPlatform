# Settings to disable Django migrations
# Import this at the end of your settings file

# Disable all migrations
MIGRATION_MODULES = {
    'admin': 'smart_legal_assistance.migrations_not_used',
    'auth': 'smart_legal_assistance.migrations_not_used',
    'contenttypes': 'smart_legal_assistance.migrations_not_used',
    'sessions': 'smart_legal_assistance.migrations_not_used',
    'messages': 'smart_legal_assistance.migrations_not_used',
    'staticfiles': 'smart_legal_assistance.migrations_not_used',
    'users': 'smart_legal_assistance.migrations_not_used',
    'attorneys': 'smart_legal_assistance.migrations_not_used',
    'clients': 'smart_legal_assistance.migrations_not_used',
    'admin': 'smart_legal_assistance.migrations_not_used',
    'chatbot': 'smart_legal_assistance.migrations_not_used',
    'document_generation': 'smart_legal_assistance.migrations_not_used',
    'oauth2_provider': 'smart_legal_assistance.migrations_not_used',
    'social_django': 'smart_legal_assistance.migrations_not_used',
    'token_blacklist': 'smart_legal_assistance.migrations_not_used',
}
