-- ============================================
-- CORRIGER LE BUG DE CONNEXION
-- ============================================
-- Problème : L'utilisateur ne peut pas voir son propre profil après connexion
-- Solution : Simplifier les politiques RLS pour users

-- ============================================
-- ÉTAPE 1 : Vérifier que le trigger fonctionne
-- ============================================

-- Vérifier que le trigger existe
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

-- ============================================
-- ÉTAPE 2 : Simplifier les politiques users
-- ============================================

-- Supprimer toutes les politiques users existantes
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Politique simple : L'utilisateur peut voir et modifier son propre profil
CREATE POLICY "Users can manage own profile"
ON users FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Politique pour les admins : Peuvent voir tous les users
-- Utilise la fonction is_admin() qui bypass RLS
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  auth.uid() = id  -- Son propre profil
  OR
  public.is_admin()  -- Ou admin (si la fonction existe)
);

-- ============================================
-- ÉTAPE 3 : Vérifier que le trigger crée bien les profils
-- ============================================

-- Recréer le trigger si nécessaire
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'member'
  )
  ON CONFLICT (id) DO NOTHING;  -- Éviter les erreurs si le profil existe déjà
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer et recréer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ÉTAPE 4 : Test de vérification
-- ============================================

-- Vérifier que vous pouvez voir votre propre profil
-- (Remplacez 'VOTRE_USER_ID' par votre ID utilisateur)
-- SELECT * FROM users WHERE id = auth.uid();

-- Vérifier que la fonction is_admin existe
SELECT EXISTS (
  SELECT 1 FROM pg_proc 
  WHERE proname = 'is_admin' 
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
) AS function_exists;
