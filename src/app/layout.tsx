import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Platform Thumbnail Pro - Formation en ligne",
  description: "Plateforme de membres pour votre formation en ligne",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased`}
        style={{ minHeight: "100vh" }}
      >
        <noscript>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#000",
              color: "#fff",
              padding: 20,
              textAlign: "center",
            }}
          >
            <p>JavaScript est requis pour utiliser cette application. Activez-le puis rechargez la page.</p>
          </div>
        </noscript>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
