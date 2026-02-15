"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, ArrowRight } from "lucide-react";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    if (isDevMode) {
      setSuccess("Mode démo : vérifiez votre email (simulation).");
      return;
    }

    if (!email.trim()) {
      setError("Veuillez entrer votre email.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
      const redirectTo = `${baseUrl.replace(/\/$/, "")}/reset-password`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

      if (err) {
        setError(err.message ?? "Erreur lors de l'envoi de l'email.");
        return;
      }
      setSuccess("Un email vous a été envoyé pour réinitialiser votre mot de passe. Vérifiez votre boîte de réception.");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassPr14 = "w-full px-4 py-3.5 pr-14 rounded-xl border-biseau-top bg-white/5 text-white placeholder-white/40 focus:outline-none transition-all text-base";
  const btnClass = "w-full py-4 rounded-xl border-biseau-top-primary bg-primary hover:bg-primary-hover text-white font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <main className="min-h-screen flex select-none [&_input]:select-text">
      <div className="w-full lg:w-[48%] min-h-screen bg-[#0d0d0d] flex flex-col p-8 lg:p-12">
        <Link href="/" className="flex items-center gap-3 mb-auto pt-2">
          <Image src="/images/logo.svg" alt="Thumbnail Pro" width={40} height={40} className="shrink-0" />
          <span className="text-xl font-semibold text-white">Thumbnail Pro</span>
        </Link>

        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-[400px]">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Mot de passe oublié</h1>
            <p className="text-white/60 text-sm lg:text-base mb-10">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {success && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-200 text-sm px-4 py-3 mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3 mb-6">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    autoComplete="email"
                    required
                    className={inputClassPr14}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-white transition-colors focus:outline-none disabled:opacity-50"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={submitting} className={btnClass}>
                {submitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  "Envoyer le lien de réinitialisation"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/50 mt-8">
              <Link href="/login" className="text-primary font-medium underline underline-offset-2 hover:text-primary-hover transition-colors">
                Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[52%] min-h-screen relative bg-gradient-to-b from-black to-[#000d3f]" />
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </main>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
