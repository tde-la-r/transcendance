import { defineConfig } from 'vite'
import postcss from './postcss.config.js'

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  css: {
    postcss: './postcss.config.js',
  }
})