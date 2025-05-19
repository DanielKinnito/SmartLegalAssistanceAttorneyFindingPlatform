# Supabase Integration Index

This directory contains all the resources you need to set up Supabase as your database for the Smart Legal Assistance Platform.

## Files in this Directory

- **schema.sql**: The complete SQL schema for creating all tables in Supabase
- **INSTRUCTIONS.md**: Step-by-step instructions for migrating from SQLite to Supabase
- **README.md**: General guide for setting up Supabase with Django
- **env.sample**: Sample environment variables file with all required Supabase settings
- **settings_update.py**: Code snippets to update your Django settings files
- **model_integration.md**: Guide for adapting your Django models to work with the Supabase schema
- **swagger_guide.md**: Instructions for accessing and using the Swagger UI

## Quick Start

1. Create a Supabase account and project
2. Run the SQL from `schema.sql` in the Supabase SQL Editor
3. Update your environment variables using `env.sample` as a template
4. Update your Django settings based on `settings_update.py`
5. Adapt your models according to `model_integration.md`
6. Start your server and access the API through Swagger UI

## Database Schema Overview

Our Supabase schema includes the following tables:

- **auth_user**: Base user accounts with authentication details
- **attorneys**: Attorney profiles with professional information
- **attorney_specialties**: Legal specialties that attorneys can have
- **attorney_specialties_rel**: Junction table for attorney-specialty relationships
- **attorney_credentials**: Documents and credentials for attorneys
- **attorney_availability_slots**: Attorney availability schedule
- **clients**: Client profiles with personal information
- **client_profiles**: Pro bono related information for clients
- **legal_requests**: Client requests for legal assistance
- **client_attorney_reviews**: Client reviews for attorneys
- **user_activity**: Activity logs for auditing and tracking

## Common Tasks

### Adding a New Table

1. Add the SQL to create the table in Supabase
2. Create or update the corresponding Django model with the correct `db_table` attribute

### Modifying an Existing Table

1. Create an SQL ALTER TABLE statement and run it in Supabase
2. Update the Django model to match the new schema

### Running Django Commands with Supabase

Most Django management commands should work normally, but avoid commands that try to modify the database schema such as `makemigrations` and `migrate`.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs/reference/javascript/supabase-client)
- [Django-Postgres Integration](https://docs.djangoproject.com/en/4.2/ref/databases/#postgresql-notes)
- [Django REST Framework Documentation](https://www.django-rest-framework.org/) 