"use client";

import { useEffect, useRef, useState } from "react";
import type { CommunityMember } from "@/lib/db/community";
import "leaflet/dist/leaflet.css";

interface MembersMapProps {
  members: CommunityMember[];
}

function MembersMap({ members }: MembersMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    // Charger Leaflet dynamiquement côté client uniquement
    import("leaflet").then((L) => {
      if (!mapContainerRef.current || mapRef.current) return;

      // Initialiser la carte centrée sur le monde
      const map = L.default.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
      });

      // Ajouter le fond de carte dark avec seulement les contours des pays
      // Utiliser CartoDB Dark Matter (style dark minimaliste)
      let tileLayer: any;
      
      try {
        tileLayer = L.default.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: "", // Masquer l'attribution
          maxZoom: 19,
          subdomains: "abcd",
          tileSize: 256,
          zoomOffset: 0,
        });
        
        tileLayer.addTo(map);
        
        // Gérer les erreurs de chargement des tuiles - fallback vers OSM si nécessaire
        tileLayer.on("tileerror", (error: any) => {
          console.warn("Erreur de chargement de tuile CartoDB, utilisation du fallback OSM");
          // Si CartoDB ne fonctionne pas, utiliser OpenStreetMap avec un filtre dark
          if (mapRef.current) {
            mapRef.current.removeLayer(tileLayer);
            const osmLayer = L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "", // Masquer l'attribution
              maxZoom: 19,
            });
            osmLayer.addTo(mapRef.current);
          }
        });
      } catch (err) {
        console.error("Erreur lors de la création du tile layer:", err);
        // Fallback vers OpenStreetMap
        const osmLayer = L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "", // Masquer l'attribution
          maxZoom: 19,
        });
        osmLayer.addTo(map);
      }
      
      // Vérifier que la carte est bien initialisée
      map.whenReady(() => {
        console.log("Carte Leaflet initialisée avec succès");
        // Forcer le redraw si nécessaire
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      });

      mapRef.current = map;

      // Nettoyer lors du démontage
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }).catch((err) => {
      console.error("Erreur lors du chargement de Leaflet:", err);
    });
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !mapRef.current) return;

    // Charger Leaflet dynamiquement
    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Supprimer les anciens marqueurs
      markersRef.current.forEach((marker) => {
        mapRef.current?.removeLayer(marker);
      });
      markersRef.current = [];

      // Filtrer les membres avec localisation valide
      console.log("🔍 Membres reçus pour la carte:", members.length);
      console.log("🔍 Détails des membres:", members.map(m => ({
        id: m.id,
        name: m.full_name,
        show_location: m.show_location,
        latitude: m.latitude,
        longitude: m.longitude,
        city: m.city,
        country: m.country
      })));

      const membersWithLocation = members.filter(m => 
        m.latitude && m.longitude && 
        !isNaN(Number(m.latitude)) && 
        !isNaN(Number(m.longitude))
      );

      console.log("✅ Membres avec localisation valide:", membersWithLocation.length);
      console.log("✅ Coordonnées:", membersWithLocation.map(m => ({
        name: m.full_name,
        lat: m.latitude,
        lng: m.longitude
      })));

      if (membersWithLocation.length === 0) {
        console.log("⚠️ Aucun membre avec localisation valide à afficher");
        return;
      }

      // Créer un groupe de marqueurs pour gérer les clusters si nécessaire
      const bounds = L.default.latLngBounds([]);

      membersWithLocation.forEach((member) => {
        const lat = Number(member.latitude);
        const lng = Number(member.longitude);

        console.log(`📍 Création du marqueur pour ${member.full_name} à [${lat}, ${lng}]`);

        // Créer une icône de localisation simple et sobre
        const locationIcon = L.default.divIcon({
          className: "location-marker",
          html: `
            <div class="relative flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#1D4ED8" stroke="#0a0a0a" stroke-width="1.5"/>
              </svg>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24],
        });

        const marker = L.default.marker([lat, lng], { icon: locationIcon }).addTo(mapRef.current!);
        console.log(`✅ Marqueur créé et ajouté pour ${member.full_name}`);

        // Créer le contenu du popup sobre
        const popupContent = `
          <div class="p-3 min-w-[180px]">
            <h3 class="font-semibold text-white text-sm mb-1">${member.full_name || "Membre"}</h3>
            ${member.city || member.country 
              ? `<p class="text-xs text-white/60 mb-2">${[member.city, member.country].filter(Boolean).join(", ")}</p>`
              : ""
            }
            ${member.role === "admin" 
              ? `<span class="inline-block px-2 py-0.5 text-xs rounded bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30">Admin</span>`
              : member.role === "intervenant"
              ? `<span class="inline-block px-2 py-0.5 text-xs rounded bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30">Intervenant</span>`
              : ""
            }
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
        bounds.extend([lat, lng]);
      });

      // Ajuster la vue pour voir tous les marqueurs
      if (membersWithLocation.length > 0 && bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }).catch((err) => {
      console.error("Erreur lors du chargement de Leaflet pour les marqueurs:", err);
    });
  }, [isMounted, members]);

  if (!isMounted) {
    return (
      <div className="h-[600px] rounded-lg border border-white/10 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/50">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[600px] w-full rounded-lg border border-white/10 overflow-hidden bg-[#0a0a0a]"
        style={{ zIndex: 1 }}
      />
      <style jsx global>{`
        .location-marker {
          background: transparent !important;
          border: none !important;
        }
        .location-marker svg {
          display: block !important;
          width: 24px !important;
          height: 24px !important;
        }
        .leaflet-marker-icon {
          z-index: 1000 !important;
        }
        .leaflet-popup-content-wrapper {
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          color: white;
        }
        .leaflet-popup-tip {
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .leaflet-container {
          background: #0a0a0a;
        }
        /* S'assurer que les tuiles sont visibles */
        .leaflet-tile-container img {
          opacity: 1 !important;
        }
        .leaflet-tile-pane {
          opacity: 1 !important;
        }
        /* Le style CartoDB Dark Matter est déjà sombre avec océans noirs et pays gris foncé */
        /* Ajuster légèrement pour correspondre au design du site */
        .leaflet-tile {
          filter: brightness(0.9) contrast(1.05) !important;
        }
        /* Masquer l'attribution OpenStreetMap */
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

export default MembersMap;
