# Database Documentation

This directory contains the database setup, schema, and migration scripts for the Smart Legal Assistance Platform.

## Overview

The platform uses PostgreSQL as its primary database. The database schema is designed to support:

- User authentication and authorization
- Attorney profiles and specializations
- Client information and case management
- Document generation and management
- Chat history and AI interactions
- Activity logging for audit purposes

## Schema

The `schema` directory contains the SQL scripts to create the database structure:

- `00_init.sql` - Initial database creation script
- `01_users.sql` - User-related tables
- `02_attorneys.sql` - Attorney profile tables
- `03_clients.sql` - Client information tables
- `04_documents.sql` - Document management tables
- `05_chatbot.sql` - AI chatbot interaction tables

## Migrations

The `migrations` directory contains migration scripts to update the database schema when changes are needed. These migrations are managed through Django's migration system.

## Database Setup

### Local Development

1. Install PostgreSQL 13 or higher
2. Create a new database:
   ```sql
   CREATE DATABASE legal_assistance_db;
   CREATE USER postgres_user WITH PASSWORD 'postgres_password';
   GRANT ALL PRIVILEGES ON DATABASE legal_assistance_db TO postgres_user;
   ```
3. Update the environment variables in `.env` with your database credentials
4. Run the migrations:
   ```
   cd SmartLegalAssistanceBackend
   python manage.py migrate
   ```

### Using Docker

If you're using Docker, the database is automatically set up when you run:
```
docker-compose up
```

The Docker setup uses the environment variables from the `.env` file.

## Entity Relationship Diagram

Below is a simplified ER diagram of the main database entities:

```
┌─────────┐        ┌──────────┐        ┌──────────┐
│  User   │        │ Attorney │        │  Client  │
├─────────┤        ├──────────┤        ├──────────┤
│ id      │─┐      │ id       │        │ id       │
│ email   │ │      │ user_id  │┼───────│ user_id  │
│ name    │ │      │ specialty│        │ address  │
│ role    │ └──────│ bio      │        │ phone    │
└─────────┘        └──────────┘        └──────────┘
     │                   │                   │
     │                   │                   │
     ▼                   ▼                   ▼
┌─────────┐        ┌──────────┐        ┌──────────┐
│ UserActivity    │ Document  │        │   Case   │
├─────────┤        ├──────────┤        ├──────────┤
│ id      │        │ id       │        │ id       │
│ user_id │        │ title    │        │ client_id│
│ action  │        │ content  │        │ attorney_id
│ timestamp        │ created_at        │ status   │
└─────────┘        └──────────┘        └──────────┘
```

## Backup and Restore

### Backup

To backup the database:

```
pg_dump -U postgres_user -d legal_assistance_db -F c -f backup.dump
```

### Restore

To restore from a backup:

```
pg_restore -U postgres_user -d legal_assistance_db -c backup.dump
``` 