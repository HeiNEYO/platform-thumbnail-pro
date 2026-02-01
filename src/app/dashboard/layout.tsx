"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Home, BookOpen, FolderOpen, User, LogOut, 
  HelpCircle, ShoppingBag, Bell, Plus, Minus,
  Heart, FileText, BarChart3, GraduationCap,
  ChevronUp, ChevronDown, Compass, Headphones,
  CheckSquare, Settings, Calendar
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { DiscountCodeModal } from "@/components/ui/DiscountCodeModal";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

// Liens directs (toujours visibles en haut)
const directLinks = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/dashboard/modules", label: "Formation", icon: BookOpen },
  { href: "/dashboard/favorites", label: "Mes favoris", icon: Heart },
  { href: "/dashboard/stats", label: "Statistiques", icon: BarChart3 },
  { href: "/dashboard/notes", label: "Mes notes", icon: FileText },
  { href: "/dashboard/resources", label: "Ressources", icon: FolderOpen },
  { href: "/dashboard/profile", label: "Profil", icon: User },
];

// Sections collapsibles (en bas)
const collapsibleSections = [
  {
    id: "academy",
    label: "Academy",
    icon: GraduationCap,
    items: [
      { href: "/dashboard/modules", label: "Formation", icon: BookOpen },
      { href: "/dashboard/masterclass", label: "Masterclass", icon: GraduationCap },
      { href: "/dashboard/resources", label: "Ressources", icon: FolderOpen },
    ],
  },
  {
    id: "community",
    label: "Communauté",
    icon: Compass,
    items: [
      { href: "/dashboard/discord", label: "Discord", icon: null, customIcon: DiscordIcon },
      { href: "/dashboard/community", label: "Communauté", icon: Compass },
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
            <Image
              src="/images/logo.png"
              alt="Thumbnail Pro Logo"
              width={28}
              height={28}
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
            Parraine un ami et gagne jusqu&apos;à 600€
          </button>
          <button className="p-[6.6px] text-white/70 hover:text-white transition-colors">
            <Bell className="h-[19.8px] w-[19.8px]" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Design inspiré de l'image */}
        <aside className="w-[240px] shrink-0 bg-[#0a0a0a] border-r border-sidebar-border flex flex-col overflow-y-auto">
          {/* Navigation principale - Liens directs */}
          <nav className="flex-1 p-3">
            {/* Liens directs en haut */}
            <div className="space-y-0.5 mb-6">
              {directLinks.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-md group ${
                      active
                        ? "bg-[#1a1a1a] text-white font-semibold"
                        : "text-white/70 hover:text-white hover:bg-[#141414]"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-white/60 group-hover:text-white/80"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Séparateur */}
            <div className="h-px bg-sidebar-border my-4" />

            {/* Sections collapsibles */}
            <div className="space-y-1">
              {collapsibleSections.map((section) => {
                const isExpanded = expandedSections.has(section.id);
                
                return (
                  <div key={section.id} className="mb-2">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-[#141414] rounded-md transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="h-5 w-5 shrink-0 text-white/60 group-hover:text-white/80" />
                        <span>{section.label}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-white/50 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-white/50 shrink-0" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-1 ml-4 pl-7 border-l border-sidebar-border space-y-0.5">
                        {section.items.map((item) => {
                          const active =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-3 px-3 py-2 text-sm transition-all duration-150 rounded-md ${
                                active
                                  ? "text-white font-medium"
                                  : "text-white/60 hover:text-white/90"
                              }`}
                            >
                              {item.customIcon ? (
                                <item.customIcon className="h-4 w-4 shrink-0" />
                              ) : item.icon ? (
                                <item.icon className="h-4 w-4 shrink-0" />
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
            </div>
          </nav>

          {/* Footer Sidebar */}
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-[#141414] rounded-md transition-all duration-150"
            >
              <HelpCircle className="h-5 w-5 shrink-0 text-white/60" />
              <span>Support</span>
            </Link>
            <button
              onClick={() => setShowDiscountModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-[#141414] rounded-md transition-all duration-150 text-left"
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
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-[#141414] rounded-md transition-all duration-150"
            >
              <LogOut className="h-5 w-5 shrink-0 text-white/60" />
              <span>Déconnexion</span>
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
