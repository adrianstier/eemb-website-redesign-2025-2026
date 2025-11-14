-- EEMB Website Database Initialization Script
-- PostgreSQL 14+
-- This script creates the initial database schema

-- Create database if not exists
-- Note: Run this as superuser from psql
-- CREATE DATABASE eemb_dev;
-- \c eemb_dev;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- Create schemas
CREATE SCHEMA IF NOT EXISTS eemb;
CREATE SCHEMA IF NOT EXISTS audit;

-- Set search path
SET search_path TO eemb, public;

-- =====================================================
-- AUDIT TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS audit.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    user_id INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_audit_log_table ON audit.audit_log(table_name);
CREATE INDEX idx_audit_log_timestamp ON audit.audit_log(timestamp);
CREATE INDEX idx_audit_log_user ON audit.audit_log(user_id);

-- =====================================================
-- MAIN TABLES (Managed by Strapi, but structure defined here for reference)
-- =====================================================

-- Faculty table structure (reference)
COMMENT ON TABLE public.faculties IS 'Faculty members - managed by Strapi';

-- Alumni table structure (reference)
COMMENT ON TABLE public.alumnis IS 'Alumni directory - managed by Strapi';

-- Research Areas table structure (reference)
COMMENT ON TABLE public.research_areas IS 'Research focus areas - managed by Strapi';

-- News/Blog table structure (reference)
COMMENT ON TABLE public.articles IS 'News and blog posts - managed by Strapi';

-- =====================================================
-- CUSTOM TABLES (Not managed by Strapi)
-- =====================================================

-- Analytics table for tracking page views
CREATE TABLE IF NOT EXISTS eemb.page_analytics (
    id SERIAL PRIMARY KEY,
    page_url VARCHAR(500) NOT NULL,
    visitor_id UUID,
    session_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    country_code CHAR(2),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    time_on_page INTEGER, -- seconds
    bounce BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_analytics_page ON eemb.page_analytics(page_url);
CREATE INDEX idx_analytics_timestamp ON eemb.page_analytics(timestamp);
CREATE INDEX idx_analytics_visitor ON eemb.page_analytics(visitor_id);

-- Search index table for full-text search
CREATE TABLE IF NOT EXISTS eemb.search_index (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(100) NOT NULL,
    content_id INTEGER NOT NULL,
    title TEXT,
    content TEXT,
    tags TEXT[],
    search_vector tsvector,
    url VARCHAR(500),
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_type, content_id)
);

CREATE INDEX idx_search_vector ON eemb.search_index USING gin(search_vector);
CREATE INDEX idx_search_tags ON eemb.search_index USING gin(tags);
CREATE INDEX idx_search_published ON eemb.search_index(published);

-- Function to update search vector
CREATE OR REPLACE FUNCTION eemb.update_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_vector_trigger
BEFORE INSERT OR UPDATE ON eemb.search_index
FOR EACH ROW
EXECUTE FUNCTION eemb.update_search_vector();

-- Newsletter subscribers (GDPR compliant)
CREATE TABLE IF NOT EXISTS eemb.newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
    confirmation_token UUID DEFAULT uuid_generate_v4(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    gdpr_consent BOOLEAN DEFAULT FALSE,
    gdpr_consent_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_newsletter_email ON eemb.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON eemb.newsletter_subscribers(status);
CREATE INDEX idx_newsletter_token ON eemb.newsletter_subscribers(confirmation_token);

-- Giving/Donations tracking
CREATE TABLE IF NOT EXISTS eemb.alumni_giving (
    id SERIAL PRIMARY KEY,
    alumni_id INTEGER, -- References Strapi alumni table
    campaign_name VARCHAR(255),
    amount DECIMAL(10, 2),
    currency CHAR(3) DEFAULT 'USD',
    donation_date DATE,
    fiscal_year INTEGER,
    gift_type VARCHAR(100), -- 'one-time', 'recurring', 'pledge', 'planned'
    designation VARCHAR(255), -- Where the gift is directed
    anonymous BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_giving_alumni ON eemb.alumni_giving(alumni_id);
CREATE INDEX idx_giving_date ON eemb.alumni_giving(donation_date);
CREATE INDEX idx_giving_fiscal ON eemb.alumni_giving(fiscal_year);

-- =====================================================
-- VIEWS
-- =====================================================

-- Active faculty view
CREATE OR REPLACE VIEW eemb.active_faculty AS
SELECT * FROM public.faculties
WHERE published_at IS NOT NULL
  AND (retired_at IS NULL OR retired_at > CURRENT_DATE)
ORDER BY last_name, first_name;

-- Recent news view
CREATE OR REPLACE VIEW eemb.recent_news AS
SELECT * FROM public.articles
WHERE published_at IS NOT NULL
  AND published_at <= CURRENT_TIMESTAMP
ORDER BY published_at DESC
LIMIT 10;

-- Giving summary view
CREATE OR REPLACE VIEW eemb.giving_summary AS
SELECT
    fiscal_year,
    COUNT(DISTINCT alumni_id) as unique_donors,
    SUM(amount) as total_amount,
    AVG(amount) as average_gift,
    COUNT(*) as total_gifts
FROM eemb.alumni_giving
GROUP BY fiscal_year
ORDER BY fiscal_year DESC;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION eemb.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to custom tables
CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON eemb.newsletter_subscribers
FOR EACH ROW EXECUTE FUNCTION eemb.update_updated_at_column();

CREATE TRIGGER update_giving_updated_at BEFORE UPDATE ON eemb.alumni_giving
FOR EACH ROW EXECUTE FUNCTION eemb.update_updated_at_column();

CREATE TRIGGER update_search_updated_at BEFORE UPDATE ON eemb.search_index
FOR EACH ROW EXECUTE FUNCTION eemb.update_updated_at_column();

-- =====================================================
-- PERMISSIONS
-- =====================================================

-- Create roles
CREATE ROLE eemb_readonly;
CREATE ROLE eemb_readwrite;
CREATE ROLE eemb_admin;

-- Grant permissions
GRANT USAGE ON SCHEMA eemb TO eemb_readonly, eemb_readwrite, eemb_admin;
GRANT USAGE ON SCHEMA audit TO eemb_admin;

-- Read-only permissions
GRANT SELECT ON ALL TABLES IN SCHEMA eemb TO eemb_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA eemb TO eemb_readonly;

-- Read-write permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA eemb TO eemb_readwrite;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA eemb TO eemb_readwrite;

-- Admin permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA eemb TO eemb_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA eemb TO eemb_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit TO eemb_admin;

-- Default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA eemb GRANT SELECT ON TABLES TO eemb_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA eemb GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO eemb_readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA eemb GRANT ALL PRIVILEGES ON TABLES TO eemb_admin;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default research areas (will be managed by Strapi later)
-- These serve as initial seed data
INSERT INTO eemb.search_index (content_type, title, content, tags, url)
VALUES
    ('page', 'Ecology', 'Study of organisms and their environment', ARRAY['ecology', 'environment', 'ecosystems'], '/research/ecology'),
    ('page', 'Evolution', 'Study of evolutionary processes', ARRAY['evolution', 'adaptation', 'genetics'], '/research/evolution'),
    ('page', 'Marine Biology', 'Study of ocean life and ecosystems', ARRAY['marine', 'ocean', 'aquatic'], '/research/marine-biology')
ON CONFLICT DO NOTHING;

-- =====================================================
-- MAINTENANCE
-- =====================================================

-- Analyze tables for query optimization
ANALYZE;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database initialization complete!';
    RAISE NOTICE 'Tables created in schemas: eemb, audit';
    RAISE NOTICE 'Roles created: eemb_readonly, eemb_readwrite, eemb_admin';
END $$;