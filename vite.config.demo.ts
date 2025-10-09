import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 演示应用配置
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'demo/index.html'),
      },
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/tokens': resolve(__dirname, 'src/tokens'),
      '@/theme': resolve(__dirname, 'src/theme'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/layouts': resolve(__dirname, 'src/layouts'),
    },
  },
  server: {
    port: 3100,
    host: '0.0.0.0',
  },
})
