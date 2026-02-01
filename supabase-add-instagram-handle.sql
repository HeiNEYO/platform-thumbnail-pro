-- Script SQL pour ajouter la colonne instagram_handle à la table users
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter la colonne instagram_handle si elle n'existe pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'instagram_handle'
  ) THEN
    ALTER TABLE public.users 
    ADD COLUMN instagram_handle TEXT;
    
    -- Ajouter un commentaire pour documenter la colonne
    COMMENT ON COLUMN public.users.instagram_handle IS 'Nom d''utilisateur Instagram de l''utilisateur (sans le @)';
  END IF;
END $$;

-- Vérifier que la colonne a été créée
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users' 
  AND column_name = 'instagram_handle';
