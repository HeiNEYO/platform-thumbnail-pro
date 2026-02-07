"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Megaphone, Plus, Loader2, Send } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_important: boolean;
  updated_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminAnnouncementsPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = user?.role === "admin";

  const fetchList = () => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title.trim() || !content.trim()) {
      setError("Titre et contenu requis.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), is_important: isImportant }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création.");
        return;
      }
      setSuccess("Annonce publiée.");
      setTitle("");
      setContent("");
      setIsImportant(false);
      fetchList();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-lg border border-[#1a1a1a] bg-[#141414] p-8 text-center">
        <p className="text-white/80">Accès réservé aux administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="h-7 w-7 text-icon" />
          Annonces / Actualités
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Les annonces s&apos;affichent dans le popup « Actualités » en haut à gauche du dashboard.
        </p>
      </div>

      {/* Formulaire */}
      <section className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle annonce
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-200 text-sm px-4 py-3">
              {success}
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white/90 mb-1">Titre</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Nouveau module : Introduction au graphisme"
              className="w-full px-4 py-3 rounded-lg border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white/90 mb-1">Contenu</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez la nouvelle (nouveaux épisodes, nouveau module, etc.)..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-y"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="rounded border-[#1a1a1a] bg-[#141414] text-primary accent-primary"
            />
            <span className="text-sm text-white/80">Marquer comme important</span>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publier l&apos;annonce
          </button>
        </form>
      </section>

      {/* Liste */}
      <section className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Annonces publiées</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-white/50 text-sm">Aucune annonce pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((a) => (
              <li
                key={a.id}
                className={`rounded-lg border p-4 ${a.is_important ? "border-primary/40 bg-primary/5" : "border-[#1a1a1a] bg-[#141414]"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-white">{a.title}</h3>
                  {a.is_important && (
                    <span className="text-xs font-medium uppercase text-primary">Important</span>
                  )}
                </div>
                <p className="text-sm text-white/60 mt-1 whitespace-pre-wrap">{a.content}</p>
                <p className="text-xs text-white/40 mt-2">{formatDate(a.created_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
