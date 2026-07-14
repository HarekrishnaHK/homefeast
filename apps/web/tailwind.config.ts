import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm spice-pantry palette — deliberately not the generic cream+terracotta pairing.
        ink: "#221E19",       // near-black warm charcoal — primary text
        paper: "#FAF4E6",     // warm ivory background
        paperDim: "#F1E9D6",  // slightly deeper card background
        leaf: {
          DEFAULT: "#2C4A3B", // banana-leaf green — primary brand color
          deep: "#1C3128",
          light: "#3E6350",
        },
        turmeric: {
          DEFAULT: "#D8A320", // golden turmeric — accent / CTAs
          deep: "#B4831A",
          light: "#F0C860",
        },
        paprika: "#B5502D",   // spice red — used sparingly (alerts, ratings)
        clay: "#8C6E4E",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-work-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        tin: "999px",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(34, 30, 25, 0.08)",
        card: "0 4px 20px rgba(34, 30, 25, 0.06)",
      },
      backgroundImage: {
        "leaf-gradient": "linear-gradient(135deg, #2C4A3B 0%, #1C3128 100%)",
        "turmeric-gradient": "linear-gradient(135deg, #F0C860 0%, #D8A320 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
