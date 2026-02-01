# 📸 Configuration Supabase Storage pour les Avatars

## 🎯 Objectif

Configurer Supabase Storage pour permettre aux utilisateurs d'uploader leur photo de profil.

---

## 📝 Étapes à Suivre

### **1. Créer le Bucket "avatars"**

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Dans le menu de gauche, cliquez sur **"Storage"**
4. Cliquez sur **"Create bucket"**
5. Configurez le bucket :
   - **Name** : `avatars`
   - **Public bucket** : ✅ **OUI** (coché)
   - **File size limit** : `4 MB`
   - **Allowed MIME types** : `image/*`
6. Cliquez sur **"Create bucket"**

### **2. Exécuter le Script SQL pour les Politiques**

1. Allez dans **"SQL Editor"** → **"+ New query"**
2. Ouvrez le fichier `supabase-storage-avatars.sql` dans votre projet
3. Copiez tout le contenu (Ctrl+A puis Ctrl+C)
4. Collez-le dans l'éditeur SQL de Supabase (Ctrl+V)
5. Cliquez sur **"Run"** (en bas à droite)
6. Attendez le message **"Success"**

---

## ✅ Vérification

Une fois configuré :

1. ✅ Le bucket `avatars` existe dans Storage
2. ✅ Les utilisateurs peuvent uploader leur photo (max 4MB)
3. ✅ Les photos sont accessibles publiquement
4. ✅ Chaque utilisateur ne peut modifier que sa propre photo

---

## 🎨 Utilisation dans l'Application

Dans la page profil (`/dashboard/profile`) :
- ✅ Cliquez sur la photo pour la modifier
- ✅ Sélectionnez une image (max 4MB)
- ✅ L'image est automatiquement uploadée vers Supabase Storage
- ✅ L'URL est sauvegardée dans la table `users.avatar_url`
- ✅ La photo apparaît immédiatement dans le profil et la communauté

---

## 📊 Structure des Fichiers

Les avatars sont stockés dans :
```
avatars/
  └── {user_id}-{timestamp}.{extension}
```

Exemple : `avatars/123e4567-e89b-12d3-a456-426614174000-1704067200000.jpg`

---

## 🔒 Sécurité

- ✅ Seuls les utilisateurs authentifiés peuvent uploader
- ✅ Chaque utilisateur ne peut modifier que ses propres fichiers
- ✅ Les fichiers sont publics en lecture (pour affichage)
- ✅ Limite de taille : 4MB
- ✅ Types acceptés : images uniquement

---

**C'est tout ! Une fois le bucket créé et les politiques appliquées, l'upload de photos fonctionnera automatiquement.** 🎉
