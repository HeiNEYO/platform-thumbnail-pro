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
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const params = new URLSearchParams(hash.replace("#", ""));
    if (params.get("type") === "recovery") {
      setIsRecovery(true);
    }
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
      const redirectTo = `${window.location.origin}/forgot-password`;
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

  return (
    <main className="min-h-screen flex items-center justify-center auth-bg-honeycomb relative overflow-hidden px-4">
      <div className="relative w-full max-w-[420px] rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
        <div className="flex justify-center mb-6">
          <Link href="/" className="block">
            <Image src="/images/logo.svg" alt="Thumbnail Pro" width={56} height={56} className="shrink-0" />
          </Link>
        </div>

        {isRecovery ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-1">Définir votre mot de passe</h1>
            <p className="text-sm text-white/60 text-center mb-8">
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

            <form onSubmit={handleSetPassword} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-white/50" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-white/90 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-primary/50"
              >
                {submitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    Définir mon mot de passe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-1">Mot de passe oublié</h1>
            <p className="text-sm text-white/60 text-center mb-8">
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
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    autoComplete="email"
                    required
                    className="w-full pr-14 pl-4 py-3.5 rounded-xl border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-white transition-colors disabled:opacity-50"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-primary/50"
              >
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

        <p className="text-center text-sm text-white/60 mt-8">
          <Link href="/login" className="text-icon font-medium underline underline-offset-2 hover:text-primary transition-colors">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center auth-bg-honeycomb">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </main>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
