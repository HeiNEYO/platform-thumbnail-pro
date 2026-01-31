-- ============================================
-- CRÉER DU CONTENU - ÉTAPE PAR ÉTAPE
-- ============================================
-- Si le script automatique ne fonctionne pas, utilisez celui-ci

-- ÉTAPE 1 : Créer le module
INSERT INTO modules (title, description, order_index, duration_estimate)
VALUES 
  ('Introduction au Graphisme', 'Découvrez les bases du graphisme et les outils essentiels', 1, '2h 30min');

-- ÉTAPE 2 : Récupérer l'ID du module créé
-- Exécutez cette requête et COPIEZ l'ID qui s'affiche (c'est un UUID)
SELECT id, title FROM modules WHERE title = 'Introduction au Graphisme';

-- ÉTAPE 3 : Créer les épisodes
-- REMPLACEZ 'COLLEZ_L_ID_ICI' par l'ID que vous avez copié à l'étape 2
-- Exemple : si l'ID est 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
-- Remplacez 'COLLEZ_L_ID_ICI' par 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

INSERT INTO episodes (module_id, title, duration, order_index, video_url)
VALUES 
  ('COLLEZ_L_ID_ICI', 'Bienvenue dans la formation', '5:00', 1, 'https://example.com/video1.mp4'),
  ('COLLEZ_L_ID_ICI', 'Les outils essentiels', '12:30', 2, 'https://example.com/video2.mp4'),
  ('COLLEZ_L_ID_ICI', 'Premier projet pratique', '18:45', 3, 'https://example.com/video3.mp4');

-- ÉTAPE 4 : Vérifier que tout est créé
SELECT 
  m.title as module,
  e.title as episode,
  e.order_index,
  e.duration
FROM modules m
JOIN episodes e ON e.module_id = m.id
ORDER BY m.order_index, e.order_index;
