import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Se o repo se chamar "lalabohm.github.io", apague a linha "base".
// Se o repo tiver outro nome (ex: "portfolio"), mantenha base: '/portfolio/'.
export default defineConfig({
  site: 'https://lalabohm.github.io',
  base: '/portfolio/',
  integrations: [tailwind()],
});
