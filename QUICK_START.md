# 🚀 Guide de Démarrage Rapide

## 📋 Checklist Immédiate (À faire MAINTENANT)

### 1. Sécurité Supabase (URGENT)

```sql
-- Exécuter dans Supabase SQL Editor

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Politique : Users peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Politique : Users peuvent voir tous les modules (public)
CREATE POLICY "Users can view modules"
ON modules FOR SELECT
USING (true);

-- Politique : Users peuvent voir les épisodes des modules publics
CREATE POLICY "Users can view episodes"
ON episodes FOR SELECT
USING (true);

-- Politique : Users peuvent voir leur propre progression
CREATE POLICY "Users can view own progress"
ON progress FOR SELECT
USING (auth.uid() = user_id);

-- Politique : Users peuvent créer leur propre progression
CREATE POLICY "Users can create own progress"
ON progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique : Admins peuvent tout voir
CREATE POLICY "Admins can view all"
ON progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

### 2. Indexes de Performance (URGENT)

```sql
-- Créer les indexes pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_episodes_module_id ON episodes(module_id);
CREATE INDEX IF NOT EXISTS idx_episodes_order ON episodes(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user_episode ON progress(user_id, episode_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(order_index);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
```

### 3. Configuration Vidéo

#### Option A : Cloudflare Stream (Recommandé)

1. Créer un compte Cloudflare
2. Activer Stream
3. Ajouter dans `.env.local` :
```env
CLOUDFLARE_STREAM_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

#### Option B : Vimeo (Alternative)

1. Créer compte Vimeo Pro
2. Générer Access Token
3. Ajouter dans `.env.local` :
```env
VIMEO_ACCESS_TOKEN=your_token_here
```

### 4. Variables d'Environnement

Créer/Modifier `.env.local` :
```env
# Supabase (déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # Pour admin uniquement

# Mode dev (désactiver en production)
NEXT_PUBLIC_DEV_MODE=false

# Vidéo (choisir une option)
CLOUDFLARE_STREAM_TOKEN=...
# OU
VIMEO_ACCESS_TOKEN=...

# Analytics (optionnel)
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_SENTRY_DSN=...
```

---

## 🎯 Prochaines Étapes (Cette Semaine)

### Jour 1-2 : Authentification
- [ ] Remplacer mode dev par Supabase Auth
- [ ] Tester login/register/logout
- [ ] Vérifier RLS fonctionne

### Jour 3-4 : Modules & Épisodes
- [ ] Créer page liste des modules
- [ ] Créer page détail module
- [ ] Afficher épisodes avec progression

### Jour 5-7 : Vidéo
- [ ] Intégrer player vidéo
- [ ] Tester avec une vidéo de test
- [ ] Implémenter tracking de progression

---

## 📦 Packages à Installer

```bash
# Pour les vidéos (Cloudflare Stream)
npm install @cloudflare/stream-react

# OU pour Vimeo
npm install @vime/react @vime/core

# Pour le cache/state management
npm install swr
# OU
npm install @tanstack/react-query

# Pour les graphiques (statistiques)
npm install recharts

# Pour les notifications
npm install react-hot-toast

# Pour les formulaires
npm install react-hook-form zod @hookform/resolvers
```

---

## 🔧 Configuration Next.js

Modifier `next.config.ts` :

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudflare.com", // Pour Cloudflare Stream
      },
      {
        protocol: "https",
        hostname: "*.vimeocdn.com", // Pour Vimeo
      },
    ],
  },
  // ISR pour cache
  experimental: {
    isrMemoryCacheSize: 0, // Désactiver cache mémoire pour éviter les problèmes
  },
};

export default nextConfig;
```

---

## 🎨 Structure de Fichiers Recommandée

```
src/
├── app/
│   ├── dashboard/
│   │   ├── modules/
│   │   │   ├── page.tsx          # Liste modules
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Détail module
│   │   │       └── episode/
│   │   │           └── [episodeId]/
│   │   │               └── page.tsx  # Player vidéo
│   │   ├── resources/
│   │   └── profile/
│   └── admin/                     # À créer
│       ├── users/
│       ├── content/
│       └── analytics/
├── components/
│   ├── video/
│   │   ├── VideoPlayer.tsx        # Player principal
│   │   └── VideoControls.tsx     # Contrôles custom
│   ├── modules/
│   │   ├── ModuleCard.tsx
│   │   └── ModuleList.tsx
│   └── progress/
│       └── ProgressBar.tsx
├── lib/
│   ├── video/
│   │   ├── cloudflare.ts         # Client Cloudflare
│   │   └── vimeo.ts              # Client Vimeo
│   └── hooks/
│       ├── useModules.ts          # SWR hook
│       └── useProgress.ts
└── types/
    └── video.ts
```

---

## ✅ Tests à Faire

### Test 1 : Authentification
```bash
# 1. Créer un compte
# 2. Se connecter
# 3. Vérifier que le dashboard s'affiche
# 4. Se déconnecter
# 5. Vérifier redirection vers /login
```

### Test 2 : RLS
```bash
# 1. Se connecter avec User A
# 2. Vérifier qu'on ne voit que sa propre progression
# 3. Se connecter avec User B
# 4. Vérifier qu'on ne voit pas la progression de User A
```

### Test 3 : Performance
```bash
# 1. Ouvrir DevTools > Network
# 2. Charger la page modules
# 3. Vérifier que seules 20 entrées sont chargées (pagination)
# 4. Vérifier temps de chargement < 2s
```

---

## 🚨 Erreurs Communes à Éviter

### ❌ NE PAS faire :
```typescript
// Charger toutes les vidéos d'un coup
const { data } = await supabase.from('episodes').select('*');

// Pas de pagination
const modules = await getAllModules(); // Charge tout !

// Pas de cache
const data = await fetch('/api/modules'); // À chaque render
```

### ✅ FAIRE :
```typescript
// Pagination
const { data } = await supabase
  .from('episodes')
  .select('*')
  .range(0, 19); // 20 par page

// Avec cache (SWR)
const { data } = useSWR('/api/modules', fetcher);

// Code splitting
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'));
```

---

## 📞 Support & Ressources

- **Supabase Docs** : https://supabase.com/docs
- **Next.js Docs** : https://nextjs.org/docs
- **Cloudflare Stream** : https://developers.cloudflare.com/stream/
- **Vimeo API** : https://developer.vimeo.com/

---

## 🎯 Objectif MVP (Minimum Viable Product)

Pour lancer rapidement, concentrez-vous sur :

1. ✅ Authentification fonctionnelle
2. ✅ Liste des modules
3. ✅ Player vidéo basique
4. ✅ Tracking de progression
5. ✅ Dashboard avec stats

Le reste peut venir après ! 🚀
