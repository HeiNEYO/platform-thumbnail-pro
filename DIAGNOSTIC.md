# 🔍 Diagnostic - Problème de connexion Supabase

## ❌ Problème identifié

Le timeout après 10 secondes indique que **Supabase ne répond pas du tout** à la requête `signInWithPassword`. Cela peut venir de plusieurs causes.

## ✅ Ce qui est déjà configuré

- ✅ Fichier `.env.local` existe à la racine
- ✅ Variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont présentes
- ✅ Le code gère maintenant les timeouts correctement

## 🔧 Étapes de diagnostic

### 1. Vérifier que le serveur Next.js est démarré

```powershell
# Dans le terminal, à la racine du projet
npm run dev
```

**Important :** Si tu as modifié `.env.local`, tu DOIS redémarrer le serveur (`Ctrl+C` puis `npm run dev`).

### 2. Tester la connexion Supabase directement

```powershell
# Installer dotenv si nécessaire
npm install dotenv

# Exécuter le script de test
node test-supabase-connection.js
```

Ce script va :
- ✅ Vérifier que les variables sont chargées
- ✅ Tester la connexion à Supabase
- ✅ Identifier le problème exact

### 3. Vérifier dans le navigateur (Console F12)

Ouvre la console (F12) et regarde :
- ✅ Tu devrais voir : `"✅ Variables Supabase chargées"`
- ❌ Si tu vois : `"❌ Variables Supabase manquantes"` → Le serveur n'a pas été redémarré

### 4. Vérifier dans Supabase Dashboard

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet
3. Vérifie que le projet est **actif** (pas suspendu)
4. Va dans **Settings → API** et vérifie :
   - ✅ L'URL correspond à celle dans `.env.local`
   - ✅ La clé `anon public` correspond à `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Vérifier les paramètres CORS dans Supabase

1. Dashboard Supabase → **Settings → API**
2. Section **CORS**
3. Assure-toi que `http://localhost:3000` est dans la liste des origines autorisées
4. Si ce n'est pas le cas, ajoute-le et sauvegarde

### 6. Vérifier que la table `users` existe

1. Dashboard Supabase → **SQL Editor**
2. Exécute cette requête :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';
```

- ✅ Si tu vois `users` → La table existe
- ❌ Si rien → Exécute le fichier `supabase-create-users-table.sql`

## 🚀 Solutions possibles

### Solution 1 : Redémarrer le serveur Next.js

```powershell
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### Solution 2 : Vérifier l'URL Supabase

L'URL dans `.env.local` doit être exactement :
```
NEXT_PUBLIC_SUPABASE_URL=https://zhdlqmkpdsygszrxjezd.supabase.co
```

**Sans** `/rest/v1` à la fin !

### Solution 3 : Vérifier la clé API

Dans Supabase Dashboard → **Settings → API** :
- Copie la clé **`anon public`** (pas `service_role` !)
- Compare avec celle dans `.env.local`

### Solution 4 : Créer la table `users` si elle n'existe pas

```powershell
# Dans Supabase Dashboard → SQL Editor
# Copie-colle le contenu de supabase-create-users-table.sql
# Clique sur "Run"
```

### Solution 5 : Vérifier la connexion internet

Le timeout peut aussi venir d'un problème réseau :
- Teste d'autres sites web
- Vérifie ton firewall/antivirus
- Essaie avec un autre réseau (hotspot mobile)

## 📋 Checklist complète

- [ ] Serveur Next.js redémarré après modification de `.env.local`
- [ ] Variables d'environnement chargées (voir console F12)
- [ ] Projet Supabase actif dans le Dashboard
- [ ] URL Supabase correcte (sans `/rest/v1`)
- [ ] Clé API `anon public` correcte
- [ ] CORS configuré pour `localhost:3000`
- [ ] Table `users` créée dans Supabase
- [ ] Connexion internet fonctionnelle
- [ ] Script de test (`node test-supabase-connection.js`) exécuté

## 🆘 Si rien ne fonctionne

1. **Vérifie les logs du serveur Next.js** dans le terminal où tu as lancé `npm run dev`
2. **Vérifie la console du navigateur** (F12) pour d'autres erreurs
3. **Teste avec un nouveau projet Supabase** pour isoler le problème
4. **Partage les résultats** du script `test-supabase-connection.js`
