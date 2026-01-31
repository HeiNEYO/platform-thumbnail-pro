import type { User, Module, Episode, Progression, Resource, Announcement } from "./types";

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_MODULES: Module[] = [
  {
    id: "m1",
    titre: "Introduction à la création de thumbnails",
    description: "Les bases et principes d'un thumbnail percutant.",
    ordre: 1,
    dureeEstimee: "45 min",
  },
  {
    id: "m2",
    titre: "Outils et logiciels",
    description: "Photoshop, Canva, Figma : choisir et maîtriser ses outils.",
    ordre: 2,
    dureeEstimee: "1h 20",
  },
  {
    id: "m3",
    titre: "Psychologie des couleurs et typographie",
    description: "Couleurs et polices qui attirent l'œil et génèrent des clics.",
    ordre: 3,
    dureeEstimee: "1h",
  },
];

export const DEMO_EPISODES: Episode[] = [
  { id: "e1", moduleId: "m1", titre: "Qu'est-ce qu'un bon thumbnail ?", duree: "8 min", ordre: 1 },
  { id: "e2", moduleId: "m1", titre: "Les 5 règles d'or", duree: "10 min", ordre: 2 },
  { id: "e3", moduleId: "m1", titre: "Analyse de cas", duree: "12 min", ordre: 3 },
  { id: "e4", moduleId: "m1", titre: "Exercice pratique", duree: "9 min", ordre: 4 },
  { id: "e5", moduleId: "m1", titre: "Récap et checklist", duree: "6 min", ordre: 5 },
  { id: "e6", moduleId: "m2", titre: "Photoshop : interface", duree: "10 min", ordre: 1 },
  { id: "e7", moduleId: "m2", titre: "Canva pour débutants", duree: "8 min", ordre: 2 },
  { id: "e8", moduleId: "m2", titre: "Figma en 15 min", duree: "15 min", ordre: 3 },
  { id: "e9", moduleId: "m2", titre: "Comparatif des outils", duree: "12 min", ordre: 4 },
  { id: "e10", moduleId: "m2", titre: "Workflow recommandé", duree: "10 min", ordre: 5 },
  { id: "e11", moduleId: "m3", titre: "Psychologie des couleurs", duree: "12 min", ordre: 1 },
  { id: "e12", moduleId: "m3", titre: "Typographie qui convertit", duree: "10 min", ordre: 2 },
  { id: "e13", moduleId: "m3", titre: "Contraste et lisibilité", duree: "8 min", ordre: 3 },
  { id: "e14", moduleId: "m3", titre: "Exemples avant/après", duree: "15 min", ordre: 4 },
  { id: "e15", moduleId: "m3", titre: "Quiz et récap", duree: "5 min", ordre: 5 },
];

export const DEMO_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", titre: "Bienvenue sur la plateforme !", contenu: "Découvrez tous les modules et progressez à votre rythme.", date: daysAgo(2), important: true },
  { id: "a2", titre: "Nouvel atelier : A/B testing", contenu: "Un nouvel atelier sur le test de vos thumbnails est disponible.", date: daysAgo(5), important: false },
  { id: "a3", titre: "Mise à jour des ressources", contenu: "20 nouveaux templates et palettes ont été ajoutés.", date: daysAgo(10), important: false },
  { id: "a4", titre: "Maintenance prévue", contenu: "Une courte maintenance est prévue dimanche 2h-4h.", date: daysAgo(1), important: true },
  { id: "a5", titre: "Retour sur vos créations", contenu: "Partagez vos thumbnails dans le Discord pour des retours.", date: daysAgo(7), important: false },
];

const resourceCats: Resource["categorie"][] = ["templates", "fonts", "palettes", "plugins", "assets", "inspirations"];
const catLabels: Record<Resource["categorie"], string> = {
  templates: "Templates",
  fonts: "Fonts & Typographies",
  palettes: "Palettes de couleurs",
  plugins: "Plugins & Outils",
  assets: "Assets gratuits",
  inspirations: "Inspirations",
};

export const DEMO_RESOURCES: Resource[] = (() => {
  const out: Resource[] = [];
  let i = 0;
  for (const cat of resourceCats) {
    const count = cat === "templates" || cat === "fonts" ? 4 : 3;
    for (let j = 0; j < count; j++) {
      i++;
      out.push({
        id: `r${i}`,
        categorie: cat,
        titre: `${catLabels[cat]} - Ressource ${j + 1}`,
        type: "lien",
        url: "https://example.com/resource",
        previewUrl: `https://placehold.co/320x180/2a2a2a/6366f1?text=${encodeURIComponent(cat)}`,
      });
    }
  }
  return out;
})();

// 10 users: 1 admin + 9 members with different progressions
export const DEMO_USERS: User[] = [
  {
    id: "admin1",
    email: "admin@thumbnailpro.com",
    name: "Admin Pro",
    role: "admin",
    dateInscription: daysAgo(90),
    derniereConnexion: now.toISOString(),
  },
  {
    id: "u1",
    email: "marie.dupont@email.com",
    name: "Marie Dupont",
    role: "member",
    dateInscription: daysAgo(60),
    derniereConnexion: daysAgo(0),
  },
  {
    id: "u2",
    email: "jean.martin@email.com",
    name: "Jean Martin",
    role: "member",
    dateInscription: daysAgo(45),
    derniereConnexion: daysAgo(1),
  },
  {
    id: "u3",
    email: "sophie.bernard@email.com",
    name: "Sophie Bernard",
    role: "member",
    dateInscription: daysAgo(30),
    derniereConnexion: daysAgo(3),
  },
  {
    id: "u4",
    email: "lucas.petit@email.com",
    name: "Lucas Petit",
    role: "member",
    dateInscription: daysAgo(20),
    derniereConnexion: daysAgo(5),
  },
  {
    id: "u5",
    email: "lea.moreau@email.com",
    name: "Léa Moreau",
    role: "member",
    dateInscription: daysAgo(15),
    derniereConnexion: daysAgo(2),
  },
  {
    id: "u6",
    email: "hugo.simon@email.com",
    name: "Hugo Simon",
    role: "member",
    dateInscription: daysAgo(10),
    derniereConnexion: daysAgo(7),
  },
  {
    id: "u7",
    email: "chloe.laurent@email.com",
    name: "Chloé Laurent",
    role: "member",
    dateInscription: daysAgo(8),
    derniereConnexion: daysAgo(14),
  },
  {
    id: "u8",
    email: "theo.lefebvre@email.com",
    name: "Théo Lefebvre",
    role: "member",
    dateInscription: daysAgo(5),
    derniereConnexion: daysAgo(20),
  },
  {
    id: "u9",
    email: "jade.michel@email.com",
    name: "Jade Michel",
    role: "member",
    dateInscription: daysAgo(2),
    derniereConnexion: daysAgo(1),
  },
];

// Progression: u1 80%, u2 60%, u3 40%, u4 20%, u5 100%, u6 33%, u7 0%, u8 50%, u9 10%
function episodeIdsByModule(): Record<string, string[]> {
  const byModule: Record<string, string[]> = {};
  for (const e of DEMO_EPISODES) {
    if (!byModule[e.moduleId]) byModule[e.moduleId] = [];
    byModule[e.moduleId].push(e.id);
  }
  return byModule;
}

const allEpisodeIds = DEMO_EPISODES.map((e) => e.id);
const byMod = episodeIdsByModule();

function makeProgression(userId: string, completedCount: number): Progression[] {
  const out: Progression[] = [];
  const toComplete = allEpisodeIds.slice(0, completedCount);
  toComplete.forEach((epId, i) => {
    out.push({
      userId,
      episodeId: epId,
      completed: true,
      dateCompletion: daysAgo(completedCount - i),
    });
  });
  return out;
}

export const DEMO_PROGRESSIONS: Progression[] = [
  ...makeProgression("u1", 12), // 12/15
  ...makeProgression("u2", 9),
  ...makeProgression("u3", 6),
  ...makeProgression("u4", 3),
  ...makeProgression("u5", 15),
  ...makeProgression("u6", 5),
  ...makeProgression("u7", 0),
  ...makeProgression("u8", 7),
  ...makeProgression("u9", 1),
];
