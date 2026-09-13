-- Database Schema for Lights Camera Learn Submissions

CREATE TABLE IF NOT EXISTS internship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source_form VARCHAR(255) NOT NULL, -- e.g., '/internship-application' or '/apply-2'
    
    -- Delivery Status
    email_delivery_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    email_delivery_error TEXT,
    
    -- Personal Information
    name VARCHAR(255) NOT NULL,
    pronouns VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    birthday VARCHAR(50) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    address TEXT,
    languages TEXT NOT NULL,
    
    -- Short Answers
    film_project VARCHAR(100),
    favorite_movie TEXT NOT NULL,
    traveled TEXT NOT NULL,
    why_youth TEXT NOT NULL,
    passions TEXT,
    passionate_filmmaking TEXT NOT NULL,
    bring_to_team TEXT NOT NULL,
    
    -- Program Details (Stored as JSON arrays)
    positions JSONB NOT NULL,
    program JSONB NOT NULL,
    disabilities VARCHAR(50),
    
    -- Agreements
    costs_agreement BOOLEAN NOT NULL,
    physical_agreement BOOLEAN NOT NULL,
    legal_agreement BOOLEAN NOT NULL,
    how_did_you_hear VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS kids_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source_form VARCHAR(255) NOT NULL, -- e.g., '/inscription'
    
    -- Delivery Status
    email_delivery_status VARCHAR(50) DEFAULT 'pending',
    email_delivery_error TEXT,
    
    -- Fields
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    age VARCHAR(10) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS rate_limits (
    ip_hash VARCHAR(255) PRIMARY KEY,
    submissions_count INT DEFAULT 1,
    last_submission TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
