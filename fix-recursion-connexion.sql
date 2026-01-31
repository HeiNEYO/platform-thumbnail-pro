-- ============================================
-- CORRECTION : récursion infinie sur la table users
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- Problème : "infinite recursion detected in policy for relation users"
-- Cause : les politiques admin lisent la table users pour vérifier le rôle,
-- ce qui relance les politiques RLS → boucle infinie.
-- Solution : fonction is_admin() en SECURITY DEFINER qui lit users sans RLS.
-- ============================================

-- 1. Créer la fonction helper (bypass RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Supprimer les anciennes politiques sur users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- 3. Une seule politique SELECT sur users (pas de récursion)
CREATE POLICY "Users can view own profile or admins all"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- 4. Remplacer les politiques admin sur les autres tables
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
CREATE POLICY "Admins can manage modules" ON public.modules FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage episodes" ON public.episodes;
CREATE POLICY "Admins can manage episodes" ON public.episodes FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all progress" ON public.progress;
CREATE POLICY "Admins can view all progress" ON public.progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (public.is_admin());
