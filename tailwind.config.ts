import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#000000",
          secondary: "#000000",
        },
        foreground: {
          DEFAULT: "#ffffff",
          muted: "#a1a1aa",
        },
        card: {
          DEFAULT: "#000000",
          hover: "#0a0a0a",
          border: "#1a1a1a",
        },
        primary: {
          DEFAULT: "#5C6FFF",
          hover: "#7F85FF",
        },
        sidebar: {
          DEFAULT: "#000000",
          border: "#1a1a1a",
          selected: "#0a0a0a",
        },
        border: {
          DEFAULT: "#1a1a1a",
        },
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      fontSize: {
        '2.7xl': ['27px', { lineHeight: '32px' }],
        '1.8xl': ['22.5px', { lineHeight: '28px' }],
      },
      spacing: {
        '58': '14.5rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '7': '1.75rem',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
