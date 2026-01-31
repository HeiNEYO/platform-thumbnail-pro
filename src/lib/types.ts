export type UserRole = "member" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  role: UserRole;
  dateInscription: string; // ISO
  derniereConnexion: string; // ISO
}

export interface Module {
  id: string;
  titre: string;
  description: string;
  ordre: number;
  dureeEstimee: string;
}

export interface Episode {
  id: string;
  moduleId: string;
  titre: string;
  duree: string;
  ordre: number;
  videoUrl?: string;
}

export interface Progression {
  userId: string;
  episodeId: string;
  completed: boolean;
  dateCompletion: string; // ISO
}

export type ResourceCategory =
  | "templates"
  | "fonts"
  | "palettes"
  | "plugins"
  | "assets"
  | "inspirations";

export interface Resource {
  id: string;
  categorie: ResourceCategory;
  titre: string;
  type: string;
  url: string;
  previewUrl?: string;
}

export interface Announcement {
  id: string;
  titre: string;
  contenu: string;
  date: string; // ISO
  important: boolean;
}

export type Level = "Débutant" | "Intermédiaire" | "Avancé" | "Expert";

export function getLevelFromProgress(progress: number): Level {
  if (progress <= 25) return "Débutant";
  if (progress <= 50) return "Intermédiaire";
  if (progress <= 75) return "Avancé";
  return "Expert";
}
