# 📋 Guide : Création de Comptes Membre & Admin

## ✅ Mode Dev Désactivé

Le mode développement est **désactivé** dans votre projet (`NEXT_PUBLIC_DEV_MODE=false`). L'authentification Supabase est maintenant active.

---

## 🚀 Script SQL Supabase

Le fichier **`supabase-comptes-membre-admin.sql`** contient tout le code nécessaire pour configurer les comptes Membre et Admin dans Supabase.

### 📝 Ce que fait le script :

1. ✅ **Crée la table `users`** avec toutes les colonnes nécessaires :
   - Informations de base (id, email, full_name, avatar_url)
   - Rôle (member, admin, intervenant)
   - Réseaux sociaux (twitter_handle, discord_tag)
   - Score communautaire (community_score)

2. ✅ **Crée automatiquement un compte Membre** à chaque inscription :
   - Quand un utilisateur s'inscrit via l'interface, un profil est automatiquement créé avec `role = 'member'`

3. ✅ **Configure la sécurité RLS** :
   - Les membres peuvent voir et modifier leur propre profil
   - Les membres peuvent voir tous les profils (pour la communauté)
   - Les admins ont accès à tous les utilisateurs

4. ✅ **Ajoute les colonnes manquantes** si elles n'existent pas déjà

---

## 📖 Comment utiliser le script

### Étape 1 : Exécuter le script dans Supabase

1. Ouvrez votre projet **Supabase**
2. Allez dans **SQL Editor** (menu de gauche)
3. Cliquez sur **+ New query**
4. Ouvrez le fichier `supabase-comptes-membre-admin.sql`
5. **Copiez tout le contenu** (Ctrl+A puis Ctrl+C)
6. **Collez dans Supabase** (Ctrl+V)
7. Cliquez sur **Run** (bouton en bas à droite)
8. Attendez le message **"Success"**

### Étape 2 : Créer un compte Membre

#### Option A : Via l'inscription sur votre site (recommandé)

1. Allez sur votre site : `https://votre-site.vercel.app/register`
2. Remplissez le formulaire d'inscription :
   - Nom complet
   - Email
   - Mot de passe (minimum 6 caractères)
3. Cliquez sur **"S'inscrire"**
4. ✅ Le compte est automatiquement créé avec `role = 'member'`

#### Option B : Via l'interface Supabase Auth

1. Dans Supabase, allez dans **Authentication** > **Users**
2. Cliquez sur **Add user** > **Create new user**
3. Remplissez :
   - **Email** : `membre@exemple.com`
   - **Password** : (générez un mot de passe sécurisé)
   - **Auto Confirm User** : ✅ (cochez cette case)
4. Cliquez sur **Create user**
5. ✅ Le profil est automatiquement créé dans `public.users` avec `role = 'member'`

### Étape 3 : Créer un compte Admin

#### Option 1 : Promouvoir un membre existant en admin

1. Dans Supabase, allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Exécutez cette commande en remplaçant `email@exemple.com` par l'email du compte à promouvoir :

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'email@exemple.com';
```

#### Option 2 : Créer directement un admin

1. Créez d'abord l'utilisateur dans **Authentication** > **Users** (comme pour un membre)
2. Dans **SQL Editor**, exécutez :

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@exemple.com';
```

---

## 🎯 Interfaces et Fonctionnalités

### 👤 Compte Membre

**Interface Membre** (accessible automatiquement) :
- ✅ Dashboard personnel
- ✅ Formation (modules, épisodes)
- ✅ Progression personnelle
- ✅ Profil (modification nom, photo, Twitter, Discord)
- ✅ Communauté (voir tous les membres)
- ✅ Favoris (épisodes, ressources)
- ✅ Notes (notes personnelles sur les épisodes)
- ✅ Ressources
- ✅ Statistiques personnelles

### 👑 Compte Admin

**Interface Admin** (tous les avantages Membre + sections supplémentaires à ajouter) :
- ✅ **Tous les avantages du compte Membre** +
- ✅ Gestion des utilisateurs (voir tous, modifier rôles)
- ✅ Gestion du contenu (modules, épisodes, ressources)
- ✅ Modération de la communauté
- ✅ Statistiques globales
- ✅ Gestion des annonces

---

## 🔒 Sécurité (RLS)

Le script configure automatiquement les politiques de sécurité :

- **Membres** : peuvent voir et modifier leur propre profil, voir tous les profils (communauté)
- **Admins** : peuvent voir et gérer tous les utilisateurs

---

## ✅ Vérification

Après avoir exécuté le script, vérifiez que tout fonctionne :

1. **Vérifiez la table `users`** :
   - Dans Supabase, allez dans **Table Editor** > **users**
   - Vous devriez voir la table avec toutes les colonnes

2. **Testez l'inscription** :
   - Créez un compte via votre site
   - Vérifiez qu'un profil est créé dans `public.users` avec `role = 'member'`

3. **Testez la promotion admin** :
   - Promouvez un compte en admin
   - Vérifiez que le `role` est bien `'admin'` dans la table

---

## 📝 Notes Importantes

- ⚠️ **Ne modifiez jamais directement le rôle dans l'interface Supabase** sans passer par SQL ou une fonction sécurisée
- ✅ **Les nouveaux utilisateurs sont automatiquement des membres** grâce au trigger
- ✅ **Les admins héritent de tous les droits des membres** automatiquement
- 🔒 **La sécurité RLS est activée** pour protéger les données

---

## 🆘 En cas de problème

Si vous rencontrez des erreurs :

1. Vérifiez que vous avez bien exécuté le script complet
2. Vérifiez que la table `users` existe dans **Table Editor**
3. Vérifiez les politiques RLS dans **Authentication** > **Policies**
4. Consultez les logs dans **SQL Editor** > **Logs**

---

**✅ Tout est prêt ! Vous pouvez maintenant créer des comptes Membre et Admin.**
