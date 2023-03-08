/**
 * @type {import('tailwindcss/defaultConfig').TailwindConfig}
 */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      keyframes: {
        rotateLeft: {
          "0%": { transform: "rotate(90deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        rotate360: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  extend: {
    extend: {
      fontFamily: {
        sans: ["Inter"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
