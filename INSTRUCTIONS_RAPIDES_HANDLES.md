# ⚡ Instructions Rapides - Ajouter les Colonnes Discord/X

## 🎯 Problème
L'erreur indique : "Les colonnes Discord/X n'existent pas encore"

## ✅ Solution en 3 Étapes (2 minutes)

### **Étape 1 : Ouvrir Supabase**
1. Allez sur https://supabase.com
2. Connectez-vous
3. Sélectionnez votre projet

### **Étape 2 : Exécuter le Script SQL**
1. Cliquez sur **SQL Editor** dans le menu de gauche
2. Cliquez sur **New query** (ou `+ New query`)
3. Ouvrez le fichier **`supabase-add-handles-simple.sql`** dans votre projet
4. **Copiez TOUT le contenu** (Ctrl+A puis Ctrl+C)
5. **Collez-le** dans Supabase (Ctrl+V)
6. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter`)

### **Étape 3 : Vérifier**
1. Dans les résultats, vous devriez voir 2 lignes :
   - `twitter_handle`
   - `discord_tag`
2. Si c'est le cas, ✅ **C'est bon !**

---

## 🔄 Après avoir exécuté le script

1. **Rechargez la page** `/dashboard/profile`
2. **Remplissez** les champs Discord et X
3. **Sauvegardez** → Ça devrait fonctionner maintenant !
4. **Vérifiez** dans `/dashboard/community` que vos handles s'affichent

---

## 🆘 Si ça ne marche toujours pas

1. Vérifiez dans **Table Editor** → **users** que les colonnes apparaissent
2. Si elles n'apparaissent pas, réexécutez le script SQL
3. Vérifiez la console du navigateur (F12) pour d'autres erreurs

---

## 📝 Script SQL (à copier-coller)

```sql
-- Ajouter twitter_handle
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS twitter_handle TEXT;

-- Ajouter discord_tag  
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS discord_tag TEXT;

-- Vérification
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('twitter_handle', 'discord_tag');
```

**C'est tout !** 🎉
