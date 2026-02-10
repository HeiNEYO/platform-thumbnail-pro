"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Save, Loader2, Upload, X, CheckCircle2, AlertCircle, MapPin, Search, Locate } from "lucide-react";
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
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showLocation, setShowLocation] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string; address?: Record<string, string> }>>([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [activeSearchField, setActiveSearchField] = useState<"address" | "city" | "country" | null>(null);
  const addressSearchRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
            setLatitude(location.latitude != null ? Number(location.latitude) : null);
            setLongitude(location.longitude != null ? Number(location.longitude) : null);
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

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setSaveMessage({ type: "error", text: "La géolocalisation n'est pas supportée par votre navigateur." });
      setTimeout(() => setSaveMessage(null), 4000);
      return;
    }
    setLoadingGeo(true);
    setSaveMessage(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
            { headers: { "User-Agent": "ThumbnailPro/1.0" } }
          );
          const data = await res.json();
          const addr = data?.address || {};
          const cityVal = addr.city || addr.town || addr.village || addr.municipality || "";
          const countryVal = addr.country || "";
          setCity(cityVal);
          setCountry(countryVal);
          setLatitude(lat);
          setLongitude(lon);
          setShowLocation(true);
        } catch (e) {
          setCity("");
          setCountry("");
          setLatitude(lat);
          setLongitude(lon);
          setShowLocation(true);
        } finally {
          setLoadingGeo(false);
        }
      },
      () => {
        setLoadingGeo(false);
        setSaveMessage({ type: "error", text: "Accès à la position refusé ou indisponible." });
        setTimeout(() => setSaveMessage(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    const query = locationSearchQuery.trim();
    if (!query) {
      setAddressSuggestions([]);
      setShowAddressDropdown(false);
      return;
    }
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    addressDebounceRef.current = setTimeout(() => {
      setLoadingSuggestions(true);
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
        { headers: { "User-Agent": "ThumbnailPro/1.0" } }
      )
        .then((r) => r.json())
        .then((data: Array<{ display_name: string; lat: string; lon: string; address?: Record<string, string> }>) => {
          setAddressSuggestions(data || []);
          setShowAddressDropdown(true);
        })
        .catch(() => setAddressSuggestions([]))
        .finally(() => setLoadingSuggestions(false));
    }, 400);
    return () => {
      if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    };
  }, [locationSearchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inAddress = addressSearchRef.current?.contains(target);
      const inCity = cityRef.current?.contains(target);
      const inCountry = countryRef.current?.contains(target);
      if (!inAddress && !inCity && !inCountry) setShowAddressDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectAddressSuggestion = useCallback((item: { display_name: string; lat: string; lon: string; address?: Record<string, string> }) => {
    const addr = item.address || {};
    setCity(addr.city || addr.town || addr.village || addr.municipality || "");
    setCountry(addr.country || "");
    setLatitude(parseFloat(item.lat));
    setLongitude(parseFloat(item.lon));
    setAddressSearch(item.display_name);
    setShowAddressDropdown(false);
    setShowLocation(true);
  }, []);

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
      
      let latToSave: number | null = latitude;
      let lonToSave: number | null = longitude;
      if (showLocation && (cleanCity || cleanCountry) && (latToSave == null || lonToSave == null)) {
        try {
          const query = [cleanCity, cleanCountry].filter(Boolean).join(", ");
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
            { headers: { "User-Agent": "ThumbnailPro/1.0" } }
          );
          const data = await response.json();
          if (data && data.length > 0) {
            latToSave = parseFloat(data[0].lat);
            lonToSave = parseFloat(data[0].lon);
          }
        } catch (err) {
          console.warn("Erreur lors du géocodage:", err);
        }
      }

      const locationUpdateData: any = {
        city: cleanCity,
        country: cleanCountry,
        show_location: showLocation,
        latitude: showLocation ? latToSave : null,
        longitude: showLocation ? lonToSave : null,
      };
      
      try {
        const { error: locationError } = await supabase
          .from("users")
          .update(locationUpdateData as never)
          .eq("id", user.id);
        
        if (locationError) {
          console.error("Erreur lors de la sauvegarde de la localisation:", locationError);
          // Vérifier si c'est parce que les colonnes n'existent pas
          const errorMessage = locationError.message?.toLowerCase() || "";
          if (errorMessage.includes("column") || errorMessage.includes("does not exist")) {
            setSaveMessage({ 
              type: "error", 
              text: "Les colonnes de localisation n'existent pas encore. Veuillez exécuter le script SQL dans Supabase." 
            });
            setTimeout(() => setSaveMessage(null), 8000);
            return;
          }
          throw locationError;
        }
      } catch (locationErr: any) {
        console.error("Erreur lors de la sauvegarde de la localisation:", locationErr);
        const errorMessage = locationErr.message?.toLowerCase() || "";
        if (errorMessage.includes("column") || errorMessage.includes("does not exist")) {
          setSaveMessage({ 
            type: "error", 
            text: "Les colonnes de localisation n'existent pas. Exécutez le script supabase-add-location-fields.sql dans Supabase." 
          });
          setTimeout(() => setSaveMessage(null), 8000);
          return;
        }
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

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white text-sm placeholder:text-white/40 focus:border-[#0044FF] focus:outline-none focus:ring-2 focus:ring-[#0044FF]/20 transition-all";

  return (
    <div className="animate-fade-in max-w-5xl space-y-6">
      <div>
        <h1 className="text-[27px] font-bold text-white mb-2">Profil</h1>
        <p className="text-white/70 text-sm">Gérez vos informations personnelles</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Colonne gauche - Identité et Stats */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="relative">
                  <UserAvatar
                    name={firstName || user?.email || ""}
                    photo={avatarUrl}
                    size="lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 rounded-full cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Changer la photo"
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {avatarUrl && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    className="absolute -top-1 -right-1 bg-red-500/90 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors disabled:opacity-50 z-10"
                    aria-label="Supprimer la photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {uploading && (
                <p className="text-xs text-white/60 flex items-center justify-center gap-2 mb-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Upload en cours...
                </p>
              )}
              {uploadMessage && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-3 ${
                  uploadMessage.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {uploadMessage.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  <span>{uploadMessage.text}</span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-white">{firstName || "Utilisateur"}</h2>
              <p className="text-xs text-white/50 mt-1">Cliquez sur la photo pour modifier (max 4MB)</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-base font-semibold text-white mb-4">Statistiques</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-white/60 mb-1">XP accumulé</p>
                <p className="text-2xl font-bold text-[#0044FF]">{xp.toLocaleString()}</p>
                <p className="text-[11px] text-white/50 mt-1">Augmente avec votre progression</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-white/60 mb-1">Évaluations réussies</p>
                <p className="text-2xl font-bold text-emerald-400">{completedEvaluations}</p>
                <p className="text-[11px] text-white/50 mt-1">Système à venir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite - Informations personnelles */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-base font-semibold text-white mb-5">Informations personnelles</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1.5">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                placeholder="Votre prénom"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/50 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-white/50 mt-1">Non modifiable</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1.5">X (Twitter)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">@</span>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value.replace(/^@+/, ""))}
                    className={`${inputClass} pl-8`}
                    placeholder="handle"
                    maxLength={50}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1.5">Discord</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">@</span>
                  <input
                    type="text"
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value.replace(/^@+/, ""))}
                    className={`${inputClass} pl-8`}
                    placeholder="tag#1234"
                    maxLength={50}
                  />
                </div>
              </div>
            </div>

            {/* Section Localisation */}
            <div className="pt-5 mt-5 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-white/60" />
                <h3 className="text-sm font-medium text-white">Localisation</h3>
              </div>

              <p className="text-xs text-white/50 mb-4">
                Utilisez votre position ou recherchez une adresse pour apparaître sur la carte.
              </p>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={loadingGeo}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#0044FF]/40 bg-[#0044FF]/10 text-[#0044FF] px-4 py-2.5 text-sm font-medium hover:bg-[#0044FF]/20 transition-colors disabled:opacity-50"
                >
                  {loadingGeo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
                  {loadingGeo ? "Localisation..." : "Utiliser ma position"}
                </button>

                <div className="relative text-white/40 text-xs text-center py-1">ou</div>

                <div ref={addressSearchRef} className="relative">
                  <label className="block text-sm font-medium text-white/90 mb-1.5">Rechercher une adresse</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      value={addressSearch}
                      onChange={(e) => {
                        const v = e.target.value;
                        setAddressSearch(v);
                        setLocationSearchQuery(v);
                        setActiveSearchField("address");
                      }}
                      onFocus={() => setActiveSearchField("address")}
                      className={`${inputClass} pl-10`}
                      placeholder="Adresse, ville ou code postal..."
                    />
                    {loadingSuggestions && activeSearchField === "address" && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                      </span>
                    )}
                  </div>
                  {showAddressDropdown && addressSuggestions.length > 0 && activeSearchField === "address" && (
                    <ul className="absolute z-20 mt-1 w-full rounded-xl border border-white/10 bg-[#141414] py-1 shadow-xl max-h-48 overflow-y-auto">
                      {addressSuggestions.map((item, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => selectAddressSuggestion(item)}
                            className="w-full text-left px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 transition-colors rounded-lg mx-1"
                          >
                            {item.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div ref={cityRef} className="relative">
                  <label className="block text-sm font-medium text-white/90 mb-1.5">Ville</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCity(v);
                        setLocationSearchQuery(v);
                        setActiveSearchField("city");
                      }}
                      onFocus={() => {
                        setActiveSearchField("city");
                        if (city.trim()) setLocationSearchQuery(city);
                      }}
                      className={inputClass}
                      placeholder="Paris"
                      maxLength={100}
                    />
                    {loadingSuggestions && activeSearchField === "city" && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                      </span>
                    )}
                  </div>
                  {showAddressDropdown && addressSuggestions.length > 0 && activeSearchField === "city" && (
                    <ul className="absolute z-20 mt-1 w-full rounded-xl border border-white/10 bg-[#141414] py-1 shadow-xl max-h-48 overflow-y-auto">
                      {addressSuggestions.map((item, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => selectAddressSuggestion(item)}
                            className="w-full text-left px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 transition-colors rounded-lg mx-1"
                          >
                            {item.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div ref={countryRef} className="relative">
                  <label className="block text-sm font-medium text-white/90 mb-1.5">Pays</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCountry(v);
                        setLocationSearchQuery(v);
                        setActiveSearchField("country");
                      }}
                      onFocus={() => {
                        setActiveSearchField("country");
                        if (country.trim()) setLocationSearchQuery(country);
                      }}
                      className={inputClass}
                      placeholder="France"
                      maxLength={100}
                    />
                    {loadingSuggestions && activeSearchField === "country" && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                      </span>
                    )}
                  </div>
                  {showAddressDropdown && addressSuggestions.length > 0 && activeSearchField === "country" && (
                    <ul className="absolute z-20 mt-1 w-full rounded-xl border border-white/10 bg-[#141414] py-1 shadow-xl max-h-48 overflow-y-auto">
                      {addressSuggestions.map((item, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => selectAddressSuggestion(item)}
                            className="w-full text-left px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 transition-colors rounded-lg mx-1"
                          >
                            {item.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showLocation}
                    aria-label="Afficher ma localisation sur la carte"
                    onClick={() => setShowLocation(!showLocation)}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                      showLocation ? "bg-[#0044FF]" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                        showLocation ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <label
                    onClick={() => setShowLocation(!showLocation)}
                    className="text-sm text-white/80 cursor-pointer select-none"
                  >
                    Afficher sur la carte communauté
                  </label>
                </div>
              </div>
            </div>

            {saveMessage && (
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm ${
                saveMessage.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}>
                {saveMessage.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{saveMessage.text}</span>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0044FF] hover:bg-[#0038cc] disabled:opacity-50 text-white font-medium rounded-xl transition-colors text-sm w-full mt-4"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
