"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, signIn } = useAuth();
  const router = useRouter();

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
    <main
      className="min-h-screen flex items-center justify-center p-6 bg-black relative"
      style={{ minHeight: "100vh", background: "#000", color: "#fff" }}
    >
      <div className="w-full max-w-md z-10 animate-fade-in">
        {isDemoMode && (
          <div
            className="rounded-lg border border-primary/50 bg-primary/10 text-primary text-center text-xs font-medium px-4 py-3 mb-4"
            style={{ borderColor: "rgba(92,111,255,0.5)", background: "rgba(92,111,255,0.1)", color: "#5C6FFF" }}
          >
            Mode démo : cliquez sur « Se connecter » pour accéder au dashboard (sans Supabase).
          </div>
        )}
        <div
          className="rounded-2xl border border-card-border bg-card p-10 shadow-2xl"
          style={{ background: "#0a0a0a", borderColor: "#1a1a1a", color: "#fff" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[19.6px] font-bold text-white mb-2">Bon retour</h1>
            <p className="text-[12.74px] text-white/70">
              Vous n&apos;avez pas encore de compte ?{" "}
              <Link href="/register" className="text-primary font-semibold hover:opacity-80 transition-opacity">
                S&apos;inscrire
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-error/30 bg-error/10 text-red-200 text-[12.74px] px-4 py-3 animate-fade-in">
                <p className="font-medium">{error}</p>
              </div>
            )}

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
                  autoComplete="current-password"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-[15.68px] w-[15.68px] rounded border-card-border bg-black text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 cursor-pointer"
                  suppressHydrationWarning
                />
                <label htmlFor="rememberMe" className="ml-2 text-[12.74px] text-white/70 cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-all duration-200 text-[13.72px]"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
