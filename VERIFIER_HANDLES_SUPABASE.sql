-- Script pour vérifier que les handles sont bien sauvegardés dans Supabase
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run

-- 1. Vérifier que les colonnes existent
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name IN ('twitter_handle', 'discord_tag')
ORDER BY column_name;

-- 2. Voir tous les utilisateurs avec leurs handles
SELECT 
  id,
  email,
  full_name,
  twitter_handle,
  discord_tag,
  CASE 
    WHEN twitter_handle IS NOT NULL AND twitter_handle != '' THEN 'Oui'
    ELSE 'Non'
  END as a_twitter,
  CASE 
    WHEN discord_tag IS NOT NULL AND discord_tag != '' THEN 'Oui'
    ELSE 'Non'
  END as a_discord
FROM public.users
ORDER BY created_at DESC
LIMIT 20;

-- 3. Compter les utilisateurs avec des handles
SELECT 
  COUNT(*) as total_users,
  COUNT(twitter_handle) FILTER (WHERE twitter_handle IS NOT NULL AND twitter_handle != '') as avec_twitter,
  COUNT(discord_tag) FILTER (WHERE discord_tag IS NOT NULL AND discord_tag != '') as avec_discord
FROM public.users;

-- 4. Voir les handles non vides
SELECT 
  id,
  email,
  full_name,
  twitter_handle,
  discord_tag
FROM public.users
WHERE (twitter_handle IS NOT NULL AND twitter_handle != '') 
   OR (discord_tag IS NOT NULL AND discord_tag != '')
ORDER BY created_at DESC;
