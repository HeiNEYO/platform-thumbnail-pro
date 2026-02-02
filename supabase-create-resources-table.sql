-- =====================================================
-- CRÉATION DE LA TABLE RESOURCES POUR SUPABASE
-- =====================================================
-- Ce script crée la table resources avec toutes les colonnes nécessaires
-- pour stocker les ressources organisées par dossiers/catégories
-- =====================================================

-- Supprimer la table si elle existe déjà (optionnel, à utiliser avec précaution)
-- DROP TABLE IF EXISTS public.resources CASCADE;

-- Créer la table resources
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Créer un index sur la catégorie pour améliorer les performances de tri
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);

-- Créer un index sur le type pour améliorer les performances de filtrage
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);

-- Créer un index sur created_at pour le tri chronologique
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur la table
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "All authenticated users can view all resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can insert resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can update resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can delete resources" ON public.resources;

-- Politique : Tous les utilisateurs authentifiés peuvent voir toutes les ressources
CREATE POLICY "All authenticated users can view all resources"
  ON public.resources
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Seuls les admins peuvent ajouter des ressources
CREATE POLICY "Admins can insert resources"
  ON public.resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Politique : Seuls les admins peuvent modifier des ressources
CREATE POLICY "Admins can update resources"
  ON public.resources
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Politique : Seuls les admins peuvent supprimer des ressources
CREATE POLICY "Admins can delete resources"
  ON public.resources
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- =====================================================
-- COMMENTAIRES SUR LES COLONNES
-- =====================================================

COMMENT ON TABLE public.resources IS 'Table pour stocker les ressources organisées par catégories (templates, images, palettes, etc.)';
COMMENT ON COLUMN public.resources.id IS 'Identifiant unique de la ressource (UUID)';
COMMENT ON COLUMN public.resources.category IS 'Catégorie de la ressource (ex: templates, images, palettes, fonts, outils, videos, audio, autres)';
COMMENT ON COLUMN public.resources.title IS 'Titre de la ressource';
COMMENT ON COLUMN public.resources.type IS 'Type de ressource (ex: fichier, lien, template, etc.)';
COMMENT ON COLUMN public.resources.url IS 'URL de la ressource (lien de téléchargement ou lien externe)';
COMMENT ON COLUMN public.resources.preview_url IS 'URL de l''image de prévisualisation (optionnel)';
COMMENT ON COLUMN public.resources.created_at IS 'Date de création de la ressource';
COMMENT ON COLUMN public.resources.updated_at IS 'Date de dernière modification de la ressource';

-- =====================================================
-- EXEMPLES D'INSERTION (à décommenter et modifier selon vos besoins)
-- =====================================================

/*
-- Exemple 1 : Template
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'templates',
  'Template Thumbnail Gaming',
  'template',
  'https://example.com/template-gaming.zip',
  'https://example.com/preview-gaming.png'
);

-- Exemple 2 : Palette de couleurs
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'palettes',
  'Palette Gaming Vibrante',
  'palette',
  'https://coolors.co/palette/123456',
  'https://example.com/preview-palette.png'
);

-- Exemple 3 : Image
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'images',
  'Pack d''icônes Gaming',
  'image',
  'https://example.com/icons-pack.zip',
  'https://example.com/preview-icons.png'
);

-- Exemple 4 : Police
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'fonts',
  'Police Gaming Bold',
  'font',
  'https://example.com/font-gaming.ttf',
  'https://example.com/preview-font.png'
);

-- Exemple 5 : Outil
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'outils',
  'Générateur de Thumbnails',
  'outil',
  'https://example.com/thumbnail-generator',
  'https://example.com/preview-tool.png'
);
*/

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- Pour utiliser ce script :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Collez ce script
-- 4. Exécutez-le
-- 5. Vous pourrez ensuite ajouter vos ressources via l'interface Supabase ou via des INSERT SQL
-- =====================================================
