"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";

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
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.");
    }
  }, [searchParams]);

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
    <main className="min-h-screen flex items-center justify-center auth-bg-honeycomb relative overflow-hidden px-4">
      {/* Carte glassmorphism - couleurs plateforme */}
      <div className="relative w-full max-w-[420px] rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
        {/* Logo Thumbnail Pro */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="block">
            <Image
              src="/images/logo.svg"
              alt="Thumbnail Pro"
              width={56}
              height={56}
              className="shrink-0"
            />
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-1">Content de vous revoir</h1>
        <p className="text-sm text-white/60 text-center mb-8">Veuillez entrer vos informations pour vous connecter.</p>

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

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">Email</label>
          <div className="relative mb-5">
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
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-white transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mot de passe */}
          <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">Mot de passe</label>
          <div className="relative mb-5">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
              suppressHydrationWarning
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-white/50 text-xs">
                <Lock className="h-4 w-4" />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30 accent-primary"
                suppressHydrationWarning
              />
              <span className="text-sm text-white/70">Se souvenir de moi</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-white/60 hover:text-primary transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Ou</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>

          {/* Bouton principal - primary plateforme */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-primary/50"
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
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-white/60 mt-8">
          Pas de compte ?{" "}
          <Link href="/register" className="text-icon font-medium underline underline-offset-2 hover:text-primary transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center auth-bg-honeycomb">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
