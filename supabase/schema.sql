-- ===================================================
-- JAMES & CRISTEL WEDDING - SUPABASE DATABASE SCHEMA
-- Wedding Date: January 28, 2027
-- ===================================================

-- 1. Create Profiles table for Role-Based Access Control
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text not null default 'guest' check (role in ('admin', 'guest')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies:
-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 2. Create RSVPs table
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  guest_count integer default 1 check (guest_count >= 1 and guest_count <= 10),
  attendance text not null check (attendance in ('accepted', 'declined')),
  message text,
  dietary_restrictions text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for optimal lookup and sorting
create index if not exists rsvps_email_idx on public.rsvps (email);
create index if not exists rsvps_status_idx on public.rsvps (status);
create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);

-- Automatic updated_at timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_rsvps_updated_at on public.rsvps;
create trigger set_rsvps_updated_at
  before update on public.rsvps
  for each row execute function public.handle_updated_at();

-- 3. Row Level Security (RLS) on RSVPs
-- For the wedding website, we disable RLS on rsvps so the wedding admin dashboard 
-- can view, update, and manage all guest submissions directly with the admin passcode.
alter table public.rsvps disable row level security;

-- (If you want RLS enabled, run the permissive policies below):
-- alter table public.rsvps enable row level security;
-- create policy "Allow public visitors to submit RSVP" on public.rsvps for insert with check (true);
-- create policy "Allow admin dashboard to read RSVPs" on public.rsvps for select using (true);
-- create policy "Allow admin dashboard to update RSVPs" on public.rsvps for update using (true);
-- create policy "Allow admin dashboard to delete RSVPs" on public.rsvps for delete using (true);

-- 4. Automatic profile creation upon user signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    -- Designate specific admin emails automatically if desired
    case 
      when new.email in ('admin@jamescristel.wedding', 'james@jamescristel.wedding', 'cristel@jamescristel.wedding') then 'admin'
      else 'guest'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable Realtime replication for rsvps table
alter publication supabase_realtime add table public.rsvps;
