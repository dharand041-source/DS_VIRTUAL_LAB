/** @type {import('tailwindcss').Config} */
module.exports = {
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
          DEFAULT: "#09090b",
          hover: "#18181b",
          muted: "#27272a",
          red: "#dc2626",
        },
        secondary: "#52525b",
        muted: "#71717a",
        border: {
          DEFAULT: "#E4E4E7",
          subtle: "#F4F4F5",
          strong: "#D4D4D8",
          red: "#fecaca",
        },
        accent: {
          red: "#dc2626",
          "red-hover": "#b91c1c",
          "red-light": "#fef2f2",
          blue: "#2563EB",
          emerald: "#059669",
          amber: "#D97706",
          rose: "#dc2626",
          indigo: "#4F46E5",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        floating: "0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        red: "0 4px 14px 0 rgba(220, 38, 38, 0.25)",
      },
      animation: {
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
};
