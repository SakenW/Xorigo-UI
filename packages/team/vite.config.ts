import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'XorigoUITeam',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs.js'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'semver', 'diff'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          semver: 'semver',
          diff: 'diff'
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
    port: 3004,
    host: true,
    cors: true
  },
  optimizeDeps: {
    include: ['semver', 'diff']
  }
})
