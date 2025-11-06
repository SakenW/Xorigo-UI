import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'XorigoUICollaboration',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs.js'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'socket.io-client', 'yjs'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'socket.io-client': 'socket.io-client',
          'yjs': 'Y'
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
    port: 3002,
    host: true,
    cors: true
  },
  optimizeDeps: {
    include: ['socket.io-client', 'yjs', 'lib0']
  }
})
