# Mise en ligne complète – tout en ligne, tout fonctionne

Ce tutoriel est l’**unique référence** pour mettre la plateforme en ligne et que tout fonctionne proprement. Suis les étapes **dans l’ordre**.

---

## Dépannage : la plateforme n’affiche rien (écran noir)

Si après déploiement tu as un écran noir ou « rien ne s’affiche » :

0. **Vérifier le déploiement** : as-tu bien poussé le code sur GitHub (ou fait un Redeploy sur Vercel) après tes derniers changements ? Sans redéploiement, le site affiche l'ancienne version. Voir **`DEPLOIEMENT_CHAQUE_FOIS.md`** à la racine du projet.
1. Va sur **Vercel** → ton projet → **Settings** → **Environment Variables**.
2. Ajoute une variable : **`NEXT_PUBLIC_DEMO_MODE`** = **`true`** (pour toutes les env : Production, Preview, Development).
3. **Redeploy** (Deployments → … sur le dernier déploiement → Redeploy).

La plateforme s’affichera en **mode démo** : page de connexion visible, et un clic sur « Se connecter » ouvre le dashboard sans vraie auth (pas de Supabase). Tu pourras naviguer partout et vérifier que l’interface fonctionne. Quand Supabase et l’auth seront OK, enlève `NEXT_PUBLIC_DEMO_MODE` (ou mets `false`) et redéploie pour repasser en mode normal.

---

## Vue d’ensemble

| Étape | Où | Quoi faire |
|-------|-----|------------|
| 1 | Supabase | Vérifier les tables + RLS + Auth URLs (prod) |
| 2 | Git / GitHub | Pousser le code (sans `.env.local`) |
| 3 | Vercel | Créer le projet + variables d’environnement |
| 4 | Vercel | Déployer |
| 5 | Supabase | Ajouter l’URL de prod dans Auth |
| 6 | Vercel | Tester le site en ligne |

---

## Étape 1 – Supabase : base et auth prêtes

### 1.1 Tables et RLS

1. Va sur **https://supabase.com** → ton projet.
2. **SQL Editor** → **+ New query**.
3. Ouvre le fichier **`supabase-complet.sql`** à la racine du projet.
4. Copie **tout** le contenu (Ctrl+A, Ctrl+C), colle dans l’éditeur SQL, clique sur **Run**.
5. Vérifie : **Table Editor** → tu dois voir les tables **users**, **modules**, **episodes**, **progress**, **resources**, **announcements**.

Si tu as déjà exécuté ce script avant, tu peux passer à la section **1.2**.

### 1.2 Politiques RLS (pas de récursion)

1. Toujours dans **SQL Editor** → **+ New query**.
2. Ouvre le fichier **`fix-recursion-connexion.sql`** à la racine du projet.
3. Copie tout, colle dans l’éditeur SQL, **Run**.
4. Aucune erreur = c’est bon.

### 1.3 (Optionnel) Créer un compte admin

1. Inscris-toi une fois sur ta plateforme (après déploiement) avec l’email que tu veux en admin.
2. Dans Supabase → **SQL Editor** → **+ New query**.
3. Exécute (en remplaçant par ton email) :
   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'ton-email@exemple.com';
   ```

Tu pourras faire ça après la mise en ligne. Pour l’instant, passe à l’étape 2.

---

## Étape 2 – Git et GitHub : code en ligne

### 2.1 Initialiser Git (si pas déjà fait)

À la racine du projet (dans un terminal) :

```bash
git init
git add .
git commit -m "Initial commit - Plateforme Thumbnail Pro"
```

### 2.2 Créer le dépôt sur GitHub

1. Va sur **https://github.com** → connecte-toi.
2. **+** (en haut à droite) → **New repository**.
3. Nom du repo : par ex. `platform-thumbnail-pro`.
4. **Public**, ne coche pas "Add a README".
5. Clique sur **Create repository**.

### 2.3 Pousser le code

Dans le terminal (toujours à la racine du projet) :

```bash
git remote add origin https://github.com/heineyo/platform-thumbnail-pro.git
git branch -M main
git push -u origin main
```

Remplace **TON_USER** par ton pseudo GitHub et **TON_REPO** par le nom du repo (ex. `platform-thumbnail-pro`).

**Important :** le fichier **`.env.local`** est dans `.gitignore`, il **ne sera pas envoyé** sur GitHub. C’est voulu : en production, les variables sont sur Vercel.

---

## Étape 3 – Vercel : projet et variables

### 3.1 Créer le projet

1. Va sur **https://vercel.com** → connecte-toi (avec GitHub si possible).
2. **Add New…** → **Project**.
3. **Import** : choisis le dépôt que tu viens de pousser (ex. `TON_USER/platform-thumbnail-pro`).
4. **Framework Preset** : Next.js (détecté automatiquement).
5. **Root Directory** : laisse vide.
6. **Ne clique pas encore sur Deploy** : on ajoute d’abord les variables.

### 3.2 Variables d’environnement (obligatoire)

1. Dans la page de configuration du projet Vercel, trouve la section **Environment Variables**.
2. Ajoute **3 variables** (une par une) :

| Name | Value | Coche pour |
|------|--------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Ton URL Supabase (ex. `https://xxxx.supabase.co`) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ta clé **anon** Supabase (pas la service_role) | Production, Preview, Development |
| `NEXT_PUBLIC_DEV_MODE` | `false` | Production, Preview, Development |

**Où trouver URL et clé Supabase :**  
Supabase → ton projet → **Settings** (icône engrenage) → **API** → **Project URL** et **anon public** (clé publique).

3. Clique sur **Save** après chaque variable.

---

## Étape 4 – Vercel : déployer

1. Clique sur **Deploy**.
2. Attends la fin du build (1 à 3 minutes).
3. Quand c’est **vert** (Ready), note l’URL affichée, par ex. :  
   `https://platform-thumbnail-pro-xxxx.vercel.app`  
   ou ton domaine personnalisé si tu en as un.

---

## Étape 5 – Supabase : autoriser l’URL de prod (Auth)

Sans cette étape, la **connexion ne fonctionnera pas** sur le site en ligne.

1. Supabase → ton projet → **Authentication** (menu gauche).
2. Onglet **URL Configuration** (ou **Settings** → **Auth** selon l’interface).
3. **Site URL** : mets l’URL de ton site Vercel, ex.  
   `https://platform-thumbnail-pro-xxxx.vercel.app`
4. **Redirect URLs** : ajoute (une par ligne si besoin) :
   - `https://platform-thumbnail-pro-xxxx.vercel.app/**`
   - `https://ton-projet.vercel.app/**` (si tu as un domaine personnalisé)
5. **Save**.

---

## Important : pousser le code après des corrections

Si tu as corrigé des erreurs de build (apostrophes, hooks, `next/image`) **en local**, Vercel ne les verra pas tant que tu n’as pas **committé et poussé** sur GitHub.

À la racine du projet, dans un terminal :

```bash
git add .
git commit -m "Fix build: ESLint errors (apostrophes, hooks, next/image)"
git push origin main
```

Ensuite, Vercel redéploiera automatiquement avec le nouveau commit.

---

## Étape 6 – Vérifier que tout fonctionne

1. Ouvre ton site Vercel (bouton **Visit** ou l’URL notée).
2. Va sur la page **Inscription** → crée un compte (email + mot de passe).
3. Tu dois être redirigé vers le **dashboard** après inscription (ou après connexion si tu as déjà un compte).
4. Si tu vois le dashboard avec le menu (Accueil, Formation, etc.) = **tout fonctionne**.

### Si la connexion ne marche pas

- Vérifie que **NEXT_PUBLIC_DEV_MODE** est bien à **false** sur Vercel.
- Vérifie que l’URL exacte de ton site Vercel est dans **Supabase → Authentication → URL Configuration** (Site URL + Redirect URLs).
- Vérifie que les variables **NEXT_PUBLIC_SUPABASE_URL** et **NEXT_PUBLIC_SUPABASE_ANON_KEY** sont bien renseignées sur Vercel (Settings → Environment Variables).

### Si le dashboard ne s’affiche pas (chargement infini)

- Attends 4–5 secondes : un timeout permet d’afficher le dashboard même si le chargement du profil est lent.
- Vérifie la console du navigateur (F12 → Console) : s’il y a des erreurs Supabase (ex. RLS), exécute à nouveau **`fix-recursion-connexion.sql`** dans Supabase (étape 1.2).

### Erreurs console : Phantom et CSP

**1. Erreurs `[PHANTOM]` / `Could not establish connection. Receiving end does not exist`**  
- Elles viennent de l'**extension de navigateur Phantom** (portefeuille Solana), pas de ton app.  
- **À faire :** les ignorer, ou désactiver l'extension sur ton site pour une console plus propre. Aucune modification de code nécessaire.

**2. Erreur « Content Security Policy of your site blocks the use of 'eval' in JavaScript »**  
- Une CSP stricte (site ou hébergeur) bloquait `eval()`, utilisé par Next.js ou des libs (ex. Supabase), ce qui peut provoquer un écran noir.  
- **Correction appliquée :** dans **`next.config.ts`** une politique CSP a été ajoutée avec `script-src 'self' 'unsafe-inline' 'unsafe-eval'` (et règles pour styles, fonts, images, Supabase).  
- Après redéploiement, cette erreur ne devrait plus bloquer l'affichage.

---

## Analyse des fonctionnalités (Ressources, Stats, Favoris, Notes, Community)

Ces fonctionnalités ont été **conservées** et **renforcées** pour éviter tout écran noir ou crash en production.

### Problème identifié
L’écran noir pouvait survenir si une des **pages serveur** (dashboard, ressources, stats, favoris, notes) levait une exception : tables Supabase absentes, erreur réseau, etc. Une erreur non gérée dans un composant serveur peut empêcher le rendu de toute la page.

### Modifications effectuées (aucune suppression)

1. **Ressources** (`/dashboard/resources`)
   - Appels à `getResources()`, `getResourceCategories()`, `getResourceTypes()` entourés d’un **try/catch**. En cas d’erreur (table `resources` absente ou autre), la page affiche une liste vide au lieu de planter.

2. **Stats** (`/dashboard/stats`)
   - Récupération de la progression et des stats par module dans un **try/catch**. En cas d’erreur, KPIs à 0 et liste de modules vide.

3. **Favoris** (`/dashboard/favorites`)
   - `getFavoritesWithDetails(user.id)` dans un **try/catch**. En cas d’erreur (table `favorites` absente), liste vide.

4. **Notes** (`/dashboard/notes`)
   - `getNotesWithEpisodes(user.id)` dans un **try/catch**. En cas d’erreur (table `notes` absente), liste vide.

5. **Page d’accueil dashboard** (`/dashboard`)
   - Toute la logique de chargement (profil, modules, progression, compteurs) est dans un **try/catch**. En cas d’erreur, affichage d’un dashboard minimal (nom utilisateur, 0 module, 0 %).

6. **Communauté / Discord**
   - Pages statiques (liens, texte, icônes). Aucune dépendance à des tables. **Aucune modification** nécessaire.

### Résultat
- Les fonctionnalités restent **toutes en place**.
- Si une table ou un service Supabase manque ou échoue, la page **s’affiche quand même** avec des données vides ou des zéros, au lieu de provoquer un écran noir.
- Une fois les tables `resources`, `favorites`, `notes` (et les politiques RLS) créées dans Supabase (voir `supabase-complet.sql` ou scripts dédiés), tout fonctionne normalement.

---

## Résumé – tout en ligne, rien en local pour la prod

| Élément | Où c’est géré |
|--------|----------------|
| Code | GitHub (sans `.env.local`) |
| Variables d’environnement | Vercel → Settings → Environment Variables |
| Base de données + Auth | Supabase (tables, RLS, Auth URLs) |
| Hébergement du site | Vercel |

**Modifier la prod plus tard :**  
- Changer le code → push sur GitHub → Vercel redéploie automatiquement.  
- Changer une variable → Vercel → Settings → Environment Variables → Redéploy si besoin.  
- Changer la base ou les droits → Supabase (SQL Editor, Table Editor, Auth).

En suivant ces étapes dans l’ordre, tout est en ligne et tout fonctionne proprement.
