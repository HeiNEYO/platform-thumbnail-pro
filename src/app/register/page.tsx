"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (authError) {
        let errorMessage = authError.message;
        if (errorMessage.includes("already registered")) {
          errorMessage = "Cet email est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.";
        }
        setError(errorMessage);
        return;
      }

      if (!authData.user) {
        setError("Erreur lors de la création du compte.");
        return;
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center auth-bg-honeycomb relative overflow-hidden px-4">
      {/* Carte - couleurs plateforme */}
      <div className="relative w-full max-w-[420px] rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
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

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-1">Bienvenue</h1>
        <p className="text-sm text-white/60 text-center mb-8">Créez votre compte et rejoignez-nous.</p>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3 mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nom complet */}
          <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-2">Nom complet</label>
          <div className="relative mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <User className="h-4 w-4" />
            </span>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nom complet"
              autoComplete="name"
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
            />
          </div>

          {/* Email */}
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">Email</label>
          <div className="relative mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              autoComplete="email"
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
            />
          </div>

          {/* Mot de passe */}
          <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">Mot de passe</label>
          <div className="relative mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="new-password"
              required
              className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Confirmer mot de passe */}
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">Confirmer le mot de passe</label>
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              autoComplete="new-password"
              required
              className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-[#1a1a1a] bg-[#141414] text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Ou</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>

          {/* Bouton - primary plateforme */}
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
                Création...
              </>
            ) : (
              <>
                S&apos;inscrire
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-white/60 mt-8">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-icon font-medium underline underline-offset-2 hover:text-primary transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
