// @ts-check
const tailwindDefault = require('tailwindcss/stubs/config.full');

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}', './app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      primary: '#053FB0',
      secondary: '#3071EF',
      white: '#FFFFFF',
      error: {
        DEFAULT: '#AD0000',
        secondary: '#C62828',
      },
      success: {
        DEFAULT: '#146622',
        secondary: '#388E3C',
      },
      gray: {
        100: '#F1F3F5',
        200: '#CFD8DC',
        300: '#AFBAC5',
        400: '#90A4AE',
        500: '#546E7A',
        600: '#091D45',
      },
    },
    extend: {
      colors: tailwindDefault.theme.colors,
      fontSize: tailwindDefault.theme.fontSize,
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      borderColor: {
        DEFAULT: '#CFD8DC',
      },
      keyframes: {
        revealVertical: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        revealVertical: 'revealVertical 400ms forwards cubic-bezier(0, 1, 0.25, 1)',
      },
    },
  },
  safelist: [
    'bg-slate-200',
    'bg-gray-200',
    'bg-zinc-200',
    'bg-neutral-200',
    'bg-stone-200',
    'bg-red-200',
    'bg-orange-200',
    'bg-amber-200',
    'bg-yellow-200',
    'bg-lime-200',
    'bg-green-200',
    'bg-emerald-200',
    'bg-teal-200',
    'bg-cyan-200',
    'bg-sky-200',
    'bg-blue-200',
    'bg-indigo-200',
    'bg-violet-200',
    'bg-purple-200',
    'bg-fuchsia-200',
    'bg-pink-200',
    'bg-rose-200',

    'bg-slate-800',
    'bg-gray-800',
    'bg-zinc-800',
    'bg-neutral-800',
    'bg-stone-800',
    'bg-red-800',
    'bg-orange-800',
    'bg-amber-800',
    'bg-yellow-800',
    'bg-lime-800',
    'bg-green-800',
    'bg-emerald-800',
    'bg-teal-800',
    'bg-cyan-800',
    'bg-sky-800',
    'bg-blue-800',
    'bg-indigo-800',
    'bg-violet-800',
    'bg-purple-800',
    'bg-fuchsia-800',
    'bg-pink-800',
    'bg-rose-800'
  ],
  // @ts-ignore
  // eslint-disable-next-line global-require
  plugins: [require('tailwindcss-radix')(), require('tailwindcss-animate')],
};

module.exports = config;
