"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthIllustration } from "@/components/auth/AuthIllustration";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

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
    <main className="min-h-screen flex flex-col lg:flex-row bg-[#0f0f0f]">
      {/* Colonne gauche - Formulaire */}
      <AuthFormWrapper
        title="Holla, Bienvenue"
        subtitle="Créez votre compte et rejoignez-nous"
        switchText="Déjà un compte ?"
        switchLink="/login"
        switchLinkText="Connectez-vous"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3 mb-6">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Full Name Input */}
          <AuthInput
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nom complet"
            icon={<User className="h-5 w-5" />}
            autoComplete="name"
            required
          />

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
              autoComplete="new-password"
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

          {/* Confirm Password Input */}
          <div className="relative mb-8">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#999999] z-10">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              autoComplete="new-password"
              required
              className="w-full pl-12 pr-12 py-4 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-white placeholder-[#999999] focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all duration-300 text-base"
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Sign Up Button */}
          <AuthButton type="submit" disabled={submitting}>
            {submitting ? "Création..." : "S'inscrire"}
          </AuthButton>
        </form>
      </AuthFormWrapper>

      {/* Colonne droite - Illustration */}
      <AuthIllustration />
    </main>
  );
}
