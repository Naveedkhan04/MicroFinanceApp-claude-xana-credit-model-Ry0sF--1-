import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

/**
 * Design tokens extracted from the UNITY GOLD reference screens:
 *   - deep black background with warm brown radial gradients
 *   - gold accent palette (champagne -> amber -> antique gold)
 *   - rounded 2xl cards with subtle gold borders
 *   - white pill inputs with gold token chips
 */
const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0A0704",
          deep: "#050301",
          panel: "#120C06",
        },
        surface: {
          DEFAULT: "#18120A",
          raised: "#231810",
        },
        border: {
          DEFAULT: "#2A2016",
          gold: "rgba(245, 195, 84, 0.25)",
        },
        gold: {
          50: "#FFF7E1",
          100: "#FDEAB4",
          200: "#F9D97E",
          300: "#F5C354",
          400: "#E9B955",
          500: "#D9A23A",
          600: "#B2873A",
          700: "#8A6423",
          800: "#5A4015",
          DEFAULT: "#F5C354",
          bright: "#FFD777",
          dim: "#B2873A",
        },
        text: {
          DEFAULT: "#F6E8C8",
          muted: "#A08A66",
          dim: "#7A6A50",
        },
        success: "#4ADE80",
        danger: "#E0614A",
        warning: "#F5A524",
        info: "#38BDF8",
        tether: "#4BB39A",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Noto Sans JP",
          "Hiragino Sans",
          "sans-serif",
        ],
        jp: [
          "Noto Sans JP",
          "Hiragino Sans",
          "Yu Gothic",
          "Inter",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.35)",
        gold: "0 8px 24px rgba(201, 145, 45, 0.35)",
        "gold-sm": "0 4px 12px rgba(201, 145, 45, 0.25)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(180deg, #E9B955 0%, #C18A2B 100%)",
        "gold-sheen":
          "linear-gradient(135deg, #FFE08A 0%, #F5C354 50%, #B2873A 100%)",
        "panel-gradient":
          "linear-gradient(180deg, rgba(24,18,10,0.85), rgba(12,8,4,0.92))",
        "rocks-bg":
          "radial-gradient(ellipse at 30% 80%, rgba(139, 90, 32, 0.55), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(92, 58, 20, 0.6), transparent 50%), radial-gradient(ellipse at 20% 30%, rgba(60, 40, 15, 0.7), transparent 60%), linear-gradient(180deg, #0a0704 0%, #1a0f06 40%, #2a1a0a 100%)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0A0704",
            foreground: "#F6E8C8",
            primary: {
              DEFAULT: "#F5C354",
              foreground: "#3B2608",
            },
            secondary: {
              DEFAULT: "#B2873A",
              foreground: "#FFFFFF",
            },
            success: { DEFAULT: "#4ADE80", foreground: "#052E16" },
            danger: { DEFAULT: "#E0614A", foreground: "#FFFFFF" },
            warning: { DEFAULT: "#F5A524", foreground: "#3B2608" },
          },
        },
      },
    }),
  ],
};

export default config;
