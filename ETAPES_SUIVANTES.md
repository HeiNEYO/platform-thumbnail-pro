# 🎯 Étapes Suivantes - Vous êtes ici !

## ✅ CE QUE VOUS AVEZ DÉJÀ FAIT
- ✅ Table `users` créée dans Supabase

---

## 📋 ÉTAPE 1 : Créer les autres tables (5 minutes)

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

**Cliquez sur "Run"** et vérifiez que tout est "Success" ✅

---

## 📋 ÉTAPE 2 : Exécuter le setup complet (2 minutes)

Maintenant, ouvrez le fichier **`supabase-setup.sql`** dans ce projet et :

1. **Copiez TOUT le contenu** du fichier
2. **Collez-le** dans le SQL Editor de Supabase
3. **Cliquez sur "Run"**

**Ce que ça fait :**
- ✅ Active Row Level Security (RLS)
- ✅ Crée les politiques de sécurité
- ✅ Crée les indexes pour la performance
- ✅ Crée le trigger pour créer automatiquement les profils

---

## 📋 ÉTAPE 3 : Vérifier le mode dev (1 minute)

1. Ouvrez le fichier **`.env.local`** à la racine du projet
2. Vérifiez que cette ligne existe :
   ```env
   NEXT_PUBLIC_DEV_MODE=false
   ```
3. Si elle est à `true`, changez-la en `false`
4. **Redémarrez votre serveur** :
   ```bash
   # Arrêtez avec Ctrl+C puis :
   npm run dev
   ```

---

## 📋 ÉTAPE 4 : Créer du contenu de test (3 minutes)

### A. Créer un module de test

Dans le **SQL Editor**, exécutez :

```sql
INSERT INTO modules (title, description, order_index, duration_estimate)
VALUES 
  ('Introduction au Graphisme', 'Découvrez les bases du graphisme et les outils essentiels', 1, '2h 30min');
```

### B. Récupérer l'ID du module créé

```sql
SELECT id, title FROM modules;
```

**Copiez l'ID** (c'est un UUID qui ressemble à : `a1b2c3d4-e5f6-...`)

### C. Créer des épisodes de test

**Remplacez `VOTRE_MODULE_ID`** par l'ID que vous venez de copier :

```sql
INSERT INTO episodes (module_id, title, duration, order_index, video_url)
VALUES 
  ('VOTRE_MODULE_ID', 'Bienvenue dans la formation', '5:00', 1, 'https://example.com/video1.mp4'),
  ('VOTRE_MODULE_ID', 'Les outils essentiels', '12:30', 2, 'https://example.com/video2.mp4'),
  ('VOTRE_MODULE_ID', 'Premier projet pratique', '18:45', 3, 'https://example.com/video3.mp4');
```

---

## 📋 ÉTAPE 5 : Tester l'application (2 minutes)

1. Allez sur **`http://localhost:3000/register`**
2. Créez un compte :
   - Nom : Votre Nom
   - Email : votre@email.com
   - Mot de passe : (au moins 6 caractères)
3. Cliquez sur "Créer mon compte"
4. Vous serez redirigé vers `/login`
5. **Connectez-vous** avec les mêmes identifiants
6. Vous devriez voir le **dashboard** avec vos statistiques !

---

## 📋 ÉTAPE 6 : Vérifier que tout fonctionne

### Checklist rapide :

- [ ] Vous pouvez créer un compte
- [ ] Vous pouvez vous connecter
- [ ] Le dashboard s'affiche
- [ ] Vous voyez "1 module disponible" (ou le nombre que vous avez créé)
- [ ] Cliquez sur "Formation" dans le menu → vous voyez votre module
- [ ] Cliquez sur le module → vous voyez les épisodes

**Si tout ça fonctionne :** 🎉 **Votre plateforme est opérationnelle !**

---

## 🚀 Prochaines Actions

Une fois que tout fonctionne :

1. **Créer plus de contenu** : Ajoutez des modules et épisodes réels
2. **Intégrer les vidéos** : Cloudflare Stream ou Vimeo (voir ARCHITECTURE.md)
3. **Personnaliser** : Modifiez les textes, couleurs, etc.
4. **Créer un compte admin** : Voir ci-dessous

---

## 👑 Créer un compte Admin

Pour promouvoir votre compte en admin :

```sql
-- Remplacez 'votre@email.com' par l'email de votre compte
UPDATE users 
SET role = 'admin' 
WHERE email = 'votre@email.com';
```

Ensuite, reconnectez-vous pour que les changements prennent effet.

---

## ❓ Problèmes ?

### "Row Level Security policy violation"
→ Vous n'avez pas exécuté `supabase-setup.sql` complètement

### "User not found"
→ Le trigger devrait créer automatiquement le profil. Vérifiez dans Table Editor > users

### Page blanche
→ Ouvrez la console (F12) et regardez les erreurs

### "Missing Supabase URL"
→ Vérifiez que `.env.local` contient bien vos variables Supabase

---

## 📞 Besoin d'aide ?

Consultez :
- `SETUP_INSTRUCTIONS.md` pour plus de détails
- `ARCHITECTURE.md` pour les recommandations techniques
- `QUICK_START.md` pour un guide rapide

**Temps total estimé : 10-15 minutes** ⚡
