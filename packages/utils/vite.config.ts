import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'XorigoUIUtils',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs.js'}`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@xorigo-ui/tokens',
        '@xorigo-ui/system',
        'clsx',
        'tailwind-merge',
        'culori',
        'color-contrast-checker'
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