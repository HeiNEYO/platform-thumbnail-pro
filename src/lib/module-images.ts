/**
 * Images de fallback pour les modules (quand image_url est null en base)
 */
const MODULE_IMAGES: Record<string, string> = {
  "1 • Les Outils": "/images/modules/module-1-les-outils.png",
};

export function getModuleImageUrl(imageUrl: string | null, title: string): string | null {
  if (imageUrl) return imageUrl;
  return MODULE_IMAGES[title] ?? null;
}
