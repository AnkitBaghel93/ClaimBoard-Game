/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS/TS files in src
    "./public/index.html"         // Optional: Scan index.html if using static classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
