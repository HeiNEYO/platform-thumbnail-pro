"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";

export default function AcheterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !fullName.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), full_name: fullName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la création du paiement");
      if (data.url) window.location.href = data.url;
      else throw new Error("URL de paiement manquante");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex select-none [&_input]:select-text">
      <div className="w-full lg:w-[48%] min-h-screen bg-[#0d0d0d] flex flex-col p-8 lg:p-12">
        <Link href="/" className="flex items-center gap-3 mb-auto pt-2">
          <Image src="/images/logo.svg" alt="Thumbnail Pro" width={40} height={40} className="shrink-0" />
          <span className="text-xl font-semibold text-white">Thumbnail Pro</span>
        </Link>

        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-[400px]">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Acheter la formation</h1>
            <p className="text-white/60 text-sm lg:text-base mb-10">
              Renseignez vos informations pour accéder au paiement sécurisé Stripe.
            </p>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3 mb-6">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-white mb-2">
                  Nom complet
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  autoComplete="name"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-biseau-top bg-white/5 text-white placeholder-white/40 focus:outline-none transition-all text-base"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-biseau-top bg-white/5 text-white placeholder-white/40 focus:outline-none transition-all text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl border-biseau-top-primary bg-primary hover:bg-primary-hover text-white font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Redirection vers le paiement...
                  </>
                ) : (
                  <>
                    Procéder au paiement
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/50 mt-8">
              Paiement sécurisé par Stripe. Après le paiement, vous recevrez un email pour définir votre mot de passe.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[52%] min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#000d3f]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 6v20M6 16h20' stroke='white' stroke-width='0.5' fill='none' opacity='0.12'/%3E%3C/svg%3E")`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 flex flex-col justify-end p-10 lg:p-14 w-full">
          <div className="pb-4">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              Maîtrisez l&apos;art
              <br />
              des thumbnails
              <br />
              qui performent.
            </h2>
            <p className="mt-6 text-base lg:text-lg text-white/80 font-normal max-w-md leading-relaxed">
              Accédez à la formation complète et développez votre audience avec des miniatures optimisées.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
