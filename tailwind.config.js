/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0027B7", soft: "#EEF2FF" },
        secondary: "#079DD8",
      },
      fontFamily: { sans: ["Cairo", "sans-serif"] },
    },
  },
  plugins: [],
};
