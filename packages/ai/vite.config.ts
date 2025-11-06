import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      skipDiagnostics: true,
      logDiagnostics: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'XorigoAI',
      fileName: (format) => {
        if (format === 'es') return 'index.mjs'
        if (format === 'cjs') return 'index.cjs.js'
        return `index.${format}.js`
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'framer-motion',
        '@anthropic-ai/sdk',
        '@xorigo-ui/core',
        '@xorigo-ui/primitives',
        '@xorigo-ui/tokens',
        '@xorigo-ui/system',
        '@xorigo-ui/utils',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'reactJsxRuntime',
          'framer-motion': 'framerMotion',
          '@anthropic-ai/sdk': 'anthropic',
          '@xorigo-ui/core': 'XorigoUICore',
          '@xorigo-ui/primitives': 'XorigoUIPrimitives',
          '@xorigo-ui/tokens': 'XorigoUITokens',
          '@xorigo-ui/system': 'XorigoUISystem',
          '@xorigo-ui/utils': 'XorigoUIUtils',
        },
      },
    },
    sourcemap: true,
    target: 'es2022',
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
})
