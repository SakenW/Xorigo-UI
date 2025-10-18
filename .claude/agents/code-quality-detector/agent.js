#!/usr/bin/env node

/**
 * Xorigo UI 代码质量检测 Agent - Claude Hooks 入口文件
 *
 * 这是一个简化版本，专门用于 Claude Hooks 集成
 * 直接执行检测逻辑，无需复杂的依赖管理
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 简化的检测规则
 */
const DETECTION_RULES = {
  // Website 架构规则
  websiteArchitecture: {
    pattern: /^\/home\/saken\/project\/Xorigo-UI\/apps\/website\/.*\.(tsx?|jsx?)$/,
    rules: [
      {
        name: 'no-local-ui-components',
        message: 'Website 不应直接创建 UI 组件，应从 packages/core 导入',
        check: (content) => {
          // 检查是否创建了本地 UI 组件
          const hasLocalComponent = /export\s+(default\s+)?function\s+\w+|const\s+\w+\s*=\s*\(\s*\)\s*=>|export\s+const\s+\w+\s*=/.test(content) &&
                                 (content.includes('return') && (content.includes('<div') || content.includes('<button') || content.includes('<input')))
          return hasLocalComponent
        }
      }
    ]
  },

  // 组件命名规则
  componentNaming: {
    pattern: /^\/home\/saken\/project\/Xorigo-UI\/packages\/.*\.(tsx?|jsx?)$/,
    rules: [
      {
        name: 'component-file-naming',
        message: '组件文件应使用 PascalCase 命名',
        check: (content, filePath) => {
          const fileName = filePath.split('/').pop().replace(/\.(tsx?|jsx?)$/, '')
          // 检查是否是 PascalCase
          const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(fileName)
          return !isPascalCase
        }
      },
      {
        name: 'default-export-component',
        message: '组件文件应有默认导出',
        check: (content) => {
          return /export\s+default/.test(content)
        }
      }
    ]
  },

  // 通用规则
  general: {
    pattern: /^\/home\/saken\/project\/Xorigo-UI\/.*\.(tsx?|jsx?|ts|js)$/,
    rules: [
      {
        name: 'no-hardcoded-colors',
        message: '禁止使用硬编码颜色值，应使用主题变量',
        check: (content) => {
          const hardcodedColors = /(#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(|hsla\().*['"]?\s*[;,{]/.test(content)
          return hardcodedColors && !content.includes('var(--color-')
        }
      }
    ]
  }
}

/**
 * 解析命令行参数
 */
function parseArgs(args) {
  const options = {
    verbose: false,
    check: null,
    toolInput: null,
    filePath: null,
    operation: 'edit'
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--verbose':
      case '-v':
        options.verbose = true
        break

      case '--check':
        options.check = args[++i]
        break

      case '--tool-input':
        const toolInputJson = args[++i]
        try {
          options.toolInput = JSON.parse(toolInputJson)
        } catch (e) {
          console.error('❌ 无效的 tool_input JSON:', toolInputJson)
          process.exit(1)
        }
        break

      case '--file':
        options.filePath = args[++i]
        break

      case '--operation':
        options.operation = args[++i]
        break

      case '--help':
      case '-h':
        showHelp()
        process.exit(0)

      default:
        if (arg.startsWith('--')) {
          console.error('❌ 未知参数:', arg)
          process.exit(1)
        }
    }
  }

  return options
}

/**
 * 构建检测上下文
 */
function buildDetectionContext(options) {
  let toolInput = options.toolInput

  if (!toolInput && options.filePath) {
    toolInput = {
      file_path: options.filePath,
      operation: options.operation || 'edit'
    }
  }

  return {
    toolInput,
    operation: options.operation,
    metadata: {
      timestamp: new Date().toISOString(),
      agent: 'code-quality-detector',
      version: '1.0.0',
      mode: options.check ? `check-${options.check}` : 'full'
    }
  }
}

/**
 * 执行代码质量检测
 */
async function detectCodeQuality(context) {
  const results = []
  const filePath = context.toolInput?.file_path

  if (!filePath) {
    if (context.verbose) {
      console.log('ℹ️ 未提供文件路径，跳过检测')
    }
    return results
  }

  try {
    // 检查文件是否存在
    if (!existsSync(filePath)) {
      console.log(`⚠️ 文件不存在: ${filePath}`)
      return results
    }

    // 读取文件内容
    const content = readFileSync(filePath, 'utf-8')

    // 应用相应的检测规则
    Object.entries(DETECTION_RULES).forEach(([category, ruleSet]) => {
      if (ruleSet.pattern.test(filePath)) {
        ruleSet.rules.forEach(rule => {
          try {
            if (rule.check(content, filePath)) {
              results.push({
                severity: 'error',
                message: rule.message,
                rule: rule.name,
                file: filePath,
                category,
                fixable: true,
                fixSuggestion: getFixSuggestion(rule.name, content, filePath)
              })
            }
          } catch (error) {
            console.error(`❌ 规则检查失败 ${rule.name}:`, error.message)
          }
        })
      }
    })

    if (context.verbose && results.length > 0) {
      console.log(`🔍 检测完成: ${filePath}`)
    }

  } catch (error) {
    console.error(`❌ 检测失败:`, error.message)
  }

  return results
}

/**
 * 获取修复建议
 */
function getFixSuggestion(ruleName, content, filePath) {
  const suggestions = {
    'no-local-ui-components': '将 UI 组件移动到 packages/core/src/components/，并在 website 中通过 import 导入使用',
    'component-file-naming': `将文件重命名为 PascalCase 格式，例如: ${filePath.split('/').pop().replace(/\.(tsx?|jsx?)$/, '').charAt(0).toUpperCase() + filePath.split('/').pop().replace(/\.(tsx?|jsx?)$/, '').slice(1)}`,
    'default-export-component': '在组件文件末尾添加: export default ComponentName',
    'no-hardcoded-colors': '使用主题变量替换硬编码颜色，例如: var(--color-primary-500)'
  }

  return suggestions[ruleName] || '请根据错误信息修复代码'
}

/**
 * 输出检测结果
 */
function outputResults(results, options) {
  if (!results || results.length === 0) {
    if (options.verbose) {
      console.log('✅ 未发现代码质量问题')
    }
    return
  }

  // 按严重程度分组
  const errors = results.filter(r => r.severity === 'error')
  const warnings = results.filter(r => r.severity === 'warning')

  // 输出错误
  if (errors.length > 0) {
    console.log('\n🚨 错误:')
    errors.forEach(result => {
      console.log(`  ❌ ${result.message}`)
      if (result.file) {
        console.log(`     文件: ${result.file}`)
      }
      if (result.rule) {
        console.log(`     规则: ${result.rule}`)
      }
      if (result.fixSuggestion) {
        console.log(`     建议: ${result.fixSuggestion}`)
      }
    })
  }

  // 输出警告
  if (warnings.length > 0) {
    console.log('\n⚠️  警告:')
    warnings.forEach(result => {
      console.log(`  ⚠️  ${result.message}`)
      if (result.file) {
        console.log(`     文件: ${result.file}`)
      }
      if (result.rule) {
        console.log(`     规则: ${result.rule}`)
      }
    })
  }

  // 输出统计
  const totalIssues = results.length
  console.log(`\n📊 检测完成: 发现 ${totalIssues} 个问题 (${errors.length} 错误, ${warnings.length} 警告)`)
}

/**
 * 确定退出码
 */
function determineExitCode(results) {
  if (!results || results.length === 0) {
    return 0
  }

  const errors = results.filter(r => r.severity === 'error')

  if (errors.length > 0) {
    return 1 // 有错误
  }

  return 0
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
Xorigo UI 代码质量检测工具 v1.0.0

用法:
  node agent.js [选项]

选项:
  -v, --verbose              显示详细输出
  --check <type>             指定检查类型 (architecture|naming|full)
  --tool-input <json>        Claude Hook 工具输入 (JSON格式)
  --file <path>              指定检测文件路径
  --operation <type>         操作类型 (edit|write|read|delete)
  -h, --help                 显示此帮助信息

示例:
  node agent.js --file /path/to/file.ts
  node agent.js --check architecture --file apps/website/components/Button.tsx
  node agent.js --tool-input '{"file_path":"src/Button.tsx","operation":"edit"}'
  node agent.js --verbose --check naming

支持的检查类型:
  architecture  - Website 架构规则检查
  naming        - 组件命名规范检查
  full          - 完整代码质量检查 (默认)

退出码:
  0  - 成功（无错误或仅有警告）
  1  - 检测到错误
`)
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2)

  try {
    // 解析命令行参数
    const options = parseArgs(args)

    // 构建检测上下文
    const context = buildDetectionContext(options)
    context.verbose = options.verbose

    // 执行检测
    const results = await detectCodeQuality(context)

    // 输出结果
    outputResults(results, options)

    // 根据错误级别设置退出码
    const exitCode = determineExitCode(results)
    process.exit(exitCode)

  } catch (error) {
    console.error('❌ 检测执行失败:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// 如果直接运行此脚本，执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}