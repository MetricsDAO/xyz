/**
 * @type {import('tailwindcss/defaultConfig').TailwindConfig}
 */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  extend: {
    colors: {
      brand: {
        50: "#dbfaff",
        100: "#b1e9fc",
        200: "#86daf5",
        300: "#59caf0",
        400: "#2ebbea",
        500: "#15a1d1",
        600: "#037ea3",
        700: "#005a76",
        800: "#00374a",
        900: "#00141d",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
