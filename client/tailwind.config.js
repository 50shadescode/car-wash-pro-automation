/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carwash: {
          teal: '#0d9488',
          blue: '#1d4ed8',
          dark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}