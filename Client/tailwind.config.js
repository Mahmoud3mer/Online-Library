/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 6px 20px 0 rgba(0, 0, 0, 0.19)', 
      },
    },
  },

  plugins: [],

}

