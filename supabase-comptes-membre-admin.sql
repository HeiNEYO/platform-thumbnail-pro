-- ============================================
-- SUPABASE : CRÉATION DE COMPTES MEMBRE & ADMIN
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- RÔLES :
-- • Membre : compte créé automatiquement à l'inscription, accès à son interface
--            (dashboard, modules, progression, profil, communauté, favoris, notes, etc.)
-- • Admin  : tous les avantages du compte Membre + onglets/sections supplémentaires
--            (gestion utilisateurs, modération, statistiques globales, etc.)
-- ============================================

-- ============================================
-- 1. CRÉATION DE LA TABLE USERS (si pas déjà créée)
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'intervenant')),
  twitter_handle TEXT,
  discord_tag TEXT,
  community_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_community_score ON public.users(community_score DESC);

-- ============================================
-- 2. AJOUT DES COLONNES SOCIALES (si elles n'existent pas)
-- ============================================

-- Ajouter twitter_handle si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'twitter_handle'
  ) THEN
    ALTER TABLE public.users ADD COLUMN twitter_handle TEXT;
    COMMENT ON COLUMN public.users.twitter_handle IS 'Handle Twitter/X de l''utilisateur';
  END IF;
END $$;

-- Ajouter discord_tag si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'discord_tag'
  ) THEN
    ALTER TABLE public.users ADD COLUMN discord_tag TEXT;
    COMMENT ON COLUMN public.users.discord_tag IS 'Tag Discord de l''utilisateur';
  END IF;
END $$;

-- Ajouter community_score si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'community_score'
  ) THEN
    ALTER TABLE public.users ADD COLUMN community_score INTEGER DEFAULT 0;
    COMMENT ON COLUMN public.users.community_score IS 'Score communautaire de l''utilisateur';
  END IF;
END $$;

-- ============================================
-- 3. CRÉATION AUTOMATIQUE D'UN COMPTE MEMBRE
-- ============================================
-- À chaque inscription (auth.users), une ligne est créée dans public.users avec role = 'member'.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    'member' -- Par défaut, tous les nouveaux utilisateurs sont des membres
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) - POLITIQUES DE SÉCURITÉ
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent lire leur propre profil
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Politique : Les utilisateurs authentifiés peuvent lire tous les profils (pour la communauté)
DROP POLICY IF EXISTS "Users can read all profiles" ON public.users;
CREATE POLICY "Users can read all profiles"
  ON public.users FOR SELECT
  USING (auth.role() = 'authenticated');

-- Politique : Les utilisateurs peuvent mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique : Les admins peuvent voir tous les utilisateurs (pour futures sections admin)
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Politique : Les admins peuvent tout faire (pour futures fonctionnalités admin)
DROP POLICY IF EXISTS "Admins can do everything" ON public.users;
CREATE POLICY "Admins can do everything"
  ON public.users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 5. FONCTION POUR METTRE À JOUR updated_at AUTOMATIQUEMENT
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.users;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 6. CRÉER UN COMPTE ADMIN
-- ============================================
-- ⚠️ INSTRUCTIONS : Pour créer un compte admin, vous avez 2 options :

-- OPTION 1 : Promouvoir un membre existant en admin
-- Remplacer 'email@exemple.com' par l'email du compte à promouvoir, puis décommenter et exécuter :
-- UPDATE public.users SET role = 'admin' WHERE email = 'email@exemple.com';

-- OPTION 2 : Créer directement un admin (si l'utilisateur existe déjà dans auth.users)
-- Remplacer les valeurs ci-dessous, puis décommenter et exécuter :
-- INSERT INTO public.users (id, email, full_name, role)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', 'Admin'), 'admin'
-- FROM auth.users WHERE email = 'admin@exemple.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ============================================
-- 7. RÉSUMÉ DES DROITS ET INTERFACES
-- ============================================
-- 
-- COMPTE MEMBRE :
--   ✅ Inscription automatique → compte créé avec role = 'member'
--   ✅ Interface Membre :
--      - Dashboard personnel
--      - Formation (modules, épisodes)
--      - Progression personnelle
--      - Profil (modification nom, photo, Twitter, Discord)
--      - Communauté (voir tous les membres)
--      - Favoris (épisodes, ressources)
--      - Notes (notes personnelles sur les épisodes)
--      - Ressources
--      - Statistiques personnelles
--   ✅ RLS : accès à son profil, progression, contenus publics
--
-- COMPTE ADMIN :
--   ✅ Tous les avantages du compte Membre +
--   ✅ Interface Admin (à ajouter plus tard) :
--      - Gestion des utilisateurs (voir tous, modifier rôles)
--      - Gestion du contenu (modules, épisodes, ressources)
--      - Modération de la communauté
--      - Statistiques globales
--      - Gestion des annonces
--   ✅ RLS : accès à tous les utilisateurs, gestion complète
--
-- ============================================
-- FIN DU SCRIPT
-- ============================================
