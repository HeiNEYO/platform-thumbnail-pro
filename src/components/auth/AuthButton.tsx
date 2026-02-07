"use client";

import { ReactNode } from "react";

interface AuthButtonProps {
  type: "submit" | "button";
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

export function AuthButton({ type, disabled = false, children, onClick }: AuthButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full py-4 rounded-lg bg-[#0044FF] hover:bg-[#2255FF] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0044FF]/50"
    >
      {disabled ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
