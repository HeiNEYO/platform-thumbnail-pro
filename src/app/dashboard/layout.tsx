"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Home, BookOpen, FolderOpen, User, LogOut, 
  HelpCircle, ShoppingBag, Bell,
  Heart, FileText, BarChart3, GraduationCap,
  Compass, Menu, X, Users, Shield
} from "lucide-react";
import { Suspense } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { DiscountCodeModal } from "@/components/ui/DiscountCodeModal";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { SiteSkeleton } from "@/components/ui/SiteSkeleton";

// Sections toujours ouvertes (organisées par catégorie)
const navSections = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    items: [
      { href: "/dashboard", label: "Accueil", icon: Home },
      { href: "/dashboard/favorites", label: "Mes favoris", icon: Heart },
      { href: "/dashboard/stats", label: "Statistiques", icon: BarChart3 },
      { href: "/dashboard/notes", label: "Mes notes", icon: FileText },
    ],
  },
  {
    id: "academy",
    label: "Academy",
    icon: GraduationCap,
    items: [
      { href: "/dashboard/modules", label: "Formation", icon: BookOpen },
      { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag },
      { href: "/dashboard/resources", label: "Ressources", icon: FolderOpen },
    ],
  },
  {
    id: "community",
    label: "Communauté",
    icon: Compass,
    items: [
      { href: "/dashboard/community", label: "Communauté", icon: Compass },
      { href: "/dashboard/discord", label: "Discord", icon: null, customIcon: DiscordIcon },
    ],
  },
  {
    id: "account",
    label: "Compte",
    icon: User,
    items: [
      { href: "/dashboard/profile", label: "Profil", icon: User },
    ],
  },
];

const gradeConfig = {
  member: {
    label: "Membre",
    color: "#82ACFF",
    icon: Users,
  },
  intervenant: {
    label: "Intervenant",
    color: "#82FFBC",
    icon: GraduationCap,
  },
  admin: {
    label: "Admin",
    color: "#FF8282",
    icon: Shield,
  },
} as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<SiteSkeleton />}>
      <RequireAuth>
        <DashboardShell>{children}</DashboardShell>
      </RequireAuth>
    </Suspense>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = user?.full_name ?? user?.email ?? "";
  const roleKey = (user?.role || "member") as keyof typeof gradeConfig;
  const grade = gradeConfig[roleKey] || gradeConfig.member;

  // Fonction pour générer les breadcrumbs
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header Top Bar - Agrandi de 10% */}
      <header className="h-[61.6px] shrink-0 border-b border-sidebar-border bg-[#0a0a0a] flex items-center justify-between px-[22px]">
        {/* Logo + Breadcrumbs */}
        <div className="flex items-center gap-[14px]">
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-full bg-white/5 p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-[11px]">
            <Image
              src="/images/logo.svg"
              alt="Thumbnail Pro Logo"
              width={28}
              height={28}
              className="shrink-0"
            />
            <span className="hidden md:inline text-[17.6px] font-bold text-white">
              Thumbnail Pro
            </span>
          </Link>
        </div>

        {/* Actions Right */}
        <div className="flex items-center gap-[15.4px]">
          <button className="hidden md:inline-flex referral-btn px-[15.4px] py-[6.6px] rounded-lg text-white text-[13.2px] font-medium relative overflow-hidden transition-all duration-200">
            Parraine un ami et gagne 200€
          </button>
          <button className="p-[6.6px] text-white/70 hover:text-white transition-colors">
            <Bell className="h-[19.8px] w-[19.8px]" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex h-full w-64 flex-col overflow-y-auto bg-[#0a0a0a] border-r border-sidebar-border p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm font-semibold text-white">Navigation</span>
              <button
                className="text-white/60 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col space-y-3">
              {navSections.map((section) => (
                <div key={`mobile-${section.id}`} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50">
                    <section.icon className="h-4 w-4 text-white/50" />
                    {section.label}
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          className={`flex items-center gap-3 rounded-md py-1.5 text-sm font-normal ${
                            active
                              ? "text-white bg-[#0044FF]/15 border-l-4 border-[#0044FF] pl-[9px] pr-3"
                              : "text-white/70 hover:bg-white/5 hover:text-white px-3 transition-colors"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.icon ? (
                            <item.icon className={`h-4 w-4 ${active ? "text-icon" : ""}`} />
                          ) : item.customIcon ? (
                            <item.customIcon className={`h-4 w-4 ${active ? "text-icon" : ""}`} />
                          ) : null}
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="pt-4 border-t border-sidebar-border">
              <Link
                href="#"
                className="flex items-center gap-3 text-sm font-normal text-white/70 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle className="h-4 w-4" />
                Support
              </Link>
              <button
                onClick={() => {
                  setShowDiscountModal(true);
                  setMobileMenuOpen(false);
                }}
                className="mt-2 flex items-center gap-3 text-sm font-normal text-white/70 hover:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                Réduction Legal Place
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Design inspiré de l'image - Fixée pour rester visible */}
        <aside className="hidden lg:flex w-[240px] shrink-0 bg-[#0a0a0a] border-r border-sidebar-border flex flex-col sticky top-[61.6px] h-[calc(100vh-61.6px)] overflow-y-auto">
          {/* Navigation principale - Toutes les sections */}
          <nav className="flex-1 p-3">
            {/* Sections toujours ouvertes */}
            <div className="space-y-3">
              {navSections.map((section) => (
                <div key={section.id} className="mb-2">
                  {/* En-tête de section */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <section.icon className="h-5 w-5 shrink-0 text-white/60" />
                    <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                      {section.label}
                    </span>
                  </div>
                  
                  {/* Items de la section */}
                  <div className="ml-4 pl-7 border-l border-sidebar-border space-y-0.5">
                    {section.items.map((item) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          className={`relative flex items-center gap-3 py-1.5 text-sm rounded-md font-normal ${
                            active
                              ? "text-white bg-[#0044FF]/15 border-l-4 border-[#0044FF] pl-[9px] pr-3"
                              : "text-white/60 hover:text-white/90 hover:bg-[#141414]/50 px-3 transition-colors"
                          }`}
                        >
                          {item.customIcon ? (
                            <item.customIcon className={`h-4 w-4 shrink-0 ${active ? "text-icon" : ""}`} />
                          ) : item.icon ? (
                            <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-icon" : ""}`} />
                          ) : null}
                          <span className={active ? "text-white" : ""}>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer Sidebar */}
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-normal text-white/70 hover:text-white hover:bg-[#141414] rounded-md transition-all duration-150"
            >
              <HelpCircle className="h-5 w-5 shrink-0 text-white/60" />
              <span>Support</span>
            </Link>
            <button
              onClick={() => setShowDiscountModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-normal text-white/70 hover:text-white hover:bg-[#141414] rounded-md transition-all duration-150 text-left"
            >
              <ShoppingBag className="h-5 w-5 shrink-0 text-white/60" />
              <span className="truncate">Réduction Legal Place</span>
            </button>
          </div>

          {/* User Section */}
          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3 px-3 py-2">
              <UserAvatar name={displayName} photo={user?.avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <div
                  className="mt-1 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    borderColor: `${grade.color}60`,
                    backgroundColor: `${grade.color}20`,
                  }}
                >
                  <grade.icon className="h-4 w-4" style={{ color: grade.color }} />
                  <span style={{ color: grade.color }}>{grade.label}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-[#141414] rounded-md transition-all duration-150"
            >
              <LogOut className="h-5 w-5 shrink-0 text-white/60" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main Content - Zone de scroll indépendante */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] h-[calc(100vh-61.6px)]">
          <div className="p-7 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Discount Code Modal */}
      <DiscountCodeModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        code="CORENTIN15"
      />
    </div>
  );
}
