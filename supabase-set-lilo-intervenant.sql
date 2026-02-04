-- ============================================
-- SUPABASE : Définir Lilo comme intervenant
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- Met à jour le rôle de l'utilisateur Lilo à 'intervenant'.
-- ============================================

-- Option 1 : Par nom (full_name contient "Lilo")
UPDATE public.users
SET role = 'intervenant'
WHERE (full_name ILIKE '%Lilo%' OR email ILIKE '%lilo%')
  AND role IN ('member', 'admin');

-- Vérifier le résultat (optionnel)
-- SELECT id, email, full_name, role FROM public.users WHERE role = 'intervenant';
