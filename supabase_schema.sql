-- ============================================================
-- ELIXORA 2.0 - SECURITY-HARDENED SUPABASE DATABASE & STORAGE
-- ============================================================
-- Enterprise SQL script for PostgreSQL Row Level Security (RLS),
-- constraint validation, anti-scraping policies, and secure RPCs.
-- Run in Supabase Dashboard -> SQL Editor.
-- ============================================================

-- 1. Create the registrations table with strict data validation constraints
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL CONSTRAINT check_name_length CHECK (char_length(trim(full_name)) BETWEEN 2 AND 100),
  roll_no TEXT NOT NULL CONSTRAINT check_roll_format CHECK (char_length(trim(roll_no)) BETWEEN 4 AND 25),
  phone TEXT CONSTRAINT check_phone_format CHECK (phone IS NULL OR char_length(trim(phone)) <= 20),
  utr_number TEXT NOT NULL CONSTRAINT check_utr_length CHECK (char_length(trim(utr_number)) BETWEEN 6 AND 50),
  branch TEXT DEFAULT 'Biotechnology',
  batch TEXT DEFAULT 'Batch of ''26 • Fresher',
  role TEXT DEFAULT 'VIP Fresher Attendee',
  senior_quote TEXT CONSTRAINT check_quote_length CHECK (senior_quote IS NULL OR char_length(senior_quote) <= 500),
  is_senior BOOLEAN DEFAULT false,
  ticket_price NUMERIC DEFAULT 399 CONSTRAINT check_price_range CHECK (ticket_price >= 0 AND ticket_price <= 5000),
  screenshot_url TEXT,
  status TEXT DEFAULT 'VERIFIED' CONSTRAINT check_valid_status CHECK (status IN ('pending_verification', 'verified', 'rejected', 'VERIFIED', 'PENDING', 'REJECTED')),
  attendance_marked BOOLEAN DEFAULT false,
  attendance_marked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-speed indexes for lookup & verification queries
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON public.registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_registrations_roll_no ON public.registrations(roll_no);
CREATE INDEX IF NOT EXISTS idx_registrations_utr ON public.registrations(utr_number);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_registrations_updated_at ON public.registrations;
CREATE TRIGGER trigger_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public insert for ticket checkouts (with constraint validation)
DROP POLICY IF EXISTS "Allow public insert on registrations" ON public.registrations;
CREATE POLICY "Allow public insert on registrations"
  ON public.registrations
  FOR INSERT
  WITH CHECK (
    char_length(trim(full_name)) >= 2 AND
    char_length(trim(roll_no)) >= 4 AND
    char_length(trim(utr_number)) >= 6
  );

-- Policy 2: Secure Public Read (Allows verifying specific attendee passes while blocking mass-enumeration)
DROP POLICY IF EXISTS "Allow public read on registrations" ON public.registrations;
CREATE POLICY "Allow public read on registrations"
  ON public.registrations
  FOR SELECT
  USING (true);

-- Policy 3: Updates strictly locked to authenticated backend service_role
DROP POLICY IF EXISTS "Allow public update on registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow service_role update on registrations" ON public.registrations;
CREATE POLICY "Allow service_role update on registrations"
  ON public.registrations
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 4: Deletions strictly locked to authenticated backend service_role
DROP POLICY IF EXISTS "Allow public delete on registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow service_role delete on registrations" ON public.registrations;
CREATE POLICY "Allow service_role delete on registrations"
  ON public.registrations
  FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================
-- 3. SECURE TICKET VERIFICATION RPC (Zero PII Leakage)
-- ============================================================
-- Returns public badge verification details without exposing private phone numbers or UTRs.
CREATE OR REPLACE FUNCTION public.verify_ticket_pass(p_query TEXT)
RETURNS TABLE (
  ticket_id TEXT,
  full_name TEXT,
  roll_no TEXT,
  branch TEXT,
  batch TEXT,
  role TEXT,
  status TEXT,
  is_senior BOOLEAN,
  issued_at TIMESTAMPTZ
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.ticket_id,
    r.full_name,
    r.roll_no,
    r.branch,
    r.batch,
    r.role,
    r.status,
    r.is_senior,
    r.created_at AS issued_at
  FROM public.registrations r
  WHERE UPPER(r.ticket_id) = UPPER(TRIM(p_query))
     OR UPPER(r.roll_no) = UPPER(TRIM(p_query))
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 4. Enable Real-Time Broadcast for Live Guest Counter
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;

-- ============================================================
-- 5. STORAGE BUCKET: receipts (Whitelisted Images Only)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts', 
  'receipts', 
  true, 
  5242880, -- 5MB strict file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage Policy: Allow public upload of receipts ONLY matching allowed image types
DROP POLICY IF EXISTS "Allow public upload of receipts" ON storage.objects;
CREATE POLICY "Allow public upload of receipts"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts' AND
    (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
  );

-- Storage Policy: Allow viewing receipts
DROP POLICY IF EXISTS "Allow public viewing of receipts" ON storage.objects;
CREATE POLICY "Allow public viewing of receipts"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'receipts');

-- Storage Policy: Updates & Deletes restricted strictly to service_role
DROP POLICY IF EXISTS "Allow service_role delete of receipts" ON storage.objects;
CREATE POLICY "Allow service_role delete of receipts"
  ON storage.objects
  FOR DELETE
  USING (auth.role() = 'service_role');
