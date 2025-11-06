import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'XorigoUIShare',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs.js'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'nanoid', 'zod'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          nanoid: 'nanoid',
          zod: 'zod'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3003,
    host: true,
    cors: true
  },
  optimizeDeps: {
    include: ['nanoid', 'zod']
  }
})
