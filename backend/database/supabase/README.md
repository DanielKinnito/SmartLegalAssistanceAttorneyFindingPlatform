# Supabase Database Setup Guide

This guide explains how to set up your Supabase database for the Smart Legal Assistance Platform and configure the Django backend to use it.

## Prerequisites

- A Supabase account (you can sign up at [supabase.com](https://supabase.com))
- Access to your project's environment variables or `.env` file

## Step 1: Create a New Supabase Project

1. Log in to your Supabase account
2. Click "New Project"
3. Enter a name for your project (e.g., "smart-legal-assistance")
4. Choose a secure database password
5. Select the region closest to your users
6. Click "Create new project"

## Step 2: Set Up the Database Schema

1. Once your project is created, go to the SQL Editor in the Supabase dashboard
2. Create a new query
3. Copy and paste the entire contents of the `schema.sql` file into the SQL editor
4. Run the query to create all tables and relationships

## Step 3: Get Your Connection Details

From your Supabase dashboard:

1. Go to Project Settings → Database
2. Under "Connection string", select "URI" to see your database connection string
3. Note your connection string (it will look something like `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres`)
4. Also note your Supabase URL and API Key from Project Settings → API

## Step 4: Configure Django Environment Variables

Update your `.env` file with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_HOST=db.[YOUR-PROJECT-ID].supabase.co
DB_PORT=5432

# Supabase Configuration
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
SUPABASE_KEY=[YOUR-API-KEY]
```

## Step 5: Update Django Settings

Your Django `settings.py` file should be configured to use the environment variables for database configuration. It should look something like this:

```python
DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.environ.get('DB_NAME', 'postgres'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

## Step 6: Install PostgreSQL Dependencies

Make sure to install the necessary Python packages:

```bash
pip install psycopg2-binary dj-database-url
```

Add these to your `requirements.txt` file.

## Step 7: Disable Django Migrations (Important!)

Since we've created our schema directly in Supabase, we need to tell Django not to try to create tables:

1. Set `MIGRATION_MODULES` in your `settings.py`:

```python
MIGRATION_MODULES = {app: 'smart_legal_assistance.migrations_not_used' for app in INSTALLED_APPS}
```

2. Create a migration directory but don't run any migrations:

```bash
mkdir -p smart_legal_assistance/migrations_not_used
touch smart_legal_assistance/migrations_not_used/__init__.py
```

## Step 8: Configure Django Models

Your Django models should be set to use the existing tables. The `Meta` class in each model should have the correct `db_table` attribute matching the tables we created in Supabase.

## Step 9: Test the Connection

Run the following commands to test your connection:

```bash
python manage.py shell

# In the shell
from django.db import connection
cursor = connection.cursor()
cursor.execute("SELECT version();")
cursor.fetchone()
# Should return something like ('PostgreSQL 14.1 on x86_64-pc-linux-gnu...', )
```

## Notes on File Storage

For storing files (like attorney credentials or client documents), you have two options:

1. **Supabase Storage Buckets**: Create buckets in Supabase for document storage
2. **Amazon S3**: Configure Django to use S3 for file storage

The recommended approach is to use Supabase Storage since you're already using Supabase for the database.

## Accessing the API Documentation (Swagger UI)

After starting the server, the Swagger UI API documentation is available at:

```
http://localhost:8000/api/swagger/
```

Or if deployed to a server:

```
https://your-domain.com/api/swagger/
```

## Troubleshooting

- **Connection Issues**: Make sure your IP is allowed in Supabase's "Database Settings" → "Connection Pooling"
- **Migration Errors**: If you see Django trying to create tables that already exist, double-check the `MIGRATION_MODULES` setting
- **Authentication Errors**: Verify your database password and connection string 