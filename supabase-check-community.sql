-- Script de diagnostic pour la page Communauté
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run

-- 1. Vérifier les colonnes de la table users
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('twitter_handle', 'discord_tag', 'community_score')
ORDER BY column_name;

-- 2. Compter le nombre total d'utilisateurs
SELECT COUNT(*) as total_users FROM public.users;

-- 3. Afficher tous les utilisateurs avec leurs infos
SELECT 
  id,
  email,
  full_name,
  avatar_url,
  twitter_handle,
  discord_tag,
  community_score,
  created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 20;

-- 4. Si les colonnes n'existent pas, les créer :
-- (Décommentez les lignes suivantes si nécessaire)
/*
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS twitter_handle text,
ADD COLUMN IF NOT EXISTS discord_tag text,
ADD COLUMN IF NOT EXISTS community_score int DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_users_community_score ON public.users(community_score DESC);
*/
