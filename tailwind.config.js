// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
    addUtilities({
      ".mask": {
        "-webkit-mask": "linear-gradient(#fff 0 0 ) content-box, linear-gradient(#fff 0 0)",
        "-webkit-mask-composite": "destination-out",
        "mask-composite": "exclude",
      },
      ".bggradient": {
        background:
          "linear-gradient(#67CCD3, #C8D5A9)",
      },
    });
  }),],
  prefix: 'tw-'
}
