# Supabase Database Setup Guide

This guide walks you through setting up your database in Supabase and migrating the schema.

## Setting Up Supabase

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com/) and sign up for a free account

2. **Create a New Project**
   - Click "New Project"
   - Enter a name (e.g., "Smart Legal Assistance")
   - Create a secure password (save this for your .env file)
   - Select a region closest to your users
   - Click "Create new project"

3. **Get Connection Information**
   - Navigate to Settings > Database
   - In the "Connection Info" section, you'll find:
     - Host: `[your-project-ref].supabase.co` (not db.[your-project-ref].supabase.co)
     - Port: `5432`
     - Database: `postgres`
     - User: `postgres`
     - Password: The password you set when creating the project

4. **Update Your .env File**
   - Update the database connection variables in your .env file:
   ```
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-supabase-db-password
   DB_HOST=your-project-ref.supabase.co
   DB_PORT=5432
   ```

## Migrating the Schema

### Option 1: Using Django Migrations

1. **Run Migrations**
   ```bash
   cd SmartLegalAssistanceBackend
   python manage.py migrate
   ```

2. **Create a Superuser**
   ```bash
   python manage.py createsuperuser
   ```

### Option 2: Using SQL Scripts

If you prefer to set up the database using raw SQL scripts:

1. **Navigate to the SQL Editor**
   - In Supabase, go to the "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run the Schema Scripts**
   - Copy and paste the contents of the schema files in order:
     1. `database/schema/00_init.sql` (without the `\c` command since you're already connected)
     2. `database/schema/01_users.sql`
     3. `database/schema/02_attorneys.sql`
     4. `database/schema/03_clients.sql`
     5. `database/schema/04_chatbot.sql`

   - Click "Run" after pasting each script

3. **Ensure Proper Order**
   - The scripts must be run in the correct order because of dependencies:
     - `00_init.sql` creates the necessary extensions and types
     - `01_users.sql` creates user-related tables
     - `02_attorneys.sql` depends on user tables
     - `03_clients.sql` depends on both user and attorney tables
     - `04_chatbot.sql` depends on client, case, and document tables

## Schema Verification

You can verify that your schema was created correctly:

1. **Check Tables in Supabase**
   - Go to the "Table Editor" in the left sidebar
   - You should see all the tables defined in your schema files

2. **Run a Test Query**
   - In the SQL Editor, run:
   ```sql
   SELECT schema_name, table_name 
   FROM information_schema.tables 
   WHERE table_schema IN ('auth', 'legal', 'audit')
   ORDER BY schema_name, table_name;
   ```

## Initializing Data

You may want to initialize some basic data:

1. **Create Specialties**
   ```sql
   INSERT INTO legal.specialties (name, description)
   VALUES
   ('Family Law', 'Legal matters relating to family relationships'),
   ('Criminal Defense', 'Representing clients charged with crimes'),
   ('Personal Injury', 'Cases involving injury due to negligence'),
   ('Corporate Law', 'Legal aspects of corporate operations'),
   ('Intellectual Property', 'Protection of intellectual creations'),
   ('Immigration Law', 'Legal matters concerning immigration status'),
   ('Employment Law', 'Legal aspects of employer-employee relationships'),
   ('Real Estate', 'Property law and transactions'),
   ('Tax Law', 'Tax planning, disputes, and compliance'),
   ('Estate Planning', 'Wills, trusts, and succession planning');
   ```

2. **Create Basic Permissions**
   ```sql
   INSERT INTO auth.permissions (name, description)
   VALUES
   ('view_attorneys', 'Can view attorney profiles'),
   ('edit_profile', 'Can edit own profile'),
   ('manage_users', 'Can manage user accounts'),
   ('manage_content', 'Can manage site content'),
   ('approve_attorneys', 'Can approve attorney registrations');
   
   INSERT INTO auth.roles (name, description)
   VALUES
   ('admin', 'Administrator with all permissions'),
   ('attorney', 'Registered attorney'),
   ('client', 'Client user'),
   ('moderator', 'Content moderator');
   ```

## Backups and Maintenance

- Supabase automatically creates backups of your database
- You can download a full database backup from Settings > Database > Backups
- For additional security, set up your own periodic backups using pg_dump

## Next Steps

After setting up your database:

1. Test the connection from your Django application
2. Run a quick health check to ensure all is working
3. Set up database monitoring in Supabase (Settings > Database > Monitoring)

## Troubleshooting

- **Connection Issues**: Ensure your IP is allowed in Supabase network settings
- **Migration Errors**: Check for conflicts between Django models and SQL schema
- **Performance Issues**: Consider adding indexes to frequently queried columns 