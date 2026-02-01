# 🚀 Déploiement Immédiat

## Commandes à exécuter dans votre terminal

### Étape 1 : Ajouter tous les fichiers modifiés
```bash
git add .
```

### Étape 2 : Créer un commit avec un message descriptif
```bash
git commit -m "feat: ajout Instagram/Discord sur cards + badges avec fond coloré"
```

### Étape 3 : Pousser vers GitHub (déploiement automatique sur Vercel)
```bash
git push origin main
```

---

## ✅ Ce qui sera déployé

1. **Badges de grade avec fond coloré** :
   - Membre : fond bleu sombre + texte bleu clair
   - Intervenant : fond vert sombre + texte vert clair
   - Admin : fond rouge sombre + texte rouge clair

2. **Support Instagram et Discord** :
   - Affichage sur les cards de la communauté
   - Formulaire de profil mis à jour

3. **Composants créés** :
   - `InstagramIcon.tsx`
   - Scripts SQL pour Supabase

---

## ⏱️ Temps de déploiement

- **Vercel déploie automatiquement** après le `git push`
- **Durée** : 1-3 minutes
- **URL** : https://platform-thumbnail-pro.vercel.app

---

## 🔍 Vérification après déploiement

1. Allez sur https://platform-thumbnail-pro.vercel.app
2. Connectez-vous
3. Allez dans **Communauté**
4. Vérifiez que les badges ont un fond coloré
5. Vérifiez que Discord et Instagram s'affichent si remplis

---

## 📋 Checklist avant de pousser

- [ ] Les fichiers sont sauvegardés dans votre éditeur
- [ ] Vous avez testé localement (`npm run dev`)
- [ ] Pas d'erreurs TypeScript/ESLint

---

## 🚨 Si vous avez des erreurs

### Erreur "Permission denied" sur git
```bash
# Fermez tous les programmes qui utilisent git (Cursor, VS Code, etc.)
# Puis réessayez les commandes
```

### Erreur de build sur Vercel
```bash
# Testez localement d'abord
npm run build
# Corrigez les erreurs avant de pousser
```

---

## 💡 Astuce

**Vercel déploie automatiquement** à chaque `git push origin main`  
→ Pas besoin de déclencher manuellement le déploiement !

---

## 🔗 Liens utiles

- **Vercel Dashboard** : https://vercel.com/dashboard
- **Votre Site** : https://platform-thumbnail-pro.vercel.app
- **GitHub** : Votre dépôt (si configuré)
