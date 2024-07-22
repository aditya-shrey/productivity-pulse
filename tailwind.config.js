/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',  // Tailwind's blue-700 color
        secondary: '#2563EB', // Tailwind's blue-600 color
      },
    },
  },
  plugins: [],
}