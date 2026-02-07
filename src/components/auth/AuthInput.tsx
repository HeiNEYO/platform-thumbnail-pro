"use client";

import { ReactNode } from "react";

interface AuthInputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: ReactNode;
  autoComplete?: string;
  required?: boolean;
}

export function AuthInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  icon,
  autoComplete,
  required = false,
}: AuthInputProps) {
  return (
    <div className="relative mb-6">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#999999] z-10">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full pl-12 pr-4 py-4 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-white placeholder-[#999999] focus:border-[#0044FF] focus:outline-none focus:ring-2 focus:ring-[#0044FF]/20 transition-all duration-300 text-base"
        suppressHydrationWarning
      />
    </div>
  );
}
