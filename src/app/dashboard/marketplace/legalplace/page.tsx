"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  imageUrl: string;
  affiliateLink: string;
  promoCode?: string;
  badge?: "best-seller" | "en-vogue";
}

const legalplaceOffers: Offer[] = [
  {
    id: "micro-entreprise",
    title: "Micro-entreprise",
    imageUrl: "/images/marketplace/legalplace/micro-entreprise.jpg",
    affiliateLink: "https://www.legalplace.fr/creation/product/creation-micro-entreprise",
    promoCode: "THUMBNAIL10",
  },
  {
    id: "creation-societe",
    title: "Création de société",
    imageUrl: "/images/marketplace/legalplace/creation-societe.jpg",
    affiliateLink: "https://www.legalplace.fr/creation/creation-entreprise-2",
    promoCode: "THUMBNAIL10",
    badge: "best-seller",
  },
  {
    id: "modification-statuts",
    title: "Modifications de statuts",
    imageUrl: "/images/marketplace/legalplace/modification-statuts.jpg",
    affiliateLink: "https://www.legalplace.fr/creation/product/modification-statuts",
    promoCode: "THUMBNAIL10",
    badge: "en-vogue",
  },
  {
    id: "dissolution-statuts",
    title: "Dissolutions de statuts",
    imageUrl: "/images/marketplace/legalplace/dissolution-statuts.jpg",
    affiliateLink: "https://www.legalplace.fr/creation/product/dissolution-societe",
    promoCode: "THUMBNAIL10",
    badge: "en-vogue",
  },
  {
    id: "domiciliation",
    title: "Domiciliation",
    imageUrl: "/images/marketplace/legalplace/domiciliation.jpg",
    affiliateLink: "https://www.legalplace.fr/landing/domiciliation",
    promoCode: "THUMBNAIL10",
  },
  {
    id: "comptabilite",
    title: "Comptabilité",
    imageUrl: "/images/marketplace/legalplace/comptabilite.jpg",
    affiliateLink: "https://www.legalplace.fr/landing/landing-expertise-comptable",
    promoCode: "THUMBNAIL10",
  },
];

export default function LegalPlacePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section - Image Header */}
      <div className="relative h-[400px] rounded-lg border border-white/10 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.legalplace.fr/wp-content/uploads/2024/11/HeroBackground2x_1.webp"
            alt="LegalPlace"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Section Explicative du Partenariat */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">LegalPlace</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-base leading-relaxed">
            LegalPlace est votre partenaire de confiance pour toutes vos démarches légales et administratives. 
            Que vous souhaitiez créer votre entreprise, modifier vos statuts, ou gérer votre comptabilité, 
            LegalPlace simplifie vos procédures juridiques pour vous permettre de vous concentrer sur votre croissance.
          </p>
          <p className="text-white/80 text-base leading-relaxed">
            Grâce à notre partenariat exclusif, bénéficiez d'offres privilégiées sur tous les services LegalPlace 
            et accélérez le développement de votre activité.
          </p>
        </div>
      </div>

      {/* Grille des Offres d'Affiliation */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Nos offres partenaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legalplaceOffers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden hover:border-white/20 transition-colors"
            >
              {/* Image de l'offre */}
              <div className="relative h-[200px] bg-gradient-to-br from-white/10 to-white/5">
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                  {offer.imageUrl}
                </div>
                {/* Badge si présent */}
                {offer.badge && (
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        offer.badge === "best-seller"
                          ? "bg-[#FF6B35] text-white"
                          : "bg-[#10B981] text-white"
                      }`}
                    >
                      {offer.badge === "best-seller" ? "Best seller" : "En vogue"}
                    </span>
                  </div>
                )}
              </div>

              {/* Contenu de la carte */}
              <div className="p-5 space-y-4">
                {/* Titre */}
                <h3 className="text-lg font-bold text-white">{offer.title}</h3>

                {/* Banderole Code Promo */}
                {offer.promoCode && (
                  <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 py-2 rounded-lg flex items-center justify-between">
                    <span className="text-white text-sm font-medium">Code promo</span>
                    <span className="text-white text-sm font-bold">{offer.promoCode}</span>
                  </div>
                )}

                {/* Bouton CTA */}
                <a
                  href={offer.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  <span>Découvrir l'offre</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
