import { createClient } from "@/lib/supabase/server";
import type { ResourceRow } from "@/lib/supabase/database.types";

export async function getResources(
  category?: string,
  type?: string
): Promise<ResourceRow[]> {
  const supabase = await createClient();
  let query = supabase.from("resources").select("*").order("category");
  if (category) query = query.eq("category", category);
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as ResourceRow[];
}

export async function getResourceCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("category")
    .order("category");
  if (error) return [];
  const rows = (data ?? []) as Pick<ResourceRow, "category">[];
  const set = new Set<string>(rows.map((r) => r.category));
  return Array.from(set);
}

export async function getResourceTypes(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("type")
    .order("type");
  if (error) return [];
  const rows = (data ?? []) as Pick<ResourceRow, "type">[];
  const set = new Set<string>(rows.map((r) => r.type));
  return Array.from(set);
}
