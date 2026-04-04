import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#eeeeef",
          200: "#e6e9ed",
          600: "#95989c",
        },
        purple: {
          200: "#d9ddee",
          500: "#9493db",
          600: "#7164c0",
        },
        richblack: {
          5: "#F1F2FF",
          25: "#DBDDEA",
          50: "#C5C7D4",
          100: "#AFB2BF",
          200: "#999DAA",
          300: "#838894",
          400: "#6E727F",
          500: "#585D69",
          600: "#424854",
          700: "#2C333F",
          800: "#161D29",
          900: "#000814",
        },
        // ✅ Missing — used in forms & buttons
        yellow: {
          5: "#FFD60A",
          25: "#F5C842",  // hover state on buttons
          50: "#FFD60A",
        },
        // ✅ Missing — used for required asterisks & links
        pink: {
          200: "#FF7D9D",
        },
        // ✅ Missing — used for "Forgot Password" & description text
        blue: {
          100: "#47A5C5",
        },
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