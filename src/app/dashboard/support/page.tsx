"use client";

import { useState, useEffect } from "react";
import { HelpCircle, Send, MessageSquare, Loader2, ArrowLeft } from "lucide-react";

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

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

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
    setSuccess("");
    window.history.replaceState({}, "", `/dashboard/support?ticket_id=${id}`);
    fetchThread(id);
  };

  const backToList = () => {
    setThread(null);
    setShowNewForm(false);
    setSubject("");
    setContent("");
    setReply("");
    setError("");
    setSuccess("");
    window.history.replaceState({}, "", "/dashboard/support");
    fetchTickets();
  };

  const handleNewTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!content.trim()) {
      setError("Veuillez écrire votre message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim() || "Sans objet", content: content.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erreur lors de l’envoi.");
        return;
      }
      setSuccess("Votre message a été envoyé. Le staff vous répondra ici.");
      setSubject("");
      setContent("");
      setShowNewForm(false);
      if (data.ticket_id) openTicket(data.ticket_id);
      else fetchTickets();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
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
            <HelpCircle className="h-7 w-7 text-white/80" />
            Support
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Envoyez un message au staff avec votre compte plateforme. Réponses dans cette page.
          </p>
        </div>
        {!thread && !showNewForm && (
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0044FF] text-white text-sm font-medium hover:bg-[#0038cc] transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Nouveau message
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {showNewForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Nouveau message au staff</h2>
          <form onSubmit={handleNewTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Sujet (optionnel)</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex : Problème de lecture vidéo"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#0044FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Message *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Décrivez votre problème ou question..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#0044FF] focus:outline-none resize-y"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0044FF] text-white text-sm font-medium hover:bg-[#0038cc] disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Envoyer
              </button>
              <button type="button" onClick={() => { setShowNewForm(false); setSubject(""); setContent(""); setError(""); }} className="px-4 py-2 rounded-lg border border-white/20 text-white/80 text-sm hover:bg-white/5">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {thread ? (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <button
              type="button"
              onClick={backToList}
              className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              aria-label="Retour à la liste"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white">{thread.ticket.subject}</h2>
              <p className="text-sm text-white/60">
                {thread.ticket.status === "closed" ? "Fermé" : "Ouvert"} · {formatDate(thread.ticket.updated_at)}
              </p>
            </div>
          </div>
          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {thread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.is_staff ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    msg.is_staff
                      ? "bg-[#0044FF]/20 border border-[#0044FF]/30 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <p className="text-xs text-white/60 mb-1">
                    {msg.is_staff ? "Staff" : "Vous"} · {formatDate(msg.created_at)}
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
                placeholder="Répondre..."
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
      ) : !showNewForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucun message. Cliquez sur &quot;Nouveau message&quot; pour contacter le staff.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {tickets.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => openTicket(t.id)}
                    className="w-full text-left p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center gap-2"
                  >
                    <span className="font-medium text-white truncate flex-1">{t.subject}</span>
                    <span className="text-sm text-white/60">
                      {formatDate(t.last_at)}
                      {t.is_staff_reply && " · Réponse staff"}
                    </span>
                    {t.last_message && (
                      <span className="text-sm text-white/50 truncate w-full sm:max-w-xs">{t.last_message}</span>
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
