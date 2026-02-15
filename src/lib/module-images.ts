/**
 * Miniatures des modules (image locale prioritaire)
 */
const MODULE_1_IMAGE = "/images/modules/module-1-les-outils.png";

function isModule1LesOutils(title: string): boolean {
  const t = title.toLowerCase();
  return t.includes("outils") && /^1[\s.•]/.test(title);
}

export function getModuleImageUrl(imageUrl: string | null, title: string): string | null {
  // Module 1 Les Outils : toujours utiliser notre image
  if (isModule1LesOutils(title)) return MODULE_1_IMAGE;
  return imageUrl || null;
}
