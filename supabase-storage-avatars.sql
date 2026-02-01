-- Configuration Supabase Storage pour les avatars
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run

-- 1. Créer le bucket "avatars" (à faire dans Storage → Create bucket)
-- Nom du bucket : avatars
-- Public bucket : OUI (pour que les images soient accessibles publiquement)
-- File size limit : 4 MB
-- Allowed MIME types : image/*

-- 2. Politique RLS pour permettre l'upload (exécuter ce script SQL)
-- Permettre à tous les utilisateurs authentifiés d'uploader leur propre avatar

-- Politique INSERT : Les utilisateurs peuvent uploader leur propre avatar
CREATE POLICY IF NOT EXISTS "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique SELECT : Tous les avatars sont publics (lecture)
CREATE POLICY IF NOT EXISTS "Avatars are publicly readable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Politique UPDATE : Les utilisateurs peuvent mettre à jour leur propre avatar
CREATE POLICY IF NOT EXISTS "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique DELETE : Les utilisateurs peuvent supprimer leur propre avatar
CREATE POLICY IF NOT EXISTS "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Note : Le bucket doit être créé manuellement dans l'interface Supabase Storage
-- avec les paramètres mentionnés ci-dessus
