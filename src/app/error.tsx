"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        background: "#000000",
        color: "#ffffff",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
        Une erreur s&apos;est produite
      </h1>
      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", margin: 0, maxWidth: 400 }}>
        Rechargez la page ou revenez à l&apos;accueil.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="/login"
          style={{
            padding: "0.5rem 1rem",
            background: "#5C6FFF",
            color: "#fff",
            borderRadius: 8,
            fontSize: "0.875rem",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Aller à la connexion
        </a>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1rem",
            background: "transparent",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 8,
            fontSize: "0.875rem",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
