-- Schéma de référence pour Supabase (à exécuter dans l'éditeur SQL du projet)
-- Ajustez les types (uuid, text, etc.) selon votre projet.

-- Table users (lien avec auth.users via id)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table modules
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  order_index int not null default 0,
  duration_estimate text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table episodes
create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  duration text,
  order_index int not null default 0,
  video_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table progress (contrainte unique pour upsert)
create table if not exists public.progress (
  user_id uuid not null references public.users(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  completed_at timestamptz default now(),
  created_at timestamptz default now(),
  primary key (user_id, episode_id)
);

-- Table resources
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  type text not null,
  url text not null,
  preview_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz default now(),
  is_important boolean default false,
  updated_at timestamptz default now()
);

-- Trigger : créer une entrée users à l'inscription (optionnel si vous l'insérez depuis l'app)
-- create or replace function public.handle_new_user()
-- returns trigger as $$
-- begin
--   insert into public.users (id, email, full_name, role)
--   values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'member');
--   return new;
-- end;
-- $$ language plpgsql security definer;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();

-- RLS (Row Level Security) : activer et définir les politiques selon vos besoins.
-- alter table public.users enable row level security;
-- alter table public.modules enable row level security;
-- alter table public.episodes enable row level security;
-- alter table public.progress enable row level security;
-- alter table public.resources enable row level security;
-- alter table public.announcements enable row level security;
