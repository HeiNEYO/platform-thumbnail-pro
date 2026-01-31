# Guide Supabase – Instructions précises

Ce guide indique **exactement** quoi faire dans Supabase pour que l’inscription (Membre/Admin) et l’app fonctionnent.

---

## Étape 1 : Ouvrir le projet Supabase

1. Va sur **https://supabase.com** et connecte-toi.
2. Clique sur ton **projet** (celui dont l’URL est dans ton `.env.local`, ex. `zhdlqmkpdsygszrxjezd.supabase.co`).
3. Dans le menu de gauche, tu dois voir : **Table Editor**, **SQL Editor**, **Authentication**, etc.

---

## Étape 2 : Ouvrir le SQL Editor

1. Dans le menu de gauche, clique sur **SQL Editor** (icône de curseur/code).
2. En haut à droite, clique sur le bouton **+ New query** (ou « New query »).
3. Une grande zone de texte vide s’ouvre : c’est là que tu colleras le code SQL.

**Tu ne touches à rien d’autre** : pas besoin d’aller dans Table Editor ni dans Authentication pour cette partie.

---

## Étape 3 : Coller le code SQL

1. Ouvre le fichier **`supabase-complet.sql`** à la racine du projet (dans Cursor ou un éditeur de texte).
2. Sélectionne **tout** le contenu du fichier (Ctrl+A).
3. Copie (Ctrl+C).
4. Reviens dans Supabase, dans la zone de texte du **SQL Editor**.
5. Colle le code (Ctrl+V).

**Important :** Ne modifie rien dans le code pour l’instant. Tu l’exécutes tel quel la première fois.

---

## Étape 4 : Exécuter le code

1. En bas à droite de la zone SQL, clique sur le bouton **Run** (ou **Ctrl+Enter**).
2. Attends quelques secondes.
3. En bas, tu dois voir un message du type **Success** ou **Success. No rows returned**.  
   Si tu vois une erreur en rouge, note le message exact (voir section Dépannage plus bas).

**Une seule exécution suffit.** Ce script crée les tables si elles n’existent pas, ajoute les politiques RLS, les index et le trigger. Tu n’as pas besoin de lancer d’autres requêtes pour la base « de base ».

---

## Étape 5 : Vérifier que les tables existent (optionnel)

1. Dans le menu de gauche, clique sur **Table Editor**.
2. Tu dois voir les tables : **users**, **modules**, **episodes**, **progress**, **resources**, **announcements**.
3. Clique sur **users** : les colonnes doivent être **id**, **email**, **full_name**, **avatar_url**, **role**, **created_at**, **updated_at**.  
   Si c’est le cas, le schéma est bon.

**Tu n’as rien à modifier ici** ; c’est juste pour vérifier.

---

## Étape 6 : Créer ton premier compte Admin

Par défaut, **toute inscription** crée un compte **Membre**. Pour avoir un **Admin**, tu dois soit t’inscrire d’abord, soit utiliser un compte déjà inscrit, puis le promouvoir en admin **dans Supabase**.

### 6.1 S’inscrire dans ton app (ou avoir déjà un compte)

1. Lance ton app (ex. `npm run dev`).
2. Va sur la page **Inscription** (register).
3. Inscris-toi avec l’email que tu veux utiliser comme **admin** (ex. `admin@mondomaine.com`).  
   Ce compte sera d’abord créé comme **Membre**.

### 6.2 Promouvoir ce compte en Admin dans Supabase

1. Retourne dans Supabase → **SQL Editor** → **+ New query**.
2. Colle **uniquement** cette ligne (en remplaçant l’email par le tien) :

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@mondomaine.com';
```

3. Remplace **`admin@mondomaine.com`** par **l’email exact** que tu as utilisé pour t’inscrire (sensible à la casse, pas d’espace).
4. Clique sur **Run**.

**Ce que tu as touché :** uniquement la partie entre guillemets : ton adresse email. Rien d’autre dans le projet ou dans Supabase.

Après ça, ce compte a le rôle **admin** : il a tous les droits Membre + ceux admin (voir tous les users, gérer modules/épisodes/ressources/annonces, etc.).

---

## Récapitulatif – Ce que tu touches

| Où | Quoi toucher |
|----|----------------|
| **Supabase → SQL Editor** | Coller tout le fichier `supabase-complet.sql` puis **Run** (rien à modifier dans le code). |
| **Supabase → SQL Editor** (2e requête) | Une seule ligne : `UPDATE public.users SET role = 'admin' WHERE email = 'TON_EMAIL';` → remplacer `TON_EMAIL` par ton email. |

Ensuite, dans ton app, tu n’as rien à changer : elle lit déjà le rôle depuis `public.users`. Un compte avec `role = 'admin'` aura les droits admin, les autres restent membres.

---

## Dépannage

- **« relation "users" does not exist »**  
  Les tables n’ont pas été créées. Vérifie que tu as bien exécuté **tout** le fichier `supabase-complet.sql` (depuis le début jusqu’à la fin) dans une seule requête.

- **« relation "modules" does not exist »** (ou episodes, progress, etc.)  
  Même chose : réexécute **tout** `supabase-complet.sql` une fois. Le script utilise `CREATE TABLE IF NOT EXISTS`, donc tu peux le relancer sans supprimer les données des tables déjà créées.

- **« duplicate key value violates unique constraint » sur users**  
  Le trigger a déjà créé la ligne pour cet utilisateur. Normal si tu t’es inscrit. Pour le promouvoir en admin, utilise uniquement la requête `UPDATE public.users SET role = 'admin' WHERE email = '...';`.

- **L’app ne voit pas le rôle admin**  
  Vérifie que dans ton app tu es bien connecté avec le compte dont tu as mis `role = 'admin'` dans `public.users`. Déconnecte-toi puis reconnecte-toi pour recharger le profil.

---

## Fichiers concernés

- **`supabase-complet.sql`** : tout le code à exécuter une fois dans Supabase (tables, trigger, RLS, index).
- **`.env.local`** : contient l’URL Supabase et la clé anon ; ne pas les modifier pour ce guide.
- **Aucun fichier du code source** à modifier pour que « Membre / Admin » fonctionne, à part si tu ajoutes plus tard des onglets ou sections réservés aux admins.
