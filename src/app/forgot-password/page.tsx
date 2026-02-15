"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // 1. Vérifier l'URL : Supabase met type=recovery dans le hash (#access_token=...&type=recovery)
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
    const searchParams = new URLSearchParams(window.location.search.replace("?", ""));
    if (hashParams.get("type") === "recovery" || searchParams.get("type") === "recovery") {
      setIsRecovery(true);
      return;
    }
    // 2. Fallback : écouter l'event PASSWORD_RECOVERY (Supabase peut traiter l'URL de façon asynchrone)
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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
      // Utiliser NEXT_PUBLIC_SITE_URL en prod pour éviter les liens vers des déploiements Vercel supprimés
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
      const redirectTo = `${baseUrl.replace(/\/$/, "")}/forgot-password`;
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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });

      if (err) {
        setError(err.message ?? "Erreur lors de la mise à jour du mot de passe.");
        return;
      }
      setSuccess("Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl border-biseau-top bg-white/5 text-white placeholder-white/40 focus:outline-none transition-all text-base";
  const inputClassPr12 = "w-full px-4 py-3.5 pr-12 rounded-xl border-biseau-top bg-white/5 text-white placeholder-white/40 focus:outline-none transition-all text-base";
  const inputClassPr14 = "w-full px-4 py-3.5 pr-14 rounded-xl border-biseau-top bg-white/5 text-white placeholder-white/40 focus:outline-none transition-all text-base";
  const btnClass = "w-full py-4 rounded-xl border-biseau-top-primary bg-primary hover:bg-primary-hover text-white font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <main className="min-h-screen flex select-none [&_input]:select-text">
      {/* Panneau gauche - Formulaire */}
      <div className="w-full lg:w-[48%] min-h-screen bg-[#0d0d0d] flex flex-col p-8 lg:p-12">
        {/* Logo en haut à gauche */}
        <Link href="/" className="flex items-center gap-3 mb-auto pt-2">
          <Image
            src="/images/logo.svg"
            alt="Thumbnail Pro"
            width={40}
            height={40}
            className="shrink-0"
          />
          <span className="text-xl font-semibold text-white">Thumbnail Pro</span>
        </Link>

        {/* Zone formulaire centrée verticalement */}
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-[400px]">
            {isRecovery ? (
              <>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Définir votre mot de passe</h1>
                <p className="text-white/60 text-sm lg:text-base mb-10">
                  Choisissez un nouveau mot de passe pour votre compte.
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

                <form onSubmit={handleSetPassword} className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        autoComplete="new-password"
                        required
                        minLength={6}
                        className={inputClassPr12}
                        suppressHydrationWarning
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-white/50" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-white/50 hover:text-white transition-colors focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-white mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="confirm"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className={inputClass}
                      suppressHydrationWarning
                    />
                  </div>
                  <button type="submit" disabled={submitting} className={btnClass}>
                    {submitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <>
                        Définir mon mot de passe
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
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
              </>
            )}

            <p className="text-center text-sm text-white/50 mt-8">
              <Link href="/login" className="text-primary font-medium underline underline-offset-2 hover:text-primary-hover transition-colors">
                Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Panneau droit */}
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
