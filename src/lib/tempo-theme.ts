/**
 * Tempo Theme Utilities
 *
 * This file contains utility functions and constants for the Tempo theme
 * extracted from the landing page.
 */

export const tempoTheme = {
  colors: {
    // Primary colors
    purple: {
      light: "#a78bfa", // purple-400
      DEFAULT: "#8b5cf6", // purple-500
      dark: "#7c3aed", // purple-600
    },
    blue: {
      light: "#60a5fa", // blue-400
      DEFAULT: "#3b82f6", // blue-500
      dark: "#2563eb", // blue-600
    },
    cyan: {
      light: "#22d3ee", // cyan-400
      DEFAULT: "#06b6d4", // cyan-500
      dark: "#0891b2", // cyan-600
    },

    // Background colors
    black: "#000000",
    slate: {
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },

    // Accent colors
    emerald: {
      light: "#34d399", // emerald-400
      DEFAULT: "#10b981", // emerald-500
      dark: "#059669", // emerald-600
    },
    amber: {
      light: "#fbbf24", // amber-400
      DEFAULT: "#f59e0b", // amber-500
      dark: "#d97706", // amber-600
    },
    red: {
      light: "#f87171", // red-400
      DEFAULT: "#ef4444", // red-500
      dark: "#dc2626", // red-600
    },
  },

  gradients: {
    purpleToBlue: "from-purple-500 to-blue-500",
    cyanToBlue: "from-cyan-500 to-blue-600",
    emeraldToTeal: "from-emerald-400 to-teal-600",
    amberToOrange: "from-amber-400 to-orange-600",
    redToRose: "from-red-400 to-rose-600",
  },

  effects: {
    glassmorphism: "bg-black/40 backdrop-blur-md border border-white/10",
    glow: {
      purple: "shadow-[0_0_40px_rgba(139,92,246,0.5)]",
      blue: "shadow-[0_0_40px_rgba(56,189,248,0.5)]",
      cyan: "shadow-[0_0_40px_rgba(34,211,238,0.5)]",
    },
  },

  text: {
    gradient:
      "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400",
    primary: "text-white",
    secondary: "text-white/70",
    accent: "text-purple-400",
  },
};

/**
 * Apply Tempo theme to an element
 * @param variant - The variant of the element
 * @returns Tailwind classes for the element
 */
export function applyTempoTheme(
  variant: "card" | "button" | "badge" | "input" | "text",
) {
  switch (variant) {
    case "card":
      return "bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6";
    case "button":
      return "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-purple-500/20 border-0";
    case "badge":
      return "bg-white/10 backdrop-blur-sm hover:bg-white/20 border-0 px-3 py-1.5";
    case "input":
      return "bg-black/20 border-white/10 text-white placeholder:text-white/50 focus:border-purple-500/50 focus:ring-purple-500/20";
    case "text":
      return "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400";
    default:
      return "";
  }
}
