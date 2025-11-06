import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      compilerOptions: {
        skipLibCheck: true,
        noEmitOnError: false,
      },
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'XorigoUIPerformance',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.mjs`
        }
        return `${entryName}.cjs.js`
      },
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'rollup',
        'fs-extra',
        'gzip-size',
        'pretty-bytes'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          rollup: 'rollup',
          'fs-extra': 'fsExtra',
          'gzip-size': 'gzipSize',
          'pretty-bytes': 'prettyBytes'
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'esnext',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
