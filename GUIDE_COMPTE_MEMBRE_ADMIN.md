# Guide : Création de comptes Membre et Admin

## 📋 Vue d'ensemble

Ce guide explique comment créer deux types de comptes dans votre plateforme :
1. **Compte Membre** : Compte standard avec accès aux fonctionnalités de base
2. **Compte Admin** : Compte avec tous les avantages d'un membre + accès aux sections administratives

## 🎯 Fonctionnalités par type de compte

### Compte Membre
- ✅ Accès à tous les modules de formation
- ✅ Accès à la communauté
- ✅ Profil personnalisable (photo, Discord, Instagram)
- ✅ Statistiques personnelles
- ✅ Favoris et notes
- ✅ Ressources

### Compte Admin
- ✅ **Tous les avantages du compte Membre**
- ✅ Accès aux sections administratives (à ajouter plus tard)
- ✅ Gestion des utilisateurs
- ✅ Gestion du contenu
- ✅ Statistiques globales
- ✅ Modération de la communauté

## 🚀 Étapes de création

### Étape 1 : Exécuter le script SQL complet

1. Ouvrez votre projet Supabase
2. Allez dans **SQL Editor**
3. Copiez-collez le contenu du fichier `supabase-setup-complete.sql`
4. Cliquez sur **Run** pour exécuter le script

Ce script va :
- Créer la table `users` si elle n'existe pas
- Ajouter toutes les colonnes nécessaires (Discord, Instagram, etc.)
- Configurer les politiques de sécurité (RLS)
- Créer les triggers automatiques

### Étape 2 : Créer un compte Membre

#### Option A : Via l'interface Supabase Auth (recommandé)

1. Allez dans **Authentication** > **Users** dans Supabase
2. Cliquez sur **Add user** > **Create new user**
3. Remplissez :
   - **Email** : `membre@example.com`
   - **Password** : (générez un mot de passe sécurisé)
   - **Auto Confirm User** : ✅ (cochez cette case)
4. Cliquez sur **Create user**

Le profil sera automatiquement créé dans `public.users` avec le rôle `member` grâce au trigger.

#### Option B : Via l'inscription sur la plateforme

1. Allez sur votre site : `https://votre-site.vercel.app/register`
2. Remplissez le formulaire d'inscription
3. Le compte sera créé automatiquement avec le rôle `member`

### Étape 3 : Créer un compte Admin

#### Méthode 1 : Promouvoir un membre existant en Admin

1. Créez d'abord un compte membre (voir Étape 2)
2. Dans Supabase, allez dans **SQL Editor**
3. Exécutez cette requête en remplaçant `USER_UUID_ICI` par l'UUID de l'utilisateur :

```sql
-- Trouver l'UUID de l'utilisateur
SELECT id, email, full_name, role 
FROM public.users 
WHERE email = 'admin@example.com';

-- Promouvoir en admin (remplacez l'UUID)
UPDATE public.users
SET role = 'admin'
WHERE id = 'USER_UUID_ICI';
```

#### Méthode 2 : Créer directement un admin

1. Créez l'utilisateur dans **Authentication** > **Users**
2. Notez l'UUID de l'utilisateur créé
3. Dans **SQL Editor**, exécutez :

```sql
-- Mettre à jour le rôle en admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@example.com';
```

## 🔐 Vérifications

### Vérifier qu'un compte est bien créé

```sql
-- Voir tous les utilisateurs avec leur rôle
SELECT 
  id,
  email,
  full_name,
  role,
  discord_tag,
  instagram_handle,
  community_score,
  created_at
FROM public.users
ORDER BY created_at DESC;
```

### Vérifier les rôles

```sql
-- Compter les utilisateurs par rôle
SELECT 
  role,
  COUNT(*) as nombre
FROM public.users
GROUP BY role;
```

## 📝 Notes importantes

1. **Rôles disponibles** :
   - `member` : Membre standard
   - `admin` : Administrateur
   - `intervenant` : Intervenant/Formateur (pour usage futur)

2. **Sécurité** :
   - Les politiques RLS (Row Level Security) sont activées
   - Les membres ne peuvent modifier que leur propre profil
   - Les admins ont accès à tout

3. **Création automatique** :
   - Quand un utilisateur s'inscrit via `/register`, un profil est automatiquement créé dans `public.users` avec le rôle `member`
   - Le trigger `on_auth_user_created` gère cela automatiquement

4. **Promotion en Admin** :
   - Seuls les admins existants peuvent promouvoir d'autres utilisateurs (via l'interface admin à venir)
   - Pour l'instant, utilisez SQL pour promouvoir manuellement

## 🎨 Interface utilisateur

### Différences visuelles

- **Badge de grade** : Chaque utilisateur a un badge coloré selon son rôle :
  - 🔵 **Membre** : Bleu (#82ACFF)
  - 🟢 **Intervenant** : Vert (#82FFBC)
  - 🔴 **Admin** : Rouge (#FF8282)

- **Sections supplémentaires** : Les admins verront des sections supplémentaires dans le dashboard (à implémenter)

## 🚀 Prochaines étapes

1. ✅ Exécuter le script SQL complet
2. ✅ Créer vos premiers comptes membre et admin
3. ⏳ Tester la connexion avec chaque type de compte
4. ⏳ Ajouter les sections administratives pour les admins
5. ⏳ Configurer les permissions spécifiques aux admins

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que le script SQL a bien été exécuté
2. Vérifiez que les triggers sont actifs
3. Vérifiez les politiques RLS dans Supabase
4. Consultez les logs Supabase pour les erreurs
