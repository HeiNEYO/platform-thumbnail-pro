-- Mise à jour des URLs vidéo pour les épisodes du module "3 • La Pratique"
-- À exécuter dans l'éditeur SQL de Supabase

-- Épisode 1 · Explication du module (1.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/19e99a52-551d-4c00-8d3e-f05fdc07f515' WHERE title = '1 · Explication du module' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 2 · Exercice 1 (2.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/ca46d5fa-bd94-4070-a01a-a95724f81dcb' WHERE title = '2 · Exercice 1' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 3 · Exercice 2 (3.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/2eb27419-5c0b-46bf-bc29-e02aa0e863e1' WHERE title = '3 · Exercice 2' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 4 · Exercice 3 (4.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/0d9a743e-de28-41c4-bec2-d5e6c74e38b6' WHERE title = '4 · Exercice 3' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 5 · Exercice 4 (5.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/c1dab33b-7cdc-4f03-866e-4551b9ea4510' WHERE title = '5 · Exercice 4' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 6 · Exercice 5 (6 exo 5.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/3ed3779e-b6b2-407c-8515-ed48388fa360' WHERE title = '6 · Exercice 5' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 7 · Exercice 6 (7 exo 6.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/7e644937-cf0c-4e78-8694-536239df2acd' WHERE title = '7 · Exercice 6' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 8 · Exercice 7 (8 exo 7.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/a6e7143c-587c-4ab4-a89b-d04d57ac19ac' WHERE title = '8 · Exercice 7' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 9 · Exercice 8 (9 exo 8.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/9adcdeb0-553a-4a1e-a6f2-2c21e5100ec8' WHERE title = '9 · Exercice 8' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 10 · Exercice 9 (10 exo 9.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/cadef917-9b3f-42d1-b3e7-6dcc8d5d97f9' WHERE title = '10 · Exercice 9' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 11 · Exercice 10 (11 exo 10.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/9ed66bae-52c9-463f-a8bd-2d071e5c45a6' WHERE title = '11 · Exercice 10' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 12 · Exercice 11 (12 exo 11.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/ebbcde6e-d16a-456b-9fd6-22c73bfd1ab3' WHERE title = '12 · Exercice 11' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 12 · Création perso 1 (13 crea perso 1.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/56c977bf-553c-4e6a-bb12-2c6d4d623075' WHERE title = '12 · Création perso 1' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 13 · Création perso 2 (14 crea perso 2.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/3e1d179f-533f-46e7-b877-8d201ab5ba34' WHERE title = '13 · Création perso 2' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 14 · Création perso 3 (15 crea perso 3.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/147c524e-1ff5-45c6-9bfb-a370da28a0ed' WHERE title = '14 · Création perso 3' AND module_id IN (SELECT id FROM modules WHERE title = '3 • La Pratique');

-- Épisode 15 · Création perso 4 — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '15 · Création perso 4' ...

-- Épisode 16 · Challenges Créatifs — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '16 · Challenges Créatifs : créer une miniature en 10 min / 30 min / 1h' ...

-- Épisode 17 · Thumbnails pour différents formats — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '17 · Thumbnails pour différents formats (Shorts, YouTube, Twitch, etc.)' ...

-- Épisode 18 · Création d'une série de miniatures — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '18 · Création d''une série de miniatures cohérentes pour une chaîne YouTube' ...

-- Épisode 19 · Travailler avec des Stocks Images — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '19 · Travailler avec des Stocks Images et les intégrer proprement' ...

-- Épisode 20 · Optimisation de la lisibilité — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '20 · Optimisation de la lisibilité pour les écrans mobiles' ...
