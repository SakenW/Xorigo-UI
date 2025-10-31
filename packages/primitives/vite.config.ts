import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'XorigoUIPrimitives',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs.js'}`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'framer-motion',
        '@xorigo-ui/tokens',
        '@xorigo-ui/system',
        '@xorigo-ui/utils',
        'clsx',
        'tailwind-merge'
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    minify: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})