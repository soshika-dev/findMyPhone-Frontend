/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        vazir: ['"Vazirmatn"', 'Tahoma', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    rtl: true,
    themes: ['light', 'dark'],
  },
}
