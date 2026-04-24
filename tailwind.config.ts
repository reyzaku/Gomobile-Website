import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        bricolage: ["var(--font-bricolage)", "sans-serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
        nunitoSans: ["var(--font-nunito-sans)", "sans-serif"],
        helvetica: ["Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        brand: { orange: "#ef6600", red: "#cb0000" },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(72deg, #ef6600 5%, #cb0000 91%)",
      },
      screens: { "2xl": "1440px", "3xl": "1920px" },
    },
  },
  plugins: [],
} satisfies Config;
