import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    dts({
      include: ['src'],
      exclude: ['src/engine/**'], // 暂时排除有类型错误的 engine
      rollupTypes: false,
      insertTypesEntry: true,
      outDir: 'dist',
      compilerOptions: {
        skipLibCheck: true,
        noEmitOnError: false,
      },
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'provider/index': resolve(__dirname, 'src/provider/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.mjs`
        }
        return `${entryName}.cjs.js`
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@xorigo-ui/tokens', 'framer-motion'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
