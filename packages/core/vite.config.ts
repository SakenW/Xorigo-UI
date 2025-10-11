import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 暂时禁用类型生成以便快速部署
    // dts({
    //   include: ['src'],
    //   exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
    //   rollupTypes: true,
    // }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/tokens': resolve(__dirname, 'src/tokens'),
      '@/theme': resolve(__dirname, 'src/theme'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/layouts': resolve(__dirname, 'src/layouts'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        theme: resolve(__dirname, 'src/theme/index.ts'),
        tokens: resolve(__dirname, 'src/tokens/index.ts'),
        'style-recipe': resolve(__dirname, 'src/style-recipe/index.ts'),
      },
      name: 'TH-UI',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.mjs`
        }
        return `${entryName}.cjs.js`
      },
    },
    rollupOptions: {
      // 外部化依赖
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'framer-motion',
        '@radix-ui/react-dialog',
        '@radix-ui/react-toast',
        '@radix-ui/react-accordion',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-slot',
        'lucide-react',
        '@th-ui/core' // 将自身包也外部化
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          'framer-motion': 'FramerMotion',
        },
        // 保持CSS导入
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'th-ui.css'
          return assetInfo.name || 'assets/[name][extname]'
        },
      },
    },
    sourcemap: true,
    // 清空输出目录
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
  // 添加此配置以解决Vite 7的包解析问题
  ssr: {
    noExternal: ['@th-ui/core']
  },
  // 解决Vite 7包解析问题
  optimizeDeps: {
    include: ['@th-ui/core']
  }
})
