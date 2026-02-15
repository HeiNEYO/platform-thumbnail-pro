/**
 * Miniatures des modules (image locale prioritaire)
 */
const MODULE_IMAGES: Record<number, string> = {
  1: "/images/modules/module-1-les-outils.png",
  2: "/images/modules/module-2-les-bases.png",
  3: "/images/modules/module-3-la-pratique.png",
  4: "/images/modules/module-4-business.png",
  5: "/images/modules/module-5-bonus.png",
};

function getModuleNumber(title: string): number | null {
  const match = title.match(/^([1-5])[\s.•]/);
  return match ? parseInt(match[1], 10) : null;
}

export function getModuleImageUrl(imageUrl: string | null, title: string): string | null {
  const num = getModuleNumber(title);
  if (num && MODULE_IMAGES[num]) return MODULE_IMAGES[num];
  return imageUrl || null;
}
