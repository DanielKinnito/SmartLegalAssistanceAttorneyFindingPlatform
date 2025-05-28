# Supabase Database Connection Guide for Render.com

This guide outlines how to properly set up your Django application on Render.com to use a Supabase PostgreSQL database.

## Common Issues and Solutions

The most common issues with Supabase database connections on Render.com are:

1. **Connection URL Format Issues**: The DATABASE_URL must have the correct format
2. **IPv6 Incompatibility**: Render.com supports only IPv4, so you must use the Supabase Pooler connections
3. **Improper URL Parsing**: Django's database URL parser can be sensitive to URL format

## Correct DATABASE_URL Format

**The proper format for your Supabase Transaction Pooler URL is:**

```
postgresql://postgres.iubskuvezsqbqqjqnvla:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

Make sure:

1. The URL starts with `postgresql://` (not just `postgresql:`)
2. You're using the Transaction Pooler hostname and port (aws-0-eu-central-1.pooler.supabase.com:6543)
3. The username is `postgres.iubskuvezsqbqqjqnvla` (not just `postgres`)
4. Special characters in the password are properly URL-encoded

## Setting Up on Render.com

1. **Test your connection locally first**:
   ```
   python utils/test_supabase_connection.py
   ```

2. **Set the correct environment variables on Render.com**:
   - Navigate to your Web Service in the Render Dashboard
   - Go to "Environment"
   - Add the DATABASE_URL with the proper format from above

3. **Force a redeployment**:
   - Go to "Manual Deploy"
   - Choose "Clear build cache & deploy"

4. **Check the logs**:
   - If you still see issues, run the debug script on your server: 
   - Add this to your startup script: `python utils/debug_database_url.py`
   - Check the logs for formatting issues in your DATABASE_URL

## Testing the Connection

To test if your database connection is working properly, run:

```
python utils/debug_database_url.py
```

This will analyze your DATABASE_URL and identify any formatting issues.

## Troubleshooting

If you're still experiencing issues:

1. **Check if your DATABASE_URL has a prefix**:
   Sometimes the DATABASE_URL environment variable includes its own name as a prefix (`DATABASE_URL=postgresql://...`). Remove this prefix.

2. **Check for proper URL format**:
   Make sure your DATABASE_URL has the correct scheme (`postgresql://`) and includes all necessary components.

3. **Use the Transaction Pooler**:
   Make sure you're using the Transaction Pooler connection (port 6543) which is recommended for web applications and supports IPv4.

4. **Verify credentials**:
   Double-check that your username and password are correct and properly URL-encoded.

5. **Set environment variables directly**:
   If all else fails, SSH into your instance and set the DATABASE_URL directly in the environment.

## Manually Verifying the Connection

You can manually verify the connection by running:

```bash
psql "postgresql://postgres.iubskuvezsqbqqjqnvla:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

## Schema Issues

If your schema doesn't exist or is incomplete:

1. **Create the tables manually**: 
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Load initial data**:
   ```
   python manage.py loaddata initial_data.json
   ```

3. **Check schema compatibility**:
   Make sure your models match the existing schema in Supabase.