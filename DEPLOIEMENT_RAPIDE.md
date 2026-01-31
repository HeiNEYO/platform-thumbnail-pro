# ⚡ Déploiement Rapide - 5 Étapes

## 🎯 Objectif
Mettre la plateforme en ligne en **15 minutes maximum**.

---

## ✅ ÉTAPE 1 : Préparer le code (2 min)

```bash
# 1. Vérifier que le mode dev est désactivé
# Ouvrez .env.local et mettez :
NEXT_PUBLIC_DEV_MODE=false

# 2. Tester le build
npm run build

# Si ça fonctionne, continuez ! ✅
```

---

## ✅ ÉTAPE 2 : GitHub (3 min)

```bash
# Si vous n'avez pas encore de repo Git
git init
git add .
git commit -m "Ready for production"

# Créez un repo sur GitHub.com puis :
git remote add origin https://github.com/VOTRE_USERNAME/platform-thumbnail-pro.git
git branch -M main
git push -u origin main
```

---

## ✅ ÉTAPE 3 : Vercel (5 min)

1. **Allez sur** https://vercel.com/signup
2. **Connectez-vous avec GitHub**
3. **Cliquez sur "Add New Project"**
4. **Sélectionnez votre repo** `platform-thumbnail-pro`
5. **Cliquez sur "Import"**

---

## ✅ ÉTAPE 4 : Variables d'environnement (3 min)

Dans Vercel, section **"Environment Variables"**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=https://zhdlqmkpdsygszrxjezd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZGxxbWtwZHN5Z3N6cnhqZXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDY1ODYsImV4cCI6MjA4NTMyMjU4Nn0.9X-asTninwNvebWtORr3c3eppJT2uQLfBdLte3qb7u0
NEXT_PUBLIC_DEV_MODE=false
```

**⚠️ Important :** Utilisez vos vraies clés Supabase !

---

## ✅ ÉTAPE 5 : Configurer Supabase (2 min)

Dans **Supabase Dashboard** > **Settings** > **API** :

1. **Redirect URLs** : Ajoutez `https://votre-site.vercel.app/**`
2. **Site URL** : Mettez `https://votre-site.vercel.app`

---

## 🚀 DÉPLOYER !

Dans Vercel, cliquez sur **"Deploy"** et attendez 2-3 minutes.

**✅ Votre plateforme est en ligne !**

---

## ✅ VÉRIFICATIONS (2 min)

1. Ouvrez votre URL Vercel
2. Testez l'inscription
3. Testez la connexion
4. Vérifiez que les modules s'affichent

**Si tout fonctionne :** 🎉 **C'est prêt !**

---

## 🚨 Si ça ne marche pas

### Erreur "Missing Supabase URL"
→ Vérifiez les variables d'environnement dans Vercel

### Page blanche
→ Regardez les logs dans Vercel Dashboard > Deployments > Logs

### Erreur de connexion
→ Vérifiez les Redirect URLs dans Supabase

---

**Temps total : 15 minutes** ⚡
