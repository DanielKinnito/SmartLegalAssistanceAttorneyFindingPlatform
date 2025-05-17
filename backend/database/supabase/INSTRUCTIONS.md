# Migrating from SQLite to Supabase

This guide provides step-by-step instructions for migrating your Smart Legal Assistance Platform from SQLite to Supabase PostgreSQL.

## Step 1: Set Up Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Set a secure database password
4. Note your project URL and API key from the project settings

## Step 2: Create the Database Schema

1. In the Supabase dashboard, go to the SQL Editor
2. Create a new query and paste the entire contents of `schema.sql`
3. Run the query to create all tables and relationships

## Step 3: Update Dependencies

Ensure you have the necessary PostgreSQL dependencies in your `requirements.txt`:

```
psycopg2-binary>=2.9.3
dj-database-url>=0.5.0
django-storages>=1.12.3
boto3>=1.24.59
```

Install these dependencies:

```bash
pip install -r requirements.txt
```

## Step 4: Update Environment Variables

1. Copy the sample environment file:
   ```bash
   cp database/supabase/env.sample .env
   ```

2. Update the values in `.env` with your actual Supabase credentials:
   - Replace `[YOUR-PASSWORD]` with your Supabase database password
   - Replace `[YOUR-PROJECT-ID]` with your Supabase project ID
   - Replace `[YOUR-API-KEY]` with your Supabase API key
   - Update other environment variables as needed

## Step 5: Update Django Settings

1. Modify your `config/settings/base.py` file to use the PostgreSQL database with Supabase:

   ```python
   # Add this import at the top
   import dj_database_url
   
   # Replace the existing DATABASES setting
   DATABASES = {
       'default': {
           'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.postgresql'),
           'NAME': os.environ.get('DB_NAME', 'postgres'),
           'USER': os.environ.get('DB_USER', 'postgres'),
           'PASSWORD': os.environ.get('DB_PASSWORD', ''),
           'HOST': os.environ.get('DB_HOST', 'localhost'),
           'PORT': os.environ.get('DB_PORT', '5432'),
           'OPTIONS': {
               'sslmode': 'require',
           },
       }
   }
   ```

   For production, you can use the more concise format:

   ```python
   DATABASES = {
       'default': dj_database_url.config(
           default=os.environ.get('DATABASE_URL'),
           conn_max_age=600,
           conn_health_checks=True,
           ssl_require=True,
       )
   }
   ```

2. Add the `MIGRATION_MODULES` setting to prevent Django from managing migrations:

   ```python
   # Prevent Django from trying to create tables that already exist
   MIGRATION_MODULES = {app.split('.')[-1]: 'smart_legal_assistance.migrations_not_used' 
                       for app in INSTALLED_APPS if '.' in app}
   ```

3. Create the migrations directory:

   ```bash
   mkdir -p smart_legal_assistance/migrations_not_used
   touch smart_legal_assistance/migrations_not_used/__init__.py
   ```

## Step 6: Configure File Storage (Optional but Recommended)

To use Supabase Storage for file uploads:

1. Add the following to your settings:

   ```python
   # File storage configuration
   DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
   
   # Supabase Storage configurations
   AWS_ACCESS_KEY_ID = os.environ.get('SUPABASE_STORAGE_KEY', '')
   AWS_SECRET_ACCESS_KEY = os.environ.get('SUPABASE_STORAGE_SECRET', '')
   AWS_STORAGE_BUCKET_NAME = os.environ.get('SUPABASE_STORAGE_BUCKET', '')
   AWS_S3_ENDPOINT_URL = f"{os.environ.get('SUPABASE_URL')}/storage/v1"
   AWS_S3_OBJECT_PARAMETERS = {
       'CacheControl': 'max-age=86400',
   }
   AWS_DEFAULT_ACL = 'public-read'
   AWS_QUERYSTRING_AUTH = False
   ```

2. Create a storage bucket in Supabase:
   - Go to Storage in the Supabase dashboard
   - Create a new bucket named `media`
   - Set the bucket to public
   - Update your environment variables with the proper credentials

## Step 7: Test the Connection

Test your connection to Supabase:

```bash
python manage.py shell

# In the shell
from django.db import connection
cursor = connection.cursor()
cursor.execute("SELECT version();")
cursor.fetchone()
```

## Step 8: Start Using with Existing Models

Your Django models with the `db_table` attributes should now connect to the Supabase tables.

## Note on Data Migration

If you have existing data in your SQLite database:

1. For a small amount of data, you can use Django's admin interface to manually re-create records
2. For larger datasets, consider using a tool like `pgloader` to migrate data from SQLite to PostgreSQL
3. For complex migrations, writing a custom Python script using Django ORM may be best

## Troubleshooting

Common issues and their solutions:

1. **Connection errors**: Ensure your IP is allowed in Supabase
2. **SSL errors**: Make sure `sslmode='require'` is set in the database OPTIONS
3. **Migrations trying to run**: Check your `MIGRATION_MODULES` setting
4. **File upload errors**: Check your Supabase storage bucket permissions

## Accessing Swagger UI

After setting up your database and starting the server, you can access the API documentation at:

```
http://localhost:8000/swagger/
```

Or if deployed:

```
https://your-domain.com/swagger/
```

## Related Documentation

- [Django documentation](https://docs.djangoproject.com/en/4.2/ref/databases/#postgresql-notes)
- [Supabase documentation](https://supabase.com/docs)
- [django-storages documentation](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html) 