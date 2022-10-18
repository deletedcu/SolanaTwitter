/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

const mainColor = colors.sky;

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/templates/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: mainColor[100],
          200: mainColor[200],
          300: mainColor[300],
          400: mainColor[400],
          500: mainColor[500],
          600: mainColor[600],
          700: mainColor[700],
          800: mainColor[800],
          900: mainColor[900],
        },
        focus: "rgb(var(--focus-color))"
      },
      textColor: {
        color: {
          primary: "rgb(var(--text-color-primary))",
          secondary: "rgb(var(--text-color-secondary))",
          third: "rgb(var(--text-color-third))",
        },
      },
      backgroundColor: {
        fill: {
          primary: "rgb(var(--fill-color-primary))",
          secondary: "rgb(var(--fill-color-secondary))",
          third: "rgb(var(--fill-color-third))",
          opacity: "rgba(var(--fill-color-opacity), 0.2)",
        },
      },
      borderColor: {
        skin: {
          primary: "rgba(var(--border-color), 0.3)",
          secondary: "rgb(var(--focus-color))"
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};
