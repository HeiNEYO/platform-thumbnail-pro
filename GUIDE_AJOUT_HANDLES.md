# 🔧 Guide - Ajout des Handles Discord/X

## 🚨 Problème

Les handles Discord et X ne se sauvegardent pas et ne s'affichent pas dans la communauté.

## ✅ Solution

### **Étape 1 : Créer les colonnes dans Supabase**

1. Allez sur votre projet Supabase
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Cliquez sur **New query**
4. Copiez-collez le contenu du fichier **`supabase-add-social-handles.sql`**
5. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter`)

Ce script va :
- ✅ Créer la colonne `twitter_handle` dans la table `users`
- ✅ Créer la colonne `discord_tag` dans la table `users`
- ✅ Créer des index pour améliorer les performances
- ✅ Vérifier que les colonnes ont été créées

### **Étape 2 : Vérifier que les colonnes existent**

Après avoir exécuté le script, vérifiez dans **Table Editor** → **users** que les colonnes `twitter_handle` et `discord_tag` apparaissent.

### **Étape 3 : Tester la sauvegarde**

1. Allez sur `/dashboard/profile`
2. Remplissez les champs Discord et X
3. Cliquez sur **Enregistrer les modifications**
4. Vérifiez que le message de succès s'affiche

### **Étape 4 : Vérifier l'affichage dans la communauté**

1. Allez sur `/dashboard/community`
2. Vérifiez que vos handles Discord/X s'affichent avec "@" devant

---

## 🔍 Diagnostic

Si ça ne fonctionne toujours pas :

1. **Vérifier les colonnes dans Supabase :**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'users' 
   AND column_name IN ('twitter_handle', 'discord_tag');
   ```

2. **Vérifier les données sauvegardées :**
   ```sql
   SELECT id, email, twitter_handle, discord_tag 
   FROM public.users 
   WHERE twitter_handle IS NOT NULL OR discord_tag IS NOT NULL;
   ```

3. **Vérifier la console du navigateur (F12)** pour voir les erreurs éventuelles

---

## 📝 Notes

- Les colonnes doivent être de type `TEXT` et peuvent être `NULL`
- Le script vérifie si les colonnes existent avant de les créer (pas d'erreur si elles existent déjà)
- Les handles sont sauvegardés sans le "@" (il est ajouté visuellement dans l'interface)
