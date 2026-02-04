-- ============================================
-- SUPABASE : Autoriser le rôle "intervenant"
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- La contrainte users_role_check n'accepte que 'member' et 'admin'.
-- On la remplace pour accepter aussi 'intervenant'.
-- ============================================

-- Supprimer l'ancienne contrainte
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_role_check;

-- Recréer la contrainte avec les 3 rôles
ALTER TABLE public.users
ADD CONSTRAINT users_role_check
CHECK (role IN ('member', 'admin', 'intervenant'));
