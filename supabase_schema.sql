-- ============================================================
-- ELIXORA 2.0 - SUPABASE SCHEMA MIGRATION: STUDENT & ATTENDEE PASSES
-- ============================================================
-- Matches: [STUDENT NAME | ROLL NO | CATEGORY | TICKET ID | PHOTO | STATUS]
-- Plus: [REGISTRATION DATE | REGISTRATION TIME | REGISTRATION DATE & TIME]
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ============================================================

-- 1. Create or Upgrade the public.registrations table with exact column names
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add columns matching the table header: STUDENT NAME, ROLL NO, CATEGORY, TICKET ID, PHOTO, STATUS
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "STUDENT NAME" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "ROLL NO" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "CATEGORY" TEXT DEFAULT 'FRESHER';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "TICKET ID" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "PHOTO" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "STATUS" TEXT DEFAULT 'VERIFIED';

-- 3. Time & Date of Registration Columns
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "REGISTRATION DATE" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "REGISTRATION TIME" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "REGISTRATION DATE & TIME" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "DATE" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "TIME" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS registration_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS registration_time TIME DEFAULT CURRENT_TIME;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Add lowercase / snake_case aliases for API & PostgREST query compatibility
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS roll_no TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'FRESHER';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ticket_id TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'VERIFIED';

-- 5. Maintain standard transactional fields
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "FULL NAME" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "REGISTRATION" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "MOBILE NO." TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "UTR NO." TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "BRANCH" TEXT DEFAULT 'Biotechnology';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "BATCH" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS is_senior BOOLEAN DEFAULT false;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ticket_price NUMERIC DEFAULT 399;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS "SCREENSHOT" TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS diet TEXT DEFAULT 'Veg';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS senior_quote TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS attendance_marked BOOLEAN DEFAULT false;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS attendance_marked_at TIMESTAMPTZ;

-- 6. Backfill existing rows so all columns are populated with clean data
UPDATE public.registrations
SET 
  "STUDENT NAME" = COALESCE("STUDENT NAME", student_name, "FULL NAME", 'VIP Attendee'),
  "ROLL NO"      = COALESCE("ROLL NO", roll_no, "REGISTRATION"),
  "CATEGORY"     = COALESCE("CATEGORY", category, CASE WHEN is_senior THEN 'SENIOR VIP' ELSE 'FRESHER' END),
  "TICKET ID"    = COALESCE("TICKET ID", ticket_id, 'ELX-' || CASE WHEN is_senior THEN 'SR' ELSE '26' END || '-' || RIGHT(COALESCE("REGISTRATION", "ROLL NO", 'PASS'), 4)),
  "PHOTO"        = COALESCE("PHOTO", photo, "SCREENSHOT"),
  "STATUS"       = COALESCE("STATUS", status, 'VERIFIED'),
  "REGISTRATION DATE" = COALESCE("REGISTRATION DATE", TO_CHAR(COALESCE(created_at, NOW()) AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY')),
  "REGISTRATION TIME" = COALESCE("REGISTRATION TIME", TO_CHAR(COALESCE(created_at, NOW()) AT TIME ZONE 'Asia/Kolkata', 'HH12:MI AM')),
  "REGISTRATION DATE & TIME" = COALESCE("REGISTRATION DATE & TIME", TO_CHAR(COALESCE(created_at, NOW()) AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY, HH12:MI AM')),
  "DATE"         = COALESCE("DATE", "REGISTRATION DATE", TO_CHAR(COALESCE(created_at, NOW()) AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY')),
  "TIME"         = COALESCE("TIME", "REGISTRATION TIME", TO_CHAR(COALESCE(created_at, NOW()) AT TIME ZONE 'Asia/Kolkata', 'HH12:MI AM')),
  registration_date = COALESCE(registration_date, (COALESCE(created_at, NOW()) AT TIME ZONE 'Asia/Kolkata')::DATE),
  registration_time = COALESCE(registration_time, (COALESCE(created_at, NOW()) AT TIME ZONE 'Asia/Kolkata')::TIME),
  registered_at  = COALESCE(registered_at, created_at, NOW()),
  student_name   = COALESCE(student_name, "STUDENT NAME", "FULL NAME", 'VIP Attendee'),
  roll_no        = COALESCE(roll_no, "ROLL NO", "REGISTRATION"),
  category       = COALESCE(category, "CATEGORY", CASE WHEN is_senior THEN 'SENIOR VIP' ELSE 'FRESHER' END),
  ticket_id      = COALESCE(ticket_id, "TICKET ID"),
  photo          = COALESCE(photo, "PHOTO", "SCREENSHOT"),
  status         = COALESCE(status, "STATUS", 'VERIFIED'),
  "FULL NAME"    = COALESCE("FULL NAME", "STUDENT NAME", student_name),
  "REGISTRATION" = COALESCE("REGISTRATION", "ROLL NO", roll_no),
  "SCREENSHOT"   = COALESCE("SCREENSHOT", "PHOTO", photo);

-- 7. Bi-directional Synchronization Trigger
-- Automatically keeps "STUDENT NAME", "ROLL NO", "CATEGORY", "TICKET ID", "PHOTO", "STATUS",
-- and Date / Time columns perfectly synchronized on every INSERT or UPDATE.
CREATE OR REPLACE FUNCTION public.sync_registration_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync Student Name
  IF NEW."STUDENT NAME" IS NOT NULL THEN
    NEW."FULL NAME" := NEW."STUDENT NAME";
    NEW.student_name := NEW."STUDENT NAME";
  ELSIF NEW.student_name IS NOT NULL THEN
    NEW."STUDENT NAME" := NEW.student_name;
    NEW."FULL NAME" := NEW.student_name;
  ELSIF NEW."FULL NAME" IS NOT NULL THEN
    NEW."STUDENT NAME" := NEW."FULL NAME";
    NEW.student_name := NEW."FULL NAME";
  END IF;

  -- Sync Roll No
  IF NEW."ROLL NO" IS NOT NULL THEN
    NEW."REGISTRATION" := NEW."ROLL NO";
    NEW.roll_no := NEW."ROLL NO";
  ELSIF NEW.roll_no IS NOT NULL THEN
    NEW."ROLL NO" := NEW.roll_no;
    NEW."REGISTRATION" := NEW.roll_no;
  ELSIF NEW."REGISTRATION" IS NOT NULL THEN
    NEW."ROLL NO" := NEW."REGISTRATION";
    NEW.roll_no := NEW."REGISTRATION";
  END IF;

  -- Sync Category & is_senior
  IF NEW."CATEGORY" IS NOT NULL THEN
    NEW.is_senior := (NEW."CATEGORY" ILIKE '%SENIOR%');
    NEW.category := NEW."CATEGORY";
  ELSIF NEW.category IS NOT NULL THEN
    NEW."CATEGORY" := NEW.category;
    NEW.is_senior := (NEW.category ILIKE '%SENIOR%');
  ELSIF NEW.is_senior IS NOT NULL THEN
    NEW."CATEGORY" := CASE WHEN NEW.is_senior THEN 'SENIOR VIP' ELSE 'FRESHER' END;
    NEW.category := NEW."CATEGORY";
  ELSE
    NEW."CATEGORY" := 'FRESHER';
    NEW.category := 'FRESHER';
    NEW.is_senior := false;
  END IF;

  -- Sync Ticket ID
  IF NEW."TICKET ID" IS NOT NULL THEN
    NEW.ticket_id := NEW."TICKET ID";
  ELSIF NEW.ticket_id IS NOT NULL THEN
    NEW."TICKET ID" := NEW.ticket_id;
  ELSE
    NEW."TICKET ID" := 'ELX-' || (CASE WHEN NEW.is_senior THEN 'SR' ELSE '26' END) || '-' || RIGHT(COALESCE(NEW."ROLL NO", NEW."REGISTRATION", 'PASS'), 4);
    NEW.ticket_id := NEW."TICKET ID";
  END IF;

  -- Sync Photo
  IF NEW."PHOTO" IS NOT NULL THEN
    NEW."SCREENSHOT" := NEW."PHOTO";
    NEW.photo := NEW."PHOTO";
  ELSIF NEW.photo IS NOT NULL THEN
    NEW."PHOTO" := NEW.photo;
    NEW."SCREENSHOT" := NEW.photo;
  ELSIF NEW."SCREENSHOT" IS NOT NULL THEN
    NEW."PHOTO" := NEW."SCREENSHOT";
    NEW.photo := NEW."SCREENSHOT";
  END IF;

  -- Sync Status
  IF NEW."STATUS" IS NOT NULL THEN
    NEW.status := NEW."STATUS";
  ELSIF NEW.status IS NOT NULL THEN
    NEW."STATUS" := NEW.status;
  ELSE
    NEW."STATUS" := 'VERIFIED';
    NEW.status := 'VERIFIED';
  END IF;

  -- Sync Registration Date & Time (Indian Standard Time: Asia/Kolkata)
  IF NEW."REGISTRATION DATE" IS NULL THEN
    NEW."REGISTRATION DATE" := TO_CHAR(COALESCE(NEW.created_at, NOW()) AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY');
  END IF;
  IF NEW."REGISTRATION TIME" IS NULL THEN
    NEW."REGISTRATION TIME" := TO_CHAR(COALESCE(NEW.created_at, NOW()) AT TIME ZONE 'Asia/Kolkata', 'HH12:MI AM');
  END IF;
  IF NEW."REGISTRATION DATE & TIME" IS NULL THEN
    NEW."REGISTRATION DATE & TIME" := NEW."REGISTRATION DATE" || ', ' || NEW."REGISTRATION TIME";
  END IF;

  NEW."DATE" := NEW."REGISTRATION DATE";
  NEW."TIME" := NEW."REGISTRATION TIME";
  NEW.registration_date := (COALESCE(NEW.created_at, NOW()) AT TIME ZONE 'Asia/Kolkata')::DATE;
  NEW.registration_time := (COALESCE(NEW.created_at, NOW()) AT TIME ZONE 'Asia/Kolkata')::TIME;
  NEW.registered_at := COALESCE(NEW.created_at, NOW());

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_registration_columns ON public.registrations;
CREATE TRIGGER trg_sync_registration_columns
  BEFORE INSERT OR UPDATE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_registration_columns();

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_reg_student_name ON public.registrations("STUDENT NAME");
CREATE INDEX IF NOT EXISTS idx_reg_roll_no ON public.registrations("ROLL NO");
CREATE INDEX IF NOT EXISTS idx_reg_ticket_id ON public.registrations("TICKET ID");
CREATE INDEX IF NOT EXISTS idx_reg_status ON public.registrations("STATUS");
CREATE INDEX IF NOT EXISTS idx_reg_category ON public.registrations("CATEGORY");
CREATE INDEX IF NOT EXISTS idx_reg_date ON public.registrations("REGISTRATION DATE");
CREATE INDEX IF NOT EXISTS idx_reg_registered_at ON public.registrations(registered_at DESC);
CREATE INDEX IF NOT EXISTS idx_reg_legacy_roll ON public.registrations("REGISTRATION");
CREATE INDEX IF NOT EXISTS idx_reg_created ON public.registrations(created_at DESC);

-- 9. Row Level Security (RLS) Policies
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public registration insert" ON public.registrations;
CREATE POLICY "Allow public registration insert"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(COALESCE("STUDENT NAME", student_name, "FULL NAME", ''))) >= 2 AND
    char_length(trim(COALESCE("ROLL NO", roll_no, "REGISTRATION", ''))) >= 4
  );

DROP POLICY IF EXISTS "Allow public read on registrations" ON public.registrations;
CREATE POLICY "Allow public read on registrations"
  ON public.registrations
  FOR SELECT
  TO anon, authenticated
  USING ("BRANCH" IS NULL OR "BRANCH" != 'DELETED');

DROP POLICY IF EXISTS "Allow public update on registrations" ON public.registrations;
CREATE POLICY "Allow public update on registrations"
  ON public.registrations
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (
    char_length(trim(COALESCE("ROLL NO", roll_no, "REGISTRATION", ''))) >= 4
  );

DROP POLICY IF EXISTS "Allow public delete on registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow service_role delete on registrations" ON public.registrations;

CREATE POLICY "Allow service_role delete on registrations"
  ON public.registrations
  FOR DELETE
  TO service_role
  USING (true);

-- 10. Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;

-- 11. Receipts Storage Bucket Configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts', 
  'receipts', 
  true, 
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Allow public upload of receipts" ON storage.objects;
CREATE POLICY "Allow public upload of receipts"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'receipts');

DROP POLICY IF EXISTS "Allow public viewing of receipts" ON storage.objects;
CREATE POLICY "Allow public viewing of receipts"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'receipts');
