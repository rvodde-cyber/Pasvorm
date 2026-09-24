import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        bg2: 'var(--c-bg2)',
        surface: 'var(--c-surface)',
        ink: 'var(--c-ink)',
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
        accent: 'var(--c-accent)',
        'accent-ink': 'var(--c-accent-ink)',
        primary: 'var(--c-primary)',
        'primary-ink': 'var(--c-primary-ink)',
        clan: 'var(--c-clan)',
        adhocracy: 'var(--c-adhocracy)',
        market: 'var(--c-market)',
        hierarchy: 'var(--c-hierarchy)',
        ethiek: 'var(--c-ethiek)',
        'mmv-zien': 'var(--c-mmv-zien)',
        'mmv-voelen': 'var(--c-mmv-voelen)',
        'mmv-wegen': 'var(--c-mmv-wegen)',
        'mmv-handelen': 'var(--c-mmv-handelen)',
        'mmv-volhouden': 'var(--c-mmv-volhouden)',
      },
      fontFamily: {
        heading: ['"Libre Franklin"', 'system-ui', 'sans-serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
