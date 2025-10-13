/**
 * 验证组件注册表脚本
 *
 * 用法：
 * npm run validate
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { RegistrySchema } from '../src/types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function main() {
  log('cyan', '\n🔍 Xorigo UI 组件注册表验证器\n')
  log('gray', '━'.repeat(50))

  const registryPath = path.join(__dirname, '../src/registry.json')

  try {
    // 读取注册表
    log('yellow', '\n📖 读取注册表...')
    const content = await fs.readFile(registryPath, 'utf-8')
    const data = JSON.parse(content)

    log('green', '✓ 注册表文件读取成功')

    // Zod 验证
    log('yellow', '\n🔍 验证数据结构...')
    const result = RegistrySchema.safeParse(data)

    if (!result.success) {
      log('red', '\n❌ 验证失败\n')
      console.error(result.error.format())
      process.exit(1)
    }

    const registry = result.data

    log('green', '✓ 数据结构验证通过')

    // 统计信息
    log('cyan', '\n📊 注册表统计:')
    log('gray', `  版本: ${registry.version}`)
    log('gray', `  生成时间: ${new Date(registry.generatedAt).toLocaleString('zh-CN')}`)
    log('gray', `  组件总数: ${registry.components.length}`)

    // 分类统计
    const categoryStats = registry.components.reduce((acc, component) => {
      acc[component.category] = (acc[component.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    log('gray', '\n  分类统计:')
    Object.entries(categoryStats).forEach(([category, count]) => {
      log('gray', `    ${category}: ${count} 个组件`)
    })

    // 可访问性统计
    const a11yCount = registry.components.filter(c => {
      const a11y = c.accessibility
      return a11y && (a11y['aria-label'] || a11y['keyboard-navigation'] || a11y['screen-reader'])
    }).length

    log('gray', `\n  可访问性支持: ${a11yCount}/${registry.components.length} 个组件`)

    // 主题支持统计
    const themeCount = registry.components.filter(c => c.theme?.supported).length

    log('gray', `  主题支持: ${themeCount}/${registry.components.length} 个组件`)

    // 质量检查
    log('yellow', '\n🧪 质量检查...')

    const warnings: string[] = []

    // 检查缺少描述的组件
    const noDescriptionComponents = registry.components.filter(
      c => !c.description || c.description.trim() === ''
    )
    if (noDescriptionComponents.length > 0) {
      warnings.push(
        `${noDescriptionComponents.length} 个组件缺少描述: ${noDescriptionComponents.map(c => c.name).join(', ')}`
      )
    }

    // 检查没有 Props 的组件
    const noPropsComponents = registry.components.filter(c => c.props.length === 0)
    if (noPropsComponents.length > 0) {
      warnings.push(
        `${noPropsComponents.length} 个组件没有定义 Props: ${noPropsComponents.map(c => c.name).join(', ')}`
      )
    }

    // 检查没有示例的组件
    const noExampleComponents = registry.components.filter(c => !c.example)
    if (noExampleComponents.length > 0) {
      warnings.push(
        `${noExampleComponents.length} 个组件没有示例代码: ${noExampleComponents.map(c => c.name).join(', ')}`
      )
    }

    // 显示警告
    if (warnings.length > 0) {
      log('yellow', `\n⚠️  发现 ${warnings.length} 个警告:`)
      warnings.forEach((warning, index) => {
        log('gray', `  ${index + 1}. ${warning}`)
      })
    } else {
      log('green', '\n✓ 质量检查通过')
    }

    // 完成
    log('gray', '\n' + '━'.repeat(50))
    log('green', '\n🎉 验证完成！')
    console.log()
  } catch (error) {
    log('red', `\n❌ 验证失败: ${error instanceof Error ? error.message : String(error)}`)
    console.error(error)
    process.exit(1)
  }
}

// 运行主函数
main().catch((error) => {
  log('red', `\n❌ 验证失败: ${error.message}`)
  console.error(error)
  process.exit(1)
})
