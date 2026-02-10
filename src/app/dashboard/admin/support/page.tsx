"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, Send, Loader2, ArrowLeft, Lock, CheckCircle } from "lucide-react";

type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_message: string | null;
  last_at: string;
  is_staff_reply: boolean;
  author: string;
};

type Message = {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  is_staff: boolean;
  created_at: string;
};

type Thread = {
  ticket: Ticket & { author: string };
  messages: Message[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const isAdmin = user?.role === "admin";

  const fetchTickets = () => {
    fetch("/api/support")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTickets(Array.isArray(data) ? data : []);
      })
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  };

  const fetchThread = (ticketId: string) => {
    setLoading(true);
    setError("");
    fetch(`/api/support?ticket_id=${ticketId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setThread({ ticket: data.ticket, messages: data.messages || [] });
      })
      .catch(() => setThread(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const tid = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("ticket_id");
    if (tid) fetchThread(tid);
    else {
      fetchTickets();
      setThread(null);
    }
  }, []);

  const openTicket = (id: string) => {
    setThread(null);
    setReply("");
    setError("");
    window.history.replaceState({}, "", `/dashboard/admin/support?ticket_id=${id}`);
    fetchThread(id);
  };

  const backToList = () => {
    setThread(null);
    setError("");
    window.history.replaceState({}, "", "/dashboard/admin/support");
    fetchTickets();
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !reply.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: thread.ticket.id, content: reply.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erreur lors de l’envoi.");
        return;
      }
      setReply("");
      fetchThread(thread.ticket.id);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeTicket = async () => {
    if (!thread || !confirm("Fermer ce ticket ?")) return;
    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: thread.ticket.id, status: "closed" }),
      });
      if (res.ok) fetchThread(thread.ticket.id);
    } catch {
      setError("Erreur lors de la fermeture.");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-white/80">Accès réservé aux administrateurs.</p>
      </div>
    );
  }

  if (loading && !tickets.length && !thread) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[27px] font-bold text-white flex items-center gap-2">
            <MessageCircle className="h-7 w-7 text-white/80" />
            Support
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Messages des membres et canaux de discussion pour répondre à leurs problèmes.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {thread ? (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={backToList}
              className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              aria-label="Retour à la liste"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">{thread.ticket.subject}</h2>
              <p className="text-sm text-white/60">
                Par {thread.ticket.author} · {thread.ticket.status === "closed" ? "Fermé" : "Ouvert"} · {formatDate(thread.ticket.updated_at)}
              </p>
            </div>
            {thread.ticket.status !== "closed" && (
              <button
                type="button"
                onClick={closeTicket}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 text-sm hover:bg-amber-500/10"
              >
                <Lock className="h-4 w-4" />
                Fermer le ticket
              </button>
            )}
          </div>
          <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
            {thread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.is_staff ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    msg.is_staff
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <p className="text-xs text-white/60 mb-1">
                    {msg.is_staff ? "Staff (vous)" : thread.ticket.author} · {formatDate(msg.created_at)}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
          {thread.ticket.status !== "closed" && (
            <form onSubmit={handleReply} className="p-4 border-t border-white/10 flex gap-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Répondre au membre..."
                rows={2}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#0044FF] focus:outline-none resize-y"
              />
              <button
                type="submit"
                disabled={submitting || !reply.trim()}
                className="self-end px-4 py-2 rounded-lg bg-[#0044FF] text-white hover:bg-[#0038cc] disabled:opacity-50 inline-flex items-center gap-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Envoyer
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucun ticket pour l’instant.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {tickets.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => openTicket(t.id)}
                    className="w-full text-left p-4 hover:bg-white/5 transition-colors flex flex-col gap-1"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white truncate flex-1">{t.subject}</span>
                      {t.status === "closed" && (
                        <span className="inline-flex items-center gap-1 text-xs text-white/50">
                          <CheckCircle className="h-3.5 w-3.5" /> Fermé
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
                      <span>{t.author}</span>
                      <span>{formatDate(t.last_at)}</span>
                      {t.is_staff_reply && <span className="text-emerald-400/80">Réponse staff</span>}
                    </div>
                    {t.last_message && (
                      <p className="text-sm text-white/50 truncate">{t.last_message}</p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
