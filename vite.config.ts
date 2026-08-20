import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { emitSpaNotFoundHtml } from './src/lib/host/emitSpaNotFoundHtml'

const spaNotFoundHtml = (): Plugin => ({
  name: 'spa-not-found-html',
  apply: 'build',
  closeBundle() {
    emitSpaNotFoundHtml(path.resolve(__dirname, 'dist'))
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), spaNotFoundHtml()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@softgate/shared': path.resolve(__dirname, './packages/shared/src'),
    },
  },
})
