# 🔍 Guide - Mon Profil N'Apparaît Pas dans Communauté

## 🎯 Problème

Votre profil ne s'affiche pas dans la page `/dashboard/community` alors que vous êtes connecté.

---

## 🔍 Diagnostic

### **Étape 1 : Vérifier dans la Console**

1. Ouvrez la page `/dashboard/community`
2. Appuyez sur **F12** pour ouvrir la console
3. Regardez les logs qui commencent par :
   - `🔍 Utilisateur connecté:` → Votre email et ID
   - `📊 Résultat requête:` → Nombre de membres trouvés
   - `✅ Utilisateur actuel dans la liste:` → `true` ou `false`

**Si vous voyez `⚠️ L'utilisateur actuel n'est pas dans la liste des membres !`**, cela signifie que votre compte existe dans `auth.users` mais pas dans `public.users`.

---

## ✅ Solutions

### **Solution 1 : Vérifier que Votre Compte Existe dans `public.users`**

1. Allez sur Supabase → **Table Editor** → **users**
2. Recherchez votre email dans la table
3. Si vous ne trouvez pas votre compte, passez à la Solution 2

### **Solution 2 : Ajouter Votre Compte Manuellement**

**Option A : Via l'Interface Supabase**
1. Table Editor → **users** → **Insert row**
2. Remplissez :
   - `id` : Votre ID utilisateur (trouvable dans auth.users)
   - `email` : Votre email
   - `full_name` : Votre nom (optionnel)
   - `role` : `member`
3. Cliquez sur **Save**

**Option B : Via SQL (Recommandé)**
1. SQL Editor → New query
2. Exécutez ce script (remplacez `VOTRE_EMAIL@example.com` par votre email) :

```sql
-- Trouver votre ID utilisateur
SELECT id, email FROM auth.users WHERE email = 'VOTRE_EMAIL@example.com';

-- Puis insérer dans public.users (remplacez l'ID)
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', '') as full_name,
  'member' as role
FROM auth.users
WHERE email = 'VOTRE_EMAIL@example.com'
ON CONFLICT (id) DO NOTHING;
```

### **Solution 3 : Vérifier les Politiques RLS**

Si RLS (Row Level Security) est activé et bloque la lecture :

1. SQL Editor → New query
2. Exécutez :

```sql
-- Vérifier si RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- Si RLS est activé, créer une politique pour permettre la lecture
CREATE POLICY IF NOT EXISTS "Authenticated users can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (true);
```

---

## 🛠️ Script de Diagnostic Complet

Pour diagnostiquer rapidement, exécutez `supabase-fix-user-in-community.sql` dans Supabase SQL Editor.

Ce script va :
1. ✅ Lister tous les utilisateurs dans `auth.users`
2. ✅ Lister tous les utilisateurs dans `public.users`
3. ✅ Trouver les utilisateurs manquants
4. ✅ Vérifier les politiques RLS

---

## 📋 Checklist de Vérification

- [ ] Votre compte existe dans `auth.users` (Supabase → Authentication → Users)
- [ ] Votre compte existe dans `public.users` (Supabase → Table Editor → users)
- [ ] Les politiques RLS permettent la lecture (si RLS est activé)
- [ ] Pas d'erreurs dans la console du navigateur (F12)
- [ ] Le nombre de membres affiché correspond au nombre dans la table

---

## 🎯 Cause Probable

Le problème vient probablement du fait que :
- ✅ Vous êtes inscrit dans `auth.users` (authentification Supabase)
- ❌ Mais votre profil n'a pas été créé dans `public.users` (table de la plateforme)

**Cela peut arriver si :**
- Le trigger automatique n'a pas fonctionné lors de l'inscription
- Vous avez créé le compte avant que le trigger soit configuré
- Il y a eu une erreur lors de la création du profil

---

## ✅ Solution Rapide

Exécutez ce script SQL pour créer automatiquement les profils manquants :

```sql
-- Créer les profils manquants pour tous les utilisateurs auth
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  'member' as role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

Après avoir exécuté ce script, rechargez la page `/dashboard/community` et votre profil devrait apparaître ! 🎉
