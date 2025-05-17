-- Smart Legal Assistance Platform - Database Schema for Supabase
-- This script creates all necessary tables for the application

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (auth)
CREATE TABLE auth_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    phone_number VARCHAR(15),
    user_type VARCHAR(20) NOT NULL,
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    date_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attorney specialties
CREATE TABLE attorney_specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attorneys
CREATE TABLE attorneys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_status VARCHAR(20) DEFAULT 'PENDING',
    years_of_experience INTEGER DEFAULT 0,
    bio TEXT,
    education TEXT,
    office_address TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_pro_bono BOOLEAN DEFAULT FALSE,
    ratings_average DECIMAL(3,2) DEFAULT 0.0,
    ratings_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT attorney_user_key UNIQUE (user_id)
);

-- Attorney specialties relationship (many-to-many)
CREATE TABLE attorney_specialties_rel (
    attorney_id UUID REFERENCES attorneys(id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES attorney_specialties(id) ON DELETE CASCADE,
    PRIMARY KEY (attorney_id, specialty_id)
);

-- Attorney credentials
CREATE TABLE attorney_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attorney_id UUID NOT NULL REFERENCES attorneys(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth_user(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attorney availability slots
CREATE TABLE attorney_availability_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attorney_id UUID NOT NULL REFERENCES attorneys(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL, -- 0=Monday, 6=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    address TEXT,
    preferred_language VARCHAR(50),
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT client_user_key UNIQUE (user_id)
);

-- Client pro bono profiles
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    probono_requested BOOLEAN DEFAULT FALSE,
    probono_reason TEXT,
    income_level VARCHAR(50),
    probono_document VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT client_profile_user_key UNIQUE (user_id)
);

-- Legal requests
CREATE TABLE legal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    attorney_id UUID NOT NULL REFERENCES attorneys(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    is_pro_bono BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client attorney reviews
CREATE TABLE client_attorney_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    attorney_id UUID NOT NULL REFERENCES attorneys(id) ON DELETE CASCADE,
    legal_request_id UUID REFERENCES legal_requests(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT client_attorney_review_unique UNIQUE (client_id, attorney_id, legal_request_id)
);

-- User activity logs
CREATE TABLE user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to automatically update ratings
CREATE OR REPLACE FUNCTION update_attorney_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE attorneys
    SET 
        ratings_count = (SELECT COUNT(*) FROM client_attorney_reviews WHERE attorney_id = NEW.attorney_id),
        ratings_average = (SELECT COALESCE(AVG(rating), 0.0) FROM client_attorney_reviews WHERE attorney_id = NEW.attorney_id)
    WHERE id = NEW.attorney_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert_or_update
    AFTER INSERT OR UPDATE ON client_attorney_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_attorney_ratings();

-- Create trigger to update last_modified timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modified = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_modtime
    BEFORE UPDATE ON auth_user
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create indexes for performance
CREATE INDEX idx_user_email ON auth_user(email);
CREATE INDEX idx_user_type ON auth_user(user_type);
CREATE INDEX idx_attorney_license ON attorneys(license_number);
CREATE INDEX idx_attorney_rating ON attorneys(ratings_average);
CREATE INDEX idx_legal_requests_status ON legal_requests(status);
CREATE INDEX idx_legal_requests_created ON legal_requests(created_at);
CREATE INDEX idx_client_attorney_reviews_rating ON client_attorney_reviews(rating); 