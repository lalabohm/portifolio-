/** @type {import('tailwindcss').Config} */

// Colors are CSS variables (RGB triplets) defined in src/styles/global.css,
// so the light/dark themes swap them without changing any class names.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        card: token('card'),
        ink: token('ink'),
        body: token('body'),
        muted: token('muted'),
        line: token('line'),
        line2: token('line2'),
        accent: token('accent'),
        'accent-hover': token('accent-hover'),
        'accent-soft': token('accent-soft'),
        primary: token('primary'),
        'primary-tint': token('primary-tint'),
        teal: token('teal'),
        'teal-tint': token('teal-tint'),
        amber: token('amber'),
        'amber-tint': token('amber-tint'),
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
