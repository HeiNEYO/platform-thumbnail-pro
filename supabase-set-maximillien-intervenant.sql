-- ============================================
-- SUPABASE : Définir Maximillien comme intervenant
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
-- ============================================

UPDATE public.users
SET role = 'intervenant'
WHERE (full_name ILIKE '%Maximillien%' OR full_name ILIKE '%Maximilien%' OR email ILIKE '%maximillien%' OR email ILIKE '%maximilien%')
  AND role IN ('member', 'admin');

-- Vérifier (optionnel)
-- SELECT id, email, full_name, role FROM public.users WHERE role = 'intervenant';
