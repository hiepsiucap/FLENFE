/** @format */

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        opensans: ["Open Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      height: {
        custom: "500px",
        custom2: "700px",
      },
      width: {
        custom: "500px",
      },
      colors: {
        primary: "#37AFE1",
        primary1: "#4CC9FE",
        secondary: "#F5F4B3",
        secondary2: "#FFFECB",
      },
      animation: {
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        wiggle: " wiggle ease-in-out infinite",
      },
      keyframes: {
        shake: {
          "10%, 90%": {
            transform: "translate3d(-2px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(3px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-5px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(5px, 0, 0)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
