# Database Connection Troubleshooting

This document provides solutions for common database connection issues with Supabase.

## Connection Timeout Issues

If you're experiencing a connection timeout when trying to connect to Supabase:

```
Error connecting to the database: connection to server at "your-project-ref.supabase.co", port 5432 failed: Connection timed out
```

### Possible Solutions:

1. **Firewall Issues**: Your local network might be blocking outgoing connections to port 5432.
   - Ask your network administrator to allow outgoing connections to port 5432
   - Try connecting from a different network (e.g., mobile hotspot)

2. **Supabase Network Restrictions**: Your IP address might not be in the allowed list.
   - In Supabase dashboard, go to Settings > Database > Network Restrictions
   - Add your current IP address to the allowed list
   - Enable "Allow All Connections" temporarily for testing (not recommended for production)

3. **Incorrect Connection String**: Double-check your connection information.
   - Verify the project reference in the hostname is correct
   - Use the format `your-project-ref.supabase.co` (not `db.your-project-ref.supabase.co`)
   - Ensure database name is `postgres` (the default for Supabase)
   - Verify your password is correct

4. **Supabase Maintenance**: Supabase might be undergoing maintenance.
   - Check the Supabase status page: [status.supabase.com](https://status.supabase.com/)
   - Wait and try again later

## Authentication Issues

If you can connect but get authentication errors:

```
FATAL: password authentication failed for user "postgres"
```

### Possible Solutions:

1. **Incorrect Password**: Verify the password in your .env file.
   - The password should be the one you set when creating the Supabase project
   - If needed, you can reset the database password in Supabase dashboard under Settings > Database

2. **Using Wrong User**: Make sure you're using the correct database user.
   - For Supabase, the default user is `postgres`
   - Check if you've created any additional database users

## Alternative Connection Methods

If direct connection still doesn't work:

1. **Use Supabase Client Library**: Instead of direct PostgreSQL connection, consider using the Supabase client library which works over HTTPS:
   ```python
   from supabase import create_client
   
   url = "https://your-project-ref.supabase.co"
   key = "your-anon-key"
   supabase = create_client(url, key)
   
   # Run a query
   data = supabase.table("your_table").select("*").execute()
   ```

2. **Use Database Connection Pooling**: Supabase provides a connection pooler that's accessible over the internet:
   - In Supabase dashboard, go to Settings > Database > Connection Pooling
   - Get the connection string for the pooler
   - Update your .env file to use the pooler host and port (usually 6543)

## Testing Connection Step by Step

1. **Test Network Connectivity**: Ensure you can reach the Supabase host:
   ```
   ping your-project-ref.supabase.co
   ```

2. **Test with psql CLI**: If you have PostgreSQL client installed:
   ```
   psql -h your-project-ref.supabase.co -p 5432 -U postgres -d postgres
   ```

3. **Test with a GUI Tool**: Try connecting with a tool like pgAdmin or DBeaver

4. **Review Logs**: Check the Supabase logs in the dashboard for any error messages

Remember to keep your database credentials secure and never commit them to version control! 