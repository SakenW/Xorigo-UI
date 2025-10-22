#!/usr/bin/env node

/**
 * Xorigo UI Core 测试运行脚本
 * 支持各种测试模式和覆盖率报告生成
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 获取 package.json 信息
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
)

const TEST_CONFIG = {
  // 测试模式
  modes: {
    unit: {
      description: '运行所有单元测试',
      command: 'vitest run',
      pattern: '**/*.test.{ts,tsx}',
    },
    watch: {
      description: '监听模式运行测试',
      command: 'vitest',
      pattern: '**/*.test.{ts,tsx}',
    },
    coverage: {
      description: '生成覆盖率报告',
      command: 'vitest run --coverage',
      pattern: '**/*.test.{ts,tsx}',
    },
    accessibility: {
      description: '运行可访问性测试',
      command: 'vitest run --run **/*.a11y.test.{ts,tsx}',
      pattern: '**/*.a11y.test.{ts,tsx}',
    },
    component: {
      description: '测试特定组件',
      command: 'vitest run',
      pattern: '',
    },
    ui: {
      description: 'UI 模式运行测试',
      command: 'vitest --ui',
      pattern: '**/*.test.{ts,tsx}',
    },
  },

  // 组件映射
  components: {
    card: 'src/data-display/card/__tests__/**/*.test.{ts,tsx}',
    alert: 'src/feedback/alert/__tests__/**/*.test.{ts,tsx}',
    badge: 'src/feedback/badge/__tests__/**/*.test.{ts,tsx}',
    list: 'src/data-display/list/__tests__/**/*.test.{ts,tsx}',
    table: 'src/data-display/table/__tests__/**/*.test.{ts,tsx}',
    loading: 'src/feedback/loading/__tests__/**/*.test.{ts,tsx}',
    tooltip: 'src/feedback/tooltip/__tests__/**/*.test.{ts,tsx}',
    progress: 'src/feedback/progress/__tests__/**/*.test.{ts,tsx}',
  },
}

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
}

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// 显示帮助信息
function showHelp() {
  colorLog('\n🧪 Xorigo UI Core 测试运行器', 'bright')
  colorLog('===================================\n', 'cyan')

  colorLog('📋 使用方法:', 'yellow')
  console.log('  node scripts/run-tests.js [模式] [组件]\n')

  colorLog('🎯 测试模式:', 'yellow')
  Object.entries(TEST_CONFIG.modes).forEach(([mode, config]) => {
    console.log(`  ${mode.padEnd(12)} - ${config.description}`)
  })

  colorLog('\n🎨 可测试组件:', 'yellow')
  Object.entries(TEST_CONFIG.components).forEach(([name, pattern]) => {
    console.log(`  ${name.padEnd(12)} - ${pattern}`)
  })

  colorLog('\n💡 示例:', 'yellow')
  console.log('  node scripts/run-tests.js unit              # 运行所有单元测试')
  console.log('  node scripts/run-tests.js coverage          # 生成覆盖率报告')
  console.log('  node scripts/run-tests.js component card    # 测试 Card 组件')
  console.log('  node scripts/run-tests.js watch             # 监听模式')
  console.log('  node scripts/run-tests.js ui                # UI 模式')

  colorLog('\n📊 覆盖率目标:', 'yellow')
  console.log('  - 语句覆盖率: 80%+')
  console.log('  - 分支覆盖率: 75%+')
  console.log('  - 函数覆盖率: 85%+')
  console.log('  - 可访问性: 100% (axe-core)')

  colorLog('\n🔗 更多信息:', 'yellow')
  console.log('  - 测试文档: docs/testing-report.md')
  console.log('  - 配置文件: vitest.config.ts')
  console.log('  - 环境设置: src/test/setup.ts\n')
}

// 运行测试命令
function runTest(mode, component) {
  const config = TEST_CONFIG.modes[mode]
  if (!config) {
    colorLog(`❌ 未知的测试模式: ${mode}`, 'red')
    showHelp()
    process.exit(1)
  }

  let command = config.command
  let pattern = config.pattern

  // 如果指定了组件，更新模式
  if (component) {
    const componentPattern = TEST_CONFIG.components[component]
    if (!componentPattern) {
      colorLog(`❌ 未知的组件: ${component}`, 'red')
      colorLog('可用组件:', 'yellow')
      Object.keys(TEST_CONFIG.components).forEach(name => {
        console.log(`  - ${name}`)
      })
      process.exit(1)
    }
    pattern = componentPattern
  }

  // 构建完整命令
  if (pattern && mode !== 'ui') {
    command += ` ${pattern}`
  }

  try {
    colorLog(`🚀 运行测试: ${mode} ${component ? `(${component})` : ''}`, 'cyan')
    colorLog(`📝 执行命令: ${command}`, 'blue')
    console.log('')

    // 执行测试
    execSync(command, {
      stdio: 'inherit',
      cwd: join(__dirname, '..'),
    })

    // 如果是覆盖率模式，显示报告位置
    if (mode === 'coverage') {
      colorLog('\n📊 覆盖率报告已生成:', 'green')
      console.log('  - HTML: coverage/index.html')
      console.log('  - 文本: coverage/lcov-report/lcov.info')
      console.log('  - 控制台: 查看上面的输出')
    }

    colorLog('\n✅ 测试完成!', 'green')

  } catch (error) {
    colorLog(`\n❌ 测试失败: ${error.message}`, 'red')
    process.exit(1)
  }
}

// 验证环境
function validateEnvironment() {
  try {
    // 检查是否在正确的目录
    const packageJsonPath = join(__dirname, '../package.json')
    require(packageJsonPath)

    // 检查依赖
    const requiredDeps = ['vitest', '@testing-library/react', '@testing-library/jest-dom']
    const missingDeps = requiredDeps.filter(dep => {
      try {
        require.resolve(dep, { paths: [join(__dirname, '../node_modules')] })
        return false
      } catch {
        return true
      }
    })

    if (missingDeps.length > 0) {
      colorLog('❌ 缺少依赖:', 'red')
      missingDeps.forEach(dep => {
        console.log(`  - ${dep}`)
      })
      colorLog('\n💡 解决方案: npm install', 'yellow')
      process.exit(1)
    }

  } catch (error) {
    colorLog('❌ 环境验证失败:', 'red')
    colorLog(error.message, 'red')
    process.exit(1)
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2)

  // 显示帮助
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showHelp()
    return
  }

  // 验证环境
  validateEnvironment()

  // 解析参数
  const mode = args[0]
  const component = args[1]

  // 运行测试
  runTest(mode, component)
}

// 运行主函数
main()