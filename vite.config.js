import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Injeta o preload da fonte crítica apenas no build de produção (evita 404 em dev)
function fontPreloadPlugin() {
  return {
    name: 'font-preload',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: '/assets/figtree-latin-wght-normal.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
            },
            injectTo: 'head',
          },
        ],
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), fontPreloadPlugin()],
  build: {
    target: 'es2020',
    // Three.js chunk é ~667 kB minificado; limite de 800 kB acomoda Three.js sem alarmes falsos
    chunkSizeWarningLimit: 800,
    modulePreload: {
      resolveDependencies(filename, deps, { hostType }) {
        if (hostType === 'html') {
          // Impede modulepreload inicial dos chunks 3D pesados no HTML crítico
          return deps.filter(
            (dep) =>
              !dep.includes('vendor-three') &&
              !dep.includes('vendor-r3f') &&
              !dep.includes('HeroScene') &&
              !dep.includes('StackScene')
          )
        }
        return deps
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.woff2')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        // Separa Three.js, R3F e Framer Motion em chunks dedicados para carregamento sob demanda
        manualChunks(id) {
          if (id.includes('node_modules/three/')) {
            return 'vendor-three'
          }
          if (id.includes('node_modules/@react-three/fiber/')) {
            return 'vendor-r3f'
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion'
          }
        },
      },
    },
  },
})
