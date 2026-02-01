# 📋 Ajout des Champs Communauté dans Supabase

## 🎯 Objectif

Ajouter les champs nécessaires pour afficher les membres de la communauté avec leurs informations Twitter, Discord et score.

---

## 📝 Étapes à Suivre

### **1. Ouvrir Supabase SQL Editor**

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Dans le menu de gauche, cliquez sur **"SQL Editor"**
4. Cliquez sur **"+ New query"**

### **2. Exécuter le Script SQL**

1. Ouvrez le fichier `supabase-add-community-fields.sql` dans votre projet
2. Copiez tout le contenu (Ctrl+A puis Ctrl+C)
3. Collez-le dans l'éditeur SQL de Supabase (Ctrl+V)
4. Cliquez sur **"Run"** (en bas à droite)
5. Attendez le message **"Success"**

### **3. Vérifier les Colonnes**

1. Allez dans **"Table Editor"** dans le menu de gauche
2. Sélectionnez la table **"users"**
3. Vous devriez voir les nouvelles colonnes :
   - `twitter_handle` (text, nullable)
   - `discord_tag` (text, nullable)
   - `community_score` (int, default: 0)

---

## 📊 Structure des Champs

| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `twitter_handle` | text (nullable) | Handle Twitter de l'utilisateur | `@username` ou `username` |
| `discord_tag` | text (nullable) | Tag Discord de l'utilisateur | `username#1234` |
| `community_score` | int (default: 0) | Score communautaire basé sur l'engagement | `150` |

---

## 🔧 Mise à Jour des Données

### **Mettre à jour un utilisateur manuellement :**

```sql
-- Exemple : Mettre à jour les infos d'un utilisateur
UPDATE public.users 
SET 
  twitter_handle = '@monhandle',
  discord_tag = 'MonPseudo#1234',
  community_score = 100
WHERE email = 'user@example.com';
```

### **Mettre à jour via l'interface Supabase :**

1. Allez dans **"Table Editor"** → **"users"**
2. Cliquez sur une ligne pour l'éditer
3. Remplissez les champs :
   - `twitter_handle`
   - `discord_tag`
   - `community_score`
4. Cliquez sur **"Save"**

---

## ✅ Vérification

Une fois les champs ajoutés, la page `/dashboard/community` affichera automatiquement tous les membres avec :
- ✅ Leur pseudo (full_name ou email)
- ✅ Leur photo de profil (avatar_url)
- ✅ Leur score communautaire
- ✅ Leur Twitter (si renseigné)
- ✅ Leur Discord (si renseigné)

Les membres sont triés par score décroissant.

---

## 🎨 Design de la Carte

Chaque membre est affiché dans une carte avec :
- **En-tête** : Identifiant du score (ex: SCORE-150) + Pseudo
- **Avatar** : Photo de profil à droite
- **Footer** : Icônes Twitter et Discord avec les handles/tags

---

## 📝 Notes

- Les champs `twitter_handle` et `discord_tag` sont optionnels (peuvent être NULL)
- Le `community_score` a une valeur par défaut de 0
- Un index a été créé sur `community_score` pour optimiser le tri
- Les membres sans Twitter/Discord affichent "—" à la place

---

**C'est tout ! Une fois le script SQL exécuté, la page communauté fonctionnera automatiquement.** 🎉
