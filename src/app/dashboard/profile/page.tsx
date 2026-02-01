"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Save, Loader2, Upload, X } from "lucide-react";
import type { UserRow } from "@/lib/supabase/database.types";

export default function ProfilePage() {
  const { user, refreshUserProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [discordTag, setDiscordTag] = useState("");
  const [xp, setXp] = useState(0);
  const [completedEvaluations, setCompletedEvaluations] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

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
        setAvatarUrl(profile.avatar_url);
        setTwitterHandle(profile.twitter_handle || "");
        setDiscordTag(profile.discord_tag || "");
        
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
        setTwitterHandle("");
        setDiscordTag("");
        setXp(1250);
        setCompletedEvaluations(3);
        return;
      }
      loadProfileData();
    }
  }, [user, isDevMode, loadProfileData]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Vérifier la taille (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert("L'image est trop grande. Taille maximale : 4MB");
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl } as never)
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      // Mettre à jour l'état local
      setAvatarUrl(publicUrl);
      
      // Rafraîchir le profil dans le contexte pour mettre à jour partout
      await refreshUserProfile();
      
      alert("Photo de profil mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors de l'upload de la photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !avatarUrl) return;

    if (!confirm("Voulez-vous supprimer votre photo de profil ?")) {
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      
      // Supprimer l'URL de la base de données
      const { error } = await supabase
        .from("users")
        .update({ avatar_url: null } as never)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setAvatarUrl(null);
      
      // Rafraîchir le profil dans le contexte pour mettre à jour partout
      await refreshUserProfile();
      
      alert("Photo de profil supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
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
          avatar_url: avatarUrl,
          twitter_handle: twitterHandle || null,
          discord_tag: discordTag || null,
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
        {/* Colonne gauche - Identité et Stats */}
        <div className="flex flex-col gap-6 min-h-0">
          <div className="rounded-lg border border-card-border bg-black p-8 overflow-hidden flex-shrink-0">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 relative group">
                <UserAvatar
                  name={firstName || user?.email || ""}
                  photo={avatarUrl}
                  size="lg"
                />
                {/* Overlay pour upload */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-white" />
                    <span className="text-xs text-white">Modifier</span>
                  </div>
                </div>
                {/* Bouton pour changer la photo */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Changer la photo de profil"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {/* Bouton supprimer si photo existe */}
                {avatarUrl && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    className="absolute -top-2 -right-2 bg-error hover:bg-error/80 text-white rounded-full p-1.5 shadow-lg transition-colors disabled:opacity-50"
                    aria-label="Supprimer la photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {uploading && (
                <div className="mb-2 text-xs text-white/70 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Upload en cours...</span>
                </div>
              )}
              <h2 className="text-xl font-bold text-white break-words mb-2">
                {firstName || "Utilisateur"}
              </h2>
              <p className="text-xs text-white/50 mb-4">
                Cliquez sur la photo pour la modifier (max 4MB)
              </p>
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

            <div className="flex-shrink-0">
              <label className="block text-sm font-semibold text-white mb-2">
                @ X (Twitter)
              </label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-black px-4 py-3 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="@votre_handle"
                maxLength={50}
              />
              <p className="text-xs text-white/50 mt-1.5">Votre nom d&apos;utilisateur X (sans le @)</p>
            </div>

            <div className="flex-shrink-0">
              <label className="block text-sm font-semibold text-white mb-2">
                @ Discord
              </label>
              <input
                type="text"
                value={discordTag}
                onChange={(e) => setDiscordTag(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-black px-4 py-3 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="votre_tag#1234"
                maxLength={50}
              />
              <p className="text-xs text-white/50 mt-1.5">Votre tag Discord (ex: username#1234)</p>
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
