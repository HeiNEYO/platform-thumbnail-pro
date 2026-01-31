# Supabase Table Editor : quoi cliquer exactement

Tes tables existent déjà (users, modules, episodes, progress, resources, announcements). Le centre est vide parce qu’aucune table n’est ouverte. Voici quoi faire.

---

## Voir le contenu d’une table (ex. users)

1. **Restez sur la page Table Editor** (celle où vous êtes).
2. **Dans la liste à GAUCHE**, sous « schema public », vous voyez les noms des tables.
3. **Cliquez une fois sur le mot `users`** (pas sur « New table », pas sur « Create a table »).
4. **Le panneau de droite** va afficher la table `users` : colonnes (id, email, full_name, role, etc.) et les lignes (les comptes créés). Si personne ne s’est encore inscrit, la liste des lignes sera vide, mais les colonnes s’affichent.

Pour voir les autres tables : cliquez sur **modules**, **episodes**, **progress**, **resources** ou **announcements** dans la même liste à gauche.

---

## Vérifier que la connexion depuis l’app fonctionne

1. **Correction RLS (récursion)**  
   Si vous ne l’avez pas encore fait :  
   Supabase → **SQL Editor** (menu de gauche) → **+ New query** → coller **tout** le contenu du fichier **`fix-recursion-connexion.sql`** → **Run**. Attendre « Success ».

2. **Créer un compte dans l’app**  
   Lancer l’app (`npm run dev`), aller sur la page **Inscription**, créer un compte (email + mot de passe).

3. **Vérifier dans Supabase**  
   Table Editor → cliquer sur **users** (à gauche) → une nouvelle ligne doit apparaître avec cet email et `role = member`.

4. **Se connecter dans l’app**  
   Page Connexion → même email et mot de passe → la connexion doit fonctionner.

5. **Optionnel : passer ce compte en admin**  
   Supabase → SQL Editor → New query → exécuter :  
   `UPDATE public.users SET role = 'admin' WHERE email = 'VOTRE_EMAIL';`  
   (remplacer `VOTRE_EMAIL` par l’email utilisé à l’inscription.)
