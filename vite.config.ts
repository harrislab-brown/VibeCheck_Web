import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@nextui-org/react','clsx', 'tailwind-merge'],
  },
  base: '/VibeCheck_Web/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  // Added to ensure TypeScript types are properly handled
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})