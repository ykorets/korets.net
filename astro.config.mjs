// @ts-check
import { defineConfig } from 'astro/config';

// The new design is built with Astro; legacy static pages (cpa, andy, dashboards…)
// stay as plain files and are merged in by scripts/build_site.py.
export default defineConfig({
  site: 'https://korets.net',
  srcDir: './src',
  publicDir: './site-public',
  outDir: './.astro-dist',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
