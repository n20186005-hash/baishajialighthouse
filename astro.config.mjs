import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://baishajialighthouse.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    assets: '_assets',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
