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
      name: 'XorigoUICore',
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
        // 内部包应该被外部化
        '@xorigo-ui/tokens',
        '@xorigo-ui/system',
        '@xorigo-ui/utils',
        '@xorigo-ui/primitives',
        '@xorigo-ui/forms',
        '@xorigo-ui/layout',
        '@xorigo-ui/navigation',
        '@xorigo-ui/overlays',
        '@xorigo-ui/feedback',
        '@xorigo-ui/i18n',
        '@xorigo-ui/style-recipe',
        '@xorigo-ui/hooks'
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
})