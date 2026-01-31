-- ============================================
-- SETUP SUPABASE - SÉCURITÉ & PERFORMANCE
-- ============================================
-- Exécuter ce fichier dans Supabase SQL Editor
-- Menu : SQL Editor > New query > Coller ce code > Run

-- ============================================
-- 1. ACTIVER ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLITIQUES RLS - USERS
-- ============================================

-- Users peuvent voir leur propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users peuvent mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins peuvent tout voir
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- 3. POLITIQUES RLS - MODULES
-- ============================================

-- Tous les utilisateurs authentifiés peuvent voir les modules
DROP POLICY IF EXISTS "Authenticated users can view modules" ON modules;
CREATE POLICY "Authenticated users can view modules"
ON modules FOR SELECT
USING (auth.role() = 'authenticated');

-- Admins peuvent créer/modifier/supprimer des modules
DROP POLICY IF EXISTS "Admins can manage modules" ON modules;
CREATE POLICY "Admins can manage modules"
ON modules FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- 4. POLITIQUES RLS - EPISODES
-- ============================================

-- Tous les utilisateurs authentifiés peuvent voir les épisodes
DROP POLICY IF EXISTS "Authenticated users can view episodes" ON episodes;
CREATE POLICY "Authenticated users can view episodes"
ON episodes FOR SELECT
USING (auth.role() = 'authenticated');

-- Admins peuvent gérer les épisodes
DROP POLICY IF EXISTS "Admins can manage episodes" ON episodes;
CREATE POLICY "Admins can manage episodes"
ON episodes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- 5. POLITIQUES RLS - PROGRESS
-- ============================================

-- Users peuvent voir leur propre progression
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
CREATE POLICY "Users can view own progress"
ON progress FOR SELECT
USING (auth.uid() = user_id);

-- Users peuvent créer leur propre progression
DROP POLICY IF EXISTS "Users can create own progress" ON progress;
CREATE POLICY "Users can create own progress"
ON progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users peuvent mettre à jour leur propre progression
DROP POLICY IF EXISTS "Users can update own progress" ON progress;
CREATE POLICY "Users can update own progress"
ON progress FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins peuvent voir toute la progression
DROP POLICY IF EXISTS "Admins can view all progress" ON progress;
CREATE POLICY "Admins can view all progress"
ON progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- 6. POLITIQUES RLS - RESOURCES
-- ============================================

-- Tous les utilisateurs authentifiés peuvent voir les ressources
DROP POLICY IF EXISTS "Authenticated users can view resources" ON resources;
CREATE POLICY "Authenticated users can view resources"
ON resources FOR SELECT
USING (auth.role() = 'authenticated');

-- Admins peuvent gérer les ressources
DROP POLICY IF EXISTS "Admins can manage resources" ON resources;
CREATE POLICY "Admins can manage resources"
ON resources FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- 7. POLITIQUES RLS - ANNOUNCEMENTS
-- ============================================

-- Tous les utilisateurs authentifiés peuvent voir les annonces
DROP POLICY IF EXISTS "Authenticated users can view announcements" ON announcements;
CREATE POLICY "Authenticated users can view announcements"
ON announcements FOR SELECT
USING (auth.role() = 'authenticated');

-- Admins peuvent gérer les annonces
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
CREATE POLICY "Admins can manage announcements"
ON announcements FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- 8. INDEXES POUR PERFORMANCE
-- ============================================

-- Indexes pour episodes
CREATE INDEX IF NOT EXISTS idx_episodes_module_id ON episodes(module_id);
CREATE INDEX IF NOT EXISTS idx_episodes_order ON episodes(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_episodes_created ON episodes(created_at DESC);

-- Indexes pour progress
CREATE INDEX IF NOT EXISTS idx_progress_user_episode ON progress(user_id, episode_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON progress(completed_at DESC);

-- Indexes pour modules
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(order_index);
CREATE INDEX IF NOT EXISTS idx_modules_created ON modules(created_at DESC);

-- Indexes pour resources
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

-- Indexes pour announcements
CREATE INDEX IF NOT EXISTS idx_announcements_important ON announcements(is_important, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);

-- ============================================
-- 9. FONCTION POUR CRÉER UN USER AUTOMATIQUEMENT
-- ============================================

-- Fonction qui crée automatiquement un profil dans users quand un compte auth est créé
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

-- Trigger qui appelle la fonction à la création d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FIN DU SETUP
-- ============================================
-- Vérifier que tout est OK :
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
-- SELECT * FROM pg_indexes WHERE schemaname = 'public';
