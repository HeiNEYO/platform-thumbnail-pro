-- ============================================
-- SUPABASE - CONFIGURATION COMPLÈTE
-- ============================================
--
-- C'EST CE FICHIER QUI CRÉE LES TABLES (Table Editor sera vide tant que tu ne l'as pas exécuté).
--
-- À faire dans Supabase :
-- 1. Menu gauche → SQL Editor → + New query
-- 2. Dans CE fichier : Ctrl+A (tout sélectionner) → Ctrl+C (copier)
-- 3. Dans Supabase : Ctrl+V (coller) → Run (bouton en bas à droite)
-- 4. Attendre "Success" → puis aller dans Table Editor : tu dois voir users, modules, episodes, etc.
--
-- Ce script :
-- 1. Crée les tables (users, modules, episodes, progress, resources, announcements)
-- 2. Crée le trigger : à chaque inscription = nouveau Membre dans public.users
-- 3. Active la sécurité RLS et les politiques (Membre vs Admin)
-- 4. Crée les index pour les performances
--
-- RÔLES :
-- - Membre : créé à l'inscription, accès à son interface (dashboard, modules, progression, etc.)
-- - Admin  : tous les droits Membre + voir tous les users, gérer modules/épisodes/ressources/annonces
-- ============================================

-- ============================================
-- PARTIE 1 - CRÉATION DES TABLES
-- ============================================

-- Table users (lien avec auth.users, rôle member ou admin)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table modules
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  order_index int NOT NULL DEFAULT 0,
  duration_estimate text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table episodes
CREATE TABLE IF NOT EXISTS public.episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration text,
  order_index int NOT NULL DEFAULT 0,
  video_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table progress (progression par utilisateur et par épisode)
CREATE TABLE IF NOT EXISTS public.progress (
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  episode_id uuid NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, episode_id)
);

-- Table resources
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  preview_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_important boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Index sur users (pour les requêtes par rôle / email)
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================
-- PARTIE 2 - CRÉATION AUTOMATIQUE D'UN MEMBRE À L'INSCRIPTION
-- ============================================

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
-- PARTIE 2b - FONCTION HELPER ANTI-RÉCURSION RLS
-- ============================================
-- Évite la récursion infinie : les politiques admin ne doivent pas
-- relire la table users (sinon RLS se réévalue à l'infini).
-- Cette fonction lit users avec les droits du propriétaire (bypass RLS).

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

-- ============================================
-- PARTIE 3 - ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ----- Politiques : USERS -----
-- (Une seule politique SELECT : son profil OU admin → évite récursion)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Users can view own profile or admins all"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ----- Politiques : MODULES -----
DROP POLICY IF EXISTS "Authenticated users can view modules" ON public.modules;
CREATE POLICY "Authenticated users can view modules"
  ON public.modules FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
CREATE POLICY "Admins can manage modules"
  ON public.modules FOR ALL
  USING (public.is_admin());

-- ----- Politiques : EPISODES -----
DROP POLICY IF EXISTS "Authenticated users can view episodes" ON public.episodes;
CREATE POLICY "Authenticated users can view episodes"
  ON public.episodes FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage episodes" ON public.episodes;
CREATE POLICY "Admins can manage episodes"
  ON public.episodes FOR ALL
  USING (public.is_admin());

-- ----- Politiques : PROGRESS -----
DROP POLICY IF EXISTS "Users can view own progress" ON public.progress;
CREATE POLICY "Users can view own progress"
  ON public.progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own progress" ON public.progress;
CREATE POLICY "Users can create own progress"
  ON public.progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.progress;
CREATE POLICY "Users can update own progress"
  ON public.progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all progress" ON public.progress;
CREATE POLICY "Admins can view all progress"
  ON public.progress FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- ----- Politiques : RESOURCES -----
DROP POLICY IF EXISTS "Authenticated users can view resources" ON public.resources;
CREATE POLICY "Authenticated users can view resources"
  ON public.resources FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;
CREATE POLICY "Admins can manage resources"
  ON public.resources FOR ALL
  USING (public.is_admin());

-- ----- Politiques : ANNOUNCEMENTS -----
DROP POLICY IF EXISTS "Authenticated users can view announcements" ON public.announcements;
CREATE POLICY "Authenticated users can view announcements"
  ON public.announcements FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (public.is_admin());

-- ============================================
-- PARTIE 4 - INDEX POUR LES PERFORMANCES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_episodes_module_id ON public.episodes(module_id);
CREATE INDEX IF NOT EXISTS idx_episodes_order ON public.episodes(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_episodes_created ON public.episodes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_progress_user_episode ON public.progress(user_id, episode_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON public.progress(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(order_index);
CREATE INDEX IF NOT EXISTS idx_modules_created ON public.modules(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);

CREATE INDEX IF NOT EXISTS idx_announcements_important ON public.announcements(is_important, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON public.announcements(created_at DESC);

-- ============================================
-- FIN - Créer un admin après inscription
-- ============================================
-- Dans une NOUVELLE requête SQL, exécuter (en remplaçant l'email) :
--
--   UPDATE public.users SET role = 'admin' WHERE email = 'ton-email@exemple.com';
--
