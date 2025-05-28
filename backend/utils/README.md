# Utils Directory

This directory contains utility scripts for the Smart Legal Assistance backend. These scripts are used for database management, testing, deployment, and maintenance tasks.

## Scripts Overview
- `add_user_names.py`: Updates user names in the database.
- `check_db_schema.py`: Checks the schema of a specific table in the database.
- `check_email_tokens_table.py`: Checks if the email tokens table exists and prints its schema.
- `check_profiles.py`: Checks for missing or incomplete user profiles.
- `check_supabase.py`: Verifies the connection to Supabase.
- `create_missing_profiles.py`: Creates missing client and attorney profiles. (Uses placeholder values for some fields; update as needed.)
- `debug_database_url.py`: Debugs and validates the DATABASE_URL environment variable.
- `direct_supabase_test.py`: Tests direct connections to Supabase using various methods.
- `disable_migrations.py`: Configures Django to skip migrations for existing tables.
- `fix_db_issue.py`: Backs up and resets the database, and configures migration settings.
- `fix_models.py`: Fixes model conflicts in the users app.
- `render_deploy.py`: Automates Render.com deployment steps.
- `render_deploy_updated.py`: Improved Render.com deployment script.
- `setup_render.py`: Sets up the Render.com deployment environment.
- `test_supabase_connection.py`: Tests Supabase database connections.
- `test_supabase_connection_ipv6.py`: Tests Supabase connection over IPv6.
- `test_supabase_direct.py`: Directly tests Supabase connection.

## Note on Placeholders
Some scripts (e.g., `create_missing_profiles.py`) use placeholder values for required fields. Please update these with real data as needed for your deployment.
