/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('tnnp_bkg-01.jpg.jpg')"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // add Poppins as a custom font
      },
      gridTemplateColumns: {
        fluid: "repeat(auto-fit, minmax(250px, 300px))",
        "fluid-sm": "repeat(auto-fit, minmax(250px, 1fr))",
        "fluid-lg": "repeat(auto-fit, minmax(350px, 1fr))",
        "fluid-table": "repeat(auto-fill, minmax(auto, 1fr))",
      },
      colors: {
        // Dominant color (background)
        background: {
          dark: "#232323", // Dark gray background color
          light: "#ffffff", // Dark gray background color
        },
        // Secondary color (light gray tones)
        secondary: {
          light: "#2d2d2d", // Slightly lighter gray for cards and containers
          dark: "#5E5E5E", // Light gray used for borders and some text
        },
        // Accent colors
        accent: {
          green: "#2DB475", // Green used in icons, text, and positive metrics
          red: "#D21C5B", // Red used to highlight critical metrics like 'Deactivated Accounts'
        },
        // Text colors
        text: {
          dark: "#e5e5e5", // Light gray for primary text color
          muted: "#9ca3af", // Muted gray for less prominent text
          light: "#000000",
        },
      },
    },
  },
  plugins: [],
};
