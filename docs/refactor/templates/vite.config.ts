// Vite 构建配置模板 - 支持按需打包和组件级导出
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    // 类型声明文件生成配置
    dts({
      include: ['src'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.stories.tsx',
        'src/test/**',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
      rollupTypes: false,
      insertTypesEntry: true,
      outDir: 'dist',
      compilerOptions: {
        skipLibCheck: true,
        noEmitOnError: false,
      },
      entryRoot: './src',
      copyDtsFiles: true,
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
    },
  },
  build: {
    lib: {
      // 多入口配置：支持按需导入
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        // 组件级入口 - 按需打包核心
        './button': resolve(__dirname, 'src/components/button.tsx'),
        './card': resolve(__dirname, 'src/components/card.tsx'),
        './dialog': resolve(__dirname, 'src/components/dialog.tsx'),
        './tabs': resolve(__dirname, 'src/components/tabs.tsx'),
        './input': resolve(__dirname, 'src/components/input.tsx'),
        './tooltip': resolve(__dirname, 'src/components/tooltip.tsx'),
        './dropdown': resolve(__dirname, 'src/components/dropdown.tsx'),
        './alert': resolve(__dirname, 'src/components/alert.tsx'),
        './avatar': resolve(__dirname, 'src/components/avatar.tsx'),
        './badge': resolve(__dirname, 'src/components/badge.tsx'),
      },
      name: 'XorigoUI',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.mjs`
        }
        return `${entryName}.cjs.js`
      },
    },
    rollupOptions: {
      // 外部化依赖，不打包进组件库
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        // Framer Motion
        /^framer-motion/,
        // Radix UI 组件
        '@radix-ui/react-dialog',
        '@radix-ui/react-toast',
        '@radix-ui/react-accordion',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-slot',
        '@radix-ui/react-tabs',
        '@radix-ui/react-tooltip',
        // 图标库
        'lucide-react',
        // 工具库
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'culori',
        'color-contrast-checker',
        // Xorigo 内部包
        '@xorigo-ui/tokens',
        '@xorigo-ui/style-recipe',
        '@xorigo-ui/system',
        '@xorigo-ui/hooks',
      ],
      output: {
        // 全局变量映射（UMD 格式时使用）
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          'framer-motion': 'Motion',
        },
        // CSS 文件命名
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'xorigo-ui.css'
          return assetInfo.name || 'assets/[name][extname]'
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    // 启用 Tree-shaking
    target: 'esnext',
    minify: 'esbuild',
  },
  // 测试配置
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  // SSR 配置
  ssr: {
    noExternal: ['@xorigo-ui/core']
  },
  // 优化配置
  optimizeDeps: {
    include: ['@xorigo-ui/core']
  }
})