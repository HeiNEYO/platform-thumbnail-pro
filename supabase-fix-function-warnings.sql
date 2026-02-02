-- =====================================================
-- CORRECTION DES WARNINGS "FUNCTION SEARCH PATH MUTABLE"
-- =====================================================
-- Ce script corrige les warnings de sécurité pour les fonctions
-- en fixant le search_path pour éviter les attaques par injection
-- =====================================================

-- =====================================================
-- 1. CORRIGER set_notes_updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.set_notes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- 2. CORRIGER update_updated_at_column
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- 3. CORRIGER handle_new_user
-- =====================================================
-- Note: Cette fonction doit accéder à auth.users et public.users
-- On spécifie explicitement les schémas dans le SET search_path

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    'member'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Pour vérifier que les fonctions ont bien le search_path fixé :
-- SELECT 
--   proname as function_name,
--   prosecdef as security_definer,
--   proconfig as search_path_config
-- FROM pg_proc 
-- WHERE proname IN ('set_notes_updated_at', 'update_updated_at_column', 'handle_new_user')
-- AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
-- =====================================================

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Collez ce script
-- 4. Exécutez-le
-- 5. Les warnings "Function Search Path Mutable" devraient disparaître
-- =====================================================
