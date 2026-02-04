"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  switchText: string;
  switchLink: string;
  switchLinkText: string;
}

export function AuthFormWrapper({
  title,
  subtitle,
  children,
  switchText,
  switchLink,
  switchLinkText,
}: AuthFormWrapperProps) {
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#0f0f0f] min-h-screen">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-block mb-12">
          <Image
            src="/images/logo.svg"
            alt="Thumbnail Pro Logo"
            width={40}
            height={40}
            className="shrink-0"
          />
        </Link>

        {/* Titre principal */}
        <h1 className="text-[32px] sm:text-[36px] lg:text-[42px] font-bold text-white mb-3 leading-tight">
          {title}
        </h1>

        {/* Sous-titre */}
        <p className="text-[14px] sm:text-[16px] text-[#A0A0A0] mb-8 sm:mb-12">
          {subtitle}
        </p>

        {/* Formulaire */}
        {children}

        {/* Lien de basculement */}
        <div className="text-center mt-10">
          <p className="text-[14px] text-[#999999]">
            {switchText}{" "}
            <Link
              href={switchLink}
              className="text-[#3B82F6] font-semibold hover:text-[#60A5FA] transition-colors duration-300"
            >
              {switchLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
