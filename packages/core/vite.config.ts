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
        // 工具库依赖
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
        'lucide-react',
        '@testing-library/react',
        '@testing-library/user-event',
        'jest-axe',
        '@testing-library/jest-dom',
        // Radix UI 依赖
        '@radix-ui/react-toast',
        '@radix-ui/react-dialog',
        '@radix-ui/react-popover',
        '@radix-ui/react-drawer',
        '@radix-ui/react-select',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-switch',
        '@radix-ui/react-slider',
        '@radix-ui/react-tabs',
        '@radix-ui/react-accordion',
        '@radix-ui/react-command',
        // 表单库依赖（外部化）
        'formik',
        'yup',
        'zod',
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