"use client";

import { useMemo } from "react";
import { FolderCard } from "@/components/ui/FolderCard";
import type { ResourceRow } from "@/lib/supabase/database.types";
import { 
  FileText, 
  Image as ImageIcon, 
  Palette, 
  Code,
  Video,
  Music,
  Type
} from "lucide-react";

interface ResourcesPageClientProps {
  resources: ResourceRow[];
  categories: string[];
  types: string[];
}

// Configuration des dossiers pré-définis avec leurs icônes
const predefinedFolders = [
  {
    key: "templates",
    name: "Templates",
    icon: <FileText className="h-5 w-5 text-blue-400 shrink-0" />,
  },
  {
    key: "images",
    name: "Images & Icônes",
    icon: <ImageIcon className="h-5 w-5 text-green-400 shrink-0" />,
  },
  {
    key: "palettes",
    name: "Palettes de Couleurs",
    icon: <Palette className="h-5 w-5 text-purple-400 shrink-0" />,
  },
  {
    key: "fonts",
    name: "Polices",
    icon: <Type className="h-5 w-5 text-orange-400 shrink-0" />,
  },
  {
    key: "outils",
    name: "Outils",
    icon: <Code className="h-5 w-5 text-red-400 shrink-0" />,
  },
  {
    key: "videos",
    name: "Vidéos",
    icon: <Video className="h-5 w-5 text-pink-400 shrink-0" />,
  },
  {
    key: "audio",
    name: "Audio",
    icon: <Music className="h-5 w-5 text-yellow-400 shrink-0" />,
  },
];

export function ResourcesPageClient({
  resources,
  categories,
  types,
}: ResourcesPageClientProps) {
  // Organiser les ressources par catégorie dans des dossiers
  const folders = useMemo(() => {
    const foldersMap = new Map<string, ResourceRow[]>();
    
    // Grouper les ressources existantes par catégorie
    resources.forEach((resource) => {
      const category = resource.category || "autres";
      if (!foldersMap.has(category)) {
        foldersMap.set(category, []);
      }
      foldersMap.get(category)!.push(resource);
    });

    // Créer les dossiers pré-définis avec leurs ressources (ou vides)
    return predefinedFolders.map((folderConfig) => {
      const folderResources = foldersMap.get(folderConfig.key) || [];
      return {
        name: folderConfig.name,
        key: folderConfig.key,
        resources: folderResources.sort((a, b) => a.title.localeCompare(b.title)),
        icon: folderConfig.icon,
      };
    });
  }, [resources]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ressources
        </h1>
        <p className="text-sm md:text-base text-[#999999]">
          Templates, polices, palettes et outils pour vos thumbnails. Organisés par dossiers pour faciliter votre navigation.
        </p>
      </div>

      {/* Liste des dossiers - Toujours affichée avec tous les dossiers pré-configurés */}
      <div className="space-y-4">
        {folders.map((folder) => (
          <FolderCard
            key={folder.key}
            folderName={folder.name}
            resources={folder.resources}
            icon={folder.icon}
          />
        ))}
      </div>
    </div>
  );
}
