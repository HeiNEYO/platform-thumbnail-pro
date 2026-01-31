export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  progress: number;
  locked: boolean;
  order: number;
}

export const MODULES: Module[] = [
  {
    id: "1",
    title: "Introduction à la création de thumbnails",
    description: "Découvrez les bases et les principes d'un thumbnail percutant.",
    duration: "45 min",
    lessons: 5,
    progress: 0,
    locked: false,
    order: 1,
  },
  {
    id: "2",
    title: "Outils et logiciels",
    description: "Photoshop, Canva, Figma : choisir et maîtriser ses outils.",
    duration: "1h 20",
    lessons: 8,
    progress: 0,
    locked: false,
    order: 2,
  },
  {
    id: "3",
    title: "Psychologie des couleurs et typographie",
    description: "Couleurs et polices qui attirent l'œil et génèrent des clics.",
    duration: "1h",
    lessons: 6,
    progress: 0,
    locked: false,
    order: 3,
  },
  {
    id: "4",
    title: "Templates et cohérence de chaîne",
    description: "Créer une identité visuelle reconnaissable.",
    duration: "1h 30",
    lessons: 7,
    progress: 0,
    locked: false,
    order: 4,
  },
  {
    id: "5",
    title: "A/B testing et optimisation",
    description: "Mesurer et améliorer les performances de vos thumbnails.",
    duration: "55 min",
    lessons: 5,
    progress: 0,
    locked: false,
    order: 5,
  },
];
