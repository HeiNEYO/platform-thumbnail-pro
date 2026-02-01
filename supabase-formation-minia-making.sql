-- ============================================
-- FORMATION MINIA MAKING - Modules et Épisodes
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- Ce script crée tous les modules et épisodes de la formation "Minia Making"
-- basés sur les screenshots fournis.
-- ============================================

-- Supprimer les anciens modules et épisodes (optionnel, décommentez si nécessaire)
-- DELETE FROM public.episodes;
-- DELETE FROM public.modules;

-- ============================================
-- MODULE 1 : Les Outils
-- ============================================
INSERT INTO public.modules (id, title, description, order_index, duration_estimate)
VALUES (
  gen_random_uuid(),
  '1 • Les Outils',
  'Découverte et maîtrise de tous les outils Photoshop essentiels',
  1,
  NULL
) ON CONFLICT DO NOTHING;

-- Épisodes du Module 1
DO $$
DECLARE
  module_1_id uuid;
BEGIN
  SELECT id INTO module_1_id FROM public.modules WHERE title = '1 • Les Outils' LIMIT 1;
  
  INSERT INTO public.episodes (module_id, title, duration, order_index, video_url) VALUES
    (module_1_id, '1. Outils Déplacements', NULL, 1, NULL),
    (module_1_id, '2. Sélectionneur de forme', NULL, 2, NULL),
    (module_1_id, '3. Outils Lassos', NULL, 3, NULL),
    (module_1_id, '4. Outils Baguette/Sélection', NULL, 4, NULL),
    (module_1_id, '5. Outils de Recadrage', NULL, 5, NULL),
    (module_1_id, '6. Pipette', NULL, 6, NULL),
    (module_1_id, '7. Outils Correcteur', NULL, 7, NULL),
    (module_1_id, '8. Outils Pinceau & Gomme', NULL, 8, NULL),
    (module_1_id, '9. Outils Doigt', NULL, 9, NULL),
    (module_1_id, '10. Outils Plumes', NULL, 10, NULL),
    (module_1_id, '11. Outils Textes', NULL, 11, NULL),
    (module_1_id, '12. Outils de formes', NULL, 12, NULL)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- MODULE 2 : Les Bases
-- ============================================
INSERT INTO public.modules (id, title, description, order_index, duration_estimate)
VALUES (
  gen_random_uuid(),
  '2 • Les Bases',
  'Fondamentaux de Photoshop et de la création de miniatures',
  2,
  NULL
) ON CONFLICT DO NOTHING;

-- Épisodes du Module 2
DO $$
DECLARE
  module_2_id uuid;
BEGIN
  SELECT id INTO module_2_id FROM public.modules WHERE title = '2 • Les Bases' LIMIT 1;
  
  INSERT INTO public.episodes (module_id, title, duration, order_index, video_url) VALUES
    (module_2_id, '1. Créer son plan de travail', NULL, 1, NULL),
    (module_2_id, '2. Comprendre l''espace & l''option des calques', NULL, 2, NULL),
    (module_2_id, '2.1. Comprendre les filtres', NULL, 3, NULL),
    (module_2_id, '3. Toutes les propriétés Photoshop dont vous aurez besoin', NULL, 4, NULL),
    (module_2_id, '4. Qu''est-ce qu''une bonne composition', NULL, 5, NULL),
    (module_2_id, '5. Savoir utiliser le Filtre Camera Raw', NULL, 6, NULL),
    (module_2_id, '6. Comment travailler avec du Raw', NULL, 7, NULL),
    (module_2_id, '7. Comment utiliser le Dodge And Burn', NULL, 8, NULL),
    (module_2_id, '8. Apprendre à utiliser la Correction Colorimétrique', NULL, 9, NULL),
    (module_2_id, '9. Bien réussir ses Incrustations', NULL, 10, NULL),
    (module_2_id, '10. Maîtriser les lights', NULL, 11, NULL),
    (module_2_id, '10.1. Maîtriser les ombres', NULL, 12, NULL),
    (module_2_id, '10.2. Analyse photos lights', NULL, 13, NULL),
    (module_2_id, '11. Se servir de l''IA dans photoshop', NULL, 14, NULL),
    (module_2_id, '12. Maîtriser Le Texte dans ses miniatures', NULL, 15, NULL),
    (module_2_id, '13. Les Raccourcis Clavier', NULL, 16, NULL),
    (module_2_id, '14. Exporter ses créations en bonne qualité', NULL, 17, NULL),
    (module_2_id, '15. Utiliser KREA pour améliorer ses photos', NULL, 18, NULL),
    (module_2_id, '16. Effets Spéciaux : Glow, Néon, Ombres Réalistes', NULL, 19, NULL),
    (module_2_id, '17. Utilisation des Modes de Fusion pour des effets puissants', NULL, 20, NULL),
    (module_2_id, '18. Créer des effets de fumée, de lumière et de particules', NULL, 21, NULL),
    (module_2_id, '19. Augmenter la qualité de vos image', NULL, 22, NULL),
    (module_2_id, '19.2. Utiliser KREA pour la qualité de vos image', NULL, 23, NULL),
    (module_2_id, '20. Études de Cas Réels : +10 miniatures qui ont explosé', NULL, 24, NULL),
    (module_2_id, '21. Psychologie des Couleurs (comment influencer le regard)', NULL, 25, NULL)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- MODULE 3 : La Pratique
-- ============================================
INSERT INTO public.modules (id, title, description, order_index, duration_estimate)
VALUES (
  gen_random_uuid(),
  '✓ 3 • La Pratique',
  'Exercices pratiques pour maîtriser la création de miniatures',
  3,
  NULL
) ON CONFLICT DO NOTHING;

-- Épisodes du Module 3
DO $$
DECLARE
  module_3_id uuid;
BEGIN
  SELECT id INTO module_3_id FROM public.modules WHERE title = '✓ 3 • La Pratique' LIMIT 1;
  
  INSERT INTO public.episodes (module_id, title, duration, order_index, video_url) VALUES
    (module_3_id, '1. Explication du module', NULL, 1, NULL),
    (module_3_id, '2. Exercice 1', NULL, 2, NULL),
    (module_3_id, '3. Exercice 2', NULL, 3, NULL),
    (module_3_id, '4. Exercice 3', NULL, 4, NULL),
    (module_3_id, '5. Exercice 4', NULL, 5, NULL),
    (module_3_id, '6. Exercice 5', '49:15', 6, NULL),
    (module_3_id, '7. Exercice 6', '35:41', 7, NULL),
    (module_3_id, '8. Exercice 7', '45:37', 8, NULL),
    (module_3_id, '9. Exercice 8', '33:27', 9, NULL),
    (module_3_id, '10. Exercice 9', '31:39', 10, NULL),
    (module_3_id, '11. Exercice 10', '2:01:45', 11, NULL),
    (module_3_id, '12. Exercice 11', '51:45', 12, NULL),
    (module_3_id, '12. Création perso 1', NULL, 13, NULL),
    (module_3_id, '13. Création perso 2', NULL, 14, NULL),
    (module_3_id, '14. Création perso 3', NULL, 15, NULL),
    (module_3_id, '15. Création perso 4', NULL, 16, NULL),
    (module_3_id, '16. Challenges Créatifs : créer une miniature en 10 min / 30 min / 1h', NULL, 17, NULL),
    (module_3_id, '17. Thumbnails pour différents formats (Shorts, YouTube, Twitch, etc.)', NULL, 18, NULL),
    (module_3_id, '18. Création d''une série de miniatures cohérentes pour une chaîne YouTube', NULL, 19, NULL),
    (module_3_id, '19. Travailler avec des Stocks Images et les intégrer proprement', NULL, 20, NULL),
    (module_3_id, '20. Optimisation de la lisibilité pour les écrans mobiles', NULL, 21, NULL)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- MODULE 4 : Business
-- ============================================
INSERT INTO public.modules (id, title, description, order_index, duration_estimate)
VALUES (
  gen_random_uuid(),
  '4 • Business',
  'Apprendre à développer son activité de créateur de miniatures',
  4,
  NULL
) ON CONFLICT DO NOTHING;

-- Épisodes du Module 4
DO $$
DECLARE
  module_4_id uuid;
BEGIN
  SELECT id INTO module_4_id FROM public.modules WHERE title = '4 • Business' LIMIT 1;
  
  INSERT INTO public.episodes (module_id, title, duration, order_index, video_url) VALUES
    (module_4_id, 'Vaincre le syndrome de la page blanche', NULL, 1, NULL),
    (module_4_id, 'Mentalité à avoir', NULL, 2, NULL),
    (module_4_id, 'Définir Ses Tarifications', NULL, 3, NULL),
    (module_4_id, 'Gérer sa comptabilité', NULL, 4, NULL),
    (module_4_id, 'Trouver ses premiers clients', NULL, 5, NULL),
    (module_4_id, 'Prospection', NULL, 6, NULL),
    (module_4_id, 'LegalPlace x Thumbnail Pro : Tuto création entreprise', NULL, 7, NULL),
    (module_4_id, 'Comment se déclarer', NULL, 8, NULL),
    (module_4_id, 'Créer son portfolio', NULL, 9, NULL),
    (module_4_id, 'Marketing Réseaux', NULL, 10, NULL),
    (module_4_id, 'Comment s''organiser', NULL, 11, NULL),
    (module_4_id, 'Productivité', NULL, 12, NULL),
    (module_4_id, 'Tes Droits', NULL, 13, NULL)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- MODULE 5 : Bonus
-- ============================================
INSERT INTO public.modules (id, title, description, order_index, duration_estimate)
VALUES (
  gen_random_uuid(),
  '5 • Bonus',
  'Ressources bonus et templates pour aller plus loin',
  5,
  NULL
) ON CONFLICT DO NOTHING;

-- Épisodes du Module 5
DO $$
DECLARE
  module_5_id uuid;
BEGIN
  SELECT id INTO module_5_id FROM public.modules WHERE title = '5 • Bonus' LIMIT 1;
  
  INSERT INTO public.episodes (module_id, title, duration, order_index, video_url) VALUES
    (module_5_id, 'Templates (Fichiers PSD & Resources prêts à l''emploi)', NULL, 1, NULL),
    (module_5_id, 'Améliorer sa prestation de services', NULL, 2, NULL),
    (module_5_id, 'Podcast avec WYZENIX (privé)', NULL, 3, NULL),
    (module_5_id, 'Podcast avec Mattéo (privé)', NULL, 4, NULL)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- MODULE 6 : 30 Day Challenge
-- ============================================
INSERT INTO public.modules (id, title, description, order_index, duration_estimate)
VALUES (
  gen_random_uuid(),
  '6 • 30 Day Challenge',
  'Défi de 30 jours pour progresser rapidement',
  6,
  NULL
) ON CONFLICT DO NOTHING;

-- Épisodes du Module 6
DO $$
DECLARE
  module_6_id uuid;
BEGIN
  SELECT id INTO module_6_id FROM public.modules WHERE title = '6 • 30 Day Challenge' LIMIT 1;
  
  INSERT INTO public.episodes (module_id, title, duration, order_index, video_url) VALUES
    (module_6_id, '1. Explication du module (à venir)', NULL, 1, NULL)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- MODULE 7 : Tuto sur demande
-- ============================================
INSERT INTO public.modules (id, title, description, order_index, duration_estimate)
VALUES (
  gen_random_uuid(),
  '7 • Tuto sur demande',
  'Tutoriels personnalisés selon vos demandes',
  7,
  NULL
) ON CONFLICT DO NOTHING;

-- Épisodes du Module 7
DO $$
DECLARE
  module_7_id uuid;
BEGIN
  SELECT id INTO module_7_id FROM public.modules WHERE title = '7 • Tuto sur demande' LIMIT 1;
  
  INSERT INTO public.episodes (module_id, title, duration, order_index, video_url) VALUES
    (module_7_id, '? Comment avoir son TUTO personalisé ?', NULL, 1, NULL)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Vérifier que tous les modules et épisodes ont été créés
SELECT 
  m.title as module_title,
  m.order_index,
  COUNT(e.id) as nombre_episodes
FROM public.modules m
LEFT JOIN public.episodes e ON e.module_id = m.id
GROUP BY m.id, m.title, m.order_index
ORDER BY m.order_index;
