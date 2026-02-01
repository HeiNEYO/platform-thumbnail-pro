-- Ajouter les champs pour la communauté (twitter, discord, score)
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run

-- Ajouter les colonnes si elles n'existent pas déjà
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS twitter_handle text,
ADD COLUMN IF NOT EXISTS discord_tag text,
ADD COLUMN IF NOT EXISTS community_score int DEFAULT 0;

-- Index pour le tri par score
CREATE INDEX IF NOT EXISTS idx_users_community_score ON public.users(community_score DESC);

-- Commentaire sur les colonnes
COMMENT ON COLUMN public.users.twitter_handle IS 'Handle Twitter (ex: @username)';
COMMENT ON COLUMN public.users.discord_tag IS 'Tag Discord (ex: username#1234)';
COMMENT ON COLUMN public.users.community_score IS 'Score communautaire basé sur l''engagement';
