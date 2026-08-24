import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#FAFAFA",
        "surface-subtle": "#F4F4F5",
        primary: {
          DEFAULT: "#111111",
          hover: "#27272A",
          muted: "#3F3F46",
        },
        secondary: "#52525B",
        muted: "#71717A",
        border: {
          DEFAULT: "#E4E4E7",
          subtle: "#F4F4F5",
          strong: "#D4D4D8",
        },
        accent: {
          blue: "#2563EB",
          emerald: "#059669",
          amber: "#D97706",
          rose: "#E11D48",
          indigo: "#4F46E5",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        floating: "0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
};

export default config;
