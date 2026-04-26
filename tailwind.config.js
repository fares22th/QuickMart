/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary:  { DEFAULT: '#00C896', dark: '#00A878', light: '#E6FAF5' },
        accent:   { DEFAULT: '#FF6B35' },
        seller:   { DEFAULT: '#F59E0B', dark: '#D97706' },
        admin:    { DEFAULT: '#6366F1', dark: '#4F46E5' },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
