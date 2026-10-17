import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // Three.js chunk é ~667 kB minificado; elevamos o limite para 1000 kB para evitar warnings desnecessários
    chunkSizeWarningLimit: 1000,
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
        // Separa o Three.js e R3F em chunks dedicados para carregamento estritamente sob demanda
        manualChunks: {
          'vendor-three': ['three'],
          'vendor-r3f': ['@react-three/fiber'],
        },
      },
    },
  },
})
