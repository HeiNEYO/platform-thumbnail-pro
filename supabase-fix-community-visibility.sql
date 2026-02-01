-- ============================================
-- FIX : Visibilité de tous les membres dans la communauté
-- ============================================
-- Ce script garantit que tous les membres authentifiés peuvent voir
-- tous les autres membres dans l'onglet Communauté
-- ============================================

-- 1. Ajouter la colonne community_score si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'community_score'
  ) THEN
    ALTER TABLE public.users ADD COLUMN community_score INTEGER DEFAULT 0;
    RAISE NOTICE 'Colonne community_score ajoutée';
  ELSE
    RAISE NOTICE 'Colonne community_score existe déjà';
  END IF;
END $$;

-- Activer RLS si ce n'est pas déjà fait
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques qui pourraient limiter la visibilité
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "All authenticated users can view all profiles" ON public.users;

-- Politique principale : Tous les utilisateurs authentifiés peuvent voir TOUS les profils
-- Cette politique permet à n'importe quel membre authentifié de voir tous les autres membres
CREATE POLICY "All authenticated users can view all profiles"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Les utilisateurs peuvent mettre à jour leur propre profil uniquement
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique : Les admins peuvent tout faire (pour futures fonctionnalités admin)
-- NOTE: Cette politique est supprimée car elle cause une récursion infinie
-- (elle essaie de lire la table users pour vérifier le rôle, ce qui déclenche la politique elle-même)
-- Les admins peuvent toujours utiliser la politique "All authenticated users can view all profiles"
-- pour voir tous les utilisateurs, et ils peuvent mettre à jour via leur propre politique
DROP POLICY IF EXISTS "Admins can do everything" ON public.users;

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Pour vérifier que les politiques sont bien appliquées :
-- SELECT * FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public';
