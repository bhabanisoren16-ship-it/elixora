-- ============================================================
-- ELIXORA 2.0 - SUPABASE DATABASE SCHEMA & STORAGE SETUP
-- ============================================================
-- Run this entire script in the Supabase Dashboard -> SQL Editor
-- to set up your PostgreSQL database and storage policies.
-- ============================================================

-- 1. Create the registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  phone TEXT,
  utr_number TEXT NOT NULL,
  branch TEXT DEFAULT 'Biotechnology',
  batch TEXT DEFAULT 'Batch of ''26 • Fresher',
  role TEXT DEFAULT 'VIP Fresher Attendee',
  senior_quote TEXT,
  is_senior BOOLEAN DEFAULT false,
  ticket_price NUMERIC DEFAULT 399,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending_verification', -- 'pending_verification', 'verified', 'rejected'
  attendance_marked BOOLEAN DEFAULT false,
  attendance_marked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for high-speed lookup by ticket_id and roll_no
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON public.registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_registrations_roll_no ON public.registrations(roll_no);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new registrations (Pass checkout)
DROP POLICY IF EXISTS "Allow public insert on registrations" ON public.registrations;
CREATE POLICY "Allow public insert on registrations"
  ON public.registrations
  FOR INSERT
  WITH CHECK (true);

-- Allow public read access strictly for ticket verification
DROP POLICY IF EXISTS "Allow public read on registrations" ON public.registrations;
CREATE POLICY "Allow public read on registrations"
  ON public.registrations
  FOR SELECT
  USING (true);

-- Security Hardened: Restrict updates strictly to backend service_role
DROP POLICY IF EXISTS "Allow public update on registrations" ON public.registrations;
CREATE POLICY "Allow service_role update on registrations"
  ON public.registrations
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Security Hardened: Restrict deletions strictly to backend service_role
DROP POLICY IF EXISTS "Allow public delete on registrations" ON public.registrations;
CREATE POLICY "Allow service_role delete on registrations"
  ON public.registrations
  FOR DELETE
  USING (auth.role() = 'service_role');

-- 3. Enable Real-Time Broadcast for registrations
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;

-- ============================================================
-- STORAGE BUCKET: receipts
-- ============================================================
-- Insert the bucket if not already present
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the 'receipts' bucket
CREATE POLICY "Allow public upload of receipts"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Allow public viewing of receipts"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'receipts');
