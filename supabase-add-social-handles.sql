-- Script pour ajouter les colonnes Twitter et Discord à la table users
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run

-- 1. Ajouter la colonne twitter_handle (si elle n'existe pas)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'twitter_handle'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN twitter_handle TEXT;
    END IF;
END $$;

-- 2. Ajouter la colonne discord_tag (si elle n'existe pas)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'discord_tag'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN discord_tag TEXT;
    END IF;
END $$;

-- 3. Vérifier que les colonnes ont été créées
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name IN ('twitter_handle', 'discord_tag')
ORDER BY column_name;

-- 4. (Optionnel) Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_twitter_handle ON public.users(twitter_handle) WHERE twitter_handle IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_discord_tag ON public.users(discord_tag) WHERE discord_tag IS NOT NULL;
