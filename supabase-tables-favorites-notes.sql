-- Tables Favoris et Notes pour la plateforme
-- Exécuter dans le SQL Editor Supabase (Dashboard > SQL Editor > New query)

-- ========== TABLE FAVORIS ==========
-- Un favori peut être un épisode OU une ressource (item_type + item_id)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  item_type text not null check (item_type in ('episode', 'resource')),
  episode_id uuid references public.episodes(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete cascade,
  created_at timestamptz default now(),
  constraint favorites_item_check check (
    (item_type = 'episode' and episode_id is not null and resource_id is null) or
    (item_type = 'resource' and resource_id is not null and episode_id is null)
  )
);

create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_favorites_episode_id on public.favorites(episode_id) where episode_id is not null;
create index if not exists idx_favorites_resource_id on public.favorites(resource_id) where resource_id is not null;
create unique index if not exists idx_favorites_unique_episode
  on public.favorites(user_id, item_type, episode_id)
  where item_type = 'episode';
create unique index if not exists idx_favorites_unique_resource
  on public.favorites(user_id, item_type, resource_id)
  where item_type = 'resource';

-- RLS
alter table public.favorites enable row level security;

drop policy if exists "Users can read own favorites" on public.favorites;
create policy "Users can read own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own favorites" on public.favorites;
create policy "Users can insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own favorites" on public.favorites;
create policy "Users can delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ========== TABLE NOTES ==========
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  content text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, episode_id)
);

create index if not exists idx_notes_user_id on public.notes(user_id);
create index if not exists idx_notes_episode_id on public.notes(episode_id);

-- RLS
alter table public.notes enable row level security;

drop policy if exists "Users can read own notes" on public.notes;
create policy "Users can read own notes"
  on public.notes for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own notes" on public.notes;
create policy "Users can insert own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own notes" on public.notes;
create policy "Users can update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own notes" on public.notes;
create policy "Users can delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Trigger updated_at pour notes
create or replace function public.set_notes_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists notes_updated_at on public.notes;
create trigger notes_updated_at
  before update on public.notes
  for each row execute function public.set_notes_updated_at();
