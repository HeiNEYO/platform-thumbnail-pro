-- ============================================
-- AJOUT DES CHAMPS DE LOCALISATION AUX UTILISATEURS
-- ============================================
-- Ce script ajoute les colonnes nécessaires pour la fonctionnalité de carte des membres
-- ============================================

-- Ajouter les colonnes de localisation si elles n'existent pas
DO $$ 
BEGIN
  -- Colonne pour la latitude
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'latitude'
  ) THEN
    ALTER TABLE public.users ADD COLUMN latitude DECIMAL(10, 8);
  END IF;

  -- Colonne pour la longitude
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'longitude'
  ) THEN
    ALTER TABLE public.users ADD COLUMN longitude DECIMAL(11, 8);
  END IF;

  -- Colonne pour la ville
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'city'
  ) THEN
    ALTER TABLE public.users ADD COLUMN city TEXT;
  END IF;

  -- Colonne pour le pays
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'country'
  ) THEN
    ALTER TABLE public.users ADD COLUMN country TEXT;
  END IF;

  -- Colonne pour activer/désactiver l'affichage de la localisation
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'show_location'
  ) THEN
    ALTER TABLE public.users ADD COLUMN show_location BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Vérification
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name IN ('latitude', 'longitude', 'city', 'country', 'show_location')
ORDER BY column_name;
