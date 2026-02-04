"use client";

import { useState } from "react";
import { ArrowRight, Copy, Check, Users } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  imageUrl: string;
  affiliateLink: string;
  description: string;
}

const legalplaceOffers: Offer[] = [
  {
    id: "micro-entreprise",
    title: "Micro-entreprise",
    imageUrl: "/images/marketplace/legalplace/micro-entreprise.jpg",
    affiliateLink: "https://www.legalplace.fr/creation/product/creation-micro-entreprise",
    description: "Créez votre micro-entreprise en quelques clics. Statut idéal pour démarrer votre activité rapidement avec des formalités simplifiées et une fiscalité avantageuse.",
  },
  {
    id: "creation-societe",
    title: "Création de société",
    imageUrl: "/images/marketplace/legalplace/creation-societe.jpg",
    affiliateLink: "https://www.legalplace.fr/creation/creation-entreprise-2",
    description: "Créez votre société (SAS, SARL, EURL) en toute simplicité. Accompagnement complet pour toutes les démarches administratives et juridiques nécessaires.",
  },
  {
    id: "modification-statuts",
    title: "Modifications de statuts",
    imageUrl: "/images/marketplace/legalplace/modification-statuts.jpg",
    affiliateLink: "https://www.legalplace.fr/creation/product/modification-statuts",
    description: "Modifiez les statuts de votre société selon vos besoins évolutifs. Changement de capital, d'objet social, de dirigeant... Nous gérons tout pour vous.",
  },
  {
    id: "dissolution-statuts",
    title: "Dissolutions de statuts",
    imageUrl: "/images/marketplace/legalplace/dissolution-statuts.jpg",
    affiliateLink: "https://www.legalplace.fr/creation/product/dissolution-societe",
    description: "Dissolvez votre société en toute conformité. Procédure simplifiée pour clôturer votre activité dans les règles et éviter tout litige.",
  },
  {
    id: "domiciliation",
    title: "Domiciliation",
    imageUrl: "/images/marketplace/legalplace/domiciliation.jpg",
    affiliateLink: "https://www.legalplace.fr/landing/domiciliation",
    description: "Domiciliez votre entreprise à l'adresse de votre choix. Service de réexpédition du courrier inclus pour une gestion simplifiée de votre boîte aux lettres professionnelle.",
  },
  {
    id: "comptabilite",
    title: "Comptabilité",
    imageUrl: "/images/marketplace/legalplace/comptabilite.jpg",
    affiliateLink: "https://www.legalplace.fr/landing/landing-expertise-comptable",
    description: "Confiez votre comptabilité à des experts. Tenue de comptabilité, déclarations fiscales et sociales, conseil en gestion... Tout pour vous concentrer sur votre cœur de métier.",
  },
];

export default function LegalPlacePage() {
  const [copied, setCopied] = useState(false);
  const promoCode = "CORENTIN15";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section - Image Header */}
      <div className="relative h-[400px] rounded-lg border border-white/10 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.legalplace.fr/wp-content/uploads/2025/12/legalplace-creation-gestion-societe-og.png"
            alt="LegalPlace"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bandeau Code Promo */}
      <div className="w-full bg-[#0a0a0a] border border-white/10 px-6 py-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-white/80 text-sm font-medium">Code promo exclusif</p>
            <p className="text-white text-xl font-bold">{promoCode} - 15% de réduction</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-white/30 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">Copié !</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">Copier</span>
            </>
          )}
        </button>
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
          {legalplaceOffers.map((offer) => {
            const isMicroEntreprise = offer.id === "micro-entreprise";
            return (
              <div
                key={offer.id}
                className={`relative rounded-lg border bg-[#0a0a0a] overflow-hidden hover:border-white/20 transition-colors ${
                  isMicroEntreprise
                    ? "border-[#2563EB]"
                    : "border-white/10"
                }`}
                style={
                  isMicroEntreprise
                    ? {
                        animation: "shimmer-blue 2s ease-in-out infinite",
                      }
                    : {}
                }
              >
                {/* Badge "Le plus choisi" pour Micro-entreprise */}
                {isMicroEntreprise && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] rounded-full border-2 border-white/20">
                      <Users className="h-3.5 w-3.5 text-white" />
                      <span className="text-white text-xs font-semibold">Le plus choisi</span>
                    </div>
                  </div>
                )}

                {/* Image de l'offre */}
                <div className="relative h-[200px] bg-gradient-to-br from-white/10 to-white/5">
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                    {offer.imageUrl}
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-5 space-y-4">
                  {/* Titre */}
                  <h3 className="text-lg font-bold text-white">{offer.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-white/60 leading-relaxed">{offer.description}</p>

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
            );
          })}
        </div>
      </div>

    </div>
  );
}
