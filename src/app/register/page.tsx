"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

      // Créer le compte auth
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

      // Le profil dans la table users sera créé automatiquement par le trigger SQL
      // Rediriger vers login avec message de succès
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black relative">
      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="rounded-2xl border border-card-border bg-card p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[19.6px] font-bold text-white mb-2">Créer un compte</h1>
            <p className="text-[12.74px] text-white/70">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-primary font-semibold hover:opacity-80 transition-opacity">
                Se connecter
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-error/30 bg-error/10 text-red-200 text-[12.74px] px-4 py-3 animate-fade-in">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Full Name Input */}
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[19.6px] w-[19.6px] text-white/50" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-card-border bg-black text-white placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-[13.72px]"
                  placeholder="Nom complet"
                  autoComplete="name"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[19.6px] w-[19.6px] text-white/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-card-border bg-black text-white placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-[13.72px]"
                  placeholder="Adresse email"
                  autoComplete="email"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[19.6px] w-[19.6px] text-white/50" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-card-border bg-black text-white placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-[13.72px]"
                  placeholder="Mot de passe"
                  autoComplete="new-password"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[19.6px] w-[19.6px] text-white/50" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-card-border bg-black text-white placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-[13.72px]"
                  placeholder="Confirmer le mot de passe"
                  autoComplete="new-password"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-all duration-200 text-[13.72px]"
            >
              {submitting ? "Création..." : "S\u2019inscrire"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
