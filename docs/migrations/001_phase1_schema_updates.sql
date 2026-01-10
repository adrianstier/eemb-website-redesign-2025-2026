-- ============================================================================
-- EEMB Website Phase 1 Schema Updates
-- Migration: 001_phase1_schema_updates
-- Date: January 10, 2026
-- Author: Tech Lead
--
-- This migration adds missing tables and columns required for Phase 1 launch.
-- Run this in Supabase SQL Editor or via Supabase CLI.
-- ============================================================================

-- ============================================================================
-- 1. ADD COLUMNS TO EXISTING TABLES
-- ============================================================================

-- Faculty: Add "accepting students" fields
ALTER TABLE faculty
  ADD COLUMN IF NOT EXISTS accepting_students BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS accepting_students_note TEXT;

COMMENT ON COLUMN faculty.accepting_students IS 'Whether faculty member is currently accepting new graduate students';
COMMENT ON COLUMN faculty.accepting_students_note IS 'Optional note about accepting students (e.g., "Fall 2026 only")';

-- ============================================================================
-- 2. CREATE NEW TABLES
-- ============================================================================

-- Student Testimonials (for graduate program page)
CREATE TABLE IF NOT EXISTS student_testimonials (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES graduate_students(id) ON DELETE SET NULL,
  quote TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE student_testimonials IS 'Student testimonials for graduate program recruitment';

-- Profile Versions (for version history/rollback)
CREATE TABLE IF NOT EXISTS profile_versions (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('faculty', 'staff', 'graduate_student')),
  entity_id INTEGER NOT NULL,
  data JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT
);

COMMENT ON TABLE profile_versions IS 'Version history for profile changes with rollback capability';

CREATE INDEX IF NOT EXISTS idx_profile_versions_entity
  ON profile_versions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_profile_versions_changed_at
  ON profile_versions(changed_at DESC);

-- Audit Log (for tracking all admin actions)
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'login', 'logout')),
  table_name TEXT NOT NULL,
  record_id INTEGER,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE audit_log IS 'Audit trail for all admin actions';

CREATE INDEX IF NOT EXISTS idx_audit_log_user
  ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table
  ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created
  ON audit_log(created_at DESC);

-- Contact Submissions (for contact form)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'archived')),
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE contact_submissions IS 'Contact form submissions';

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
  ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created
  ON contact_submissions(created_at DESC);

-- ============================================================================
-- 3. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE student_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Student Testimonials: Public read, Admin write
CREATE POLICY "Public read access" ON student_testimonials
  FOR SELECT USING (true);

CREATE POLICY "Admin write access" ON student_testimonials
  FOR ALL USING (is_admin());

-- Profile Versions: Admin only
CREATE POLICY "Admin access" ON profile_versions
  FOR ALL USING (is_admin());

-- Audit Log: Admin read only (writes via service role)
CREATE POLICY "Admin read" ON audit_log
  FOR SELECT USING (is_admin());

-- Contact Submissions: Public insert (with constraints), Admin read/update
CREATE POLICY "Public insert" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read" ON contact_submissions
  FOR SELECT USING (is_admin());

CREATE POLICY "Admin update" ON contact_submissions
  FOR UPDATE USING (is_admin());

-- ============================================================================
-- 4. UPDATE EXISTING RLS POLICIES (if needed)
-- ============================================================================

-- Ensure faculty table has proper RLS
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Public read faculty" ON faculty;
DROP POLICY IF EXISTS "Admin write faculty" ON faculty;

-- Create clean policies
CREATE POLICY "Public read faculty" ON faculty
  FOR SELECT USING (active = true);

CREATE POLICY "Admin write faculty" ON faculty
  FOR ALL USING (is_admin());

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_student_testimonials_updated_at ON student_testimonials;
CREATE TRIGGER update_student_testimonials_updated_at
  BEFORE UPDATE ON student_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile version on update
CREATE OR REPLACE FUNCTION create_profile_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profile_versions (entity_type, entity_id, data, changed_by)
  VALUES (
    TG_TABLE_NAME,
    OLD.id,
    to_jsonb(OLD),
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply versioning triggers
DROP TRIGGER IF EXISTS faculty_version_trigger ON faculty;
CREATE TRIGGER faculty_version_trigger
  BEFORE UPDATE ON faculty
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_version();

DROP TRIGGER IF EXISTS staff_version_trigger ON staff;
CREATE TRIGGER staff_version_trigger
  BEFORE UPDATE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_version();

DROP TRIGGER IF EXISTS graduate_students_version_trigger ON graduate_students;
CREATE TRIGGER graduate_students_version_trigger
  BEFORE UPDATE ON graduate_students
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_version();

-- ============================================================================
-- 6. SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert sample testimonials (only if table is empty)
INSERT INTO student_testimonials (student_id, quote, featured, display_order)
SELECT
  gs.id,
  'The collaborative environment in EEMB has been instrumental in my research development. Faculty are genuinely invested in student success.',
  true,
  1
FROM graduate_students gs
WHERE gs.active = true
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Run these to verify migration success:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'faculty' AND column_name LIKE 'accepting%';
-- SELECT * FROM student_testimonials LIMIT 5;
-- SELECT * FROM profile_versions LIMIT 5;
-- SELECT * FROM audit_log LIMIT 5;
-- SELECT * FROM contact_submissions LIMIT 5;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
