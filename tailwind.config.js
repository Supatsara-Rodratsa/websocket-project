/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    colors: {
      yellow: "#F9F6D1",
      sally: "#F7D452",
      orange: "#D85A33",
      white: "#FFFFFF",
      black: "#000000",
      grey: "#757575",
      darkYellow: "#F2D450",
      transparent: "transparent",
      cream: "#EEE3A9",
      darkOrange: "#C04F34",
    },
    extend: {},
  },
  plugins: [],
};
