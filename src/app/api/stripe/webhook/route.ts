import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const TEMP_PASSWORD = "ThumbnailPro2024!ChgMdp";

export async function POST(request: NextRequest) {
  if (!webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    console.error("[Stripe webhook] Configuration manquante");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[Stripe webhook] Signature invalide:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_email || session.customer_details?.email;
  const fullName = (session.metadata?.full_name as string) || session.customer_details?.name || "";

  if (!email || !email.includes("@")) {
    console.error("[Stripe webhook] Email manquant dans la session");
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: TEMP_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName || undefined },
    });

    if (authError) {
      if (authError.message?.includes("already been registered") || authError.message?.includes("already exists")) {
        return NextResponse.json({ received: true });
      }
      console.error("[Stripe webhook] Erreur création utilisateur:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Stripe webhook]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
