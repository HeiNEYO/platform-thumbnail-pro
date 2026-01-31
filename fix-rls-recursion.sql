-- ============================================
-- CORRIGER LA RÉCURSION INFINIE DANS RLS
-- ============================================
-- Problème : Les politiques admin lisent la table users, ce qui déclenche
-- à nouveau les politiques RLS, créant une boucle infinie.
-- Solution : Créer une fonction SECURITY DEFINER qui bypass RLS

-- ============================================
-- ÉTAPE 1 : Créer une fonction helper qui bypass RLS
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- ============================================
-- ÉTAPE 2 : Supprimer les anciennes politiques problématiques
-- ============================================

DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can view all progress" ON progress;
DROP POLICY IF EXISTS "Admins can manage modules" ON modules;
DROP POLICY IF EXISTS "Admins can manage episodes" ON episodes;
DROP POLICY IF EXISTS "Admins can manage resources" ON resources;
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

-- ============================================
-- ÉTAPE 3 : Recréer les politiques avec la fonction helper
-- ============================================

-- Users : Admins peuvent voir tous les users
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  auth.uid() = id  -- L'utilisateur peut voir son propre profil
  OR
  public.is_admin()  -- Ou si c'est un admin (fonction qui bypass RLS)
);

-- Progress : Admins peuvent voir toute la progression
CREATE POLICY "Admins can view all progress"
ON progress FOR SELECT
USING (
  auth.uid() = user_id  -- L'utilisateur peut voir sa propre progression
  OR
  public.is_admin()  -- Ou si c'est un admin
);

-- Modules : Admins peuvent gérer
CREATE POLICY "Admins can manage modules"
ON modules FOR ALL
USING (public.is_admin());

-- Episodes : Admins peuvent gérer
CREATE POLICY "Admins can manage episodes"
ON episodes FOR ALL
USING (public.is_admin());

-- Resources : Admins peuvent gérer
CREATE POLICY "Admins can manage resources"
ON resources FOR ALL
USING (public.is_admin());

-- Announcements : Admins peuvent gérer
CREATE POLICY "Admins can manage announcements"
ON announcements FOR ALL
USING (public.is_admin());

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Testez que tout fonctionne :
-- SELECT public.is_admin(); -- Devrait retourner true si vous êtes admin
