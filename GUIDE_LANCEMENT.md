# 🚀 Guide de Lancement - Platform Thumbnail Pro

## 📋 Prérequis

- ✅ Node.js installé (v18 ou supérieur)
- ✅ Compte Supabase créé
- ✅ Projet Supabase configuré

---

## 🎯 ÉTAPE 1 : Installation des dépendances (2 minutes)

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

**Vérification :** Assurez-vous que le dossier `node_modules` a été créé.

---

## 🔧 ÉTAPE 2 : Configuration Supabase (5 minutes)

### A. Créer le fichier `.env.local`

À la racine du projet, créez un fichier `.env.local` (ou modifiez-le s'il existe déjà) :

```env
# Supabase (obligatoire)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_publique

# Mode développement (false pour production)
NEXT_PUBLIC_DEV_MODE=false
```

**Où trouver ces valeurs :**
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
5. Copiez `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🗄️ ÉTAPE 3 : Configuration de la base de données Supabase (10 minutes)

### A. Créer les tables

Dans le **SQL Editor** de Supabase, exécutez ce SQL :

```sql
-- Table modules
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  order_index int not null default 0,
  duration_estimate text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table episodes
create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  duration text,
  order_index int not null default 0,
  video_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table progress
create table if not exists public.progress (
  user_id uuid not null references public.users(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  completed_at timestamptz default now(),
  created_at timestamptz default now(),
  primary key (user_id, episode_id)
);

-- Table resources
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  type text not null,
  url text not null,
  preview_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_important boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### B. Exécuter le setup complet

1. Ouvrez le fichier **`supabase-setup.sql`** dans ce projet
2. **Copiez TOUT le contenu**
3. **Collez-le** dans le SQL Editor de Supabase
4. **Cliquez sur "Run"**

**Ce que ça fait :**
- ✅ Active Row Level Security (RLS)
- ✅ Crée les politiques de sécurité
- ✅ Crée les indexes pour la performance
- ✅ Crée le trigger pour créer automatiquement les profils utilisateurs

---

## 🎬 ÉTAPE 4 : Créer du contenu de test (5 minutes)

### Option A : Script automatique (recommandé)

Dans le **SQL Editor** de Supabase, exécutez le contenu du fichier **`create-test-content.sql`** :

```sql
-- Ce script crée un module et ses épisodes en une seule fois
WITH new_module AS (
  INSERT INTO modules (title, description, order_index, duration_estimate)
  VALUES 
    ('Introduction au Graphisme', 'Découvrez les bases du graphisme et les outils essentiels', 1, '2h 30min')
  RETURNING id
)
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
```

### Option B : Création manuelle

1. Créer un module :
```sql
INSERT INTO modules (title, description, order_index, duration_estimate)
VALUES 
  ('Introduction au Graphisme', 'Découvrez les bases du graphisme', 1, '2h 30min');
```

2. Récupérer l'ID du module :
```sql
SELECT id, title FROM modules;
```

3. Créer des épisodes (remplacez `VOTRE_MODULE_ID` par l'ID copié) :
```sql
INSERT INTO episodes (module_id, title, duration, order_index, video_url)
VALUES 
  ('VOTRE_MODULE_ID', 'Bienvenue dans la formation', '5:00', 1, 'https://example.com/video1.mp4'),
  ('VOTRE_MODULE_ID', 'Les outils essentiels', '12:30', 2, 'https://example.com/video2.mp4');
```

---

## 🚀 ÉTAPE 5 : Lancer le serveur de développement (1 minute)

Dans le terminal, exécutez :

```bash
npm run dev
```

**Vérification :** Vous devriez voir :
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
```

---

## ✅ ÉTAPE 6 : Tester l'application (5 minutes)

### A. Créer un compte

1. Ouvrez votre navigateur sur **`http://localhost:3000`**
2. Vous serez redirigé vers `/login`
3. Cliquez sur **"S'inscrire"** ou allez sur `/register`
4. Remplissez le formulaire :
   - Nom complet
   - Email
   - Mot de passe (minimum 6 caractères)
5. Cliquez sur **"S'inscrire"**

**Note :** Si vous avez activé la confirmation email dans Supabase, vérifiez votre boîte mail.

### B. Se connecter

1. Sur la page de connexion, entrez vos identifiants
2. Cliquez sur **"Se connecter"**
3. Vous devriez être redirigé vers le **dashboard**

### C. Vérifier que tout fonctionne

**Checklist :**
- [ ] Le dashboard s'affiche avec vos statistiques
- [ ] Cliquez sur **"Formation"** dans le menu → vous voyez vos modules
- [ ] Cliquez sur un module → vous voyez les épisodes
- [ ] Cliquez sur **"Profil"** → votre profil s'affiche
- [ ] Cliquez sur **"Discord"** → le lien Discord s'affiche

---

## 🎯 Mode Développement vs Production

### Mode Développement (`NEXT_PUBLIC_DEV_MODE=true`)

- ✅ Accès sans authentification
- ✅ Pas besoin de Supabase pour tester l'UI
- ⚠️ Les modules ne se chargent pas depuis Supabase
- ⚠️ À utiliser uniquement pour le développement

### Mode Production (`NEXT_PUBLIC_DEV_MODE=false`)

- ✅ Authentification Supabase active
- ✅ Données réelles depuis la base de données
- ✅ Sécurité RLS activée
- ✅ À utiliser pour la production

**Pour changer de mode :**
1. Modifiez `.env.local`
2. Redémarrez le serveur (`Ctrl+C` puis `npm run dev`)

---

## 🔍 Vérification finale

### Checklist complète :

- [ ] Les dépendances sont installées (`npm install`)
- [ ] Le fichier `.env.local` est configuré avec vos clés Supabase
- [ ] Les tables sont créées dans Supabase
- [ ] Le script `supabase-setup.sql` a été exécuté
- [ ] Au moins un module de test a été créé
- [ ] Le serveur démarre sans erreur (`npm run dev`)
- [ ] Vous pouvez créer un compte
- [ ] Vous pouvez vous connecter
- [ ] Le dashboard s'affiche correctement
- [ ] Les modules s'affichent dans la page "Formation"

---

## 🚨 Problèmes courants et solutions

### ❌ "Missing Supabase URL" ou "Missing Supabase Key"
**Solution :** Vérifiez que `.env.local` contient bien `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ❌ "Row Level Security policy violation"
**Solution :** Exécutez le script `supabase-setup.sql` dans Supabase SQL Editor

### ❌ "User not found"
**Solution :** Le trigger devrait créer automatiquement le profil. Vérifiez dans Supabase > Table Editor > `users`

### ❌ Page blanche ou erreur
**Solution :** 
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs dans l'onglet "Console"
3. Vérifiez les logs du serveur dans le terminal

### ❌ "Aucun module disponible"
**Solution :** Créez au moins un module dans Supabase (voir ÉTAPE 4)

### ❌ Le serveur ne démarre pas
**Solution :**
1. Vérifiez que Node.js est installé : `node --version`
2. Supprimez `node_modules` et `.next` : `rm -rf node_modules .next` (Linux/Mac) ou `rmdir /s node_modules .next` (Windows)
3. Réinstallez : `npm install`
4. Relancez : `npm run dev`

---

## 📚 Ressources supplémentaires

- **`ETAPES_SUIVANTES.md`** : Guide détaillé étape par étape
- **`QUICK_START.md`** : Guide de démarrage rapide avec optimisations
- **`ARCHITECTURE.md`** : Recommandations techniques pour la scalabilité
- **`ROADMAP.md`** : Plan de développement sur 8-12 semaines

---

## 🎉 Félicitations !

Si toutes les étapes sont complétées et que vous pouvez vous connecter et voir vos modules, **votre plateforme est opérationnelle !**

**Prochaines étapes suggérées :**
1. Créer plus de modules et épisodes
2. Intégrer un service vidéo (Cloudflare Stream ou Vimeo)
3. Personnaliser le design selon vos besoins
4. Créer un compte admin (voir `ETAPES_SUIVANTES.md`)

---

**Temps total estimé : 25-30 minutes** ⚡
