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
  const result: NoteWithEpisode[] = [];
  for (const n of list) {
    const item: NoteWithEpisode = { ...n, episode: null };
    const { data: ep } = await supabase
      .from("episodes")
      .select("id, title, module_id")
      .eq("id", n.episode_id)
      .single();
    item.episode = ep as NoteWithEpisode["episode"];
    result.push(item);
  }
  return result;
}
