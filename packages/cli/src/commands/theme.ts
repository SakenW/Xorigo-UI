/**
 * 主题管理命令
 * 支持主题生成、预览、配置和验证
 */

import { Command } from 'commander'
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { logger } from '../utils/logger'

export interface ThemeOptions {
  mode: 'light' | 'dark' | 'auto'
  preset: string
  output: string
  validate: boolean
}

/**
 * 预定义主题配方
 */
const themePresets = {
  'modern-light': {
    mode: 'light',
    colors: {
      primary: { hue: 221, saturation: 83, lightness: 53 },
      secondary: { hue: 262, saturation: 83, lightness: 53 },
      accent: { hue: 43, saturation: 96, lightness: 50 },
      success: { hue: 142, saturation: 71, lightness: 42 },
      warning: { hue: 38, saturation: 92, lightness: 54 },
      danger: { hue: 0, saturation: 84, lightness: 53 },
      neutral: { hue: 220, saturation: 14, lightness: 96 }
    }
  },
  'modern-dark': {
    mode: 'dark',
    colors: {
      primary: { hue: 221, saturation: 83, lightness: 53 },
      secondary: { hue: 262, saturation: 83, lightness: 53 },
      accent: { hue: 43, saturation: 96, lightness: 50 },
      success: { hue: 142, saturation: 71, lightness: 42 },
      warning: { hue: 38, saturation: 92, lightness: 54 },
      danger: { hue: 0, saturation: 84, lightness: 53 },
      neutral: { hue: 220, saturation: 14, lightness: 96 }
    }
  },
  'warm-light': {
    mode: 'light',
    colors: {
      primary: { hue: 14, saturation: 90, lightness: 50 },
      secondary: { hue: 39, saturation: 95, lightness: 48 },
      accent: { hue: 43, saturation: 96, lightness: 50 },
      success: { hue: 142, saturation: 71, lightness: 42 },
      warning: { hue: 38, saturation: 92, lightness: 54 },
      danger: { hue: 0, saturation: 84, lightness: 53 },
      neutral: { hue: 30, saturation: 20, lightness: 95 }
    }
  },
  'cool-dark': {
    mode: 'dark',
    colors: {
      primary: { hue: 195, saturation: 100, lightness: 50 },
      secondary: { hue: 230, saturation: 85, lightness: 60 },
      accent: { hue: 280, saturation: 90, lightness: 65 },
      success: { hue: 142, saturation: 71, lightness: 42 },
      warning: { hue: 38, saturation: 92, lightness: 54 },
      danger: { hue: 0, saturation: 84, lightness: 53 },
      neutral: { hue: 215, saturation: 28, lightness: 13 }
    }
  },
  'nature-light': {
    mode: 'light',
    colors: {
      primary: { hue: 142, saturation: 71, lightness: 42 },
      secondary: { hue: 160, saturation: 65, lightness: 45 },
      accent: { hue: 43, saturation: 96, lightness: 50 },
      success: { hue: 142, saturation: 71, lightness: 42 },
      warning: { hue: 38, saturation: 92, lightness: 54 },
      danger: { hue: 0, saturation: 84, lightness: 53 },
      neutral: { hue: 120, saturation: 10, lightness: 95 }
    }
  }
}

/**
 * 生成主题令牌
 */
function generateThemeTokens(name: string, preset: any): string {
  const tokens: any = {
    $schema: 'https://design-tokens.org/schema.json',
    color: {},
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '1rem',
      full: '9999px'
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  }

  // 生成颜色令牌
  Object.entries(preset.colors).forEach(([key, value]: [string, any]) => {
    const { hue, saturation, lightness } = value
    tokens.color[key] = {
      '50': `hsl(${hue} ${saturation}% ${Math.min(lightness + 40, 95)}%)`,
      '100': `hsl(${hue} ${saturation}% ${Math.min(lightness + 35, 90)}%)`,
      '200': `hsl(${hue} ${saturation}% ${Math.min(lightness + 25, 80)}%)`,
      '300': `hsl(${hue} ${saturation}% ${Math.min(lightness + 15, 70)}%)`,
      '400': `hsl(${hue} ${saturation}% ${Math.min(lightness + 5, 60)}%)`,
      '500': `hsl(${hue} ${saturation}% ${lightness}%)`,
      '600': `hsl(${hue} ${saturation}% ${Math.max(lightness - 5, 5)}%)`,
      '700': `hsl(${hue} ${saturation}% ${Math.max(lightness - 15, 5)}%)`,
      '800': `hsl(${hue} ${saturation}% ${Math.max(lightness - 25, 5)}%)`,
      '900': `hsl(${hue} ${saturation}% ${Math.max(lightness - 35, 5)}%)`
    }
  })

  return JSON.stringify(tokens, null, 2)
}

/**
 * 生成 Tailwind 配置
 */
function generateTailwindTheme(preset: any): string {
  const colors: any = {}

  Object.entries(preset.colors).forEach(([key, value]: [string, any]) => {
    const { hue, saturation, lightness } = value
    colors[key] = {
      '50': `hsl(${hue} ${saturation}% ${Math.min(lightness + 40, 95)}%)`,
      '100': `hsl(${hue} ${saturation}% ${Math.min(lightness + 35, 90)}%)`,
      '200': `hsl(${hue} ${saturation}% ${Math.min(lightness + 25, 80)}%)`,
      '300': `hsl(${hue} ${saturation}% ${Math.min(lightness + 15, 70)}%)`,
      '400': `hsl(${hue} ${saturation}% ${Math.min(lightness + 5, 60)}%)`,
      '500': `hsl(${hue} ${saturation}% ${lightness}%)`,
      '600': `hsl(${hue} ${saturation}% ${Math.max(lightness - 5, 5)}%)`,
      '700': `hsl(${hue} ${saturation}% ${Math.max(lightness - 15, 5)}%)`,
      '800': `hsl(${hue} ${saturation}% ${Math.max(lightness - 25, 5)}%)`,
      '900': `hsl(${hue} ${saturation}% ${Math.max(lightness - 35, 5)}%)`
    }
  })

  return `import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 6)}
    }
  },
  plugins: []
} satisfies Config`
}

/**
 * 生成预览页面
 */
function generatePreviewPage(presetName: string, preset: any): string {
  return `<!DOCTYPE html>
<html lang="zh-CN" class="${preset.mode === 'dark' ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>主题预览 - ${presetName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${preset.mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen">
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-5xl font-bold mb-8 text-center">主题预览</h1>
    <p class="text-xl text-center mb-16 opacity-80">配方: ${presetName} | 模式: ${preset.mode}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      ${Object.entries(preset.colors).map(([key, value]: [string, any]) => `
      <div class="rounded-lg overflow-hidden shadow-lg">
        <div class="p-4 text-center font-semibold">${key}</div>
        <div class="grid grid-cols-5">
          ${[50, 100, 200, 300, 400].map(num => `
            <div class="h-16 flex items-center justify-center text-xs font-medium"
                 style="background: hsl(${value.hue} ${value.saturation}% ${Math.min(value.lightness + (50 - num) * 0.05, 95)}%)">
              ${num}
            </div>
          `).join('')}
        </div>
        <div class="grid grid-cols-5">
          ${[500, 600, 700, 800, 900].map(num => `
            <div class="h-16 flex items-center justify-center text-xs font-medium"
                 style="background: hsl(${value.hue} ${value.saturation}% ${Math.max(value.lightness - (num - 500) * 0.05, 5)}%); color: ${num >= 600 ? 'white' : 'black'}">
              ${num}
            </div>
          `).join('')}
        </div>
      </div>
      `).join('')}
    </div>

    <div class="mt-16 max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-center">组件预览</h2>
      <div class="space-y-6">
        <div class="text-center">
          <button class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mr-4">
            主要按钮
          </button>
          <button class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            次要按钮
          </button>
        </div>
        <div class="${preset.mode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-6 rounded-lg">
          <h3 class="text-xl font-semibold mb-2">卡片组件</h3>
          <p class="${preset.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}">
            这是一个卡片组件，用于展示内容。
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
}

/**
 * 验证主题配置
 */
function validateTheme(preset: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // 检查颜色配置
  if (!preset.colors) {
    errors.push('缺少颜色配置')
  } else {
    const requiredColors = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger']
    requiredColors.forEach(color => {
      if (!preset.colors[color]) {
        errors.push(`缺少必需的颜色: ${color}`)
      } else {
        const { hue, saturation, lightness } = preset.colors[color]
        if (typeof hue !== 'number' || hue < 0 || hue > 360) {
          errors.push(`颜色 ${color} 的色相值无效`)
        }
        if (typeof saturation !== 'number' || saturation < 0 || saturation > 100) {
          errors.push(`颜色 ${color} 的饱和度值无效`)
        }
        if (typeof lightness !== 'number' || lightness < 0 || lightness > 100) {
          errors.push(`颜色 ${color} 的亮度值无效`)
        }
      }
    })
  }

  // 检查模式
  if (!['light', 'dark', 'auto'].includes(preset.mode)) {
    errors.push('无效的主题模式')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 主题管理命令
 */
export const themeCommand = new Command('theme')
  .description('管理主题配置和生成')
  .option('preview', '预览主题效果')
  .option('generate', '生成主题令牌')
  .option('list', '列出所有可用主题配方')
  .option('-p, --preset <name>', '主题配方名称', 'modern-light')
  .option('-m, --mode <mode>', '主题模式 (light|dark|auto)', 'light')
  .option('-o, --output <path>', '输出路径')
  .option('--validate', '验证主题配置')
  .action(async (options: any) => {
    const startTime = Date.now()
    const spinner = ora('处理主题...').start()

    try {
      if (options.list) {
        // 列出所有主题配方
        logger.section('可用主题配方')
        Object.keys(themePresets).forEach(name => {
          const preset = themePresets[name as keyof typeof themePresets]
          console.log(chalk.blue(`  ${name}`), chalk.gray(`- ${preset.mode} 模式`))
        })
        return
      }

      if (options.preview) {
        // 预览主题
        const preset = themePresets[options.preset as keyof typeof themePresets]
        if (!preset) {
          throw new Error(`未找到主题配方: ${options.preset}`)
        }

        // 验证主题
        const validation = validateTheme(preset)
        if (!validation.valid) {
          throw new Error(`主题验证失败:\n${validation.errors.join('\n')}`)
        }

        spinner.text = '生成预览页面...'

        // 生成预览页面
        const outputPath = options.output || path.join(process.cwd(), 'theme-preview.html')
        const previewContent = generatePreviewPage(options.preset, preset)
        await fs.writeFile(outputPath, previewContent, 'utf-8')

        const elapsed = Date.now() - startTime
        spinner.succeed(chalk.green('✅ 主题预览生成成功'))
        logger.info(`预览页面: ${outputPath}`)
        logger.info(`在浏览器中打开查看效果`)
        logger.info(`⏱️ 用时: ${elapsed}ms`)
        return
      }

      if (options.validate) {
        // 验证主题
        const preset = themePresets[options.preset as keyof typeof themePresets]
        if (!preset) {
          throw new Error(`未找到主题配方: ${options.preset}`)
        }

        const validation = validateTheme(preset)
        if (validation.valid) {
          logger.success(`主题 ${options.preset} 验证通过`)
        } else {
          logger.error(`主题 ${options.preset} 验证失败`)
          validation.errors.forEach(error => logger.warn(error))
          process.exit(1)
        }
        return
      }

      // 默认生成主题令牌
      const preset = themePresets[options.preset as keyof typeof themePresets]
      if (!preset) {
        throw new Error(`未找到主题配方: ${options.preset}`)
      }

      spinner.text = '生成主题令牌...'

      // 生成令牌
      const tokens = generateThemeTokens(options.preset, preset)
      const tailwindConfig = generateTailwindTheme(preset)

      // 确定输出路径
      const outputDir = options.output
        ? path.resolve(process.cwd(), options.output)
        : path.join(process.cwd(), 'themes', options.preset)

      await fs.mkdir(outputDir, { recursive: true })

      // 写入文件
      await fs.writeFile(
        path.join(outputDir, 'tokens.json'),
        tokens,
        'utf-8'
      )
      await fs.writeFile(
        path.join(outputDir, 'tailwind.config.js'),
        tailwindConfig,
        'utf-8'
      )
      await fs.writeFile(
        path.join(outputDir, 'README.md'),
        `# 主题: ${options.preset}\n\n模式: ${preset.mode}\n\n使用方法:\n1. 将 tokens.json 导入到设计系统\n2. 将 tailwind.config.js 集成到项目中\n`,
        'utf-8'
      )

      const elapsed = Date.now() - startTime
      spinner.succeed(chalk.green('✅ 主题令牌生成成功'))

      logger.section('生成的文件')
      console.log(chalk.gray(`  📄 令牌: ${path.join(outputDir, 'tokens.json')}`))
      console.log(chalk.gray(`  ⚙️ 配置: ${path.join(outputDir, 'tailwind.config.js')}`))
      console.log(chalk.gray(`  📚 文档: ${path.join(outputDir, 'README.md')}`))
      logger.info(`⏱️ 用时: ${elapsed}ms`)

    } catch (error) {
      spinner.fail(chalk.red('❌ 主题处理失败'))
      console.error(chalk.red('错误:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })
