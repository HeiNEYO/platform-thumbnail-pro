-- ============================================
-- CRÉER LES ÉPISODES AVEC VOTRE ID DE MODULE
-- ============================================
-- Module ID : 08b5a0ca-55f2-4996-9607-a4a9f73216e5

INSERT INTO episodes (module_id, title, duration, order_index, video_url)
VALUES 
  ('08b5a0ca-55f2-4996-9607-a4a9f73216e5', 'Bienvenue dans la formation', '5:00', 1, 'https://example.com/video1.mp4'),
  ('08b5a0ca-55f2-4996-9607-a4a9f73216e5', 'Les outils essentiels', '12:30', 2, 'https://example.com/video2.mp4'),
  ('08b5a0ca-55f2-4996-9607-a4a9f73216e5', 'Premier projet pratique', '18:45', 3, 'https://example.com/video3.mp4');

-- Vérification : Afficher ce qui a été créé
SELECT 
  m.title as module,
  e.title as episode,
  e.order_index,
  e.duration,
  e.video_url
FROM modules m
JOIN episodes e ON e.module_id = m.id
WHERE m.id = '08b5a0ca-55f2-4996-9607-a4a9f73216e5'
ORDER BY e.order_index;
