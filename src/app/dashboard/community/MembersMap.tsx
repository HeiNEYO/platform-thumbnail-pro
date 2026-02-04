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
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (!mapContainerRef.current || mapRef.current) return;

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
      mapRef.current = map;
      map.whenReady(() => {
        setTimeout(() => {
          map.invalidateSize();
          setMapReady(true);
        }, 150);
      });

      // Nettoyer lors du démontage
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          setMapReady(false);
        }
      };
    }).catch((err) => {
      console.error("Erreur lors du chargement de Leaflet:", err);
    });
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !mapReady || !mapRef.current || !members.length) return;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Supprimer les anciens marqueurs
      markersRef.current.forEach((marker) => {
        mapRef.current?.removeLayer(marker);
      });
      markersRef.current = [];

      const membersWithLocation = members.filter(m => {
        const lat = Number(m.latitude);
        const lng = Number(m.longitude);
        return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
      });

      if (membersWithLocation.length === 0) {
        return;
      }

      const bounds = L.default.latLngBounds([]);

      membersWithLocation.forEach((member) => {
        const lat = Number(member.latitude);
        const lng = Number(member.longitude);

        // Marqueur classique (icône par défaut) + cercle bleu pour visibilité max
        const circle = L.default.circleMarker([lat, lng], {
          radius: 14,
          fillColor: "#2563EB",
          color: "#ffffff",
          weight: 3,
          opacity: 1,
          fillOpacity: 1,
        });
        circle.addTo(mapRef.current!);

        // Popup au clic
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

        circle.bindPopup(popupContent);
        markersRef.current.push(circle);
        bounds.extend([lat, lng]);
      });

      // Forcer le rafraîchissement de la carte pour afficher les marqueurs
      mapRef.current.invalidateSize();

      // Ajuster la vue pour voir tous les marqueurs (avec zoom max pour 1 point)
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    }).catch((err) => {
      console.error("Erreur lors du chargement de Leaflet pour les marqueurs:", err);
    });
  }, [isMounted, mapReady, members]);

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
        .leaflet-overlay-pane {
          z-index: 400 !important;
        }
        .leaflet-pane svg {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
}

export default MembersMap;
