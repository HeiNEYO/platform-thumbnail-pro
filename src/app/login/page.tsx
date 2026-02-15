"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    if (isDevMode) {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 300));
      router.push("/dashboard");
      return;
    }

    if (!email.trim() || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setSubmitting(true);
    try {
      const timeout = new Promise<{ error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error("La connexion a expiré. Vérifiez votre connexion et réessayez.")), 15000)
      );
      const result = await Promise.race([
        signIn(email.trim(), password, rememberMe),
        timeout,
      ]);
      if (result.error) {
        setError(result.error.message ?? "Erreur de connexion.");
        setSubmitting(false);
        return;
      }
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDemoMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <main className="min-h-screen flex">
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
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Se connecter</h1>
            <p className="text-white/60 text-sm lg:text-base mb-10">
              Connectez-vous pour accéder à la plateforme Thumbnail Pro
            </p>

            {isDemoMode && (
              <div className="rounded-lg border border-primary/50 bg-primary/10 text-primary text-center text-sm font-medium px-4 py-3 mb-6">
                Mode démo : cliquez sur « Se connecter » pour accéder au dashboard.
              </div>
            )}

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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-biseau-top bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Mot de passe
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary-hover transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border-biseau-top bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me - toggle style localisation */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Se souvenir de moi</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#0d0d0d] ${
                    rememberMe
                      ? "border-biseau-top-primary bg-primary"
                      : "border-biseau-top bg-white/5"
                  }`}
                >
                  <span
                    className={`pointer-events-none absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ease-in-out ${
                      rememberMe ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </label>

              {/* Bouton */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl border-biseau-top-primary bg-primary hover:bg-primary-hover text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/50 mt-8">
              Accès réservé aux membres ayant acheté la formation.
            </p>
          </div>
        </div>
      </div>

      {/* Panneau droit */}
      <div className="hidden lg:flex lg:w-[52%] min-h-screen relative bg-gradient-to-b from-black to-[#000d3f]" />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
