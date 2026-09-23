import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0E1A2B',
        bg2: '#132238',
        surface: '#17273D',
        ink: '#EDF1F6',
        muted: '#A9B7C8',
        line: 'rgba(233,238,244,0.13)',
        accent: '#C7973F',
        'accent-ink': '#241A08',
        primary: '#7FA6D1',
        'primary-ink': '#0F1A26',
        clan: '#8FB897',
        adhocracy: '#D9A85C',
        market: '#D08064',
        hierarchy: '#7FA6D1',
        ethiek: '#9B84C4',
      },
      fontFamily: {
        heading: ['"Libre Franklin"', 'system-ui', 'sans-serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
