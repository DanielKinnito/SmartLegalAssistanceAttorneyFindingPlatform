-- Client-related tables for Smart Legal Assistance Platform

-- Create client profiles
CREATE TABLE IF NOT EXISTS legal.client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'United States',
    phone VARCHAR(20),
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    occupation VARCHAR(100),
    income_range VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_preferred_contact CHECK (preferred_contact_method IN ('email', 'phone', 'mail'))
);

-- Create cases
CREATE TABLE IF NOT EXISTS legal.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES legal.client_profiles(id) ON DELETE CASCADE,
    attorney_id UUID REFERENCES legal.attorney_profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    case_type VARCHAR(100) NOT NULL,
    status case_status_enum NOT NULL DEFAULT 'pending',
    open_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    close_date TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(20) DEFAULT 'medium',
    is_pro_bono BOOLEAN NOT NULL DEFAULT FALSE,
    is_confidential BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Create case notes
CREATE TABLE IF NOT EXISTS legal.case_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES legal.cases(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create client documents
CREATE TABLE IF NOT EXISTS legal.client_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES legal.client_profiles(id) ON DELETE CASCADE,
    case_id UUID REFERENCES legal.cases(id) ON DELETE SET NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    status document_status_enum NOT NULL DEFAULT 'draft',
    is_template BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create client appointments
CREATE TABLE IF NOT EXISTS legal.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES legal.client_profiles(id) ON DELETE CASCADE,
    attorney_id UUID NOT NULL REFERENCES legal.attorney_profiles(id) ON DELETE CASCADE,
    case_id UUID REFERENCES legal.cases(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    location VARCHAR(255),
    is_virtual BOOLEAN NOT NULL DEFAULT FALSE,
    meeting_link VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show'))
);

-- Create client billing
CREATE TABLE IF NOT EXISTS legal.billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES legal.client_profiles(id) ON DELETE CASCADE,
    attorney_id UUID NOT NULL REFERENCES legal.attorney_profiles(id) ON DELETE CASCADE,
    case_id UUID REFERENCES legal.cases(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    hours_billed DECIMAL(5, 2),
    hourly_rate DECIMAL(10, 2),
    status payment_status_enum NOT NULL DEFAULT 'pending',
    due_date DATE NOT NULL,
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON legal.client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON legal.cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_attorney_id ON legal.cases(attorney_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON legal.cases(status);
CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON legal.case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON legal.client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_case_id ON legal.client_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON legal.appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_attorney_id ON legal.appointments(attorney_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON legal.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_billing_client_id ON legal.billing(client_id);
CREATE INDEX IF NOT EXISTS idx_billing_case_id ON legal.billing(case_id); 