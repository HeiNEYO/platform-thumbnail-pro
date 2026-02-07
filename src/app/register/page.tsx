"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
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
    <main className="min-h-screen flex items-center justify-center bg-[#0f1419] relative overflow-hidden px-4">
      {/* Fond avec reflets / speckles */}
      <div className="absolute inset-0 bg-[#0f1419]" />
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-2 h-2 rounded-full bg-white/60" />
        <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-white/50" />
        <div className="absolute top-[40%] left-[25%] w-1 h-1 rounded-full bg-white/40" />
        <div className="absolute top-[60%] right-[30%] w-2 h-2 rounded-full bg-white/50" />
        <div className="absolute top-[75%] left-[20%] w-1.5 h-1.5 rounded-full bg-white/40" />
        <div className="absolute top-[30%] right-[10%] w-1 h-1 rounded-full bg-white/30" />
        <div className="absolute top-[55%] left-[10%] w-1 h-1 rounded-full bg-white/30" />
      </div>

      {/* Carte glassmorphism */}
      <div className="relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border-2 border-white/30 bg-white/5 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/60" />
          </div>
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
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
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
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
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
              className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
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
              className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
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

          {/* Séparateur OR */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <Link href="/login" className="text-primary font-medium underline underline-offset-2 hover:text-primary-hover">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
