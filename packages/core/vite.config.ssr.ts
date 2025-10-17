import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import pkg from 'glob'
const { glob } = pkg

// 动态生成多入口配置（复用主配置的逻辑）
const generateEntryPoints = async () => {
  const rootDir = resolve(__dirname, 'src')

  // 主入口点
  const entryPoints = {
    index: resolve(rootDir, 'index.ts'),

    // 分类入口点
    ui: resolve(rootDir, 'ui/index.ts'),
    inputs: resolve(rootDir, 'inputs/index.ts'),
    form: resolve(rootDir, 'form/index.ts'),
    navigation: resolve(rootDir, 'navigation/index.ts'),
    layout: resolve(rootDir, 'layout/index.ts'),
    feedback: resolve(rootDir, 'feedback/index.ts'),
    overlays: resolve(rootDir, 'overlays/index.ts'),
    datadisplay: resolve(rootDir, 'datadisplay/index.ts'),
    charts: resolve(rootDir, 'charts/index.ts'),
    utilities: resolve(rootDir, 'utilities/index.ts'),

    // SSR专用入口点
    'ssr': resolve(rootDir, 'ssr.ts'),
    'ssr-theme': resolve(rootDir, 'ssr-theme.ts'),
    'ssr-motion': resolve(rootDir, 'ssr-motion.ts'),
  }

  // 自动发现组件级入口点
  try {
    const componentFiles = await glob('src/{ui,inputs,form,navigation,layout,feedback,overlays,datadisplay,charts,utilities}/*.{ts,tsx}', {
      cwd: __dirname,
      ignore: ['**/index.ts', '**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx']
    })

    if (Array.isArray(componentFiles)) {
      for (const file of componentFiles) {
        const componentName = file.match(/\/([^/]+)\.[^.]+$/)?.[1]
        if (componentName && !file.includes('/index.')) {
          entryPoints[componentName] = resolve(__dirname, file)
        }
      }
    }
  } catch (error) {
    console.warn('自动发现组件入口点时出错:', error)
  }

  return entryPoints
}

// SSR专用配置
export default defineConfig(async () => {
  const entryPoints = await generateEntryPoints()

  return {
    plugins: [
      react(),
      // 为SSR构建生成类型声明
      dts({
        include: ['src'],
        exclude: [
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.stories.tsx',
          'src/test/**',
          '**/*.spec.ts',
          '**/*.spec.tsx',
          'src/blocks/**',
        ],
        rollupTypes: false,
        insertTypesEntry: true,
        outDir: 'dist-ssr',
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
        '@/layouts': resolve(__dirname, 'src/layouts'),
      },
    },
    build: {
      lib: {
        entry: entryPoints,
        name: 'XorigoUI-SSR',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          if (format === 'es') {
            return `${entryName}.mjs`
          }
          return `${entryName}.cjs.js`
        },
      },
      rollupOptions: {
        // SSR构建外部化所有React相关依赖
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'framer-motion',
          '@radix-ui/*',
          'lucide-react',
          'class-variance-authority',
          'clsx',
          'culori',
          'color-contrast-checker',
          'tailwind-merge',
          'react-router-dom',
          // 内部包也需要外部化
          '@xorigo-ui/*',
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime',
            'framer-motion': 'Motion',
          },
          // SSR构建不需要CSS文件
          assetFileNames: undefined,
        },
      },
      sourcemap: true,
      emptyOutDir: true,
      target: 'esnext',
      minify: false, // SSR构建不压缩，便于调试
      outDir: 'dist-ssr',
    },
    // SSR特定配置
    ssr: {
      format: 'esm',
      target: 'node',
      noExternal: [], // 所有依赖都外部化
    },
    // 实验性功能
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { js: `/${filename}` }
        } else {
          return { relative: true }
        }
      },
    },
  }
})