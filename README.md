# Platform Thumbnail Pro

Plateforme de formation en ligne avec **double espace** : **Membres** et **Admins**.  
Construite avec Next.js, TypeScript, Tailwind CSS et Lucide React. Données en localStorage pour la démo (prêt pour Supabase).

---

## Accès démo

- **Admin** : connectez-vous avec `admin@thumbnailpro.com` (mot de passe quelconque) → redirection vers `/admin`.
- **Membre** : inscrivez-vous ou connectez-vous avec un email des utilisateurs démo (ex. `marie.dupont@email.com`) → redirection vers `/dashboard`.

---

## Espace Membre (`/dashboard`)

- **Accueil** : annonces (cards avec dates), message de bienvenue, progression globale.
- **Formation** : liste des modules en accordéon ; chaque module affiche ses épisodes. Clic sur un épisode → page dédiée avec zone vidéo/contenu, bouton « Marquer comme terminé », « Épisode suivant », barre de progression par module et globale.
- **Ressources** : onglets (Templates, Fonts, Palettes, Plugins, Assets, Inspirations) ; cards avec preview et liens externes.
- **Discord** : card avec bouton « Rejoindre la communauté ».
- **Profil** : avatar, nom, email, niveau (Débutant / Intermédiaire / Avancé / Expert), stats (modules/épisodes complétés, temps passé, date d’inscription, dernière connexion), historique des épisodes complétés.

---

## Espace Admin (`/admin`)

- **Tableau de bord** : stats (nombre d’élèves, taux de complétion moyen, actifs cette semaine, nouveaux ce mois), tableau des élèves (photo, nom, email, inscription, dernière connexion, progression, note d’activité 0–5, modules complétés, statut Actif/Inactif), filtres et recherche. Répartition par niveau et taux de complétion par module.
- **Gestion contenu** : vue d’ensemble modules / épisodes / annonces / ressources (prêt pour CRUD backend).
- **Gestion utilisateurs** : liste complète, rôles, statut (prêt pour modifier/suspendre).
- **Analytics** : progression moyenne, taux par module, placeholder heatmap d’activité, bouton export rapport.

---

## Protection des routes

- **Middleware** : vérification du cookie `platform-role` (member | admin).
  - `/dashboard/*` : accès si rôle member ou admin.
  - `/admin/*` : accès réservé aux admins.
- **RequireAuth** (client) : redirection vers `/login` si non connecté ; redirection admin → `/admin` après login, membre → `/dashboard`.

---

## Données démo (localStorage)

- **3 modules** avec **5 épisodes** chacun.
- **10 utilisateurs** : 1 admin + 9 membres avec progressions variées.
- **5 annonces** (dont 2 importantes).
- **20 ressources** réparties dans 6 catégories.

Progression et note d’activité (0–5) sont calculées côté client ; niveau (Débutant → Expert) selon le % de complétion globale.

---

## Design

- Sidebar noire fixe `#0f0f0f`, fond principal `#1a1a1a`, cards `#2a2a2a`.
- Accent bleu/violet `#6366f1` (indigo).
- Police Inter, icônes Lucide React.
- Composants : `ProgressBar`, `StatCard`, `UserAvatar`, `ActivityBadge`, `EpisodeCard`, `ModuleAccordion`, `ResourceCard`, `Button`.

---

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- localStorage (démo) — prêt pour Supabase ou autre backend
