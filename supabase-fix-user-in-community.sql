-- Script pour vérifier et corriger le problème de profil manquant dans Communauté
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run

-- 1. Vérifier tous les utilisateurs dans auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 2. Vérifier tous les utilisateurs dans public.users
SELECT 
  id,
  email,
  full_name,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- 3. Trouver les utilisateurs dans auth.users qui ne sont PAS dans public.users
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 4. Si vous trouvez des utilisateurs manquants, les ajouter automatiquement :
-- (Décommentez et adaptez selon vos besoins)
/*
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  'member' as role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
*/

-- 5. Vérifier les politiques RLS sur la table users
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users';

-- 6. Si RLS bloque la lecture, créer une politique pour permettre la lecture à tous les utilisateurs authentifiés
-- (Décommentez si nécessaire)
/*
-- Désactiver RLS temporairement pour tester (ATTENTION : à réactiver après)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- OU créer une politique pour permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY IF NOT EXISTS "Authenticated users can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (true);
*/
