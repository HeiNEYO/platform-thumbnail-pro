# 🛠️ Mode Développement - Bypass Authentification

## 📋 Description

Le mode développement permet d'accéder à la plateforme **sans authentification Supabase**. Utile pendant la maintenance Supabase ou pour développer sans dépendre de l'API.

## ⚠️ IMPORTANT

- **NE JAMAIS activer en production !**
- **Uniquement pour le développement local**
- Le code d'authentification reste intact et fonctionnera normalement une fois désactivé

## 🚀 Activation

1. **Ouvre le fichier `.env.local`** à la racine du projet

2. **Ajoute cette ligne** :
```env
NEXT_PUBLIC_DEV_MODE=true
```

3. **Redémarre le serveur** :
```powershell
# Arrête (Ctrl+C) puis relance :
npm run dev
```

## ✅ Ce qui se passe en mode dev

- ✅ Accès automatique à toutes les pages (dashboard, admin, etc.)
- ✅ Utilisateur mock créé automatiquement (admin)
- ✅ Pas besoin de se connecter
- ✅ Tous les composants fonctionnent normalement
- ✅ Le code d'authentification reste intact

## 🔄 Désactivation

1. **Dans `.env.local`**, change :
```env
NEXT_PUBLIC_DEV_MODE=false
```

2. **Redémarre le serveur**

3. **L'authentification Supabase fonctionnera normalement**

## 📝 Utilisateur Mock

En mode dev, un utilisateur mock est créé automatiquement :
- **Email** : `dev@example.com` (ou celui que tu entres dans le formulaire)
- **Rôle** : `admin` (accès complet)
- **Nom** : "Utilisateur Développement"

## 🎯 Cas d'usage

- ✅ Maintenance Supabase
- ✅ Développement sans connexion internet
- ✅ Tests de l'interface utilisateur
- ✅ Développement de nouvelles fonctionnalités

## ⚠️ Limitations

- Les données ne sont pas sauvegardées (pas de vraie base de données)
- Les fonctionnalités qui dépendent de Supabase ne fonctionneront pas
- C'est uniquement pour voir/test l'interface
