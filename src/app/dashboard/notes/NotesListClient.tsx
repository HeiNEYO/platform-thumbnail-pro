"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Pencil, Trash2, X, Check } from "lucide-react";
import type { NoteWithEpisode } from "@/lib/db/notes";
import { upsertNote, deleteNote } from "@/lib/db/notes.client";

export function NotesListClient({
  notes,
  userId,
}: {
  notes: NoteWithEpisode[];
  userId: string;
}) {
  const [list, setList] = useState(notes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const startEdit = (note: NoteWithEpisode) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = async (episodeId: string) => {
    const { error } = await upsertNote(userId, episodeId, editContent);
    if (error) {
      alert("Impossible d'enregistrer la note. Réessayez.");
      return;
    }
    setList((prev) =>
      prev.map((n) =>
        n.episode_id === episodeId ? { ...n, content: editContent, updated_at: new Date().toISOString() } : n
      )
    );
    setEditingId(null);
  };

  const handleDelete = async (noteId: string) => {
    const { error } = await deleteNote(noteId);
    if (error) {
      alert("Impossible de supprimer la note. Réessayez.");
      return;
    }
    setList((prev) => prev.filter((n) => n.id !== noteId));
  };

  if (list.length === 0) {
    return (
      <div className="rounded-lg border border-card-border bg-black p-12 text-center">
        <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
        <p className="text-white/70 font-medium mb-2">Aucune note</p>
        <p className="text-white/50 text-sm">
          Vos notes apparaîtront ici lorsque vous en ajouterez depuis un épisode.
        </p>
        <Link
          href="/dashboard/modules"
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:opacity-90"
        >
          Voir les modules
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((note) => {
        const isEditing = editingId === note.id;
        const episodeTitle = note.episode?.title ?? "Épisode";
        const episodeModuleId = note.episode?.module_id;

        return (
          <div
            key={note.id}
            className="rounded-lg border border-card-border bg-black p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <Link
                href={
                  episodeModuleId
                    ? `/dashboard/modules/${episodeModuleId}/episode/${note.episode_id}`
                    : "/dashboard/modules"
                }
                className="font-medium text-white hover:text-primary transition-colors truncate flex-1"
              >
                {episodeTitle}
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(note)}
                      className="p-2 rounded-lg border border-card-border text-white/50 hover:text-icon hover:border-icon/50 transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="p-2 rounded-lg border border-card-border text-white/50 hover:text-error hover:border-error/50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(note.episode_id)}
                      className="p-2 rounded-lg border border-icon text-icon hover:bg-icon/10/10 transition-colors"
                      title="Enregistrer"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-2 rounded-lg border border-card-border text-white/50 hover:text-white transition-colors"
                      title="Annuler"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-black px-4 py-3 text-sm text-white placeholder-white/50 focus:border-primary focus:outline-none min-h-[120px]"
                placeholder="Vos notes..."
                autoFocus
              />
            ) : (
              <p className="text-sm text-white/70 whitespace-pre-wrap break-words">
                {note.content || <span className="text-white/40">Aucune note</span>}
              </p>
            )}
            <p className="text-xs text-white/40 mt-2">
              Modifié le {new Date(note.updated_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
