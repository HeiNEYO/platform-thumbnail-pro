"use client";

import { useMemo } from "react";
import { FolderCard } from "@/components/ui/FolderCard";
import type { ResourceRow } from "@/lib/supabase/database.types";
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Palette, 
  Download,
  Code,
  Video,
  Music
} from "lucide-react";

interface ResourcesPageClientProps {
  resources: ResourceRow[];
  categories: string[];
  types: string[];
}

// Configuration des icônes pour chaque catégorie
const categoryIcons: Record<string, React.ReactNode> = {
  templates: <FileText className="h-5 w-5 text-blue-400 shrink-0" />,
  images: <ImageIcon className="h-5 w-5 text-green-400 shrink-0" />,
  palettes: <Palette className="h-5 w-5 text-purple-400 shrink-0" />,
  fonts: <FileText className="h-5 w-5 text-orange-400 shrink-0" />,
  outils: <Code className="h-5 w-5 text-red-400 shrink-0" />,
  videos: <Video className="h-5 w-5 text-pink-400 shrink-0" />,
  audio: <Music className="h-5 w-5 text-yellow-400 shrink-0" />,
  autres: <Folder className="h-5 w-5 text-white/60 shrink-0" />,
};

export function ResourcesPageClient({
  resources,
  categories,
  types,
}: ResourcesPageClientProps) {
  // Organiser les ressources par catégorie dans des dossiers
  const folders = useMemo(() => {
    const foldersMap = new Map<string, ResourceRow[]>();
    
    // Grouper les ressources par catégorie
    resources.forEach((resource) => {
      const category = resource.category || "autres";
      if (!foldersMap.has(category)) {
        foldersMap.set(category, []);
      }
      foldersMap.get(category)!.push(resource);
    });

    // Convertir en tableau et trier par nom de catégorie
    return Array.from(foldersMap.entries())
      .map(([category, resources]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        resources: resources.sort((a, b) => a.title.localeCompare(b.title)),
        icon: categoryIcons[category.toLowerCase()] || categoryIcons.autres,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
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

      {/* Liste des dossiers */}
      {folders.length > 0 ? (
        <div className="space-y-4">
          {folders.map((folder) => (
            <FolderCard
              key={folder.name}
              folderName={folder.name}
              resources={folder.resources}
              icon={folder.icon}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-[#0A0A0A] p-8 text-center">
          <Folder className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50 text-sm">
            Aucune ressource disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
