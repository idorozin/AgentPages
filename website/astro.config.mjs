import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  outDir: '../docs',
  // Set these to match your GitHub Pages URL after forking:
  // site: 'https://YOUR_USERNAME.github.io',
  // base: '/YOUR_REPO_NAME',
});
