-- ============================================
-- AJOUTER LE CHAMP IMAGE_URL À LA TABLE MODULES
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- Ce script ajoute un champ image_url pour stocker l'URL de l'image de chaque formation
-- ============================================

-- Ajouter la colonne image_url si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'modules' 
    AND column_name = 'image_url'
  ) THEN
    ALTER TABLE public.modules ADD COLUMN image_url TEXT;
    COMMENT ON COLUMN public.modules.image_url IS 'URL de l''image de couverture de la formation';
  END IF;
END $$;

-- Mettre à jour le module "Formation Minia Making" avec l'image
UPDATE public.modules 
SET image_url = '/images/formations/thumbnail-pro-formation.jpg'
WHERE title = 'Formation Minia Making';
