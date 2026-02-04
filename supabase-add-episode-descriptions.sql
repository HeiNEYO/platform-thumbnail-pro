-- ============================================
-- AJOUT DES DESCRIPTIONS AUX ÉPISODES
-- ============================================
-- Ce script ajoute la colonne description à la table episodes
-- et remplit toutes les descriptions pour chaque épisode
-- ============================================

-- Ajouter la colonne description si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'episodes' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE public.episodes ADD COLUMN description TEXT;
  END IF;
END $$;

-- ============================================
-- MODULE 0 : Introduction Thumbnail Pro
-- ============================================
UPDATE public.episodes 
SET description = CASE title
  WHEN '1 · Introduction' THEN 'Découvrez la formation complète et apprenez comment créer des miniatures professionnelles qui génèrent des vues et de l''argent.'
  WHEN '2 · Rejoindre le discord' THEN 'Rejoignez la communauté Discord pour échanger avec d''autres créateurs et obtenir de l''aide sur vos projets.'
  WHEN '3 · Installer Photoshop' THEN 'Apprenez à installer et configurer Photoshop pour commencer à créer vos premières miniatures.'
END
WHERE module_id IN (SELECT id FROM public.modules WHERE title = 'Introduction Thumbnail Pro');

-- ============================================
-- MODULE 1 : Les Outils
-- ============================================
UPDATE public.episodes 
SET description = CASE title
  WHEN 'Outils Déplacements' THEN 'Maîtrisez l''outil de déplacement pour positionner précisément vos éléments et créer des compositions équilibrées.'
  WHEN 'Sélectionneur de forme' THEN 'Apprenez à utiliser le sélectionneur de forme pour créer des sélections géométriques parfaites dans vos miniatures.'
  WHEN 'Outils Lassos' THEN 'Découvrez les outils lasso pour faire des sélections libres et découper vos éléments avec précision.'
  WHEN 'Outils Baguette/Sélection' THEN 'Utilisez la baguette magique pour sélectionner rapidement des zones de même couleur et accélérer votre workflow.'
  WHEN 'Outils de Recadrage' THEN 'Maîtrisez le recadrage pour optimiser vos compositions et créer des miniatures aux bonnes proportions.'
  WHEN 'Pipette' THEN 'Apprenez à utiliser la pipette pour capturer et réutiliser les couleurs de vos images dans vos créations.'
  WHEN 'Outils Correcteur' THEN 'Découvrez les outils de correction pour retoucher vos images et éliminer les imperfections.'
  WHEN 'Outils Pinceau & Gomme' THEN 'Maîtrisez le pinceau et la gomme pour peindre, masquer et créer des effets personnalisés dans vos miniatures.'
  WHEN 'Outils Doigt' THEN 'Utilisez l''outil doigt pour mélanger les couleurs et créer des transitions douces dans vos compositions.'
  WHEN 'Outils Plumes' THEN 'Apprenez à créer des tracés vectoriels avec les outils plume pour des sélections ultra-précises.'
  WHEN 'Outils Textes' THEN 'Maîtrisez les outils de texte pour créer des titres impactants et lisibles dans vos miniatures YouTube.'
  WHEN 'Outils de formes' THEN 'Découvrez les outils de formes pour créer rapidement des éléments graphiques dans vos miniatures.'
END
WHERE module_id IN (SELECT id FROM public.modules WHERE title = '1 • Les Outils');

-- ============================================
-- MODULE 2 : Les Bases
-- ============================================
UPDATE public.episodes 
SET description = CASE title
  WHEN '1 · Créer son plan de travail' THEN 'Configurez votre espace de travail Photoshop pour optimiser votre productivité et créer efficacement.'
  WHEN '2 · Comprendre l''espace & l''option des calques' THEN 'Maîtrisez les calques, base fondamentale de Photoshop, pour organiser et modifier vos créations.'
  WHEN '2.1 · Comprendre les filtres' THEN 'Découvrez les filtres Photoshop pour transformer vos images et créer des effets visuels puissants.'
  WHEN '3 · Toutes les propriétés Photoshop dont vous aurez besoin' THEN 'Apprenez toutes les propriétés essentielles de Photoshop pour créer des miniatures professionnelles.'
  WHEN '4 · Qu''est-ce qu''une bonne composition' THEN 'Comprenez les règles de composition pour créer des miniatures qui attirent l''œil et génèrent des clics.'
  WHEN '5 · Savoir utiliser le Filtre Camera Raw' THEN 'Maîtrisez Camera Raw pour retoucher vos photos et améliorer leurs couleurs avant de créer vos miniatures.'
  WHEN '6 · Comment travailler avec du Raw' THEN 'Apprenez à travailler avec des fichiers RAW pour obtenir la meilleure qualité d''image possible.'
  WHEN '7 · Comment utiliser le Dodge And Burn' THEN 'Utilisez le Dodge and Burn pour éclaircir et assombrir vos images et créer de la profondeur.'
  WHEN '8 · Apprendre à utiliser la Correction Colorimétrique' THEN 'Maîtrisez la correction colorimétrique pour harmoniser les couleurs et créer une identité visuelle forte.'
  WHEN '9 · Bien réussir ses Incrustations' THEN 'Apprenez à incruster proprement des éléments dans vos images pour créer des compositions réalistes.'
  WHEN '10 · Maîtriser les lights' THEN 'Découvrez comment utiliser la lumière pour mettre en valeur vos sujets et créer de l''impact visuel.'
  WHEN '10.1 · Maîtriser les ombres' THEN 'Apprenez à créer des ombres réalistes pour donner de la profondeur et du réalisme à vos miniatures.'
  WHEN '10.2 · Analyse photos lights' THEN 'Analysez la lumière dans les photos existantes pour comprendre comment créer des effets similaires.'
  WHEN '11 · Se servir de l''IA dans photoshop' THEN 'Découvrez comment utiliser l''intelligence artificielle de Photoshop pour accélérer votre création.'
  WHEN '12 · Maîtriser Le Texte dans ses miniatures' THEN 'Apprenez à créer des textes lisibles et impactants qui attirent l''attention dans vos miniatures YouTube.'
  WHEN '13 · Les Raccourcis Clavier' THEN 'Mémorisez les raccourcis clavier essentiels pour travailler plus vite et être plus productif.'
  WHEN '14 · Exporter ses créations en bonne qualité' THEN 'Apprenez à exporter vos miniatures dans les bons formats et résolutions pour YouTube et autres plateformes.'
  WHEN '15 · Utiliser KREA pour améliorer ses photos' THEN 'Découvrez KREA, un outil d''IA pour améliorer et transformer vos images avant de créer vos miniatures.'
  WHEN '16 · Effets Spéciaux : Glow, Néon, Ombres Réalistes' THEN 'Créez des effets visuels spectaculaires avec des lueurs, néons et ombres pour rendre vos miniatures uniques.'
  WHEN '17 · Utilisation des Modes de Fusion pour des effets puissants' THEN 'Maîtrisez les modes de fusion pour créer des effets créatifs et professionnels dans vos compositions.'
  WHEN '18 · Créer des effets de fumée, de lumière et de particules' THEN 'Apprenez à créer des effets atmosphériques pour donner de l''ambiance et du dynamisme à vos miniatures.'
  WHEN '19 · Augmenter la qualité de vos image' THEN 'Découvrez les techniques pour améliorer la résolution et la netteté de vos images dans Photoshop.'
  WHEN '19.2 · Utiliser KREA pour la qualité de vos image' THEN 'Utilisez KREA pour upscaler vos images et obtenir une qualité professionnelle pour vos miniatures.'
  WHEN '20 · Études de Cas Réels : +10 miniatures qui ont explosé' THEN 'Analysez des miniatures qui ont généré des millions de vues pour comprendre les secrets du succès.'
  WHEN '21 · Psychologie des Couleurs (comment influencer le regard)' THEN 'Apprenez à utiliser la psychologie des couleurs pour influencer les émotions et augmenter les clics.'
END
WHERE module_id IN (SELECT id FROM public.modules WHERE title = '2 • Les Bases');

-- ============================================
-- MODULE 3 : La Pratique
-- ============================================
UPDATE public.episodes 
SET description = CASE title
  WHEN '1 · Explication du module' THEN 'Découvrez comment ce module pratique va vous permettre de maîtriser la création de miniatures par l''exercice.'
  WHEN '2 · Exercice 1' THEN 'Premier exercice pratique : créez votre première miniature en appliquant les techniques apprises.'
  WHEN '3 · Exercice 2' THEN 'Deuxième exercice : développez vos compétences avec un projet plus complexe.'
  WHEN '4 · Exercice 3' THEN 'Troisième exercice : créez une miniature avec des effets avancés et des incrustations.'
  WHEN '5 · Exercice 4' THEN 'Quatrième exercice : maîtrisez la composition et la mise en valeur de vos sujets.'
  WHEN '6 · Exercice 5' THEN 'Cinquième exercice complet : créez une miniature professionnelle de A à Z avec toutes les techniques.'
  WHEN '7 · Exercice 6' THEN 'Sixième exercice : développez votre style personnel et créez des miniatures uniques.'
  WHEN '8 · Exercice 7' THEN 'Septième exercice : créez des miniatures pour différents types de contenus et niches.'
  WHEN '9 · Exercice 8' THEN 'Huitième exercice : maîtrisez les effets spéciaux et les techniques avancées de Photoshop.'
  WHEN '10 · Exercice 9' THEN 'Neuvième exercice : créez des miniatures qui génèrent de l''engagement et des clics.'
  WHEN '11 · Exercice 10' THEN 'Dixième exercice complet : projet final pour consolider toutes vos compétences acquises.'
  WHEN '12 · Exercice 11' THEN 'Onzième exercice : créez des miniatures professionnelles qui se démarquent de la concurrence.'
  WHEN '12 · Création perso 1' THEN 'Première création personnelle : appliquez vos compétences sur un projet réel de votre choix.'
  WHEN '13 · Création perso 2' THEN 'Deuxième création personnelle : développez votre portfolio avec des miniatures variées.'
  WHEN '14 · Création perso 3' THEN 'Troisième création personnelle : créez des miniatures pour différents clients ou projets.'
  WHEN '15 · Création perso 4' THEN 'Quatrième création personnelle : maîtrisez la création de séries cohérentes de miniatures.'
  WHEN '16 · Challenges Créatifs : créer une miniature en 10 min / 30 min / 1h' THEN 'Relevez des défis créatifs pour apprendre à créer rapidement des miniatures efficaces sous contrainte de temps.'
  WHEN '17 · Thumbnails pour différents formats (Shorts, YouTube, Twitch, etc.)' THEN 'Apprenez à adapter vos miniatures pour chaque plateforme et format (Shorts, YouTube, Twitch) pour maximiser vos revenus.'
  WHEN '18 · Création d''une série de miniatures cohérentes pour une chaîne YouTube' THEN 'Créez une identité visuelle cohérente pour une chaîne YouTube complète et professionnelle.'
  WHEN '19 · Travailler avec des Stocks Images et les intégrer proprement' THEN 'Apprenez à utiliser des images stock et à les intégrer naturellement dans vos miniatures pour créer des compositions uniques.'
  WHEN '20 · Optimisation de la lisibilité pour les écrans mobiles' THEN 'Optimisez vos miniatures pour qu''elles soient parfaitement lisibles sur mobile et génèrent plus de clics.'
END
WHERE module_id IN (SELECT id FROM public.modules WHERE title = '3 • La Pratique');

-- ============================================
-- MODULE 4 : Business
-- ============================================
UPDATE public.episodes 
SET description = CASE title
  WHEN 'Vaincre le syndrome de la page blanche' THEN 'Découvrez des techniques pour surmonter le blocage créatif et générer des idées de miniatures en continu.'
  WHEN 'Mentalité à avoir' THEN 'Adoptez la bonne mentalité d''entrepreneur pour réussir dans la création de miniatures et générer de l''argent.'
  WHEN 'Définir Ses Tarifications' THEN 'Apprenez à fixer vos prix pour vendre vos miniatures et services de création à leur juste valeur.'
  WHEN 'Gérer sa comptabilité' THEN 'Maîtrisez les bases de la comptabilité pour gérer votre activité de créateur de miniatures en toute légalité.'
  WHEN 'Trouver ses premiers clients' THEN 'Découvrez des stratégies efficaces pour trouver vos premiers clients et commencer à générer des revenus.'
  WHEN 'Prospection' THEN 'Apprenez les techniques de prospection pour contacter des clients potentiels et décrocher des commandes.'
  WHEN 'LegalPlace x Thumbnail Pro : Tuto création entreprise' THEN 'Découvrez comment créer votre entreprise facilement avec LegalPlace pour monétiser votre activité de créateur.'
  WHEN 'Comment se déclarer' THEN 'Apprenez les démarches administratives pour déclarer votre activité et travailler en toute légalité.'
  WHEN 'Créer son portfolio' THEN 'Créez un portfolio professionnel pour présenter vos créations et attirer de nouveaux clients.'
  WHEN 'Marketing Réseaux' THEN 'Utilisez les réseaux sociaux pour promouvoir vos services et trouver des clients qui paient bien.'
  WHEN 'Comment s''organiser' THEN 'Apprenez à organiser votre temps et vos projets pour être productif et gérer plusieurs clients.'
  WHEN 'Productivité' THEN 'Découvrez des outils et méthodes pour augmenter votre productivité et créer plus de miniatures en moins de temps.'
  WHEN 'Tes Droits' THEN 'Comprenez vos droits en tant que créateur freelance pour protéger votre travail et négocier de meilleurs contrats.'
END
WHERE module_id IN (SELECT id FROM public.modules WHERE title = '4 • Business');

-- ============================================
-- MODULE 5 : Bonus
-- ============================================
UPDATE public.episodes 
SET description = CASE title
  WHEN 'Templates (Fichiers PSD & Resources prêts à l''emploi)' THEN 'Accédez à des templates PSD et ressources prêtes à l''emploi pour créer rapidement des miniatures professionnelles.'
  WHEN 'Améliorer sa prestation de services' THEN 'Apprenez à améliorer votre offre de services pour proposer plus de valeur et augmenter vos tarifs.'
  WHEN 'Podcast avec WYZENIX (privé)' THEN 'Écoutez un podcast exclusif avec WYZENIX pour découvrir les secrets de réussite dans la création de miniatures.'
  WHEN 'Podcast avec Mattéo (privé)' THEN 'Découvrez les conseils de Mattéo dans ce podcast privé pour développer votre activité et générer plus d''argent.'
END
WHERE module_id IN (SELECT id FROM public.modules WHERE title = '5 • Bonus');

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT 
  m.title as module_title,
  e.title as episode_title,
  e.description
FROM public.modules m
JOIN public.episodes e ON e.module_id = m.id
WHERE e.description IS NOT NULL
ORDER BY m.order_index, e.order_index;
