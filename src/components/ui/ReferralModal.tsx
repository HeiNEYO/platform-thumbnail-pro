"use client";

import { X, Users } from "lucide-react";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop avec transition fluide */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[modalBackdropIn_0.2s_ease-out_forwards]"
        aria-hidden
      />
      {/* Contenu modal */}
      <div
        className="relative bg-[#0a0a0a] border border-white/10 rounded-xl p-8 max-w-sm w-full shadow-2xl animate-[modalContentIn_0.3s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Parraine un ami
          </h2>
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            Le système d&apos;affiliation vous permettra de gagner 200€ par personne qui rejoindra la formation avec votre lien, et vous offrira un apprentissage dans les meilleures conditions.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-medium">
            <span>⏳</span>
            Bientôt disponible
          </div>
        </div>
      </div>
    </div>
  );
}
