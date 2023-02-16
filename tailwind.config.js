/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#EEBA5E",
          DEFAULT: "#F6AE2D",
          dark: "#F26419",
        },
        secondary: {
          light: "#86BBD8",
          DEFAULT: "#33658A",
          dark: "#2F4858",
        },
        tertiary: {
          light: "#747373",
          DEFAULT: "#353535",
          dark: "#0F0F0F",
        },
        background: "#F8F9FA",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
