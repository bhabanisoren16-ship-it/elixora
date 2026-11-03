-- ============================================================
-- ELIXORA 2.0 - PRODUCTION SECURITY HARDENING & RLS POLICIES
-- ============================================================
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- This script hardens your existing registrations table and receipts bucket.
-- ============================================================

-- 1. Enable Row Level Security (RLS) on registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 2. Policy 1: Allow public INSERT for student pass registrations
-- Validates that students provide required roll number, name, and UTR
DROP POLICY IF EXISTS "Allow public registration insert" ON public.registrations;
DROP POLICY IF EXISTS "Allow public insert on registrations" ON public.registrations;

CREATE POLICY "Allow public registration insert"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(COALESCE("FULL NAME", ''))) >= 2 AND
    char_length(trim(COALESCE("REGISTRATION", ''))) >= 4 AND
    char_length(trim(COALESCE("UTR NO.", ''))) >= 6
  );

-- 3. Policy 2: Allow public SELECT for pass verification and live counter
-- (Private phone numbers and receipts are filtered by the client / public API)
DROP POLICY IF EXISTS "Allow public read on registrations" ON public.registrations;
CREATE POLICY "Allow public read on registrations"
  ON public.registrations
  FOR SELECT
  TO anon, authenticated
  USING ("BRANCH" IS NULL OR "BRANCH" != 'DELETED');

-- 4. Policy 3: Allow UPDATE for pass re-issues and attendance checks
DROP POLICY IF EXISTS "Allow public update on registrations" ON public.registrations;
CREATE POLICY "Allow public update on registrations"
  ON public.registrations
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (
    char_length(trim(COALESCE("REGISTRATION", ''))) >= 4
  );

-- 5. Policy 4: Hard DELETE restricted to backend service_role only
-- Public clients cannot execute hard DELETE statements on the table
DROP POLICY IF EXISTS "Allow public delete on registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow service_role delete on registrations" ON public.registrations;

CREATE POLICY "Allow service_role delete on registrations"
  ON public.registrations
  FOR DELETE
  TO service_role
  USING (true);

-- 6. High-Speed Performance Indexes
CREATE INDEX IF NOT EXISTS idx_reg_roll ON public.registrations("REGISTRATION");
CREATE INDEX IF NOT EXISTS idx_reg_utr ON public.registrations("UTR NO.");
CREATE INDEX IF NOT EXISTS idx_reg_created ON public.registrations(created_at DESC);

-- 7. Enable Supabase Realtime Broadcast on the registrations table
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;

-- ============================================================
-- 8. STORAGE BUCKET: receipts (Whitelisted Image Proofs Only)
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

-- Storage Policy: Allow public upload of receipts matching allowed image types
DROP POLICY IF EXISTS "Allow public upload of receipts" ON storage.objects;
CREATE POLICY "Allow public upload of receipts"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'receipts');

-- Storage Policy: Allow viewing receipts
DROP POLICY IF EXISTS "Allow public viewing of receipts" ON storage.objects;
CREATE POLICY "Allow public viewing of receipts"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'receipts');

-- Storage Policy: Deletion of receipts restricted strictly to service_role
DROP POLICY IF EXISTS "Allow service_role delete of receipts" ON storage.objects;
CREATE POLICY "Allow service_role delete of receipts"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'receipts');
