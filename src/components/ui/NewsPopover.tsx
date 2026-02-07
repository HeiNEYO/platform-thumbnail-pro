"use client";

import { useState, useEffect, useRef } from "react";
import { Megaphone, X, Loader2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_important: boolean;
  updated_at: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function NewsPopover() {
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Voir les actualités"
      >
        <Megaphone className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-[320px] sm:w-[380px] max-h-[min(70vh,420px)] overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
            <h3 className="text-sm font-semibold text-white">Actualités</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[min(70vh,360px)] p-2">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-white/50">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-white/50 text-center py-8">Aucune actualité pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {announcements.map((a) => (
                  <li
                    key={a.id}
                    className={`rounded-lg border p-3 ${
                      a.is_important
                        ? "border-primary/40 bg-primary/5"
                        : "border-[#1a1a1a] bg-[#141414]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-white leading-tight">{a.title}</h4>
                      {a.is_important && (
                        <span className="shrink-0 text-[10px] font-medium uppercase text-primary">Important</span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-1.5 whitespace-pre-wrap">{a.content}</p>
                    <p className="text-[10px] text-white/40 mt-2">{formatDate(a.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
