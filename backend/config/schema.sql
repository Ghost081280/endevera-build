-- ============================================
-- ENDEVERA DATABASE SCHEMA
-- PostgreSQL schema for Railway deployment
-- ============================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    role VARCHAR(50) DEFAULT 'investor',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Create investor_applications table
CREATE TABLE IF NOT EXISTS investor_applications (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    accreditation_status VARCHAR(255) NOT NULL,
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    approval_token VARCHAR(255),
    notes TEXT
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    location VARCHAR(255),
    target_amount DECIMAL(15, 2),
    raised_amount DECIMAL(15, 2) DEFAULT 0,
    minimum_investment DECIMAL(15, 2),
    expected_return VARCHAR(100),
    investment_timeline VARCHAR(100),
    risk_level VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft',
    launch_date TIMESTAMP,
    close_date TIMESTAMP,
    images JSONB,
    documents JSONB,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT,
    file_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    submitted_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP,
    responded_by INTEGER REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE INDEX IF NOT EXISTS idx_investor_applications_email ON investor_applications(email);
CREATE INDEX IF NOT EXISTS idx_investor_applications_status ON investor_applications(status);

CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_launch_date ON deals(launch_date);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_published_at ON reports(published_at);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - for development)
-- INSERT INTO users (email, password_hash, first_name, last_name, role, status)
-- VALUES ('admin@endevera.com', '$2a$10$...', 'Admin', 'User', 'admin', 'active');

-- Grant privileges (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
