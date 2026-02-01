-- ============================================
-- SUPPRIMER LE MODULE "Introduction au Graphisme"
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- Ce script supprime le module "Introduction au Graphisme" et tous ses épisodes
-- ============================================

-- Supprimer les épisodes du module "Introduction au Graphisme"
DELETE FROM public.episodes
WHERE module_id IN (
  SELECT id FROM public.modules WHERE title = 'Introduction au Graphisme'
);

-- Supprimer le module "Introduction au Graphisme"
DELETE FROM public.modules
WHERE title = 'Introduction au Graphisme';

-- Vérification : Afficher les modules restants
SELECT 
  m.title as module_title,
  m.order_index,
  COUNT(e.id) as nombre_episodes
FROM public.modules m
LEFT JOIN public.episodes e ON e.module_id = m.id
GROUP BY m.id, m.title, m.order_index
ORDER BY m.order_index;
