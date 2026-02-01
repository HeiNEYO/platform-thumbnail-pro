# 🔍 Diagnostic - Handles Discord/X Ne S'Affichent Pas

## ✅ Étapes de Diagnostic

### **Étape 1 : Vérifier que les handles sont sauvegardés dans Supabase**

1. Allez sur Supabase → **SQL Editor**
2. Exécutez le script **`VERIFIER_HANDLES_SUPABASE.sql`**
3. Vérifiez les résultats :
   - Les colonnes `twitter_handle` et `discord_tag` existent-elles ?
   - Y a-t-il des valeurs dans ces colonnes pour votre utilisateur ?

### **Étape 2 : Vérifier dans la Console du Navigateur**

1. Ouvrez la page `/dashboard/community`
2. Appuyez sur **F12** pour ouvrir la console
3. Regardez les logs qui commencent par :
   - `📊 Membres chargés:` → Nombre de membres
   - `👥 Membres avec handles:` → Nombre de membres avec handles
   - `📋 Exemples de handles:` → Exemples de handles chargés
   - `🔍 Données brutes handlesData:` → Données brutes depuis Supabase

**Si vous voyez `👥 Membres avec handles: 0`**, cela signifie que les handles ne sont pas chargés depuis Supabase.

### **Étape 3 : Vérifier la Sauvegarde**

1. Allez sur `/dashboard/profile`
2. Remplissez les champs Discord et X
3. Cliquez sur **Enregistrer les modifications**
4. Vérifiez le message de succès
5. Rechargez la page et vérifiez que les valeurs sont toujours là

### **Étape 4 : Vérifier Directement dans Supabase**

1. Allez sur Supabase → **Table Editor** → **users**
2. Trouvez votre ligne (recherchez votre email)
3. Vérifiez les colonnes `twitter_handle` et `discord_tag`
4. Sont-elles remplies avec vos valeurs ?

---

## 🐛 Problèmes Courants

### **Problème 1 : Les colonnes n'existent pas**
**Solution :** Exécutez `supabase-add-handles-simple.sql` dans Supabase

### **Problème 2 : Les handles sont sauvegardés mais ne s'affichent pas**
**Causes possibles :**
- Les handles sont des chaînes vides (`""`) au lieu de `null`
- Le cache du navigateur
- Les données ne sont pas rechargées

**Solutions :**
1. Videz le cache du navigateur (Ctrl+Shift+R)
2. Vérifiez dans Supabase que les valeurs ne sont pas des chaînes vides
3. Rechargez la page communauté

### **Problème 3 : Les handles s'affichent dans la console mais pas dans l'UI**
**Solution :** Vérifiez que `member.twitter_handle` et `member.discord_tag` ne sont pas `null` ou `undefined` dans le composant `MemberCard`

---

## 🔧 Test Rapide

Exécutez ce script SQL pour voir vos handles :

```sql
SELECT 
  email,
  full_name,
  twitter_handle,
  discord_tag,
  LENGTH(twitter_handle) as twitter_length,
  LENGTH(discord_tag) as discord_length
FROM public.users
WHERE email = 'VOTRE_EMAIL@example.com';
```

Remplacez `VOTRE_EMAIL@example.com` par votre email.

---

## 📝 Checklist de Vérification

- [ ] Les colonnes `twitter_handle` et `discord_tag` existent dans Supabase
- [ ] Les valeurs sont sauvegardées dans Supabase (pas vides, pas null)
- [ ] Le message de succès s'affiche lors de la sauvegarde
- [ ] Les logs dans la console montrent que les handles sont chargés
- [ ] Le cache du navigateur a été vidé
- [ ] La page communauté a été rechargée

---

## 🆘 Si Rien Ne Fonctionne

1. **Vérifiez les logs dans la console** (F12)
2. **Vérifiez les données dans Supabase** (Table Editor)
3. **Exécutez le script de vérification** (`VERIFIER_HANDLES_SUPABASE.sql`)
4. **Partagez les résultats** pour un diagnostic plus approfondi
