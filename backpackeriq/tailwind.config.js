/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B2B22',
        paper: '#EDE9DC',
        paperDark: '#E1DCC9',
        trail: {
          DEFAULT: '#2F5D50',
          light: '#3F7A69',
          dark: '#1E3F36',
        },
        marigold: {
          DEFAULT: '#E3A020',
          light: '#F0C169',
          dark: '#B87E14',
        },
        dusk: {
          DEFAULT: '#6B4C6B',
          light: '#8A6A8A',
        },
        mist: '#C9C2AE',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
