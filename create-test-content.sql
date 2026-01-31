-- ============================================
-- CRÉER DU CONTENU DE TEST AUTOMATIQUEMENT
-- ============================================
-- Ce script crée un module et ses épisodes en une seule fois
-- Exécutez-le dans Supabase SQL Editor

-- Étape 1 : Créer le module et récupérer son ID
WITH new_module AS (
  INSERT INTO modules (title, description, order_index, duration_estimate)
  VALUES 
    ('Introduction au Graphisme', 'Découvrez les bases du graphisme et les outils essentiels', 1, '2h 30min')
  RETURNING id
)
-- Étape 2 : Créer les épisodes avec l'ID du module créé
INSERT INTO episodes (module_id, title, duration, order_index, video_url)
SELECT 
  new_module.id,
  episode_data.title,
  episode_data.duration,
  episode_data.order_index,
  episode_data.video_url
FROM new_module
CROSS JOIN (VALUES
  ('Bienvenue dans la formation', '5:00', 1, 'https://example.com/video1.mp4'),
  ('Les outils essentiels', '12:30', 2, 'https://example.com/video2.mp4'),
  ('Premier projet pratique', '18:45', 3, 'https://example.com/video3.mp4')
) AS episode_data(title, duration, order_index, video_url);

-- Vérification : Afficher ce qui a été créé
SELECT 
  m.id as module_id,
  m.title as module_title,
  COUNT(e.id) as nombre_episodes
FROM modules m
LEFT JOIN episodes e ON e.module_id = m.id
WHERE m.title = 'Introduction au Graphisme'
GROUP BY m.id, m.title;
