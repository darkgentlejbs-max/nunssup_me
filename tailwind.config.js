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
          50: '#faf6f0',
          100: '#f4ede2',
          200: '#e8dbca',
          300: '#d9c4ad',
          400: '#c5a78c',
          500: '#ad8a6e',
          600: '#8e6c51',
          700: '#73543d',
          800: '#583f2e',
          900: '#3e2c1e', // Rich Warm Espresso from the logo & text
          950: '#271b12',
        },
        coral: {
          50: '#fdf7f5',
          100: '#faeee9',
          200: '#f5dad3',
          300: '#edbfb5',
          400: '#e29f92',
          500: '#df9a8c', // Dusty Coral from the OPEN badge
          600: '#cf7e6e',
          700: '#b26252',
          800: '#8f4d40',
          900: '#754137',
        },
        taupe: {
          50: '#f9f8f8',
          100: '#f2f0f0',
          200: '#e4e0e1',
          300: '#d2ccce',
          400: '#beb2b3', // Soft Muted Grey from the CLOSED badge
          500: '#a79a9b',
          600: '#8d7e7f',
          700: '#716364',
          800: '#5a4f50',
          900: '#4a4142',
        },
        gold: {
          50: '#fcfaf6',
          100: '#f7f2e8',
          200: '#eee3cd',
          300: '#e2ceaa',
          400: '#d3b683',
          500: '#c59f60',
          600: '#af8345',
          700: '#8f6535',
          800: '#73502d',
          900: '#5c3f24',
        },
        beige: {
          50: '#fdfcf9',
          100: '#faf6ee',
          200: '#f4ede0',
          300: '#ebe0ce',
          400: '#ddccb1',
          500: '#cbaf8c',
          600: '#b79770',
          700: '#987a56',
          800: '#7b6247',
          900: '#64503c',
          950: '#372b1f',
        }
      },
      fontFamily: {
        serif: ['"Gowun Batang"', '"Noto Serif KR"', 'serif'],
        sans: ['"Gowun Dodum"', 'Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Montserrat', 'Pretendard', 'monospace'],
        brand: ['"Gowun Dodum"', 'Pretendard', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
