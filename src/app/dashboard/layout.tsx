"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Home, BookOpen, FolderOpen, User, LogOut, 
  HelpCircle, ShoppingBag, Bell, Plus, Minus,
  Heart, FileText, BarChart3, GraduationCap
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { DiscountCodeModal } from "@/components/ui/DiscountCodeModal";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

// Structure de navigation avec sections collapsibles
const navSections = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Accueil", icon: Home },
      { href: "/dashboard/favorites", label: "Mes favoris", icon: Heart },
      { href: "/dashboard/notes", label: "Mes notes", icon: FileText },
      { href: "/dashboard/stats", label: "Statistiques", icon: BarChart3 },
    ],
  },
  {
    id: "academy",
    label: "Academy",
    items: [
      { href: "/dashboard/modules", label: "Formation", icon: BookOpen },
      { href: "/dashboard/masterclass", label: "Masterclass", icon: GraduationCap },
      { href: "/dashboard/resources", label: "Ressources", icon: FolderOpen },
    ],
  },
  {
    id: "tools",
    label: "Outils & Services",
    items: [
      { href: "/dashboard/discord", label: "Discord", icon: null, customIcon: DiscordIcon },
      { href: "/dashboard/profile", label: "Profil", icon: User },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview", "academy", "tools"])
  );
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const displayName = user?.full_name ?? user?.email ?? "";

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Fonction pour générer les breadcrumbs
  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") return "Accueil";
    if (pathname.startsWith("/dashboard/modules")) {
      return "Academy > Formation";
    }
    if (pathname.startsWith("/dashboard/resources")) {
      return "Academy > Ressources";
    }
    if (pathname.startsWith("/dashboard/discord")) {
      return "Outils & Services > Discord";
    }
    if (pathname.startsWith("/dashboard/profile")) {
      return "Outils & Services > Profil";
    }
    return "Dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header Top Bar - Agrandi de 10% */}
      <header className="h-[61.6px] shrink-0 border-b border-sidebar-border bg-black flex items-center justify-between px-[22px]">
        {/* Logo + Breadcrumbs */}
        <div className="flex items-center gap-[22px]">
          <Link href="/dashboard" className="flex items-center gap-[11px]">
            <img
              src="/images/logo.png"
              alt="Thumbnail Pro Logo"
              width={27.5}
              height={27.5}
              className="shrink-0"
            />
            <span className="text-[17.6px] font-bold text-white">
              Thumbnail Pro
            </span>
          </Link>
          <div className="text-white/70 text-[13.2px]">
            {getBreadcrumbs()}
          </div>
        </div>

        {/* Actions Right */}
        <div className="flex items-center gap-[15.4px]">
          <button className="px-[15.4px] py-[6.6px] rounded-lg bg-black border border-card-border text-white text-[13.2px] font-medium hover:bg-card-hover transition-colors">
            Parraine un ami et gagne jusqu'à 600€
          </button>
          <button className="p-[6.6px] text-white/70 hover:text-white transition-colors">
            <Bell className="h-[19.8px] w-[19.8px]" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[232px] shrink-0 bg-black border-r border-sidebar-border flex flex-col overflow-y-auto">
          {/* Navigation avec sections - Moins d'espace entre sections */}
          <nav className="flex-1 p-4">
            {navSections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <div key={section.id} className="mb-1">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-2 py-2.5 text-white text-xs font-medium hover:bg-sidebar-selected rounded-lg transition-colors"
                  >
                    <span>{section.label}</span>
                    {isExpanded ? (
                      <Minus className="h-[14px] w-[14px] text-white/50" />
                    ) : (
                      <Plus className="h-[14px] w-[14px] text-white/50" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 space-y-1.5">
                      {section.items.map((item) => {
                        const active =
                          pathname === item.href ||
                          (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-all duration-200 rounded-lg ${
                              active
                                ? "bg-sidebar-selected text-white"
                                : "text-white/50 hover:text-white hover:bg-sidebar-selected"
                            }`}
                          >
                            {item.customIcon ? (
                              <item.customIcon className="h-[18px] w-[18px] shrink-0" />
                            ) : item.icon ? (
                              <item.icon className="h-[18px] w-[18px] shrink-0" />
                            ) : null}
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-4 border-t border-sidebar-border space-y-1.5">
            <Link
              href="#"
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-white/50 hover:text-white hover:bg-sidebar-selected rounded-lg transition-all duration-200"
            >
              <HelpCircle className="h-[18px] w-[18px] shrink-0" />
              <span>Contacter le support technique</span>
            </Link>
            <button
              onClick={() => setShowDiscountModal(true)}
              className="w-full flex items-start gap-2.5 px-3.5 py-2.5 text-xs font-medium text-white/50 hover:text-white hover:bg-sidebar-selected rounded-lg transition-all duration-200 text-left"
            >
              <ShoppingBag className="h-[18px] w-[18px] shrink-0 mt-0.5" />
              <span>15% de réduction avec Legal Place</span>
            </button>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2.5 mb-3">
              <UserAvatar name={displayName} photo={user?.avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] font-medium rounded">
                    Plus
                  </span>
                  <span className="text-[10px] text-white/50">Membre</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-white/50 hover:text-white hover:bg-sidebar-selected rounded-lg transition-all duration-200"
            >
              <LogOut className="h-[14px] w-[14px]" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-black">
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
