import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const priceId = process.env.STRIPE_PRICE_ID;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://platform-thumbnail-pro.vercel.app";

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !priceId) {
    return NextResponse.json(
      { error: "Configuration Stripe manquante (STRIPE_SECRET_KEY, STRIPE_PRICE_ID)" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: { full_name: fullName },
      success_url: `${siteUrl.replace(/\/$/, "")}/login?payment=success`,
      cancel_url: `${siteUrl.replace(/\/$/, "")}/acheter`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[Stripe checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur Stripe" },
      { status: 500 }
    );
  }
}
