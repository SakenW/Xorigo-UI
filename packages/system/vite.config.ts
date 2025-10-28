import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

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
      name: 'XorigoUISystem',
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
        'framer-motion',
        '@xorigo-ui/tokens',
        '@xorigo-ui/style-recipe',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
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
});
