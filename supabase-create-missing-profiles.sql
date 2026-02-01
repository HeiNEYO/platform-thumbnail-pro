-- Script pour créer automatiquement les profils manquants dans public.users
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
-- 
-- Ce script trouve tous les utilisateurs dans auth.users qui n'ont pas de profil
-- dans public.users et les crée automatiquement.

-- 1. Voir les utilisateurs qui seront créés
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  'member' as role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 2. Créer les profils manquants
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  'member' as role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. Vérifier le résultat
SELECT COUNT(*) as total_users_in_public_users FROM public.users;
SELECT COUNT(*) as total_users_in_auth_users FROM auth.users;

-- Les deux nombres devraient être identiques (ou public.users peut avoir plus si des admins ont été créés manuellement)
