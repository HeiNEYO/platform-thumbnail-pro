"use client";

import { createClient } from "@/lib/supabase/client";
import type { NoteRow } from "@/lib/supabase/database.types";

export async function getNotesClient(userId: string): Promise<NoteRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as NoteRow[];
}

export async function upsertNote(
  userId: string,
  episodeId: string,
  content: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("notes").upsert(
    {
      user_id: userId,
      episode_id: episodeId,
      content,
      updated_at: new Date().toISOString(),
    } as never,
    { onConflict: "user_id,episode_id" }
  );
  return { error: error as unknown as Error };
}

export async function deleteNote(noteId: string): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  return { error: error as unknown as Error };
}
