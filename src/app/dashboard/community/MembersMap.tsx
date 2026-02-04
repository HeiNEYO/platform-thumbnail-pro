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

      // Couleurs des grades (alignées avec MemberCard)
      const gradeStyles: Record<string, { color: string; bg: string; border: string; label: string }> = {
        admin: { color: "#FF8282", bg: "rgba(255, 130, 130, 0.15)", border: "rgba(255, 130, 130, 0.4)", label: "Admin" },
        intervenant: { color: "#82FFBC", bg: "rgba(130, 255, 188, 0.15)", border: "rgba(130, 255, 188, 0.4)", label: "Intervenant" },
        member: { color: "#82ACFF", bg: "rgba(130, 172, 255, 0.15)", border: "rgba(130, 172, 255, 0.4)", label: "Membre" },
      };

      membersWithLocation.forEach((member) => {
        const lat = Number(member.latitude);
        const lng = Number(member.longitude);
        const role = member.role || "member";
        const grade = gradeStyles[role] || gradeStyles.member;

        // Icône pin (location) en SVG, couleur selon le grade
        const pinIcon = L.default.divIcon({
          className: "map-pin-icon",
          html: `
            <div style="position:relative;display:inline-block;">
              <svg width="32" height="40" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.25 8 14.5 8.5 15 .15.2.36.3.5.3s.35-.1.5-.3c.5-.5 8.5-9.75 8.5-15C20.5 3.81 16.69 0 12 0z" fill="${grade.color}" stroke="#0a0a0a" stroke-width="1.5"/>
                <circle cx="12" cy="8.5" r="3.5" fill="#0a0a0a"/>
              </svg>
            </div>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        });

        const marker = L.default.marker([lat, lng], { icon: pinIcon }).addTo(mapRef.current!);

        const popupContent = `
          <div class="p-3 min-w-[180px]" style="background:#0a0a0a;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;">
            <h3 class="font-semibold text-sm mb-1" style="color:#fff;">${(member.full_name || "Membre").replace(/</g, "&lt;")}</h3>
            ${member.city || member.country 
              ? `<p class="text-xs mb-2" style="color:rgba(255,255,255,0.6);">${[member.city, member.country].filter(Boolean).join(", ").replace(/</g, "&lt;")}</p>`
              : ""
            }
            <span class="inline-block px-2 py-0.5 text-xs rounded" style="color:${grade.color};background:${grade.bg};border:1px solid ${grade.border}">${grade.label}</span>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
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
        .map-pin-icon {
          background: none !important;
          border: none !important;
        }
        .map-pin-icon svg {
          display: block;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
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
