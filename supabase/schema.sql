-- ─────────────────────────────────────────────────────────────────────────────
-- PIDC Statistics Dashboard — Database Schema
-- Run this ONCE in your Supabase project:
--   Supabase Dashboard → SQL Editor → New Query → Paste this → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. PROFILES table ───────────────────────────────────────────────────────
-- Extends Supabase Auth users with a role and entity link.
-- Every user who logs in must have a row here.

create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null default '',
  role        text not null check (role in ('admin', 'entity', 'viewer')) default 'entity',
  entity_id   text,           -- which entity this user belongs to (null for admins)
  created_at  timestamptz not null default now()
);

-- Automatically create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'entity');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─── 2. UPLOADS table ────────────────────────────────────────────────────────
-- One row per file submission from an entity user.
-- The admin panel reads from this table.

create table if not exists uploads (
  id          uuid primary key default gen_random_uuid(),
  entity_id   text not null,             -- e.g. 'kc', 'ld'
  period      text not null,             -- e.g. '2025-H1'
  status      text not null
              check (status in ('pending', 'processing', 'approved', 'rejected'))
              default 'pending',
  file_path   text not null,             -- path inside the 'uploads' Storage bucket
  uploaded_by uuid references auth.users(id),
  notes       text,                      -- rejection reason, admin notes
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by status (admin panel filter)
create index if not exists uploads_status_idx on uploads(status);
create index if not exists uploads_entity_idx on uploads(entity_id);


-- ─── 3. Row Level Security (RLS) ─────────────────────────────────────────────
-- IMPORTANT: Without RLS, any logged-in user can read/write all data.
-- These policies restrict access by role.

alter table profiles enable row level security;
alter table uploads  enable row level security;

-- profiles: users can only read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- uploads: admins can see all; entity users can only see their own
create policy "Admins see all uploads"
  on uploads for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Entity users see own uploads"
  on uploads for select
  using (uploaded_by = auth.uid());

-- uploads: anyone authenticated can insert (they upload their own files)
create policy "Authenticated users can upload"
  on uploads for insert
  with check (auth.uid() = uploaded_by);

-- uploads: only admins can update status (approve/reject)
create policy "Admins can update upload status"
  on uploads for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ─── 4. Seed: make the first user an admin ───────────────────────────────────
-- After you create your first user via the Auth UI, run this to make them admin:
-- Replace 'your-email@example.com' with your actual email.

-- update profiles set role = 'admin' where email = 'your-email@example.com';
