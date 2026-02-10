import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticket_id");

    if (ticketId) {
      const { data: ticket, error: ticketError } = await supabase
        .from("support_tickets")
        .select("id, user_id, subject, status, created_at, updated_at")
        .eq("id", ticketId)
        .single();
      if (ticketError || !ticket) return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });

      const { data: messages, error: msgError } = await supabase
        .from("support_messages")
        .select("id, ticket_id, user_id, content, is_staff, created_at")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
      if (msgError) return NextResponse.json({ error: msgError.message }, { status: 500 });

      const { data: author } = await supabase.from("users").select("full_name, email").eq("id", ticket.user_id).single();
      return NextResponse.json({
        ticket: { ...ticket, author: author?.full_name || author?.email || "Membre" },
        messages: messages || [],
      });
    }

    const { data: tickets, error } = await supabase
      .from("support_tickets")
      .select("id, user_id, subject, status, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const ticketsWithLast = await Promise.all(
      (tickets || []).map(async (t) => {
        const { data: lastMsg } = await supabase
          .from("support_messages")
          .select("content, created_at, is_staff")
          .eq("ticket_id", t.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        const { data: author } = await supabase.from("users").select("full_name, email").eq("id", t.user_id).single();
        return {
          ...t,
          last_message: lastMsg?.content ? lastMsg.content.slice(0, 80) + (lastMsg.content.length > 80 ? "…" : "") : null,
          last_at: lastMsg?.created_at || t.updated_at,
          is_staff_reply: lastMsg?.is_staff ?? false,
          author: author?.full_name || author?.email || "Membre",
        };
      })
    );
    return NextResponse.json(ticketsWithLast);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { subject, content, ticket_id: ticketId } = body as { subject?: string; content?: string; ticket_id?: string };
    const text = typeof content === "string" ? content.trim() : "";
    if (!text) return NextResponse.json({ error: "Message vide" }, { status: 400 });

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    const isAdmin = (profile as { role?: string } | null)?.role === "admin";

    if (ticketId) {
      const { data: ticket } = await supabase.from("support_tickets").select("id, user_id").eq("id", ticketId).single();
      if (!ticket) return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
      const { error: insertError } = await supabase.from("support_messages").insert({
        ticket_id: ticketId,
        user_id: user.id,
        content: text,
        is_staff: isAdmin,
      } as never);
      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    const subj = typeof subject === "string" ? subject.trim() : "Sans objet";
    const { data: newTicket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert({ user_id: user.id, subject: subj } as never)
      .select("id")
      .single();
    if (ticketError || !newTicket) return NextResponse.json({ error: ticketError?.message || "Erreur création ticket" }, { status: 500 });

    const { error: msgError } = await supabase.from("support_messages").insert({
      ticket_id: newTicket.id,
      user_id: user.id,
      content: text,
      is_staff: false,
    } as never);
    if (msgError) return NextResponse.json({ error: msgError.message }, { status: 500 });
    return NextResponse.json({ ok: true, ticket_id: newTicket.id });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if ((profile as { role?: string } | null)?.role !== "admin") {
      return NextResponse.json({ error: "Réservé aux admins" }, { status: 403 });
    }

    const body = await request.json();
    const { ticket_id: ticketId, status: newStatus } = body as { ticket_id?: string; status?: string };
    if (!ticketId || newStatus !== "closed") {
      return NextResponse.json({ error: "ticket_id et status requis (status: closed)" }, { status: 400 });
    }

    const { error } = await supabase
      .from("support_tickets")
      .update({ status: "closed", updated_at: new Date().toISOString() } as never)
      .eq("id", ticketId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
