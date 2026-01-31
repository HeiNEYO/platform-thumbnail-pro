-- ============================================
-- SUPABASE : CRÉATION DE COMPTES MEMBRE & ADMIN
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- RÔLES :
-- • Membre : compte créé à l'inscription, accès à son interface (dashboard, modules, progression, etc.)
-- • Admin  : tous les avantages Membre + onglets/sections supplémentaires (à attribuer plus tard)
-- ============================================

-- ============================================
-- 1. TABLE USERS (si pas déjà créée)
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour les requêtes par rôle
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================
-- 2. CRÉATION AUTOMATIQUE D'UN COMPTE MEMBRE
-- ============================================
-- À chaque inscription (auth.users), une ligne est créée dans public.users avec role = 'member'.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. CRÉER UN COMPTE ADMIN
-- ============================================
-- Méthode 1 : Promouvoir un membre existant en admin (exécuter après qu'il se soit inscrit)
-- Remplacer 'email@exemple.com' par l'email du compte à promouvoir.

-- UPDATE public.users SET role = 'admin' WHERE email = 'email@exemple.com';

-- Méthode 2 : Créer le premier admin manuellement (si auth.users existe déjà pour cet email)
-- INSERT INTO public.users (id, email, full_name, role)
-- SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
-- FROM auth.users WHERE email = 'votre-admin@email.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) - USERS
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Un utilisateur voit uniquement son propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Un utilisateur peut mettre à jour son propre profil (nom, avatar, pas le rôle)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Les admins peuvent voir tous les utilisateurs (pour futures sections admin)
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Seul un super-admin ou le backend (service role) peut changer le rôle.
-- En pratique : promouvoir en admin via SQL Editor ou une fonction SECURITY DEFINER réservée aux admins.

-- ============================================
-- 5. RÉSUMÉ DES DROITS
-- ============================================
-- MEMBRE :
--   - Inscription → compte créé avec role = 'member'
--   - Interface : dashboard, modules, épisodes, progression, profil, ressources, etc.
--   - RLS : accès à son profil, à la progression, aux contenus (modules, épisodes, ressources)
--
-- ADMIN :
--   - Tous les droits Membre +
--   - Lecture de tous les utilisateurs
--   - Gestion des modules, épisodes, ressources, annonces (selon vos politiques RLS existantes)
--   - Onglets/sections supplémentaires à ajouter plus tard dans l’app (ex: liste des membres, stats globales, etc.)
--
-- Pour activer RLS sur les autres tables (modules, episodes, progress, resources, announcements),
-- exécuter le fichier supabase-setup.sql ou les politiques correspondantes.
-- ============================================
