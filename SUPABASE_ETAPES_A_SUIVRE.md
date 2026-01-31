# Supabase : étapes pour que les tables apparaissent

Si **Table Editor est vide**, c’est que les **tables n’ont pas encore été créées**. Il faut exécuter **une seule fois** le script qui crée tout.

---

## Fichier à utiliser

- **`supabase-complet.sql`** → c’est lui qui **crée les tables** (users, modules, episodes, progress, resources, announcements) et tout le reste.
- **Ne pas utiliser** `fix-recursion-connexion.sql` seul : il ne crée pas les tables, il corrige seulement les politiques.

---

## Étapes exactes

### 1. Ouvre ton projet Supabase

- Va sur **https://supabase.com** → connexion.
- Clique sur le **bon projet** (celui dont l’URL est dans ton `.env.local`, ex. `zhdlqmkpdsygszrxjezd.supabase.co`).

### 2. Ouvre le SQL Editor

- Dans le **menu de gauche**, clique sur **SQL Editor** (icône </> ou "SQL Editor").
- Clique sur le bouton **"+ New query"** (en haut à droite).

### 3. Colle TOUT le script

- Ouvre le fichier **`supabase-complet.sql`** (à la racine du projet) dans Cursor ou le Bloc-notes.
- **Sélectionne tout** : Ctrl+A.
- **Copie** : Ctrl+C.
- Reviens dans Supabase, dans la **grande zone de texte** du SQL Editor.
- **Colle** : Ctrl+V. Tu dois voir tout le code (des lignes qui commencent par `--`, puis `CREATE TABLE`, etc.).

### 4. Exécute le script

- Clique sur le bouton **"Run"** en bas à droite (ou Ctrl+Enter).
- Attends 5–10 secondes.
- En bas de l’écran, regarde le **résultat** :
  - **"Success"** ou **"Success. No rows returned"** → c’est bon.
  - Un **message d’erreur en rouge** → copie le message exact (tu pourras me le donner).

### 5. Vérifier dans Table Editor

- Dans le menu de gauche, clique sur **Table Editor**.
- Dans la liste à gauche, tu dois voir le schéma **"public"** (ou une liste de tables).
- En cliquant sur **public** (ou en dépliant), tu dois voir **6 tables** :
  - **users**
  - **modules**
  - **episodes**
  - **progress**
  - **resources**
  - **announcements**

Si tu les vois, les tables sont créées. Tu peux ensuite tester la connexion dans ton app.

---

## Si ça ne marche pas

1. **Tu as bien exécuté `supabase-complet.sql` (tout le fichier) et pas seulement un petit bout ?**  
   Il faut que toute la requête soit sélectionnée et exécutée (Run).

2. **Tu as un message d’erreur ?**  
   Copie-colle le message exact (en rouge) sous le SQL Editor et envoie-le-moi.

3. **Tu es bien dans le bon projet Supabase ?**  
   L’URL du projet dans le navigateur doit correspondre à celle dans ton `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`).

4. **Dans Table Editor, tu ne vois pas "public" ?**  
   Regarde s’il y a un menu ou un filtre par schéma (ex. "public", "auth") et sélectionne **public**.
