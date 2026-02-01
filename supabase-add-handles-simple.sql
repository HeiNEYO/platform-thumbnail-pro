-- ============================================
-- SCRIPT SIMPLE - Ajouter les colonnes Discord/X
-- ============================================
-- Copiez-collez ce script dans Supabase SQL Editor et cliquez sur "Run"

-- Ajouter twitter_handle
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS twitter_handle TEXT;

-- Ajouter discord_tag  
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS discord_tag TEXT;

-- Vérification
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('twitter_handle', 'discord_tag');

-- ✅ Si vous voyez les 2 colonnes ci-dessus, c'est bon !
