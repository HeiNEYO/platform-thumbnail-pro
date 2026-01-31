"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Camera, Save, Loader2 } from "lucide-react";
import type { UserRow } from "@/lib/supabase/database.types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [xp, setXp] = useState(0);
  const [completedEvaluations, setCompletedEvaluations] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

  const loadProfileData = useCallback(async () => {
    if (!user || isDevMode) return;

    try {
      const supabase = createClient();
      
      // Récupérer le profil complet (cast pour contourner l'inférence never du client Supabase)
      const { data: rawProfile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement du profil:", error);
        return;
      }

      const profile: UserRow | null = rawProfile as UserRow | null;
      if (profile) {
        const nameParts = profile.full_name?.split(" ") || [];
        setFirstName(nameParts[0] || "");
        setEmail(profile.email || "");
        setAccountNumber(profile.account_number ?? `TP-${user.id.slice(0, 6).toUpperCase()}`);
        
        // Calculer l'XP basé sur la progression (à adapter selon votre logique)
        // Pour l'instant, on simule avec un calcul basique
        const { data: progressData } = await supabase
          .from("progress")
          .select("episode_id")
          .eq("user_id", user.id);

        const episodesCompleted = progressData?.length || 0;
        // 10 XP par épisode complété
        setXp(episodesCompleted * 10);

        // Compter les évaluations réussies (à implémenter plus tard)
        setCompletedEvaluations(0);
      }
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    }
  }, [user, isDevMode]);

  useEffect(() => {
    if (user) {
      const nameParts = user.full_name?.split(" ") || [];
      setFirstName(nameParts[0] || "");
      setEmail(user.email || "");
      setAvatarUrl(user.avatar_url);
      if (isDevMode) {
        setAccountNumber("TP-001234");
        setXp(1250);
        setCompletedEvaluations(3);
        return;
      }
      loadProfileData();
    }
  }, [user, isDevMode, loadProfileData]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      
      // Upload vers Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Mettre à jour le profil (assertion pour contourner le typage .update(never) du client Supabase)
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl } as never)
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error("Erreur lors de l'upload:", err);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || isDevMode) {
      alert("Profil sauvegardé (mode dev)");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      
      // Mettre à jour le prénom (full_name) — assertion pour contourner le typage .update(never) du client Supabase
      const { error } = await supabase
        .from("users")
        .update({
          full_name: firstName,
          account_number: accountNumber,
        } as never)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      alert("Profil mis à jour avec succès");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-[27px] font-bold mb-2 text-white">Profil</h1>
        <p className="text-white/70 text-sm">Gérez vos informations personnelles</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 flex-1 min-h-0">
        {/* Colonne gauche - Photo et Stats */}
        <div className="flex flex-col gap-6 min-h-0">
          {/* Photo de profil */}
          <div className="rounded-lg border border-card-border bg-black p-8 overflow-hidden flex-shrink-0">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5">
                <UserAvatar
                  name={firstName || user?.email || ""}
                  photo={avatarUrl}
                  size="lg"
                />
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border-2 border-black hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <h2 className="text-xl font-bold text-white break-words mb-2">
                {firstName || "Utilisateur"}
              </h2>
              <p className="text-xs text-white/70">Cliquez sur l&apos;icône pour changer votre photo</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="rounded-lg border border-card-border bg-black p-8 overflow-hidden flex-1 flex flex-col min-h-0">
            <h2 className="text-lg font-bold text-white mb-6 flex-shrink-0">Statistiques</h2>
            
            <div className="space-y-5 flex-1">
              <div className="p-6 bg-sidebar-selected rounded-lg border border-card-border flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/70">XP accumulé</p>
                  <span className="text-xs text-primary font-bold">{xp.toLocaleString()}</span>
                </div>
                <p className="text-3xl font-bold text-white break-words mb-2">{xp.toLocaleString()}</p>
                <p className="text-xs text-white/50">Augmente avec votre progression</p>
              </div>

              <div className="p-6 bg-sidebar-selected rounded-lg border border-card-border flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/70">Évaluations réussies</p>
                  <span className="text-xs text-success font-bold">{completedEvaluations}</span>
                </div>
                <p className="text-3xl font-bold text-white break-words mb-2">{completedEvaluations}</p>
                <p className="text-xs text-white/50">Système d&apos;évaluation à venir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite - Informations personnelles */}
        <div className="rounded-lg border border-card-border bg-black p-8 overflow-hidden flex flex-col min-h-0">
          <h2 className="text-lg font-bold text-white mb-6 flex-shrink-0">Informations personnelles</h2>
          
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="flex-shrink-0">
              <label className="block text-sm font-semibold text-white mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-black px-4 py-3 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Votre prénom"
                maxLength={50}
              />
            </div>

            <div className="flex-shrink-0">
              <label className="block text-sm font-semibold text-white mb-2">
                Numéro de compte
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-black px-4 py-3 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="TP-XXXXXX"
                maxLength={20}
              />
            </div>

            <div className="flex-shrink-0">
              <label className="block text-sm font-semibold text-white mb-2">
                Email du compte
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-lg border border-card-border bg-black/50 px-4 py-3 text-white/50 text-sm cursor-not-allowed truncate"
              />
              <p className="text-xs text-white/50 mt-1.5">L&apos;email ne peut pas être modifié</p>
            </div>

            <div className="mt-auto pt-4 flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-premium hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-lg transition-opacity text-sm w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
