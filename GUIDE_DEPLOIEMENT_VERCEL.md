# 📦 Guide de Déploiement sur Vercel

Ce guide explique le processus complet pour déployer vos modifications sur Vercel après chaque changement dans votre code.

---

## 🚀 Workflow Complet

### **Étape 1 : Vérifier vos modifications localement**

Avant de déployer, testez localement :

```bash
# 1. Vérifier que le projet compile sans erreurs
npm run build

# 2. Si le build réussit, tester en local
npm run dev
```

**✅ Vérifications importantes :**
- ✅ Pas d'erreurs TypeScript (`npm run build`)
- ✅ Pas d'erreurs ESLint
- ✅ L'application fonctionne en local (`localhost:3000`)

---

### **Étape 2 : Committer et pousser sur GitHub**

Une fois que tout fonctionne localement :

```bash
# 1. Voir les fichiers modifiés
git status

# 2. Ajouter tous les fichiers modifiés
git add .

# 3. Créer un commit avec un message descriptif
git commit -m "Description de vos modifications"

# 4. Pousser sur GitHub (branche main)
git push origin main
```

**💡 Exemples de messages de commit :**
- `fix: correction du problème de page noire après refresh`
- `feat: ajout de la fonctionnalité de favoris`
- `refactor: amélioration de la gestion des cookies`
- `fix: correction des erreurs de build Vercel`

---

### **Étape 3 : Vercel déploie automatiquement**

**🎉 Bonne nouvelle :** Vercel est connecté à votre dépôt GitHub et déploie **automatiquement** à chaque push sur la branche `main` !

**Ce qui se passe automatiquement :**
1. ✅ Vercel détecte le nouveau commit
2. ✅ Vercel clone le dépôt
3. ✅ Vercel installe les dépendances (`npm install`)
4. ✅ Vercel build le projet (`npm run build`)
5. ✅ Vercel déploie si le build réussit

---

### **Étape 4 : Vérifier le déploiement sur Vercel**

#### **4.1 Accéder au Dashboard Vercel**

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet **"platform-thumbnail-pro"**

#### **4.2 Vérifier le statut du déploiement**

Dans le dashboard Vercel, vous verrez :

- **🟢 "Building"** → Le déploiement est en cours
- **🟢 "Ready"** → Le déploiement a réussi ✅
- **🔴 "Error"** → Le déploiement a échoué ❌

#### **4.3 Consulter les logs en cas d'erreur**

Si le déploiement échoue :

1. Cliquez sur le déploiement qui a échoué
2. Cliquez sur **"Build Logs"** ou **"Deployment Logs"**
3. Analysez les erreurs affichées

**Erreurs courantes :**
- ❌ Erreurs de build TypeScript → Corriger les erreurs dans le code
- ❌ Erreurs ESLint → Corriger les warnings/erreurs ESLint
- ❌ Variables d'environnement manquantes → Vérifier dans Settings > Environment Variables

---

### **Étape 5 : Tester le site déployé**

Une fois le déploiement réussi :

1. **Récupérer l'URL de déploiement :**
   - Dans le dashboard Vercel, cliquez sur **"Visit"** ou copiez l'URL
   - Format : `https://platform-thumbnail-pro-xxxxx.vercel.app`

2. **Tester les fonctionnalités :**
   - ✅ Connexion/Déconnexion
   - ✅ Navigation entre les pages
   - ✅ Fonctionnalités ajoutées/modifiées
   - ✅ Vérifier qu'il n'y a pas de page noire après refresh

---

## 🔧 Configuration Vercel (Une seule fois)

### **Variables d'environnement**

Assurez-vous que ces variables sont configurées dans Vercel :

1. Allez dans **Settings** > **Environment Variables**
2. Vérifiez que ces variables existent :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme
NEXT_PUBLIC_DEV_MODE=false
```

**⚠️ Important :**
- Ces variables doivent être définies pour **Production**, **Preview**, et **Development**
- Après modification, **redéployez** le projet

---

## 📋 Checklist de Déploiement

Utilisez cette checklist à chaque modification :

### **Avant de pousser sur GitHub :**
- [ ] Code testé localement (`npm run dev`)
- [ ] Build réussi (`npm run build`)
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs ESLint critiques
- [ ] Modifications commitées avec un message clair

### **Après le push sur GitHub :**
- [ ] Vérifier que Vercel détecte le nouveau commit
- [ ] Surveiller les logs de build dans Vercel
- [ ] Attendre la fin du déploiement (statut "Ready")

### **Après le déploiement :**
- [ ] Tester l'URL de production
- [ ] Vérifier les fonctionnalités modifiées
- [ ] Tester la connexion/déconnexion
- [ ] Vérifier qu'il n'y a pas de régression

---

## 🐛 Résolution de Problèmes

### **Problème : Le déploiement échoue**

**Solution 1 : Vérifier les logs**
```bash
# Dans Vercel Dashboard > Deployments > [Dernier déploiement] > Build Logs
```

**Solution 2 : Tester localement**
```bash
npm run build
# Si ça échoue localement, corriger les erreurs avant de pousser
```

**Solution 3 : Vérifier les variables d'environnement**
- Vérifier dans Vercel Settings > Environment Variables
- S'assurer qu'elles sont définies pour Production

### **Problème : Le site fonctionne en local mais pas en production**

**Causes possibles :**
1. Variables d'environnement manquantes dans Vercel
2. Problème de cache → Vider le cache du navigateur
3. Problème de cookies → Vérifier la configuration Supabase

**Solution :**
- Vérifier les variables d'environnement dans Vercel
- Tester en navigation privée
- Vérifier les logs Vercel pour les erreurs runtime

### **Problème : Les modifications ne sont pas visibles**

**Solutions :**
1. Attendre quelques secondes (cache CDN)
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Vérifier que le bon commit a été déployé dans Vercel
4. Vérifier l'URL (production vs preview)

---

## 🎯 Workflow Rapide (Résumé)

```bash
# 1. Modifier le code localement
# 2. Tester localement
npm run build
npm run dev

# 3. Committer et pousser
git add .
git commit -m "Description des modifications"
git push origin main

# 4. Vérifier sur Vercel
# → Aller sur vercel.com
# → Vérifier le statut du déploiement
# → Attendre "Ready"

# 5. Tester en production
# → Cliquer sur "Visit" dans Vercel
# → Tester les fonctionnalités
```

---

## 📝 Notes Importantes

1. **Déploiement automatique :** Vercel déploie automatiquement à chaque push sur `main`
2. **Pas besoin de déclencher manuellement :** Le déploiement se fait tout seul
3. **Temps de déploiement :** Généralement 1-3 minutes
4. **URL de production :** Toujours la même (si vous avez un domaine personnalisé)
5. **Preview URLs :** Chaque commit crée une URL de preview (pour les PR)

---

## 🔗 Liens Utiles

- **Dashboard Vercel :** https://vercel.com/dashboard
- **Documentation Vercel :** https://vercel.com/docs
- **GitHub Repository :** Votre repo GitHub

---

## ✅ Résumé Ultra-Rapide

**À chaque modification :**
1. ✅ Modifier le code
2. ✅ `git add .`
3. ✅ `git commit -m "message"`
4. ✅ `git push origin main`
5. ✅ Vérifier Vercel (déploiement automatique)
6. ✅ Tester en production

**C'est tout ! 🎉**
