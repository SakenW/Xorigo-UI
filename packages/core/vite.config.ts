import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import pkg from 'glob'
const { glob } = pkg

// 动态生成多入口配置
const generateEntryPoints = async () => {
  const rootDir = resolve(__dirname, 'src')

  // 主入口点
  const entryPoints = {
    index: resolve(rootDir, 'index.ts'),

    // 分类入口点 - 基于实际目录结构
    foundations: resolve(rootDir, 'foundations/index.ts'),
    system: resolve(rootDir, 'system/index.ts'),
    primitives: resolve(rootDir, 'primitives/index.ts'),
    branding: resolve(rootDir, 'branding/index.ts'),
    feedback: resolve(rootDir, 'feedback/index.ts'),
    layout: resolve(rootDir, 'layout/index.ts'),
    navigation: resolve(rootDir, 'navigation/index.ts'),
    'data-display': resolve(rootDir, 'data-display/index.ts'),
    form: resolve(rootDir, 'form/index.ts'),
    typography: resolve(rootDir, 'typography/index.ts'),
    showcase: resolve(rootDir, 'showcase/index.ts'),
    effects: resolve(rootDir, 'effects/index.ts'),
    motion: resolve(rootDir, 'motion/index.ts'),
  }

  // 自动发现组件级入口点
  try {
    // 查找所有组件目录下的主要组件文件
    const componentFilesResult = await glob('src/{feedback,layout,navigation,data-display,form,typography,showcase,effects,motion,utils}/*.{ts,tsx}', {
      cwd: __dirname,
      ignore: ['**/index.ts', '**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx']
    })

    // 确保获取到文件数组
    const componentFiles = Array.isArray(componentFilesResult) ? componentFilesResult : []

    // 为每个组件创建入口点
    for (const file of componentFiles) {
      const componentName = file.match(/\/([^/]+)\.[^.]+$/)?.[1]
      if (componentName && !file.includes('/index.')) {
        entryPoints[componentName] = resolve(__dirname, file)
      }
    }
  } catch (error) {
    console.warn('自动发现组件入口点时出错:', error)
  }

  return entryPoints
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const entryPoints = await generateEntryPoints()

  return {
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
        insertTypesEntry: true, // 启用自动插入类型声明文件
        outDir: 'dist', // 输出到 dist 目录
        compilerOptions: {
          skipLibCheck: true, // 跳过库检查
          noEmitOnError: false, // 即使有错误也生成类型
        },
        // 为每个入口点生成类型声明文件
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
      '@/layouts': resolve(__dirname, 'src/layouts'),
    },
  },
  build: {
    lib: {
      entry: entryPoints,
      name: 'Xorigo UI',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.mjs`
        }
        return `${entryName}.cjs.js`
      },
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^framer-motion/,
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
        '@xorigo-ui/core',
        '@xorigo-ui/tokens',
        '@xorigo-ui/style-recipe',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          'framer-motion': 'Motion',
        },
        // 保持CSS导入
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'xorigo-ui.css'
          return assetInfo.name || 'assets/[name][extname]'
        },
        // 为分类导出创建子目录
        preserveModules: false, // 不保持模块结构，使用入口点文件名
        // 确保按需导入的chunk分离
        manualChunks: undefined, // 让每个入口点生成独立的chunk
      },
    },
    sourcemap: true,
    // 清空输出目录
    emptyOutDir: true,
    // 优化构建性能
    target: 'esnext',
    minify: 'esbuild',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
  // SSR构建配置优化
  ssr: {
    // 服务端构建时需要外部化的依赖
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
      'react-router-dom'
    ],
    // 确保内部包可以正常解析
    noExternal: ['@xorigo-ui/tokens', '@xorigo-ui/style-recipe', '@xorigo-ui/system', '@xorigo-ui/hooks', '@xorigo-ui/i18n']
  },
  // 客户端优化
  optimizeDeps: {
    include: [
      '@xorigo-ui/core',
      '@xorigo-ui/tokens',
      '@xorigo-ui/style-recipe',
      '@xorigo-ui/system',
      'framer-motion'
    ],
    exclude: ['@xorigo-ui/hooks', '@xorigo-ui/i18n']
  }
}
})
