# 🚀 Instructions de Setup - Plateforme Thumbnail Pro

## ✅ ÉTAPE 1 : Exécuter le SQL dans Supabase (5 minutes)

1. Ouvrez votre **Dashboard Supabase** : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (menu de gauche)
4. Cliquez sur **New query**
5. Ouvrez le fichier `supabase-setup.sql` dans ce projet
6. **Copiez tout le contenu** et collez-le dans l'éditeur SQL
7. Cliquez sur **Run** (ou F5)
8. Vérifiez qu'il n'y a pas d'erreurs

**Ce que ça fait :**
- ✅ Active Row Level Security (RLS) sur toutes les tables
- ✅ Crée les politiques de sécurité
- ✅ Crée les indexes pour la performance
- ✅ Crée un trigger pour créer automatiquement un profil utilisateur

---

## ✅ ÉTAPE 2 : Désactiver le mode dev (1 minute)

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Changez cette ligne :
   ```env
   NEXT_PUBLIC_DEV_MODE=false
   ```
3. Redémarrez le serveur de développement :
   ```bash
   npm run dev
   ```

---

## ✅ ÉTAPE 3 : Tester l'authentification (2 minutes)

1. Allez sur `http://localhost:3000/register`
2. Créez un compte de test :
   - Nom : Test User
   - Email : test@example.com
   - Mot de passe : test123456
3. Cliquez sur "Créer mon compte"
4. Vous serez redirigé vers `/login`
5. Connectez-vous avec les mêmes identifiants
6. Vous devriez arriver sur `/dashboard`

**✅ Si ça fonctionne :** L'authentification Supabase est configurée !

---

## ✅ ÉTAPE 4 : Créer votre premier module (Admin)

### Option A : Via Supabase Dashboard (Rapide)

1. Allez dans **Table Editor** > `modules`
2. Cliquez sur **Insert** > **Insert row**
3. Remplissez :
   - `title` : "Introduction au Graphisme"
   - `description` : "Découvrez les bases du graphisme"
   - `order_index` : 1
   - `duration_estimate` : "2h 30min"
4. Cliquez sur **Save**

### Option B : Via SQL (Plus rapide pour plusieurs)

```sql
INSERT INTO modules (title, description, order_index, duration_estimate)
VALUES 
  ('Introduction au Graphisme', 'Découvrez les bases du graphisme', 1, '2h 30min'),
  ('Photoshop Avancé', 'Maîtrisez les techniques avancées de Photoshop', 2, '4h 15min'),
  ('Illustrator pour Débutants', 'Apprenez à créer des illustrations vectorielles', 3, '3h 00min');
```

---

## ✅ ÉTAPE 5 : Créer des épisodes (Vidéos)

### Via SQL (Recommandé)

```sql
-- Remplacer 'VOTRE_MODULE_ID' par l'ID du module créé à l'étape 4
-- Pour trouver l'ID : Table Editor > modules > copier l'ID de la première ligne

INSERT INTO episodes (module_id, title, duration, order_index, video_url)
VALUES 
  ('VOTRE_MODULE_ID', 'Bienvenue dans la formation', '5:00', 1, 'https://vimeo.com/VIDEO_ID'),
  ('VOTRE_MODULE_ID', 'Les outils essentiels', '12:30', 2, 'https://vimeo.com/VIDEO_ID'),
  ('VOTRE_MODULE_ID', 'Premier projet pratique', '18:45', 3, 'https://vimeo.com/VIDEO_ID');
```

**Note :** Pour l'instant, mettez une URL de test dans `video_url`. On intégrera Cloudflare Stream ou Vimeo ensuite.

---

## ✅ ÉTAPE 6 : Promouvoir un utilisateur Admin

Pour créer un compte admin :

```sql
-- Remplacer 'EMAIL_DE_L_ADMIN' par l'email de votre compte
UPDATE users 
SET role = 'admin' 
WHERE email = 'EMAIL_DE_L_ADMIN';
```

---

## 🎯 Checklist de Vérification

- [ ] SQL exécuté sans erreurs dans Supabase
- [ ] `NEXT_PUBLIC_DEV_MODE=false` dans `.env.local`
- [ ] Serveur redémarré
- [ ] Compte créé avec succès
- [ ] Connexion fonctionne
- [ ] Dashboard s'affiche
- [ ] Au moins 1 module créé
- [ ] Au moins 1 épisode créé
- [ ] Page `/dashboard/modules` affiche le module
- [ ] Page détail module affiche les épisodes

---

## 🐛 Problèmes Courants

### Erreur "Row Level Security policy violation"
**Solution :** Vérifiez que vous avez bien exécuté le fichier `supabase-setup.sql`

### Erreur "User not found in users table"
**Solution :** Le trigger SQL devrait créer automatiquement le profil. Vérifiez dans Table Editor > users

### Page blanche après connexion
**Solution :** Vérifiez la console du navigateur (F12) pour voir les erreurs

### "Missing NEXT_PUBLIC_SUPABASE_URL"
**Solution :** Vérifiez que `.env.local` contient bien les variables Supabase

---

## 📞 Prochaines Étapes

Une fois que tout fonctionne :

1. **Intégrer Cloudflare Stream** pour les vidéos (voir ARCHITECTURE.md)
2. **Créer plus de contenu** (modules et épisodes)
3. **Personnaliser le design** si besoin
4. **Ajouter des ressources** dans la table `resources`
5. **Créer des annonces** dans la table `announcements`

---

## 🎉 Félicitations !

Votre plateforme est maintenant fonctionnelle avec :
- ✅ Authentification Supabase
- ✅ Protection des routes (RLS)
- ✅ Dashboard avec progression
- ✅ Liste des modules
- ✅ Détail des modules avec épisodes
- ✅ Système de progression

**Temps total estimé : 10-15 minutes** ⚡
