# Environment Variables Setup Guide

This guide explains how to obtain and configure the environment variables required for the Smart Legal Assistance Platform.

## Basic Configuration

### Django Settings

#### SECRET_KEY
A secret key used for cryptographic signing in Django.

1. Generate a secure random key:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(50))"
   ```
2. Copy the output to the `SECRET_KEY` variable in your `.env` file

#### DEBUG
Toggle debugging mode:
- For development: `DEBUG=True`
- For production: `DEBUG=False`

#### ALLOWED_HOSTS
Comma-separated list of host/domain names that the application can serve:
- Development: `ALLOWED_HOSTS=localhost,127.0.0.1`
- Production: `ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`

## Database Settings

### PostgreSQL

You can either use a local PostgreSQL installation or a cloud provider like Supabase.

#### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine:
   - [PostgreSQL Downloads](https://www.postgresql.org/download/)

2. Create a new database:
   ```sql
   CREATE DATABASE legal_assistance_db;
   CREATE USER postgres_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE legal_assistance_db TO postgres_user;
   ```

3. Configure `.env` variables:
   ```
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=legal_assistance_db
   DB_USER=postgres_user
   DB_PASSWORD=your_secure_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

#### Option 2: Supabase (Recommended)

1. Create a free Supabase account at [supabase.com](https://supabase.com/)

2. Create a new project:
   - Go to the Supabase dashboard
   - Click "New Project"
   - Enter a name for your project
   - Set a secure database password (save this for later)
   - Choose a region closest to your users
   - Click "Create new project"

3. Get your database connection information:
   - In your project dashboard, go to "Settings" > "Database"
   - Find the "Connection Info" section
   - Note the following information:
     - Host: `[your-project-ref].supabase.co` (not db.[your-project-ref].supabase.co)
     - Database name: `postgres`
     - Port: `5432` 
     - User: `postgres`
     - Password: The password you set when creating the project

4. Configure your `.env` file with Supabase details:
   ```
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-supabase-db-password
   DB_HOST=your-project-ref.supabase.co
   DB_PORT=5432
   ```

5. Configure database security:
   - In Supabase, go to "Settings" > "Database"
   - Under "Connection Pooling", ensure that "Pool Mode" is set to "Transaction"
   - Under "Network Restrictions", you might need to add your application's IP to the allowed list in production

## Redis Settings

Redis is used for caching and as a message broker for Celery.

### Local Installation

1. Install Redis:
   - [Redis Downloads](https://redis.io/download)
   - Windows users can use [Memurai](https://www.memurai.com/) (Redis alternative)

2. Configure the `.env` variable:
   ```
   REDIS_URL=redis://localhost:6379/0
   ```

### Cloud Option

1. Create a free Redis instance:
   - [Redis Cloud](https://redis.com/try-free/) (Free tier available)
   - [Upstash](https://upstash.com/) (Free tier available)

2. Configure the `.env` variable with your Redis Cloud URL:
   ```
   REDIS_URL=redis://username:password@host:port/0
   ```

## Email Settings

For development, you can use Mailtrap, a fake SMTP server for testing.

1. Create a free [Mailtrap](https://mailtrap.io/) account

2. Go to your inbox, find the SMTP credentials, and configure the `.env` variables:
   ```
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your_mailtrap_username
   EMAIL_HOST_PASSWORD=your_mailtrap_password
   ```

For production, you can use:
- [SendGrid](https://sendgrid.com/) (Free tier: 100 emails/day)
- [Mailgun](https://www.mailgun.com/) (Free tier: 5,000 emails/month for 3 months)

## JWT Settings

JSON Web Tokens (JWT) are used for authentication.

1. Generate a secure random key for JWT:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(50))"
   ```

2. Configure the `.env` variables:
   ```
   JWT_SECRET_KEY=your_generated_key
   JWT_ACCESS_TOKEN_LIFETIME=5    # Hours
   JWT_REFRESH_TOKEN_LIFETIME=1   # Days
   ```

## OAuth Settings

OAuth is used for third-party authentication (Google, GitHub, etc.).

### Setting up OAuth with Google

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the consent screen if prompted
6. Choose "Web application" as the application type
7. Add redirect URIs:
   - Development: `http://localhost:3000/oauth/callback/google`
   - Production: `https://yourdomain.com/oauth/callback/google`
8. Copy the Client ID and Client Secret to your `.env` file:
   ```
   OAUTH_CLIENT_ID=your_google_client_id
   OAUTH_CLIENT_SECRET=your_google_client_secret
   ```

### Setting up OAuth with GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: "Smart Legal Assistance"
   - Homepage URL: `http://localhost:3000` (or your production URL)
   - Authorization callback URL: `http://localhost:3000/oauth/callback/github`
4. Copy the Client ID and Client Secret to your `.env` file:
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

## Testing Your Configuration

1. Make sure all variables are set in your `.env` file
2. Run Django's check command to verify your configuration:
   ```bash
   python manage.py check
   ```
3. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Security Tips

- Never commit your `.env` file to version control
- Use different environment variables for development and production
- Regularly rotate sensitive credentials like JWT secrets
- Use long, random strings for secret keys
- When deploying to production, use a secure vault service like AWS Secrets Manager or HashiCorp Vault 