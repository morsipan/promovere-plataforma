/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial de Promovere
        promovere: {
          dark: '#4d4e4f',
          green: '#3cac59',
          blue: '#1b87c7',
          light: '#f9f9f9',
        },
        brand: {
          50:  '#f0f7fc',
          100: '#e1f0f9',
          200: '#b8def3',
          300: '#7bc1ea',
          400: '#38a2de',
          500: '#1b87c7', // Promovere Blue
          600: '#0e6aa3',
          700: '#0c5584',
          800: '#0e496d',
          900: '#113d5b',
          950: '#0b273d',
        },
        'brand-green': {
          50:  '#f2fbf4',
          100: '#e1f6e6',
          200: '#c5eccf',
          300: '#97dcab',
          400: '#64c581',
          500: '#3cac59', // Promovere Green
          600: '#2d8d45',
          700: '#266f39',
          800: '#235831',
          900: '#1f492b',
          950: '#0c2714',
        },
        'brand-dark': {
          50:  '#f6f6f6',
          100: '#e7e7e8',
          200: '#d0d1d2',
          300: '#b0b2b4',
          400: '#7b7d80',
          500: '#4d4e4f', // Promovere Dark Gray
          600: '#434445',
          700: '#38393a',
          800: '#2f3030',
          900: '#262627',
          950: '#1a1a1b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
