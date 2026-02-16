-- ============================================
-- SUPABASE : Définir admankenzy@gmail.com comme intervenant
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- 1. Si l'utilisateur existe dans auth.users mais pas dans public.users → INSERT
-- 2. Si l'utilisateur existe déjà dans public.users → UPDATE
-- ============================================

-- Étape 1 : Créer le profil dans public.users (depuis auth.users) si manquant, avec rôle intervenant
INSERT INTO public.users (id, email, full_name, avatar_url, role)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url,
  'intervenant' as role
FROM auth.users au
WHERE au.email = 'admankenzy@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- Étape 2 : Mettre à jour le rôle si l'utilisateur existe déjà dans public.users
UPDATE public.users
SET role = 'intervenant'
WHERE email = 'admankenzy@gmail.com';

-- Vérifier le résultat
SELECT id, email, full_name, role FROM public.users WHERE email = 'admankenzy@gmail.com';
