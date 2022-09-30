/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

const mainColor = colors.sky;

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./templates/**/*.{js,ts,jsx,tsx}",
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
      },
    },
  },
  plugins: [],
}
