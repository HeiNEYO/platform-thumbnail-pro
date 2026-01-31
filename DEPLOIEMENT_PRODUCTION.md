# 🚀 Guide de Déploiement en Production

## 🎯 Objectif
Déployer la plateforme en ligne pour qu'elle soit accessible publiquement et fonctionnelle (pas parfaite, mais utilisable).

---

## 📋 PRÉREQUIS

Avant de déployer, assurez-vous d'avoir :

- ✅ Un compte **Supabase** avec votre projet configuré
- ✅ Les tables créées dans Supabase (voir `ETAPES_SUIVANTES.md`)
- ✅ Au moins un module de test créé
- ✅ Un compte **GitHub** (pour Vercel)
- ✅ Le code poussé sur GitHub (recommandé)

---

## 🎯 OPTION 1 : Vercel (Recommandé - Gratuit et Simple)

### Pourquoi Vercel ?
- ✅ Gratuit jusqu'à 100GB/mois
- ✅ Optimisé pour Next.js (créé par l'équipe Next.js)
- ✅ Déploiement automatique depuis GitHub
- ✅ CDN global pour performance
- ✅ SSL automatique (HTTPS)
- ✅ Configuration en 5 minutes

---

### ÉTAPE 1 : Préparer le code (2 minutes)

#### A. Vérifier que le mode dev est désactivé

Dans `.env.local`, assurez-vous que :
```env
NEXT_PUBLIC_DEV_MODE=false
```

#### B. Tester le build localement

```bash
npm run build
```

**Si le build réussit**, vous êtes prêt ! ✅

**Si le build échoue**, corrigez les erreurs avant de continuer.

#### C. (Optionnel) Créer un fichier `.gitignore` si nécessaire

Assurez-vous que `.env.local` est dans `.gitignore` (ne jamais commiter les secrets !)

---

### ÉTAPE 2 : Pousser le code sur GitHub (5 minutes)

#### A. Créer un repository GitHub

1. Allez sur https://github.com/new
2. Créez un nouveau repository (ex: `platform-thumbnail-pro`)
3. **Ne cochez PAS** "Initialize with README" (si vous avez déjà du code)

#### B. Pousser votre code

```bash
# Si vous n'avez pas encore initialisé git
git init
git add .
git commit -m "Initial commit - Platform Thumbnail Pro"

# Ajoutez votre repository GitHub
git remote add origin https://github.com/VOTRE_USERNAME/platform-thumbnail-pro.git
git branch -M main
git push -u origin main
```

**Note :** Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub.

---

### ÉTAPE 3 : Déployer sur Vercel (5 minutes)

#### A. Créer un compte Vercel

1. Allez sur https://vercel.com/signup
2. Cliquez sur **"Continue with GitHub"**
3. Autorisez Vercel à accéder à vos repositories

#### B. Importer votre projet

1. Dans le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Sélectionnez votre repository `platform-thumbnail-pro`
3. Cliquez sur **"Import"**

#### C. Configurer les variables d'environnement

Dans la section **"Environment Variables"**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_publique
NEXT_PUBLIC_DEV_MODE=false
```

**Important :**
- Remplacez les valeurs par vos vraies clés Supabase
- **NE JAMAIS** mettre `NEXT_PUBLIC_DEV_MODE=true` en production !

#### D. Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes que le build se termine
3. ✅ Votre site est en ligne !

**Votre URL sera :** `https://platform-thumbnail-pro.vercel.app` (ou un nom personnalisé)

---

### ÉTAPE 4 : Configurer un domaine personnalisé (Optionnel - 5 minutes)

1. Dans Vercel Dashboard > Votre projet > **Settings** > **Domains**
2. Ajoutez votre domaine (ex: `platform.thumbnailpro.com`)
3. Suivez les instructions pour configurer les DNS
4. Attendez la propagation DNS (5-30 minutes)

---

## 🎯 OPTION 2 : Netlify (Alternative)

### ÉTAPE 1 : Créer un compte Netlify

1. Allez sur https://app.netlify.com/signup
2. Connectez-vous avec GitHub

### ÉTAPE 2 : Créer un fichier `netlify.toml`

Créez ce fichier à la racine du projet :

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### ÉTAPE 3 : Déployer

1. Dans Netlify Dashboard, cliquez sur **"Add new site"** > **"Import an existing project"**
2. Sélectionnez votre repository GitHub
3. Configurez les variables d'environnement (même que Vercel)
4. Cliquez sur **"Deploy site"**

---

## 🎯 OPTION 3 : Railway (Alternative)

### ÉTAPE 1 : Créer un compte Railway

1. Allez sur https://railway.app
2. Connectez-vous avec GitHub

### ÉTAPE 2 : Créer un nouveau projet

1. Cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez votre repository

### ÉTAPE 3 : Configurer

1. Railway détecte automatiquement Next.js
2. Ajoutez les variables d'environnement dans **Variables**
3. Railway déploie automatiquement

---

## ✅ VÉRIFICATIONS POST-DÉPLOIEMENT

Une fois déployé, vérifiez :

### Checklist fonctionnelle :

- [ ] Le site charge sans erreur
- [ ] La page de connexion s'affiche
- [ ] Vous pouvez créer un compte
- [ ] Vous pouvez vous connecter
- [ ] Le dashboard s'affiche
- [ ] Les modules s'affichent dans "Formation"
- [ ] Le profil s'affiche
- [ ] Le lien Discord fonctionne

### Tests à faire :

1. **Test d'inscription :**
   - Créez un nouveau compte avec un email de test
   - Vérifiez que vous êtes redirigé vers le dashboard

2. **Test de connexion :**
   - Déconnectez-vous
   - Reconnectez-vous avec le même compte
   - Vérifiez que vos données sont conservées

3. **Test des modules :**
   - Allez sur "Formation"
   - Vérifiez que vos modules s'affichent
   - Cliquez sur un module pour voir les détails

---

## 🔧 CONFIGURATION SUPABASE POUR LA PRODUCTION

### A. Vérifier les URLs autorisées

Dans Supabase Dashboard > **Settings** > **API** > **URL Configuration** :

1. Ajoutez votre URL de production dans **"Redirect URLs"** :
   ```
   https://votre-site.vercel.app/**
   https://votre-site.vercel.app/auth/callback
   ```

2. Ajoutez votre URL dans **"Site URL"** :
   ```
   https://votre-site.vercel.app
   ```

### B. Vérifier les politiques RLS

Assurez-vous que `supabase-setup.sql` a été exécuté pour activer RLS.

---

## 🚨 PROBLÈMES COURANTS ET SOLUTIONS

### ❌ "Missing Supabase URL" après déploiement

**Solution :**
1. Vérifiez que les variables d'environnement sont bien configurées dans Vercel/Netlify/Railway
2. Redéployez après avoir ajouté les variables

### ❌ Erreur 500 ou page blanche

**Solution :**
1. Vérifiez les logs de déploiement dans votre plateforme (Vercel/Netlify)
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Vérifiez que `NEXT_PUBLIC_DEV_MODE=false` en production

### ❌ "Row Level Security policy violation"

**Solution :**
1. Exécutez `supabase-setup.sql` dans Supabase SQL Editor
2. Vérifiez que les politiques RLS sont bien créées

### ❌ Les modules ne s'affichent pas

**Solution :**
1. Vérifiez que vous avez créé au moins un module dans Supabase
2. Vérifiez que les politiques RLS permettent la lecture des modules

### ❌ Erreur de connexion après déploiement

**Solution :**
1. Vérifiez que les URLs de redirection sont bien configurées dans Supabase
2. Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` est correct dans les variables d'environnement

---

## 📊 MONITORING ET MAINTENANCE

### A. Vérifier les logs

- **Vercel :** Dashboard > Votre projet > **Logs**
- **Netlify :** Dashboard > Votre site > **Functions** > **Logs**
- **Railway :** Dashboard > Votre projet > **Deployments** > **Logs**

### B. Analytics (Optionnel)

Pour suivre l'utilisation de votre plateforme :

1. **Vercel Analytics** (gratuit) :
   - Dashboard > Votre projet > **Analytics**
   - Activez "Web Analytics"

2. **Google Analytics** (gratuit) :
   - Ajoutez le script dans `src/app/layout.tsx`

---

## 🎯 CHECKLIST FINALE AVANT LANCEMENT

### Configuration :

- [ ] Mode dev désactivé (`NEXT_PUBLIC_DEV_MODE=false`)
- [ ] Variables d'environnement configurées dans la plateforme de déploiement
- [ ] URLs de redirection configurées dans Supabase
- [ ] Build local réussi (`npm run build`)

### Contenu :

- [ ] Au moins un module créé dans Supabase
- [ ] Au moins un épisode créé pour tester
- [ ] RLS activé et politiques créées

### Tests :

- [ ] Site accessible en ligne
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Dashboard s'affiche
- [ ] Modules s'affichent
- [ ] Profil fonctionne

---

## 🚀 DÉPLOIEMENT CONTINU (Optionnel)

Pour déployer automatiquement à chaque push sur GitHub :

### Vercel :
✅ Déjà activé par défaut ! Chaque push sur `main` déclenche un nouveau déploiement.

### Netlify :
✅ Déjà activé par défaut !

### Railway :
✅ Déjà activé par défaut !

---

## 📝 RÉSUMÉ RAPIDE

**Pour déployer rapidement :**

1. ✅ `NEXT_PUBLIC_DEV_MODE=false` dans `.env.local`
2. ✅ `npm run build` (vérifier que ça fonctionne)
3. ✅ Pousser le code sur GitHub
4. ✅ Créer un compte Vercel
5. ✅ Importer le projet depuis GitHub
6. ✅ Ajouter les variables d'environnement Supabase
7. ✅ Cliquer sur "Deploy"
8. ✅ Configurer les URLs dans Supabase Dashboard

**Temps total : 15-20 minutes** ⚡

---

## 🎉 FÉLICITATIONS !

Votre plateforme est maintenant en ligne et accessible publiquement !

**Prochaines étapes suggérées :**
1. Tester avec quelques utilisateurs réels
2. Ajouter plus de contenu (modules, épisodes)
3. Configurer un domaine personnalisé
4. Ajouter des analytics pour suivre l'usage
5. Optimiser les performances (voir `ARCHITECTURE.md`)

---

## 📞 BESOIN D'AIDE ?

- **Vercel Docs** : https://vercel.com/docs
- **Next.js Deployment** : https://nextjs.org/docs/deployment
- **Supabase Production** : https://supabase.com/docs/guides/hosting/overview
