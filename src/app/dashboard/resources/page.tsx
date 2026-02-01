import { getResources, getResourceCategories, getResourceTypes } from "@/lib/db/resources";
import { ResourcesPageClient } from "@/components/ResourcesPageClient";

export default async function ResourcesPage() {
  let resources: Awaited<ReturnType<typeof getResources>> = [];
  let categories: string[] = [];
  let types: string[] = [];
  try {
    const result = await Promise.all([
      getResources(),
      getResourceCategories(),
      getResourceTypes(),
    ]);
    resources = result[0];
    categories = result[1];
    types = result[2];
  } catch {
    // Tables absentes ou erreur Supabase : afficher une liste vide
  }
  return (
    <ResourcesPageClient
      resources={resources}
      categories={categories}
      types={types}
    />
  );
}
