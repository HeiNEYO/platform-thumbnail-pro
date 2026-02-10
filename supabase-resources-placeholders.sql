-- ============================================
-- SUPABASE : Ressources placeholder (vides)
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
-- Les URLs sont vides ; vous pourrez les remplir plus tard avec vos fichiers
-- ============================================

-- Vérifier que la table resources existe (structure standard)
-- Si besoin, créer la table :
-- CREATE TABLE IF NOT EXISTS public.resources (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   category TEXT NOT NULL,
--   title TEXT NOT NULL,
--   type TEXT NOT NULL,
--   url TEXT NOT NULL,  -- ou '' pour vide
--   preview_url TEXT,
--   created_at TIMESTAMPTZ DEFAULT now(),
--   updated_at TIMESTAMPTZ DEFAULT now()
-- );

-- Insérer des ressources vides par catégorie (url = '')
INSERT INTO public.resources (category, title, type, url, preview_url) VALUES
-- PSD Photoshop
('psd', 'Template PSD 1', 'psd', '', NULL),
('psd', 'Template PSD 2', 'psd', '', NULL),
('psd', 'Template PSD 3', 'psd', '', NULL),
('psd', 'Template PSD 4', 'psd', '', NULL),
-- Textures
('textures', 'Texture 1', 'image', '', NULL),
('textures', 'Texture 2', 'image', '', NULL),
('textures', 'Texture 3', 'image', '', NULL),
('textures', 'Texture 4', 'image', '', NULL),
-- Polices
('fonts', 'Police 1', 'font', '', NULL),
('fonts', 'Police 2', 'font', '', NULL),
('fonts', 'Police 3', 'font', '', NULL),
('fonts', 'Police 4', 'font', '', NULL),
-- Palettes
('palettes', 'Palette 1', 'palette', '', NULL),
('palettes', 'Palette 2', 'palette', '', NULL),
('palettes', 'Palette 3', 'palette', '', NULL),
('palettes', 'Palette 4', 'palette', '', NULL),
-- Templates
('templates', 'Template 1', 'template', '', NULL),
('templates', 'Template 2', 'template', '', NULL),
('templates', 'Template 3', 'template', '', NULL),
('templates', 'Template 4', 'template', '', NULL),
-- Images & Icônes
('images', 'Image 1', 'image', '', NULL),
('images', 'Image 2', 'image', '', NULL),
('images', 'Image 3', 'image', '', NULL),
('images', 'Image 4', 'image', NULL),
-- Outils
('outils', 'Outil 1', 'outil', '', NULL),
('outils', 'Outil 2', 'outil', '', NULL),
('outils', 'Outil 3', 'outil', '', NULL),
('outils', 'Outil 4', 'outil', '', NULL);

-- Note : modifier les titres et ajouter les URLs (Stockage Supabase) quand vos fichiers seront prêts.
