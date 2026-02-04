"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CommunityMember } from "@/lib/db/community";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface MembersMapProps {
  members: CommunityMember[];
}

// Fix pour les icônes Leaflet avec Next.js
const createIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Icône par défaut pour les marqueurs
const defaultIcon = createIcon("https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png");
const shadowIcon = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

function MembersMap({ members }: MembersMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialiser la carte centrée sur le monde
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    });

    // Ajouter le fond de carte (tile layer) - style simple et épuré
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Nettoyer lors du démontage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || members.length === 0) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Créer un groupe de marqueurs pour gérer les clusters si nécessaire
    const bounds = L.latLngBounds([]);

    members.forEach((member) => {
      if (!member.latitude || !member.longitude) return;

      const lat = Number(member.latitude);
      const lng = Number(member.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      // Créer un marqueur personnalisé avec avatar
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div class="relative">
            <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-[#0a0a0a]">
              ${member.avatar_url 
                ? `<img src="${member.avatar_url}" alt="${member.full_name || 'Membre'}" class="w-full h-full object-cover" />`
                : `<div class="w-full h-full flex items-center justify-center text-white text-xs font-semibold bg-[#1D4ED8]">${(member.full_name || member.email || 'M').charAt(0).toUpperCase()}</div>`
              }
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1D4ED8] rounded-full border-2 border-white"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current!);

      // Créer le contenu du popup
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <div class="flex items-center gap-3 mb-2">
            ${member.avatar_url 
              ? `<img src="${member.avatar_url}" alt="${member.full_name || 'Membre'}" class="w-10 h-10 rounded-full object-cover" />`
              : `<div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-[#1D4ED8]">${(member.full_name || member.email || 'M').charAt(0).toUpperCase()}</div>`
            }
            <div>
              <h3 class="font-semibold text-gray-900 text-sm">${member.full_name || "Membre"}</h3>
              ${member.city || member.country 
                ? `<p class="text-xs text-gray-600">${[member.city, member.country].filter(Boolean).join(", ")}</p>`
                : ""
              }
            </div>
          </div>
          ${member.role === "admin" 
            ? `<span class="inline-block px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">Admin</span>`
            : member.role === "intervenant"
            ? `<span class="inline-block px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-800">Intervenant</span>`
            : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
      bounds.extend([lat, lng]);
    });

    // Ajuster la vue pour voir tous les marqueurs
    if (members.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [members]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[600px] w-full rounded-lg border border-white/10 overflow-hidden bg-[#0a0a0a]"
        style={{ zIndex: 1 }}
      />
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-tip {
          background: white;
        }
        .leaflet-container {
          background: #0a0a0a;
        }
      `}</style>
    </div>
  );
}

export default MembersMap;
