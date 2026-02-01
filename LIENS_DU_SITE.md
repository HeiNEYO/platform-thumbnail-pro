# 🔗 Liste Complète des Liens du Site

## 🌐 Base URL
**Production :** https://platform-thumbnail-pro.vercel.app  
**Local :** http://localhost:3000

---

## 📄 Pages Publiques (Non Authentifiées)

### 1. Page d'Accueil
- **URL :** `/`
- **Description :** Page d'accueil du site
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/

### 2. Connexion
- **URL :** `/login`
- **Description :** Page de connexion
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/login

### 3. Inscription
- **URL :** `/register`
- **Description :** Page d'inscription
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/register

---

## 🔐 Pages Dashboard (Authentifiées)

### 📊 Overview

#### 1. Accueil Dashboard
- **URL :** `/dashboard`
- **Description :** Page d'accueil du dashboard
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard

#### 2. Mes Favoris
- **URL :** `/dashboard/favorites`
- **Description :** Liste des favoris de l'utilisateur
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/favorites

#### 3. Statistiques
- **URL :** `/dashboard/stats`
- **Description :** Statistiques de progression de l'utilisateur
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/stats

#### 4. Mes Notes
- **URL :** `/dashboard/notes`
- **Description :** Notes personnelles de l'utilisateur
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/notes

---

### 🎓 Academy

#### 5. Formation (Modules)
- **URL :** `/dashboard/modules`
- **Description :** Liste de tous les modules de formation
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/modules

#### 6. Module Spécifique
- **URL :** `/dashboard/modules/[id]`
- **Description :** Détails d'un module spécifique
- **Exemple :** https://platform-thumbnail-pro.vercel.app/dashboard/modules/1
- **Note :** `[id]` est l'ID du module

#### 7. Épisode d'un Module
- **URL :** `/dashboard/modules/[id]/episode/[episodeId]`
- **Description :** Page d'un épisode spécifique dans un module
- **Exemple :** https://platform-thumbnail-pro.vercel.app/dashboard/modules/1/episode/1
- **Note :** `[id]` est l'ID du module, `[episodeId]` est l'ID de l'épisode

#### 8. Masterclass
- **URL :** `/dashboard/masterclass`
- **Description :** Page des masterclasses
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/masterclass

#### 9. Ressources
- **URL :** `/dashboard/resources`
- **Description :** Ressources disponibles
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/resources

---

### 👥 Communauté

#### 10. Communauté
- **URL :** `/dashboard/community`
- **Description :** Liste de tous les membres de la communauté
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/community

#### 11. Discord
- **URL :** `/dashboard/discord`
- **Description :** Page Discord de la communauté
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/discord

---

### 👤 Compte

#### 12. Mon Profil
- **URL :** `/dashboard/profile`
- **Description :** Page de gestion du profil personnel
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/profile

#### 13. Profil Public d'un Membre
- **URL :** `/dashboard/profile/[id]`
- **Description :** Profil public d'un autre membre
- **Exemple :** https://platform-thumbnail-pro.vercel.app/dashboard/profile/abc123
- **Note :** `[id]` est l'ID utilisateur du membre

---

### 🔧 Pages Supplémentaires (Non listées dans la sidebar)

#### 14. Coaching
- **URL :** `/dashboard/coaching`
- **Description :** Page de coaching
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/coaching

#### 15. Network
- **URL :** `/dashboard/network`
- **Description :** Page réseau
- **Lien complet :** https://platform-thumbnail-pro.vercel.app/dashboard/network

---

## 📋 Résumé par Catégorie

### Pages Publiques (3)
1. `/` - Accueil
2. `/login` - Connexion
3. `/register` - Inscription

### Pages Dashboard (15)
- **Overview (4)** : Accueil, Favoris, Stats, Notes
- **Academy (5)** : Modules, Module spécifique, Épisode, Masterclass, Ressources
- **Communauté (2)** : Communauté, Discord
- **Compte (2)** : Profil, Profil public
- **Autres (2)** : Coaching, Network

---

## 🎯 Routes Dynamiques

Les routes avec `[id]` ou `[episodeId]` sont dynamiques et nécessitent un identifiant :

- `/dashboard/modules/[id]` → Remplacez `[id]` par l'ID du module
- `/dashboard/modules/[id]/episode/[episodeId]` → Remplacez `[id]` et `[episodeId]`
- `/dashboard/profile/[id]` → Remplacez `[id]` par l'ID utilisateur

---

## 🔒 Protection des Routes

### Routes Publiques
- `/` - Redirige vers `/login` si non connecté
- `/login` - Accessible à tous, redirige vers `/dashboard` si déjà connecté
- `/register` - Accessible à tous, redirige vers `/dashboard` si déjà connecté

### Routes Protégées (Authentification Requise)
- Toutes les routes `/dashboard/*` nécessitent une authentification
- Redirection automatique vers `/login` si non authentifié

### Routes Admin (Non implémentées actuellement)
- `/admin/*` - Routes prévues pour les administrateurs
- Nécessitent le rôle "admin" dans la base de données
- Redirigent vers `/dashboard` si l'utilisateur n'est pas admin

---

## 📝 Notes Importantes

- **Tous les liens du dashboard nécessitent une connexion**
- **Les routes dynamiques nécessitent des IDs valides**
- **Le middleware vérifie l'authentification pour toutes les routes `/dashboard/*`**
- **Les profils publics sont accessibles à tous les membres connectés**
- **Mode Dev/Demo :** Si `NEXT_PUBLIC_DEV_MODE=true`, l'authentification est bypassée

---

## 🔗 Liens Rapides (Production)

### Pages Principales
- 🏠 [Accueil](https://platform-thumbnail-pro.vercel.app/)
- 🔐 [Connexion](https://platform-thumbnail-pro.vercel.app/login)
- 📝 [Inscription](https://platform-thumbnail-pro.vercel.app/register)

### Dashboard
- 📊 [Accueil Dashboard](https://platform-thumbnail-pro.vercel.app/dashboard)
- ❤️ [Mes Favoris](https://platform-thumbnail-pro.vercel.app/dashboard/favorites)
- 📈 [Statistiques](https://platform-thumbnail-pro.vercel.app/dashboard/stats)
- 📝 [Mes Notes](https://platform-thumbnail-pro.vercel.app/dashboard/notes)
- 📚 [Formation](https://platform-thumbnail-pro.vercel.app/dashboard/modules)
- 🎓 [Masterclass](https://platform-thumbnail-pro.vercel.app/dashboard/masterclass)
- 📁 [Ressources](https://platform-thumbnail-pro.vercel.app/dashboard/resources)
- 👥 [Communauté](https://platform-thumbnail-pro.vercel.app/dashboard/community)
- 💬 [Discord](https://platform-thumbnail-pro.vercel.app/dashboard/discord)
- 👤 [Mon Profil](https://platform-thumbnail-pro.vercel.app/dashboard/profile)
