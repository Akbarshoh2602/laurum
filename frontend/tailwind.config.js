/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FF5C00',
          light: '#FF8A4C',
          dark: '#CC4900',
        },
        ink: '#0D1B2A',
        charcoal: '#1B263B',
        cream: '#F7F3EC',
        pearl: '#EDE8DF',
        mist: '#D6D0C4',
        slate: '#5C6778',
        electric: '#00B4D8',
        forest: '#2D6A4F',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '4px 4px 0px #0D1B2A',
        'pop-sm': '3px 3px 0px #0D1B2A',
        'pop-lg': '6px 6px 0px #0D1B2A',
        'pop-accent': '4px 4px 0px #FF5C00',
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
