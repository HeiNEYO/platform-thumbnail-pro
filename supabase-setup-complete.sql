-- ============================================
-- SCRIPT COMPLET DE CONFIGURATION SUPABASE
-- Pour Platform Thumbnail Pro
-- ============================================

-- ============================================
-- 1. CRÉATION DE LA TABLE USERS (si elle n'existe pas)
-- ============================================

-- Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'intervenant')),
  account_number TEXT,
  twitter_handle TEXT,
  discord_tag TEXT,
  instagram_handle TEXT,
  community_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Créer un index sur le role pour les filtres
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Créer un index sur community_score pour le tri
CREATE INDEX IF NOT EXISTS idx_users_community_score ON public.users(community_score DESC);

-- ============================================
-- 2. AJOUT DES COLONNES SOCIALES (si elles n'existent pas)
-- ============================================

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
    COMMENT ON COLUMN public.users.discord_tag IS 'Tag Discord de l''utilisateur (ex: username#1234)';
  END IF;
END $$;

-- Ajouter instagram_handle si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'instagram_handle'
  ) THEN
    ALTER TABLE public.users ADD COLUMN instagram_handle TEXT;
    COMMENT ON COLUMN public.users.instagram_handle IS 'Nom d''utilisateur Instagram (sans le @)';
  END IF;
END $$;

-- Ajouter twitter_handle si elle n'existe pas (pour compatibilité)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'twitter_handle'
  ) THEN
    ALTER TABLE public.users ADD COLUMN twitter_handle TEXT;
    COMMENT ON COLUMN public.users.twitter_handle IS 'Handle Twitter/X (sans le @)';
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
-- 3. FONCTION POUR CRÉER AUTOMATIQUEMENT UN PROFIL UTILISATEUR
-- ============================================

-- Fonction qui crée automatiquement un profil dans public.users quand un utilisateur s'inscrit
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

-- Trigger qui appelle la fonction à chaque création d'utilisateur dans auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) - POLITIQUES DE SÉCURITÉ
-- ============================================

-- Activer RLS sur la table users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent lire leur propre profil
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Politique : Les utilisateurs peuvent lire tous les profils (pour la communauté)
DROP POLICY IF EXISTS "Users can read all profiles" ON public.users;
CREATE POLICY "Users can read all profiles"
  ON public.users
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Politique : Les utilisateurs peuvent mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique : Les admins peuvent tout faire
DROP POLICY IF EXISTS "Admins can do everything" ON public.users;
CREATE POLICY "Admins can do everything"
  ON public.users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 5. FONCTION POUR METTRE À JOUR updated_at AUTOMATIQUEMENT
-- ============================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at à chaque modification
DROP TRIGGER IF EXISTS set_updated_at ON public.users;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 6. CRÉATION D'UN COMPTE ADMIN (EXEMPLE)
-- ============================================
-- ⚠️ REMPLACEZ les valeurs suivantes par vos propres données :
--    - L'UUID de l'utilisateur dans auth.users
--    - L'email de l'admin
--    - Le nom complet de l'admin

-- Pour créer un compte admin :
-- 1. Créez d'abord l'utilisateur dans l'interface Supabase Auth
-- 2. Récupérez son UUID depuis auth.users
-- 3. Exécutez cette requête en remplaçant 'USER_UUID_ICI' par l'UUID réel :

-- UPDATE public.users
-- SET role = 'admin'
-- WHERE id = 'USER_UUID_ICI';

-- OU créez directement un admin (si vous avez déjà l'UUID) :
-- INSERT INTO public.users (id, email, full_name, role)
-- VALUES (
--   'USER_UUID_ICI', -- Remplacez par l'UUID de l'utilisateur dans auth.users
--   'admin@example.com', -- Remplacez par l'email de l'admin
--   'Administrateur', -- Remplacez par le nom de l'admin
--   'admin'
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ============================================
-- 7. VÉRIFICATIONS FINALES
-- ============================================

-- Vérifier que toutes les colonnes existent
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users';

-- Vérifier les triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- ============================================
-- FIN DU SCRIPT
-- ============================================
