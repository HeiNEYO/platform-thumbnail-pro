-- Mise à jour des URLs vidéo pour les épisodes du module "4 • Business"
-- À exécuter dans l'éditeur SQL de Supabase

-- Épisode 1 · Vaincre le syndrome de la page blanche (1.Vaincre le syndrome de la page BLANCHE.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/0341a7c2-733a-481e-921c-5297d1d35a39' WHERE title = 'Vaincre le syndrome de la page blanche' AND module_id IN (SELECT id FROM modules WHERE title = '4 • Business');

-- Épisode 2 · Mentalité à avoir — MANQUANT dans la liste fournie
-- UPDATE episodes SET video_url = '...' WHERE title = 'Mentalité à avoir' ...

-- Épisode 3 · Définir Ses Tarifications (2.Définir ses tarifications.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/cefd122d-8d6c-4d41-973e-a982c8fd2ec2' WHERE title = 'Définir Ses Tarifications' AND module_id IN (SELECT id FROM modules WHERE title = '4 • Business');

-- Épisode 4 · Gérer sa comptabilité (3.Gérer sa comptabilité.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/59d1c71c-fa9c-4d8e-a594-3896ca63c628' WHERE title = 'Gérer sa comptabilité' AND module_id IN (SELECT id FROM modules WHERE title = '4 • Business');

-- Épisode 5 · Trouver ses premiers clients (trouver ses premier client.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/0dda4afb-71a7-4ed4-b449-9037f6ab1f5a' WHERE title = 'Trouver ses premiers clients' AND module_id IN (SELECT id FROM modules WHERE title = '4 • Business');

-- Épisode 6 · Prospection (5. Prspection.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/beda5f61-ea85-48bb-8671-09e1688c6a88' WHERE title = 'Prospection' AND module_id IN (SELECT id FROM modules WHERE title = '4 • Business');

-- Épisode 7 · LegalPlace x Thumbnail Pro : Tuto création entreprise (6. Guillame de legalplace x thumbnail pro.mp4)
UPDATE episodes SET video_url = 'https://player.mediadelivery.net/embed/597170/4c7bfdb4-ed00-4015-8b28-15301651e4a1' WHERE title = 'LegalPlace x Thumbnail Pro : Tuto création entreprise' AND module_id IN (SELECT id FROM modules WHERE title = '4 • Business');

-- Épisodes 8 à 13 — MANQUANTS dans la liste fournie
-- Comment se déclarer, Créer son portfolio, Marketing Réseaux, Comment s'organiser, Productivité, Tes Droits
