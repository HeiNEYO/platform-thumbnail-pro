-- À exécuter dans Supabase : Dashboard → SQL Editor → New query
-- Crée la table public.users requise pour l'inscription et la connexion.

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Optionnel : activer RLS et ajouter des policies selon vos besoins.
-- Sans RLS, l'app peut insérer/lire avec la clé anon (service role ou policies à définir).
