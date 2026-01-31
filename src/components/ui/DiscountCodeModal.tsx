"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

interface DiscountCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export function DiscountCodeModal({ isOpen, onClose, code }: DiscountCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-black border border-card-border rounded-xl p-7 max-w-md w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5.5">
          <h2 className="text-lg font-bold text-white">Code de réduction LegalPlace</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-sidebar-selected"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="space-y-3.5">
          <p className="text-white/70 text-xs">
            Utilisez ce code pour obtenir <span className="font-semibold text-primary">15% de réduction</span> sur LegalPlace
          </p>

          <div className="flex items-center gap-2.5 p-3.5 bg-sidebar-selected rounded-lg border border-card-border">
            <div className="flex-1">
              <p className="text-[10px] text-white/50 mb-1">Code promo</p>
              <p className="text-[22.5px] font-bold text-white font-mono">{code}</p>
            </div>
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-gradient-premium hover:opacity-90 text-white font-semibold rounded-lg transition-opacity flex items-center gap-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-[14px] w-[14px]" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="h-[14px] w-[14px]" />
                  Copier
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-white/50 text-center">
            Le code sera automatiquement appliqué lors de votre commande
          </p>
        </div>
      </div>
    </div>
  );
}
