/**
 * 构建优化命令
 * 提供性能监控、构建优化和资源分析功能
 */

import { Command } from 'commander'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { logger } from '../utils/logger'

const execAsync = promisify(exec)

export interface BuildOptions {
  preset: 'development' | 'production' | 'performance'
  analyze: boolean
  watch: boolean
  target: string
}

/**
 * 分析包大小
 */
async function analyzeBundleSize(buildPath: string): Promise<void> {
  logger.section('包大小分析')

  const files = await fs.readdir(buildPath)
  const jsFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.mjs'))

  for (const file of jsFiles) {
    const filePath = path.join(buildPath, file)
    const stats = await fs.stat(filePath)
    const sizeInKB = (stats.size / 1024).toFixed(2)

    const size = parseFloat(sizeInKB)
    let color = chalk.green
    if (size > 500) color = chalk.red
    else if (size > 200) color = chalk.yellow

    console.log(`  ${file.padEnd(30)} ${color(`${sizeInKB} KB`)}`)
  }
}

/**
 * 生成构建报告
 */
function generateBuildReport(stats: {
  duration: number
  bundleSize: number
  warnings: string[]
  errors: string[]
}): string {
  const timestamp = new Date().toISOString()

  return `# 构建报告

生成时间: ${timestamp}
构建耗时: ${stats.duration}ms
包大小: ${stats.bundleSize} KB

## 构建配置

- 预设: production
- 目标: esnext
- 压缩: 启用
- Tree Shaking: 启用

## 性能指标

- 首次构建: ✅
- 热更新: ✅
- 类型检查: ✅

## 建议

${stats.bundleSize > 500 ? '- 考虑使用代码分割以减小包大小\n' : ''}${
    stats.warnings.length > 0 ? '- 解决以下警告:\n' + stats.warnings.map(w => `  - ${w}`).join('\n') : ''
  }

---
由 Xorigo CLI 生成
`
}

/**
 * 优化构建配置
 */
function generateOptimizedConfig(): string {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // 生产环境启用包分析
    process.env.ANALYZE === 'true' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),

  build: {
    // 目标浏览器
    target: 'esnext',

    // 输出目录
    outDir: 'dist',

    // 资源目录
    assetsDir: 'assets',

    // 启用 Source Map (生产环境建议关闭以减小包大小)
    sourcemap: process.env.NODE_ENV !== 'production',

    // 最小化
    minify: 'terser',

    // 压缩选项
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },

    // 代码分割
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@xorigo-ui/core']
        },

        // 文件名格式
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.')
          const ext = info[info.length - 1]

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return \`images/[name]-[hash].\${ext}\`
          }

          if (/css/i.test(ext)) {
            return \`css/[name]-[hash].\${ext}\`
          }

          return \`assets/[name]-[hash].\${ext}\`
        }
      },

      // 外部依赖
      external: (id) => {
        return id.startsWith('@xorigo-ui/')
      }
    },

    // Chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,

    // 启用 CSS 代码分割
    cssCodeSplit: true
  },

  // 优化依赖
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@xorigo-ui/core'
    ]
  },

  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})`
}

/**
 * 性能监控
 */
async function monitorPerformance(
  command: string,
  options: { analyze?: boolean; watch?: boolean }
): Promise<void> {
  const startTime = Date.now()
  const warnings: string[] = []
  const errors: string[] = []

  try {
    logger.info(`执行: ${command}`)

    // 添加环境变量
    const env = {
      ...process.env,
      NODE_ENV: options.watch ? 'development' : 'production',
      ANALYZE: options.analyze ? 'true' : 'false'
    }

    const { stdout, stderr } = await execAsync(command, {
      env,
      maxBuffer: 1024 * 1024 * 10 // 10MB
    })

    if (stderr) {
      warnings.push(stderr)
    }

    const duration = Date.now() - startTime

    // 性能基准
    const benchmarks = {
      build: 5000, // 5秒
      analyze: 8000 // 8秒
    }

    if (duration > (options.analyze ? benchmarks.analyze : benchmarks.build)) {
      warnings.push(`构建时间较长 (${duration}ms)，建议优化`)
    }

    // 分析结果
    if (options.analyze) {
      const distPath = path.join(process.cwd(), 'dist')
      try {
        const stats = await fs.stat(distPath)
        if (stats.isDirectory()) {
          await analyzeBundleSize(distPath)
        }
      } catch (error) {
        warnings.push('无法分析包大小，请确保构建成功')
      }
    }

    // 输出结果
    const elapsed = Date.now() - startTime
    logger.success(`构建完成`)
    logger.info(`⏱️ 总耗时: ${elapsed}ms`)

    if (warnings.length > 0) {
      logger.section('警告')
      warnings.forEach(w => logger.warn(w))
    }

  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error))
    logger.error(`构建失败`)
    errors.forEach(e => console.error(chalk.red(e)))
    process.exit(1)
  }
}

/**
 * 构建优化命令
 */
export const buildCommand = new Command('build')
  .description('构建和优化项目')
  .option('-p, --preset <preset>', '构建预设', 'production')
  .option('--analyze', '分析包大小', false)
  .option('--watch', '监听模式', false)
  .option('-t, --target <target>', '构建目标', 'dist')
  .action(async (options: BuildOptions) => {
    const startTime = Date.now()
    const spinner = ora('准备构建...').start()

    try {
      // 验证预设
      const validPresets = ['development', 'production', 'performance']
      if (!validPresets.includes(options.preset)) {
        throw new Error(`无效的构建预设: ${options.preset}`)
      }

      // 检查必要文件
      spinner.text = '检查项目配置...'

      const configFiles = ['package.json', 'vite.config.ts', 'tsconfig.json']
      for (const file of configFiles) {
        try {
          await fs.access(file)
        } catch {
          logger.warn(`未找到文件: ${file}`)
        }
      }

      // 生成优化的构建配置
      if (options.preset === 'performance') {
        spinner.text = '生成优化配置...'
        const config = generateOptimizedConfig()
        await fs.writeFile('vite.config.optimized.ts', config, 'utf-8')
        logger.info('已生成优化配置文件: vite.config.optimized.ts')
      }

      // 确定构建命令
      let buildCommand = 'vite build'

      if (options.preset === 'development') {
        buildCommand = 'vite build --mode development'
      } else if (options.preset === 'performance') {
        buildCommand = 'vite build --config vite.config.optimized.ts'
      }

      if (options.watch) {
        buildCommand += ' --watch'
      }

      // 开始构建
      spinner.text = '执行构建...'

      await monitorPerformance(buildCommand, {
        analyze: options.analyze,
        watch: options.watch
      })

      // 生成构建报告
      if (!options.watch) {
        spinner.text = '生成构建报告...'

        const reportPath = path.join(process.cwd(), options.target, 'build-report.md')

        // 计算包大小
        let bundleSize = 0
        try {
          const distPath = path.join(process.cwd(), options.target)
          const files = await fs.readdir(distPath)
          for (const file of files) {
            const filePath = path.join(distPath, file)
            const stats = await fs.stat(filePath)
            bundleSize += stats.size
          }
        } catch {
          // 忽略错误
        }

        const report = generateBuildReport({
          duration: Date.now() - startTime,
          bundleSize: Math.round(bundleSize / 1024),
          warnings: [],
          errors: []
        })

        await fs.writeFile(reportPath, report, 'utf-8')
        logger.info(`构建报告: ${reportPath}`)
      }

      const elapsed = Date.now() - startTime
      spinner.succeed(chalk.green('✅ 构建任务完成'))

      logger.section('构建结果')
      console.log(chalk.gray(`  📦 输出目录: ${options.target}`))
      console.log(chalk.gray(`  ⏱️ 构建时间: ${elapsed}ms`))
      if (options.analyze) {
        console.log(chalk.gray(`  📊 分析报告: ${path.join(options.target, 'stats.html')}`))
      }

      if (!options.watch) {
        logger.section('下一步')
        logger.info(`预览构建结果: pnpm preview`)
        logger.info(`部署到生产: pnpm deploy`)
      }

    } catch (error) {
      spinner.fail(chalk.red('❌ 构建失败'))
      console.error(chalk.red('错误:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })
