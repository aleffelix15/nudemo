import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js chunk é ~667 kB minificado; elevamos o limite para 1000 kB para evitar warnings desnecessários
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Separa o Three.js em um chunk isolado para carregamento sob demanda
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
})
