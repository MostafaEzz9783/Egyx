import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#ededed",
        foreground: "#222222",
        panel: "#ffffff",
        accent: "#d92027",
        muted: "#6b7280",
        border: "#d7d7d7",
        danger: "#ef4444",
        success: "#22c55e"
      },
      boxShadow: {
        glow: "0 1px 2px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.06)"
      },
      backgroundImage: {
        "hero-grid": "none"
      },
      fontFamily: {
        sans: ["Tahoma", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
