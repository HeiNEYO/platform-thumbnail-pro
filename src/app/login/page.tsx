"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthIllustration } from "@/components/auth/AuthIllustration";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

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

  // Vérifier si on vient de s'inscrire
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.");
    }
  }, [searchParams]);

  // Déjà connecté : redirection immédiate vers le dashboard
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
      // Timeout : si Supabase ne répond pas en 15 s, on débloque le bouton
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
    <main className="min-h-screen flex flex-col lg:flex-row bg-[#0f0f0f]">
      {/* Colonne gauche - Formulaire */}
      <AuthFormWrapper
        title="Holla, Welcome Back"
        subtitle="Ravi de vous revoir sur votre espace"
        switchText="Pas de compte ?"
        switchLink="/register"
        switchLinkText="Inscrivez-vous"
      >
        {isDemoMode && (
          <div className="rounded-lg border border-[#3B82F6]/50 bg-[#3B82F6]/10 text-[#3B82F6] text-center text-sm font-medium px-4 py-3 mb-6">
            Mode démo : cliquez sur « Se connecter » pour accéder au dashboard (sans Supabase).
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          {/* Email Input */}
          <AuthInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            icon={<Mail className="h-5 w-5" />}
            autoComplete="email"
            required
          />

          {/* Password Input */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#999999] z-10">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className="w-full pl-12 pr-12 py-4 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-white placeholder-[#999999] focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all duration-300 text-base"
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#2A2A2A] bg-[#1A1A1A] text-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 focus:ring-offset-0 cursor-pointer accent-[#3B82F6]"
                suppressHydrationWarning
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-[#999999] cursor-pointer">
                Se souvenir de moi
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-[#999999] hover:text-[#3B82F6] transition-colors duration-300"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Login Button */}
          <AuthButton type="submit" disabled={submitting}>
            {submitting ? "Connexion..." : "Se connecter"}
          </AuthButton>
        </form>
      </AuthFormWrapper>

      {/* Colonne droite - Illustration */}
      <AuthIllustration />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="w-12 h-12 border-4 border-[#3B82F6]/20 border-t-[#3B82F6] rounded-full animate-spin" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
