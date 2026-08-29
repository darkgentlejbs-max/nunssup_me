/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8f6',
          100: '#def0eb',
          200: '#bee0d7',
          300: '#92c9be',
          400: '#5fab9f',
          500: '#3e8f83',
          600: '#2f736a',
          700: '#275d56',
          800: '#1b433e',
          900: '#0e3d37', // Brand deep green from the business card
          950: '#072421',
        },
        gold: {
          50: '#fbf8ee',
          100: '#f5eed3',
          200: '#eadcaa',
          300: '#ddc478',
          400: '#d4af4a',
          500: '#c59b32', // Brand gold accent
          600: '#a67b26',
          700: '#7f5921',
          800: '#684820',
          900: '#563c1f',
        }
      },
      fontFamily: {
        serif: ['Pretendard', 'Noto Serif KR', 'serif'],
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
