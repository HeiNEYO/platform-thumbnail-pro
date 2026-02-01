"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Ne rien faire pendant le chargement initial
    if (!mounted || loading) {
      return;
    }

    // Si on est sur une route dashboard et qu'il n'y a pas d'utilisateur après chargement
    // Attendre un peu plus car le middleware a déjà vérifié la session
    if (pathname?.startsWith("/dashboard") && !user && !hasRedirected) {
      // Attendre 1 seconde supplémentaire pour laisser le temps à la session de se charger
      const timeout = setTimeout(() => {
        if (!user) {
          setHasRedirected(true);
          router.replace("/login");
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [user, loading, router, hasRedirected, pathname, mounted]);

  // Si pas encore monté côté client, afficher le contenu (le middleware a déjà vérifié)
  if (!mounted) {
    return <>{children}</>;
  }

  // Pendant le chargement : afficher le contenu (le middleware a déjà vérifié la session)
  if (loading) {
    return <>{children}</>;
  }

  // Si pas d'utilisateur après chargement et qu'on a attendu, rediriger
  if (!user && hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white/70 text-sm">Redirection...</div>
      </div>
    );
  }

  // Afficher le contenu (le middleware a déjà vérifié l'accès)
  return <>{children}</>;
}
