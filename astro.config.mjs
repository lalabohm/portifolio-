import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// O repositório se chama "larissabohm.github.io" (organização larissabohm),
// então o site fica na raiz do domínio e não precisa de "base".
export default defineConfig({
  site: 'https://larissabohm.github.io',
  integrations: [tailwind()],
});
