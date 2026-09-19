-- ==============================================================================
-- FIX FOR RSVP DATA NOT SHOWING IN ADMIN DASHBOARD
-- ==============================================================================
-- Why this happens:
-- In Supabase, the table "rsvps" has Row-Level Security (RLS) enabled.
-- Because the wedding admin logs in with the wedding password (Love2027!)
-- rather than a complex Supabase Auth user, PostgreSQL blocks SELECT queries.
--
-- Running this script instantly allows your Admin Dashboard to read, update,
-- and delete RSVPs, while still allowing guests to submit!
-- ==============================================================================

-- 1. Easiest & Most Reliable Fix: Disable Row Level Security on rsvps table
ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;

-- 2. Ensure Realtime is enabled so the dashboard updates live as guests RSVP
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rsvps'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
  END IF;
END $$;

-- 3. (Alternative if you prefer RLS to remain enabled, you can run this instead):
-- ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Admins can view all RSVPs" ON public.rsvps;
-- DROP POLICY IF EXISTS "Admins can update RSVPs" ON public.rsvps;
-- DROP POLICY IF EXISTS "Admins can delete RSVPs" ON public.rsvps;
-- DROP POLICY IF EXISTS "Allow public visitors to submit RSVP" ON public.rsvps;
-- DROP POLICY IF EXISTS "Allow read all rsvps" ON public.rsvps;
-- DROP POLICY IF EXISTS "Allow insert rsvps" ON public.rsvps;
-- DROP POLICY IF EXISTS "Allow update rsvps" ON public.rsvps;
-- DROP POLICY IF EXISTS "Allow delete rsvps" ON public.rsvps;
-- CREATE POLICY "Allow read all rsvps" ON public.rsvps FOR SELECT USING (true);
-- CREATE POLICY "Allow insert rsvps" ON public.rsvps FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow update rsvps" ON public.rsvps FOR UPDATE USING (true);
-- CREATE POLICY "Allow delete rsvps" ON public.rsvps FOR DELETE USING (true);
