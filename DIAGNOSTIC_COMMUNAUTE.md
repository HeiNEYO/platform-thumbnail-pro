# 🔍 Diagnostic - Page Communauté Vide

## 🎯 Problème

La page `/dashboard/community` n'affiche aucune carte de membre.

---

## ✅ Solutions par Ordre de Priorité

### **1. Vérifier que les Colonnes Existent dans Supabase**

Les colonnes `twitter_handle`, `discord_tag` et `community_score` doivent exister dans la table `users`.

**Vérification :**
1. Allez sur Supabase → **Table Editor** → **users**
2. Vérifiez les colonnes en haut du tableau
3. Vous devez voir :
   - `twitter_handle` (text, nullable)
   - `discord_tag` (text, nullable)
   - `community_score` (int, default: 0)

**Si les colonnes n'existent pas :**
1. Allez dans **SQL Editor** → **New query**
2. Ouvrez `supabase-add-community-fields.sql`
3. Copiez et exécutez le script
4. Rechargez la page communauté

---

### **2. Vérifier qu'il y a des Utilisateurs dans la Table**

**Vérification :**
1. Supabase → **Table Editor** → **users**
2. Vérifiez qu'il y a au moins une ligne

**Si la table est vide :**
- Créez un compte via `/register`
- Ou ajoutez manuellement un utilisateur dans Supabase

---

### **3. Vérifier les Politiques RLS (Row Level Security)**

Si RLS est activé, vérifiez que les politiques permettent la lecture :

**Vérification :**
1. Supabase → **Authentication** → **Policies**
2. Table `users`
3. Vérifiez qu'il y a une politique SELECT pour les utilisateurs authentifiés

**Si besoin, créer une politique :**
```sql
-- Permettre à tous les utilisateurs authentifiés de voir les autres utilisateurs
CREATE POLICY "Users can view other users"
ON public.users
FOR SELECT
TO authenticated
USING (true);
```

---

### **4. Vérifier les Logs dans la Console**

Ouvrez la console du navigateur (F12) et vérifiez :
- Des erreurs JavaScript
- Des erreurs de requête Supabase
- Des messages de debug

---

### **5. Tester en Mode Développement**

Si vous êtes en mode dev (`NEXT_PUBLIC_DEV_MODE=true`), la page affiche un message spécifique.

**Vérification :**
- Vérifiez votre fichier `.env.local`
- Assurez-vous que `NEXT_PUBLIC_DEV_MODE=false` en production

---

## 🛠️ Solution Rapide

Si rien ne fonctionne, exécutez ce script SQL dans Supabase pour tout vérifier :

```sql
-- 1. Vérifier que les colonnes existent
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('twitter_handle', 'discord_tag', 'community_score');

-- 2. Compter les utilisateurs
SELECT COUNT(*) as total_users FROM public.users;

-- 3. Voir les utilisateurs
SELECT id, email, full_name, avatar_url, twitter_handle, discord_tag, community_score 
FROM public.users 
LIMIT 10;
```

---

## 📋 Checklist de Diagnostic

- [ ] Les colonnes `twitter_handle`, `discord_tag`, `community_score` existent
- [ ] Il y a au moins un utilisateur dans la table `users`
- [ ] Les politiques RLS permettent la lecture (si RLS est activé)
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Le mode dev est désactivé en production
- [ ] Les variables d'environnement Supabase sont correctes

---

## 🎯 Code Amélioré

Le code a été amélioré pour :
- ✅ Gérer le cas où les colonnes n'existent pas encore (fallback)
- ✅ Afficher un message d'aide en développement
- ✅ Afficher le nombre de membres trouvés
- ✅ Gérer les erreurs silencieusement

---

**Si le problème persiste après ces vérifications, consultez les logs Supabase dans le dashboard pour plus de détails.**
