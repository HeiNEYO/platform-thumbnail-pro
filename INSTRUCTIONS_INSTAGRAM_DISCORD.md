# Instructions : Ajout de Discord et Instagram sur les cards de profil

## ✅ Modifications effectuées dans le code

1. **Composant InstagramIcon** créé (`src/components/ui/InstagramIcon.tsx`)
2. **MemberCard** mis à jour pour afficher Discord et Instagram (au lieu de Twitter)
3. **Formulaire de profil** mis à jour pour permettre la saisie de Discord et Instagram
4. **Types TypeScript** mis à jour pour inclure `instagram_handle`
5. **Pages de profil** mises à jour pour afficher Discord et Instagram

## 📋 Script SQL à exécuter dans Supabase

### Étape 1 : Ajouter la colonne Instagram

Exécutez le script suivant dans l'**éditeur SQL de Supabase** :

```sql
-- Script SQL pour ajouter la colonne instagram_handle à la table users
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter la colonne instagram_handle si elle n'existe pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'instagram_handle'
  ) THEN
    ALTER TABLE public.users 
    ADD COLUMN instagram_handle TEXT;
    
    -- Ajouter un commentaire pour documenter la colonne
    COMMENT ON COLUMN public.users.instagram_handle IS 'Nom d''utilisateur Instagram de l''utilisateur (sans le @)';
  END IF;
END $$;

-- Vérifier que la colonne a été créée
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users' 
  AND column_name = 'instagram_handle';
```

**Fichier disponible :** `supabase-add-instagram-handle.sql`

### Étape 2 : Vérifier les colonnes existantes

Pour vérifier que toutes les colonnes nécessaires existent :

```sql
-- Vérifier les colonnes Discord et Instagram
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users' 
  AND column_name IN ('discord_tag', 'instagram_handle')
ORDER BY column_name;
```

## 🎯 Fonctionnalités

### Sur les cards de la communauté
- **Discord** : Affiche le tag Discord si rempli (avec icône et lien cliquable)
- **Instagram** : Affiche le handle Instagram si rempli (avec icône et lien cliquable)
- Les deux apparaissent uniquement si l'utilisateur les a remplis dans son profil

### Dans le formulaire de profil
- Champ **@ Discord** : Pour saisir le tag Discord (ex: username#1234)
- Champ **@ Instagram** : Pour saisir le handle Instagram (ex: username)
- Le "@" est pré-rempli visuellement
- Les handles sont sauvegardés sans le "@" dans la base de données

## 🔧 Désactivation du mode dev

Pour désactiver le mode dev, assurez-vous que dans vos variables d'environnement (Vercel ou `.env.local`) :

```
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_DEMO_MODE=false
```

## 📝 Notes importantes

1. **Twitter/X a été retiré** : Seuls Discord et Instagram sont maintenant affichés sur les cards
2. **Compatibilité** : Le code gère gracieusement l'absence des colonnes (message d'erreur clair si elles n'existent pas)
3. **Nettoyage automatique** : Les handles sont automatiquement nettoyés (suppression du "@" en début, trim des espaces)
4. **Affichage conditionnel** : Les icônes Discord et Instagram n'apparaissent que si les handles sont remplis

## 🚀 Déploiement

Après avoir exécuté le script SQL dans Supabase :

1. Commitez les changements :
   ```bash
   git add .
   git commit -m "Ajout Discord et Instagram sur les cards de profil"
   git push origin main
   ```

2. Vérifiez le déploiement sur Vercel

3. Testez en remplissant Discord et Instagram dans votre profil, puis vérifiez qu'ils apparaissent sur votre card dans la section Communauté
