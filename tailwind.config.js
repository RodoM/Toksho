/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
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
          light: "#AAAAAA",
          DEFAULT: "#353535",
          dark: "#0F0F0F",
        },
        background: "#F8F9FA",
      },
      dropShadow: {
        navlink: "4px 4px 0px rgba(0,0,0,1)",
        items: "6px 6px 0px rgba(0,0,0,1)",
      },
      backgroundImage: {
        comic:
          "url('https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
