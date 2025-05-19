# Supabase Connection Scripts

This directory contains scripts for connecting to and working with your Supabase PostgreSQL database.

## Setup

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the project root directory with your Supabase credentials:

```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Li+!v7S!9RQu2?c
DB_HOST=db.iubskuvezsqbqqjqnvla.supabase.co
DB_PORT=5432
SUPABASE_URL=https://iubskuvezsqbqqjqnvla.supabase.co
SUPABASE_KEY=[YOUR-API-KEY]
```

## Available Scripts

### 1. `connect_supabase.py`

Basic connection script that provides functions to connect to your Supabase PostgreSQL database.

**Usage:**
```bash
python connect_supabase.py
```

This will test the connection to your Supabase database and list available tables.

**Functions:**
- `load_environment()` - Loads environment variables from .env file
- `connect_to_supabase()` - Returns a database connection
- `run_custom_query(query)` - Runs a custom SQL query and returns results
- `test_connection()` - Tests the database connection

### 2. `supabase_utils.py`

Utility script with helpful commands for working with your Supabase database.

**Usage:**
```bash
# List all tables
python supabase_utils.py list-tables

# Describe a table structure
python supabase_utils.py describe auth_user

# Query data from a table
python supabase_utils.py query auth_user --limit 5 --where "is_active=true" --order-by "id DESC"

# Export data to a file
python supabase_utils.py export --table auth_user --format json
python supabase_utils.py export --format json  # Export all tables

# Run a custom SQL query
python supabase_utils.py custom "SELECT id, username, email FROM auth_user WHERE is_active = true"
```

## Integrating with Django

To use these scripts in your Django project:

1. Import the connect_supabase module in your Python scripts:
```python
from database.supabase.connect_supabase import connect_to_supabase, run_custom_query

# Connect to the database
connection = connect_to_supabase()

# Run a query
result = run_custom_query('SELECT * FROM auth_user LIMIT 5')
```

2. Use Django's settings to connect:
```python
# In your Django views or management commands
def my_function():
    from django.db import connection
    
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM auth_user LIMIT 5")
        rows = cursor.fetchall()
        return rows
```

## Troubleshooting

If you encounter connection issues:

1. Verify your database credentials in the .env file
2. Check if your IP address is allowed in the Supabase dashboard
3. Ensure the Supabase database is up and running
4. Check for any special characters in your password that might need escaping
5. Verify that the required Python packages are installed

For password issues with special characters, use direct connection parameters instead of DATABASE_URL:
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Li+!v7S!9RQu2?c
DB_HOST=db.iubskuvezsqbqqjqnvla.supabase.co
DB_PORT=5432
``` 