"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Save, Loader2, Upload, X, CheckCircle2, AlertCircle, MapPin, Search } from "lucide-react";
import type { UserRow } from "@/lib/supabase/database.types";

export default function ProfilePage() {
  const { user, refreshUserProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [discordTag, setDiscordTag] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [xp, setXp] = useState(0);
  const [completedEvaluations, setCompletedEvaluations] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const loadProfileData = useCallback(async () => {
    if (!user || isDevMode) return;

    try {
      const supabase = createClient();
      
      // Récupérer seulement les colonnes de base qui existent toujours
      const { data: rawProfile, error } = await supabase
        .from("users")
        .select("id, email, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement du profil:", error);
        return;
      }

      const profile: any = rawProfile;
      if (profile) {
        const nameParts = profile.full_name?.split(" ") || [];
        setFirstName(nameParts[0] || "");
        setEmail(profile.email || "");
        setAvatarUrl(profile.avatar_url);
        
        // Essayer de charger les handles si les colonnes existent (sans erreur si elles n'existent pas)
        try {
          const { data: handlesData, error: handlesError } = await supabase
            .from("users")
            .select("discord_tag, twitter_handle")
            .eq("id", user.id)
            .single();

          if (handlesError) {
            throw handlesError;
          }

          if (handlesData) {
            const handles = handlesData as any;
            setDiscordTag(handles.discord_tag?.replace(/^@+/, "") || "");
            setTwitterHandle(handles.twitter_handle?.replace(/^@+/, "") || "");
          }
        } catch (err) {
          console.warn("Impossible de charger les handles Twitter/Discord :", err);
          setDiscordTag("");
          setTwitterHandle("");
        }

        // Charger les données de localisation
        try {
          const { data: locationData, error: locationError } = await supabase
            .from("users")
            .select("city, country, show_location, latitude, longitude")
            .eq("id", user.id)
            .single();

          if (!locationError && locationData) {
            const location = locationData as any;
            setCity(location.city || "");
            setCountry(location.country || "");
            setShowLocation(location.show_location || false);
          }
        } catch (err) {
          console.warn("Impossible de charger les données de localisation :", err);
        }
        
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
        setDiscordTag("");
        setTwitterHandle("");
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
      setUploadMessage({ type: "error", text: "L'image est trop grande. Taille maximale : 4MB" });
      setTimeout(() => setUploadMessage(null), 5000);
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith("image/")) {
      setUploadMessage({ type: "error", text: "Veuillez sélectionner une image" });
      setTimeout(() => setUploadMessage(null), 5000);
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
      
      setUploadMessage({ type: "success", text: "Photo de profil mise à jour avec succès !" });
      setTimeout(() => setUploadMessage(null), 5000);
    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);
      setUploadMessage({ 
        type: "error", 
        text: error.message || "Erreur lors de l'upload de la photo. Veuillez réessayer." 
      });
      setTimeout(() => setUploadMessage(null), 5000);
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
      
      setUploadMessage({ type: "success", text: "Photo de profil supprimée" });
      setTimeout(() => setUploadMessage(null), 5000);
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      setUploadMessage({ 
        type: "error", 
        text: error.message || "Erreur lors de la suppression. Veuillez réessayer." 
      });
      setTimeout(() => setUploadMessage(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || isDevMode) {
      setSaveMessage({ type: "success", text: "Profil sauvegardé (mode dev)" });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      const supabase = createClient();
      
      // Sauvegarder d'abord les données de base (toujours présentes)
      const baseUpdateData: any = {
        full_name: firstName.trim() || null,
        avatar_url: avatarUrl,
      };
      
      const { error: baseError } = await supabase
        .from("users")
        .update(baseUpdateData as never)
        .eq("id", user.id);

      if (baseError) {
        console.error("Erreur Supabase (base):", baseError);
        throw new Error(baseError.message || "Erreur lors de la sauvegarde");
      }

      // Sauvegarder les handles (toujours, même si vides pour les mettre à null)
      const cleanDiscordTag = discordTag.trim().replace(/^@+/, "").trim() || null;
      const cleanTwitterHandle = twitterHandle.trim().replace(/^@+/, "").trim() || null;
      
      // Préparer les données de mise à jour avec les handles (toujours inclure pour mettre à jour)
      const handlesUpdateData: any = {
        discord_tag: cleanDiscordTag,
        twitter_handle: cleanTwitterHandle,
      };
      
      // Essayer de sauvegarder les handles
      const { error: handlesError } = await supabase
        .from("users")
        .update(handlesUpdateData as never)
        .eq("id", user.id);
      
      if (handlesError) {
        console.error("Erreur lors de la sauvegarde des handles:", handlesError);
        // Si les colonnes n'existent pas, afficher un message clair
        const errorMessage = handlesError.message || "";
        const errorCode = handlesError.code || "";
        
        throw handlesError;
      }

      // Sauvegarder les données de localisation
      const cleanCity = city.trim() || null;
      const cleanCountry = country.trim() || null;
      
      // Si la localisation est activée et qu'on a une ville ou un pays, géocoder
      let latitude: number | null = null;
      let longitude: number | null = null;
      
      if (showLocation && (cleanCity || cleanCountry)) {
        try {
          const query = [cleanCity, cleanCountry].filter(Boolean).join(", ");
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
            {
              headers: {
                "User-Agent": "ThumbnailPro/1.0",
              },
            }
          );
          const data = await response.json();
          if (data && data.length > 0) {
            latitude = parseFloat(data[0].lat);
            longitude = parseFloat(data[0].lon);
          }
        } catch (err) {
          console.warn("Erreur lors du géocodage:", err);
        }
      }

      const locationUpdateData: any = {
        city: cleanCity,
        country: cleanCountry,
        show_location: showLocation,
        latitude: showLocation ? latitude : null,
        longitude: showLocation ? longitude : null,
      };
      
      const { error: locationError } = await supabase
        .from("users")
        .update(locationUpdateData as never)
        .eq("id", user.id);
      
      if (locationError) {
        console.warn("Erreur lors de la sauvegarde de la localisation:", locationError);
        // Ne pas bloquer la sauvegarde si les colonnes n'existent pas encore
      }

      // Rafraîchir le profil dans le contexte
      await refreshUserProfile();
      
      setSaveMessage({ type: "success", text: "Profil mis à jour avec succès !" });
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde:", err);
      setSaveMessage({ 
        type: "error", 
        text: err.message || "Erreur lors de la sauvegarde. Veuillez réessayer." 
      });
      setTimeout(() => setSaveMessage(null), 5000);
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
              {uploadMessage && (
                <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                  uploadMessage.type === "success" 
                    ? "bg-success/10 border-success/30 text-success" 
                    : "bg-error/10 border-error/30 text-error"
                }`}>
                  {uploadMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  )}
                  <p className="font-medium">{uploadMessage.text}</p>
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
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-sm">@</span>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => {
                    const value = e.target.value.replace(/^@+/, "");
                    setTwitterHandle(value);
                  }}
                  className="w-full rounded-lg border border-card-border bg-black pl-8 pr-4 py-3 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="votre_handle"
                  maxLength={50}
                />
              </div>
              <p className="text-xs text-white/50 mt-1.5">Votre nom d&apos;utilisateur X/Twitter</p>
            </div>

            <div className="flex-shrink-0">
              <label className="block text-sm font-semibold text-white mb-2">
                @ Discord
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-sm">@</span>
                <input
                  type="text"
                  value={discordTag}
                  onChange={(e) => {
                    const value = e.target.value.replace(/^@+/, "");
                    setDiscordTag(value);
                  }}
                  className="w-full rounded-lg border border-card-border bg-black pl-8 pr-4 py-3 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="votre_tag#1234"
                  maxLength={50}
                />
              </div>
              <p className="text-xs text-white/50 mt-1.5">Votre tag Discord (ex: username#1234)</p>
            </div>

            {/* Section Localisation */}
            <div className="flex-shrink-0 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-white/70" />
                <h3 className="text-sm font-semibold text-white">Localisation</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-card-border bg-black px-4 py-3 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Paris"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-card-border bg-black px-4 py-3 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="France"
                    maxLength={100}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showLocation"
                    checked={showLocation}
                    onChange={(e) => setShowLocation(e.target.checked)}
                    className="w-4 h-4 rounded border-card-border bg-black text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  />
                  <label htmlFor="showLocation" className="text-sm text-white/80 cursor-pointer">
                    Afficher ma localisation sur la carte des membres
                  </label>
                </div>
                <p className="text-xs text-white/50">
                  Votre position sera visible sur la carte de la communauté si vous activez cette option
                </p>
              </div>
            </div>

            {/* Message de succès/erreur */}
            {saveMessage && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
                saveMessage.type === "success" 
                  ? "bg-success/10 border-success/30 text-success" 
                  : "bg-error/10 border-error/30 text-error"
              }`}>
                {saveMessage.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0" />
                )}
                <p className="text-sm font-medium">{saveMessage.text}</p>
              </div>
            )}

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
