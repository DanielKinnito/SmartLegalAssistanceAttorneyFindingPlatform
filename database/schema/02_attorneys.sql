-- Attorney-related tables for Smart Legal Assistance Platform

-- Create legal specialties table
CREATE TABLE IF NOT EXISTS legal.specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create attorney profiles
CREATE TABLE IF NOT EXISTS legal.attorney_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    bar_admission_date DATE NOT NULL,
    bar_state VARCHAR(2) NOT NULL,
    years_of_experience INTEGER NOT NULL DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    bio TEXT,
    education TEXT,
    firm_name VARCHAR(255),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_date TIMESTAMP WITH TIME ZONE,
    availability_status VARCHAR(20) NOT NULL DEFAULT 'available',
    rating DECIMAL(3, 2) CHECK (rating >= 0.0 AND rating <= 5.0),
    consultation_fee DECIMAL(10, 2),
    profile_views INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_bar_state CHECK (bar_state ~ '^[A-Z]{2}$'),
    CONSTRAINT valid_availability_status CHECK (availability_status IN ('available', 'unavailable', 'busy', 'vacation'))
);

-- Create attorney specialties (junction table)
CREATE TABLE IF NOT EXISTS legal.attorney_specialties (
    attorney_id UUID NOT NULL REFERENCES legal.attorney_profiles(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES legal.specialties(id) ON DELETE CASCADE,
    years_of_experience INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (attorney_id, specialty_id)
);

-- Create attorney certifications
CREATE TABLE IF NOT EXISTS legal.attorney_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attorney_id UUID NOT NULL REFERENCES legal.attorney_profiles(id) ON DELETE CASCADE,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiration_date DATE,
    certification_id VARCHAR(100),
    document_url VARCHAR(255),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create attorney availability schedule
CREATE TABLE IF NOT EXISTS legal.attorney_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attorney_id UUID NOT NULL REFERENCES legal.attorney_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    recurrence_type VARCHAR(20) DEFAULT 'weekly',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT valid_recurrence_type CHECK (recurrence_type IN ('once', 'daily', 'weekly', 'biweekly', 'monthly'))
);

-- Create attorney reviews
CREATE TABLE IF NOT EXISTS legal.attorney_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attorney_id UUID NOT NULL REFERENCES legal.attorney_profiles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_client_review UNIQUE (attorney_id, client_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_attorney_profiles_user_id ON legal.attorney_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_attorney_profiles_bar_state ON legal.attorney_profiles(bar_state);
CREATE INDEX IF NOT EXISTS idx_attorney_profiles_rating ON legal.attorney_profiles(rating);
CREATE INDEX IF NOT EXISTS idx_attorney_specialties_attorney_id ON legal.attorney_specialties(attorney_id);
CREATE INDEX IF NOT EXISTS idx_attorney_specialties_specialty_id ON legal.attorney_specialties(specialty_id);
CREATE INDEX IF NOT EXISTS idx_attorney_availability_attorney_id ON legal.attorney_availability(attorney_id);
CREATE INDEX IF NOT EXISTS idx_attorney_reviews_attorney_id ON legal.attorney_reviews(attorney_id);
CREATE INDEX IF NOT EXISTS idx_attorney_reviews_client_id ON legal.attorney_reviews(client_id); 