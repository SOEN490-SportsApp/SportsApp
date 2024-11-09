/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        customGray: '#aaa',
        customGreen: '#0C9E04',
      }
    },
  },
  plugins: [],
}

