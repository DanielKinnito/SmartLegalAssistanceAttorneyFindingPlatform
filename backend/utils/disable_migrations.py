"""
Script to configure Django to skip creating tables that already exist.
Run before migrations to avoid duplicate table errors.
"""
# ...existing code...
def disable_migrations():
    """Configure Django to skip migrations for existing tables. Use when your database schema is already established."""
    # ...existing code...
