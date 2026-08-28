import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { prepareSsrClientDist } from './src/lib/host/emitSpaNotFoundHtml'

const ssrClientDist = (): Plugin => {
  let isSsrBuild = false
  return {
    name: 'ssr-client-dist',
    apply: 'build',
    configResolved(config) {
      isSsrBuild = Boolean(config.build.ssr)
    },
    closeBundle() {
      if (isSsrBuild) return
      prepareSsrClientDist(path.resolve(__dirname, 'dist/client'))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), ssrClientDist()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@softgate/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
})
