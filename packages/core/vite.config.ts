import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 启用类型声明文件生成
    dts({
      include: ['src'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.stories.tsx',
        'src/test/**',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        'src/blocks/**', // 暂时排除 blocks 目录（存在类型错误）
      ],
      rollupTypes: false, // 暂时禁用合并（API Extractor有兼容性问题）
      insertTypesEntry: false, // 暂时禁用自动插入
      outDir: 'dist', // 输出到 dist 目录
      compilerOptions: {
        skipLibCheck: true, // 跳过库检查
        noEmitOnError: false, // 即使有错误也生成类型
      },
    }),
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
      // 外部化依赖 - 防止打包第三方库
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
        'class-variance-authority',
        'clsx',
        'culori',
        'color-contrast-checker',
        'tailwind-merge',
        'react-router-dom',
        '@th-ui/core',
        '@th-ui/tokens',
        '@th-ui/style-recipe',
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
