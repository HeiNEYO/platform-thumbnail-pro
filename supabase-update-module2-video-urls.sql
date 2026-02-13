-- Mise à jour des URLs vidéo pour les épisodes du module "2 • Les Bases"
-- À exécuter dans l'éditeur SQL de Supabase

-- Épisode 1 · Créer son plan de travail (1.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/bfe04180-16cd-46d4-8703-ef3cf924b714' WHERE title = '1 · Créer son plan de travail' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 2 · Comprendre l'espace & l'option des calques (2.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/53584691-bf69-447c-88e2-6d04685e84c4' WHERE title = '2 · Comprendre l''espace & l''option des calques' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 2.1 · Comprendre les filtres (2.1.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/5bd09b31-c850-42dd-95f3-c431d91f8744' WHERE title = '2.1 · Comprendre les filtres' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 3 · Toutes les propriétés Photoshop dont vous aurez besoin (3.mp4) — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '3 · Toutes les propriétés Photoshop dont vous aurez besoin' ...

-- Épisode 4 · Qu'est-ce qu'une bonne composition (4.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/7a6d97f5-244b-42ba-b2f5-03052c625255' WHERE title = '4 · Qu''est-ce qu''une bonne composition' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 5 · Savoir utiliser le Filtre Camera Raw (5.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/b2bde496-25d7-45e2-b8c7-eca7d51a7318' WHERE title = '5 · Savoir utiliser le Filtre Camera Raw' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 6 · Comment travailler avec du Raw (6.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/a3b5f6a6-e03f-4cfb-beec-6770f2beb86f' WHERE title = '6 · Comment travailler avec du Raw' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 7 · Comment utiliser le Dodge And Burn (7.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/005a3ab4-dc31-4d7d-9ed9-b2d45de35df1' WHERE title = '7 · Comment utiliser le Dodge And Burn' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 8 · Apprendre à utiliser la Correction Colorimétrique (8.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/ff6d9964-8ce7-42ff-8051-61cc7a533313' WHERE title = '8 · Apprendre à utiliser la Correction Colorimétrique' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 9 · Bien réussir ses Incrustations (9.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/6251b5dc-c0b3-41d1-9dfb-60ba8a90e731' WHERE title = '9 · Bien réussir ses Incrustations' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 10 · Maîtriser les lights (10.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/eab85da7-8923-4da6-854d-e6db4360d618' WHERE title = '10 · Maîtriser les lights' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 10.1 · Maîtriser les ombres (10.1.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/64d71b23-eee0-4255-9e31-8dde4cc91d3f' WHERE title = '10.1 · Maîtriser les ombres' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 10.2 · Analyse photos lights (10.2.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/1e4ab98d-955e-4646-bcf8-6ed6f9f303a0' WHERE title = '10.2 · Analyse photos lights' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 11 · Se servir de l'IA dans photoshop (11.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/b4e3fc86-fd48-4f22-80e3-dd63b49657de' WHERE title = '11 · Se servir de l''IA dans photoshop' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 12 · Maîtriser Le Texte dans ses miniatures (12.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/5c35d855-e068-4e41-a2c2-5656c66a8227' WHERE title = '12 · Maîtriser Le Texte dans ses miniatures' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 13 · Les Raccourcis Clavier (13.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/cfc691f5-36c4-45a4-aae3-1fce3c3b198c' WHERE title = '13 · Les Raccourcis Clavier' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 14 · Exporter ses créations en bonne qualité (14.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/91f3a9df-8b71-4295-95cb-3a59761b70de' WHERE title = '14 · Exporter ses créations en bonne qualité' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 15 · Utiliser KREA pour améliorer ses photos — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '15 · Utiliser KREA pour améliorer ses photos' ...

-- Épisode 16 · Effets Spéciaux : Glow, Néon, Ombres Réalistes — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '16 · Effets Spéciaux : Glow, Néon, Ombres Réalistes' ...

-- Épisode 17 · Utilisation des Modes de Fusion pour des effets puissants — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '17 · Utilisation des Modes de Fusion pour des effets puissants' ...

-- Épisode 18 · Créer des effets de fumée, de lumière et de particules — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '18 · Créer des effets de fumée, de lumière et de particules' ...

-- Épisode 19 · Augmenter la qualité de vos image (19.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/9e3f43a5-0bad-4f4e-8c6d-30d77476dd3f' WHERE title = '19 · Augmenter la qualité de vos image' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 19.2 · Utiliser KREA pour la qualité de vos image (19.2.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/a914b764-9747-4074-b494-02b39c08eb0d' WHERE title = '19.2 · Utiliser KREA pour la qualité de vos image' AND module_id IN (SELECT id FROM modules WHERE title = '2 • Les Bases');

-- Épisode 20 · Études de Cas Réels : +10 miniatures qui ont explosé — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '20 · Études de Cas Réels : +10 miniatures qui ont explosé' ...

-- Épisode 21 · Psychologie des Couleurs (comment influencer le regard) — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = '21 · Psychologie des Couleurs (comment influencer le regard)' ...
