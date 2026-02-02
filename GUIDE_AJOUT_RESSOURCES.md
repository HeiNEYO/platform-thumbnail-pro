# 📁 Guide d'Ajout de Ressources

Ce guide vous explique comment ajouter des ressources dans la plateforme Thumbnail Pro.

## 🗄️ Structure de la Table

La table `resources` contient les colonnes suivantes :

| Colonne | Type | Description | Obligatoire |
|---------|------|-------------|-------------|
| `id` | UUID | Identifiant unique (généré automatiquement) | Non |
| `category` | TEXT | Catégorie de la ressource | **Oui** |
| `title` | TEXT | Titre de la ressource | **Oui** |
| `type` | TEXT | Type de ressource | **Oui** |
| `url` | TEXT | URL de téléchargement ou lien externe | **Oui** |
| `preview_url` | TEXT | URL de l'image de prévisualisation | Non |
| `created_at` | TIMESTAMPTZ | Date de création (automatique) | Non |
| `updated_at` | TIMESTAMPTZ | Date de modification (automatique) | Non |

## 📂 Catégories Disponibles

Les ressources sont organisées par catégories. Voici les catégories recommandées :

- **templates** - Templates de thumbnails
- **images** - Images, icônes, packs d'images
- **palettes** - Palettes de couleurs
- **fonts** - Polices de caractères
- **outils** - Outils en ligne, générateurs
- **videos** - Vidéos, tutoriels
- **audio** - Musiques, sons
- **autres** - Autres types de ressources

## 🎯 Types de Ressources

Le champ `type` peut contenir :
- `template` - Fichier template
- `image` - Image ou pack d'images
- `palette` - Palette de couleurs
- `font` - Police de caractères
- `outil` - Outil en ligne
- `video` - Vidéo
- `audio` - Fichier audio
- `lien` - Lien externe
- `fichier` - Fichier à télécharger

## 📝 Comment Ajouter une Ressource

### Méthode 1 : Via l'Interface Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans **Table Editor** > **resources**
3. Cliquez sur **Insert** > **Insert row**
4. Remplissez les champs :
   - **category** : Choisissez une catégorie (ex: `templates`)
   - **title** : Nom de la ressource (ex: `Template Gaming Pro`)
   - **type** : Type de ressource (ex: `template`)
   - **url** : URL de téléchargement ou lien (ex: `https://example.com/template.zip`)
   - **preview_url** : URL de l'image de prévisualisation (optionnel)
5. Cliquez sur **Save**

### Méthode 2 : Via SQL

Exécutez cette requête dans le **SQL Editor** de Supabase :

```sql
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'templates',                    -- Catégorie
  'Template Thumbnail Gaming',    -- Titre
  'template',                     -- Type
  'https://example.com/template.zip',  -- URL de téléchargement
  'https://example.com/preview.png'    -- URL de prévisualisation (optionnel)
);
```

## 📋 Exemples d'Insertion

### Exemple 1 : Template de Thumbnail

```sql
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'templates',
  'Template Gaming Pro',
  'template',
  'https://drive.google.com/file/d/xxx/view',
  'https://example.com/preview-gaming.png'
);
```

### Exemple 2 : Palette de Couleurs

```sql
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'palettes',
  'Palette Gaming Vibrante',
  'palette',
  'https://coolors.co/palette/ff6b6b-4ecdc4-45b7d1-96ceb4-ffeaa7',
  'https://example.com/preview-palette.png'
);
```

### Exemple 3 : Pack d'Icônes

```sql
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'images',
  'Pack Icônes Gaming 100+',
  'image',
  'https://example.com/icons-pack.zip',
  'https://example.com/preview-icons.png'
);
```

### Exemple 4 : Police de Caractères

```sql
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'fonts',
  'Police Gaming Bold',
  'font',
  'https://example.com/font-gaming.ttf',
  'https://example.com/preview-font.png'
);
```

### Exemple 5 : Outil en Ligne

```sql
INSERT INTO public.resources (category, title, type, url, preview_url)
VALUES (
  'outils',
  'Générateur de Thumbnails AI',
  'outil',
  'https://example.com/thumbnail-generator',
  'https://example.com/preview-tool.png'
);
```

## 🔐 Permissions

- **Lecture** : Tous les utilisateurs authentifiés peuvent voir les ressources
- **Écriture** : Seuls les administrateurs peuvent ajouter/modifier/supprimer des ressources

## 💡 Conseils

1. **URLs de prévisualisation** : Ajoutez toujours une image de prévisualisation pour améliorer l'expérience utilisateur
2. **Titres descriptifs** : Utilisez des titres clairs et descriptifs
3. **Catégories cohérentes** : Respectez les catégories existantes pour une meilleure organisation
4. **URLs valides** : Vérifiez que les URLs fonctionnent avant de les ajouter

## 🚀 Après l'Ajout

Une fois les ressources ajoutées :
1. Elles apparaîtront automatiquement dans l'onglet **Ressources** du dashboard
2. Elles seront organisées par dossiers selon leur catégorie
3. Les utilisateurs pourront les consulter et les télécharger

## 📞 Support

Si vous avez des questions ou besoin d'aide, contactez le support.
