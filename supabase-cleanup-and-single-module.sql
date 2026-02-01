-- ============================================
-- NETTOYAGE ET CRÉATION D'UN SEUL MODULE POUR TOUTE LA FORMATION
-- ============================================
-- À exécuter dans Supabase : SQL Editor → New query → Coller → Run
--
-- Ce script :
-- 1. Supprime tous les modules et épisodes existants (doublons)
-- 2. Supprime "Introduction au Graphisme" si présent
-- 3. Crée un seul module "Formation Minia Making" avec tous les épisodes
-- ============================================

-- ============================================
-- 1. CRÉER LES TABLES SI ELLES N'EXISTENT PAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  order_index int NOT NULL DEFAULT 0,
  duration_estimate text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- ============================================
-- 2. SUPPRIMER TOUS LES MODULES ET ÉPISODES EXISTANTS
-- ============================================
DELETE FROM public.episodes;
DELETE FROM public.modules;

-- ============================================
-- 2. CRÉER UN SEUL MODULE POUR TOUTE LA FORMATION
-- ============================================
INSERT INTO public.modules (id, title, description, order_index, duration_estimate, image_url)
VALUES (
  gen_random_uuid(),
  'Formation Minia Making',
  'Formation complète sur la création de miniatures YouTube avec Photoshop',
  1,
  NULL,
  '/images/formations/thumbnail-pro-formation.jpg'
) ON CONFLICT DO NOTHING;

-- ============================================
-- 3. AJOUTER TOUS LES ÉPISODES DANS CE MODULE UNIQUE
-- ============================================
DO $$
DECLARE
  module_id uuid;
  episode_order int := 1;
BEGIN
  -- Récupérer l'ID du module créé
  SELECT id INTO module_id FROM public.modules WHERE title = 'Formation Minia Making' LIMIT 1;
  
  -- Tous les épisodes de la formation dans l'ordre
  INSERT INTO public.episodes (module_id, title, duration, order_index, video_url) VALUES
    -- Introduction
    (module_id, '1. Introduction', NULL, episode_order, NULL),
    (module_id, '2. Rejoindre le discord', NULL, episode_order + 1, NULL),
    (module_id, '3. Installer Photoshop', NULL, episode_order + 2, NULL),
    
    -- Les Outils
    (module_id, '4. Outils Déplacements', NULL, episode_order + 3, NULL),
    (module_id, '5. Sélectionneur de forme', NULL, episode_order + 4, NULL),
    (module_id, '6. Outils Lassos', NULL, episode_order + 5, NULL),
    (module_id, '7. Outils Baguette/Sélection', NULL, episode_order + 6, NULL),
    (module_id, '8. Outils de Recadrage', NULL, episode_order + 7, NULL),
    (module_id, '9. Pipette', NULL, episode_order + 8, NULL),
    (module_id, '10. Outils Correcteur', NULL, episode_order + 9, NULL),
    (module_id, '11. Outils Pinceau & Gomme', NULL, episode_order + 10, NULL),
    (module_id, '12. Outils Doigt', NULL, episode_order + 11, NULL),
    (module_id, '13. Outils Plumes', NULL, episode_order + 12, NULL),
    (module_id, '14. Outils Textes', NULL, episode_order + 13, NULL),
    (module_id, '15. Outils de formes', NULL, episode_order + 14, NULL),
    
    -- Les Bases
    (module_id, '16. Créer son plan de travail', NULL, episode_order + 15, NULL),
    (module_id, '17. Comprendre l''espace & l''option des calques', NULL, episode_order + 16, NULL),
    (module_id, '18. Comprendre les filtres', NULL, episode_order + 17, NULL),
    (module_id, '19. Toutes les propriétés Photoshop dont vous aurez besoin', NULL, episode_order + 18, NULL),
    (module_id, '20. Qu''est-ce qu''une bonne composition', NULL, episode_order + 19, NULL),
    (module_id, '21. Savoir utiliser le Filtre Camera Raw', NULL, episode_order + 20, NULL),
    (module_id, '22. Comment travailler avec du Raw', NULL, episode_order + 21, NULL),
    (module_id, '23. Comment utiliser le Dodge And Burn', NULL, episode_order + 22, NULL),
    (module_id, '24. Apprendre à utiliser la Correction Colorimétrique', NULL, episode_order + 23, NULL),
    (module_id, '25. Bien réussir ses Incrustations', NULL, episode_order + 24, NULL),
    (module_id, '26. Maîtriser les lights', NULL, episode_order + 25, NULL),
    (module_id, '27. Maîtriser les ombres', NULL, episode_order + 26, NULL),
    (module_id, '28. Analyse photos lights', NULL, episode_order + 27, NULL),
    (module_id, '29. Se servir de l''IA dans photoshop', NULL, episode_order + 28, NULL),
    (module_id, '30. Maîtriser Le Texte dans ses miniatures', NULL, episode_order + 29, NULL),
    (module_id, '31. Les Raccourcis Clavier', NULL, episode_order + 30, NULL),
    (module_id, '32. Exporter ses créations en bonne qualité', NULL, episode_order + 31, NULL),
    (module_id, '33. Utiliser KREA pour améliorer ses photos', NULL, episode_order + 32, NULL),
    (module_id, '34. Effets Spéciaux : Glow, Néon, Ombres Réalistes', NULL, episode_order + 33, NULL),
    (module_id, '35. Utilisation des Modes de Fusion pour des effets puissants', NULL, episode_order + 34, NULL),
    (module_id, '36. Créer des effets de fumée, de lumière et de particules', NULL, episode_order + 35, NULL),
    (module_id, '37. Augmenter la qualité de vos image', NULL, episode_order + 36, NULL),
    (module_id, '38. Utiliser KREA pour la qualité de vos image', NULL, episode_order + 37, NULL),
    (module_id, '39. Études de Cas Réels : +10 miniatures qui ont explosé', NULL, episode_order + 38, NULL),
    (module_id, '40. Psychologie des Couleurs (comment influencer le regard)', NULL, episode_order + 39, NULL),
    
    -- La Pratique
    (module_id, '41. Explication du module', NULL, episode_order + 40, NULL),
    (module_id, '42. Exercice 1', NULL, episode_order + 41, NULL),
    (module_id, '43. Exercice 2', NULL, episode_order + 42, NULL),
    (module_id, '44. Exercice 3', NULL, episode_order + 43, NULL),
    (module_id, '45. Exercice 4', NULL, episode_order + 44, NULL),
    (module_id, '46. Exercice 5', '49:15', episode_order + 45, NULL),
    (module_id, '47. Exercice 6', '35:41', episode_order + 46, NULL),
    (module_id, '48. Exercice 7', '45:37', episode_order + 47, NULL),
    (module_id, '49. Exercice 8', '33:27', episode_order + 48, NULL),
    (module_id, '50. Exercice 9', '31:39', episode_order + 49, NULL),
    (module_id, '51. Exercice 10', '2:01:45', episode_order + 50, NULL),
    (module_id, '52. Exercice 11', '51:45', episode_order + 51, NULL),
    (module_id, '53. Création perso 1', NULL, episode_order + 52, NULL),
    (module_id, '54. Création perso 2', NULL, episode_order + 53, NULL),
    (module_id, '55. Création perso 3', NULL, episode_order + 54, NULL),
    (module_id, '56. Création perso 4', NULL, episode_order + 55, NULL),
    (module_id, '57. Challenges Créatifs : créer une miniature en 10 min / 30 min / 1h', NULL, episode_order + 56, NULL),
    (module_id, '58. Thumbnails pour différents formats (Shorts, YouTube, Twitch, etc.)', NULL, episode_order + 57, NULL),
    (module_id, '59. Création d''une série de miniatures cohérentes pour une chaîne YouTube', NULL, episode_order + 58, NULL),
    (module_id, '60. Travailler avec des Stocks Images et les intégrer proprement', NULL, episode_order + 59, NULL),
    (module_id, '61. Optimisation de la lisibilité pour les écrans mobiles', NULL, episode_order + 60, NULL),
    
    -- Business
    (module_id, '62. Vaincre le syndrome de la page blanche', NULL, episode_order + 61, NULL),
    (module_id, '63. Mentalité à avoir', NULL, episode_order + 62, NULL),
    (module_id, '64. Définir Ses Tarifications', NULL, episode_order + 63, NULL),
    (module_id, '65. Gérer sa comptabilité', NULL, episode_order + 64, NULL),
    (module_id, '66. Trouver ses premiers clients', NULL, episode_order + 65, NULL),
    (module_id, '67. Prospection', NULL, episode_order + 66, NULL),
    (module_id, '68. LegalPlace x Thumbnail Pro : Tuto création entreprise', NULL, episode_order + 67, NULL),
    (module_id, '69. Comment se déclarer', NULL, episode_order + 68, NULL),
    (module_id, '70. Créer son portfolio', NULL, episode_order + 69, NULL),
    (module_id, '71. Marketing Réseaux', NULL, episode_order + 70, NULL),
    (module_id, '72. Comment s''organiser', NULL, episode_order + 71, NULL),
    (module_id, '73. Productivité', NULL, episode_order + 72, NULL),
    (module_id, '74. Tes Droits', NULL, episode_order + 73, NULL),
    
    -- Bonus
    (module_id, '75. Templates (Fichiers PSD & Resources prêts à l''emploi)', NULL, episode_order + 74, NULL),
    (module_id, '76. Améliorer sa prestation de services', NULL, episode_order + 75, NULL),
    (module_id, '77. Podcast avec WYZENIX (privé)', NULL, episode_order + 76, NULL),
    (module_id, '78. Podcast avec Mattéo (privé)', NULL, episode_order + 77, NULL),
    
    -- 30 Day Challenge
    (module_id, '79. Explication du module (à venir)', NULL, episode_order + 78, NULL),
    
    -- Tuto sur demande
    (module_id, '80. Comment avoir son TUTO personalisé ?', NULL, episode_order + 79, NULL)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- 4. VÉRIFICATION
-- ============================================
SELECT 
  m.title as module_title,
  m.order_index,
  COUNT(e.id) as nombre_episodes
FROM public.modules m
LEFT JOIN public.episodes e ON e.module_id = m.id
GROUP BY m.id, m.title, m.order_index
ORDER BY m.order_index;
