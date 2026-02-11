import { createClient } from "@/lib/supabase/server";
import type { NoteRow, EpisodeRow } from "@/lib/supabase/database.types";

export type NoteWithEpisode = NoteRow & {
  episode?: Pick<EpisodeRow, "id" | "title" | "module_id"> | null;
};

export async function getNoteForEpisode(
  userId: string,
  episodeId: string
): Promise<NoteRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .eq("episode_id", episodeId)
    .maybeSingle();
  if (error) return null;
  return data as NoteRow | null;
}

export async function getNotesWithEpisodes(userId: string): Promise<NoteWithEpisode[]> {
  const supabase = await createClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) return [];

  const list = (notes ?? []) as NoteRow[];
  if (list.length === 0) return [];

  const episodeIds = [...new Set(list.map((n) => n.episode_id).filter(Boolean))] as string[];
  const { data: episodesData } = await supabase
    .from("episodes")
    .select("id, title, module_id")
    .in("id", episodeIds);
  const episodes = (episodesData ?? []) as Pick<EpisodeRow, "id" | "title" | "module_id">[];
  const epMap = new Map(episodes.map((e) => [e.id, e]));

  return list.map((n) => ({
    ...n,
    episode: (n.episode_id ? epMap.get(n.episode_id) : null) ?? null,
  }));
}
