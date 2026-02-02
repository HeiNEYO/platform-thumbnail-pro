-- =====================================================
-- CORRECTION DES ERREURS RLS POUR EPISODES ET MODULES
-- =====================================================
-- Ce script active RLS et crée les politiques appropriées
-- pour les tables episodes et modules dans Supabase
-- =====================================================

-- =====================================================
-- 1. ACTIVER ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur la table modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur la table episodes
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. SUPPRIMER LES ANCIENNES POLITIQUES (si elles existent)
-- =====================================================

-- Modules
DROP POLICY IF EXISTS "Authenticated users can view modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can insert modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can update modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can delete modules" ON public.modules;

-- Episodes
DROP POLICY IF EXISTS "Authenticated users can view episodes" ON public.episodes;
DROP POLICY IF EXISTS "Admins can manage episodes" ON public.episodes;
DROP POLICY IF EXISTS "Admins can insert episodes" ON public.episodes;
DROP POLICY IF EXISTS "Admins can update episodes" ON public.episodes;
DROP POLICY IF EXISTS "Admins can delete episodes" ON public.episodes;

-- =====================================================
-- 3. CRÉER LES POLITIQUES RLS POUR MODULES
-- =====================================================

-- Politique : Tous les utilisateurs authentifiés peuvent voir les modules
CREATE POLICY "Authenticated users can view modules"
  ON public.modules
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Seuls les admins peuvent insérer des modules
CREATE POLICY "Admins can insert modules"
  ON public.modules
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Politique : Seuls les admins peuvent modifier des modules
CREATE POLICY "Admins can update modules"
  ON public.modules
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

-- Politique : Seuls les admins peuvent supprimer des modules
CREATE POLICY "Admins can delete modules"
  ON public.modules
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
-- 4. CRÉER LES POLITIQUES RLS POUR EPISODES
-- =====================================================

-- Politique : Tous les utilisateurs authentifiés peuvent voir les épisodes
CREATE POLICY "Authenticated users can view episodes"
  ON public.episodes
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Seuls les admins peuvent insérer des épisodes
CREATE POLICY "Admins can insert episodes"
  ON public.episodes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Politique : Seuls les admins peuvent modifier des épisodes
CREATE POLICY "Admins can update episodes"
  ON public.episodes
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

-- Politique : Seuls les admins peuvent supprimer des épisodes
CREATE POLICY "Admins can delete episodes"
  ON public.episodes
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
-- 5. VÉRIFICATION
-- =====================================================
-- Pour vérifier que RLS est bien activé, exécutez :
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('modules', 'episodes');
-- 
-- Le résultat devrait montrer rowsecurity = true pour les deux tables
-- =====================================================

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Collez ce script
-- 4. Exécutez-le
-- 5. Les erreurs RLS devraient disparaître dans l'onglet Issues
-- =====================================================
