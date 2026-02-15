-- PROFILES
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  slug text not null unique,
  name text not null,
  role text not null,
  bio text not null,
  theme text not null default 'Cinematic',
  location text,
  hero_image text,
  tags text[] default '{}',
  is_published boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- WORKS
create table if not exists works (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  image text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table works enable row level security;

-- Profiles: public can read published
create policy "public read published profiles"
on profiles for select
using (is_published = true);

-- Profiles: owner can read own
create policy "owner read profiles"
on profiles for select
using (auth.uid() = user_id);

-- Profiles: owner can insert/update/delete own
create policy "owner write profiles"
on profiles for insert
with check (auth.uid() = user_id);

create policy "owner update profiles"
on profiles for update
using (auth.uid() = user_id);

create policy "owner delete profiles"
on profiles for delete
using (auth.uid() = user_id);

-- Works: public can read works for published profiles
create policy "public read works for published profiles"
on works for select
using (
  exists (
    select 1 from profiles p
    where p.id = works.profile_id
    and p.is_published = true
  )
);

-- Works: owner can read/write works for own profiles
create policy "owner read works"
on works for select
using (
  exists (
    select 1 from profiles p
    where p.id = works.profile_id
    and p.user_id = auth.uid()
  )
);

create policy "owner write works"
on works for insert
with check (
  exists (
    select 1 from profiles p
    where p.id = works.profile_id
    and p.user_id = auth.uid()
  )
);

create policy "owner update works"
on works for update
using (
  exists (
    select 1 from profiles p
    where p.id = works.profile_id
    and p.user_id = auth.uid()
  )
);

create policy "owner delete works"
on works for delete
using (
  exists (
    select 1 from profiles p
    where p.id = works.profile_id
    and p.user_id = auth.uid()
  )
);
