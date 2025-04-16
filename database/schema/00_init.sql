-- Database initialization script for Smart Legal Assistance Platform

-- Create the database if it doesn't exist
-- Note: This must be run as a PostgreSQL superuser
-- CREATE DATABASE legal_assistance_db;

-- Connect to the database
\c legal_assistance_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "hstore";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS legal;
CREATE SCHEMA IF NOT EXISTS audit;

-- Create custom types
CREATE TYPE user_role_enum AS ENUM ('admin', 'attorney', 'client', 'staff');
CREATE TYPE case_status_enum AS ENUM ('pending', 'active', 'closed', 'archived');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE document_status_enum AS ENUM ('draft', 'pending_review', 'approved', 'finalized');

-- Set search path
SET search_path TO public, auth, legal, audit; 