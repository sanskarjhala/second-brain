import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // darkbg: "#091413",  //best color its matched now...
        navbg: "#1A1A1A",
        cardbg: "#1E1E1E",
        accent: "#A855F7",
        accentHover: "#C084FC",
        secondary: "#B3B3B3",
        darkGreen: "#285A48"

        // New colors for Dark Mode

      },
      fontFamily: {
        "edu-sa": ["'Edu SA Beginner'", "cursive"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
