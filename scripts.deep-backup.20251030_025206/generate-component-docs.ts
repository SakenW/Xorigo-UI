#!/usr/bin/env tsx
/**
 * TH-UI 组件文档自动生成器
 *
 * 功能：
 * - 自动读取组件源码
 * - 提取 TypeScript 接口定义
 * - 提取 CVA 变体配置
 * - 生成标准化 Markdown 文档
 *
 * 使用方法：
 * npx tsx scripts/generate-component-docs.ts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ts from 'typescript'

// ESM 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 组件分类
const COMPONENT_CATEGORIES = {
  ui: {
    name: 'UI 组件',
    path: 'packages/core/src/components/ui',
    components: [
      'Avatar', 'Badge', 'Breadcrumb', 'Button', 'ButtonGroup',
      'Card', 'Checkbox', 'Combobox', 'Command', 'Divider',
      'Input', 'InputNumber', 'PasswordInput', 'Pagination', 'Radio',
      'SearchInput', 'Select', 'Skeleton', 'Spinner', 'Switch',
      'SwitchNoMotion', 'Textarea', 'Tooltip'
    ]
  },
  advanced: {
    name: '高级组件',
    path: 'packages/core/src/components/advanced',
    components: ['AdvancedCard', 'AnimatedCard', 'Dialog', 'InteractionStates', 'MicroInteractions']
  },
  feedback: {
    name: '反馈组件',
    path: 'packages/core/src/components/feedback',
    components: ['Alert', 'Loading', 'Modal', 'Notification', 'Progress', 'ThemeToggle', 'Toast']
  },
  navigation: {
    name: '导航组件',
    path: 'packages/core/src/components/navigation',
    components: ['BasicHeader', 'DataTable', 'ResponsiveLayout', 'Sidebar', 'Tabs', 'Breadcrumb']
  },
  radix: {
    name: 'Radix 组件',
    path: 'packages/core/src/components/radix',
    components: ['Accordion', 'DropdownMenu']
  }
}

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '..')
const DOCS_OUTPUT_DIR = path.join(PROJECT_ROOT, 'docs', 'components')

// 确保输出目录存在
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 读取组件源码
function readComponentSource(categoryPath: string, componentName: string): string | null {
  const filePath = path.join(PROJECT_ROOT, categoryPath, `${componentName}.tsx`)
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  组件文件不存在: ${filePath}`)
    return null
  }
  return fs.readFileSync(filePath, 'utf-8')
}

// 提取组件接口定义
function extractComponentInterface(sourceCode: string, componentName: string): any {
  const sourceFile = ts.createSourceFile(
    'temp.tsx',
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  )

  let propsInterface: any = null
  let displayName: string | null = null

  function visit(node: ts.Node) {
    // 提取 Props 接口
    if (ts.isInterfaceDeclaration(node)) {
      const interfaceName = node.name.text
      if (interfaceName === `${componentName}Props`) {
        const props: any[] = []
        node.members.forEach(member => {
          if (ts.isPropertySignature(member) && member.name) {
            const propName = member.name.getText(sourceFile)
            const type = member.type ? member.type.getText(sourceFile) : 'unknown'
            const optional = !!member.questionToken
            const jsDoc = ts.getJSDocCommentRanges(member, sourceCode)
            const description = jsDoc?.[0] ? sourceCode.substring(jsDoc[0].pos, jsDoc[0].end) : ''

            props.push({
              name: propName,
              type,
              optional,
              description: description.replace(/\/\*\*|\*\/|\*/g, '').trim()
            })
          }
        })
        propsInterface = { name: interfaceName, props }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return propsInterface
}

// 提取 CVA 变体定义
function extractCVAVariants(sourceCode: string): any {
  const variantRegex = /variants:\s*{([^}]+)}/gs
  const match = variantRegex.exec(sourceCode)

  if (!match) return null

  const variantsCode = match[1]
  const variants: any = {}

  // 简单的变体提取（正则表达式方式）
  const variantLines = variantsCode.split('\n').filter(line => line.trim())
  let currentVariant: string | null = null

  variantLines.forEach(line => {
    const variantMatch = line.match(/(\w+):\s*{/)
    if (variantMatch) {
      currentVariant = variantMatch[1]
      variants[currentVariant] = []
    } else if (currentVariant) {
      const optionMatch = line.match(/(\w+):\s*['"]/)
      if (optionMatch) {
        variants[currentVariant].push(optionMatch[1])
      }
    }
  })

  return variants
}

// 生成 Markdown 文档
function generateMarkdown(
  componentName: string,
  category: string,
  propsInterface: any,
  variants: any,
  sourceCode: string
): string {
  const categoryInfo = Object.values(COMPONENT_CATEGORIES).find(c =>
    c.components.includes(componentName)
  )

  let md = `# ${componentName}\n\n`
  md += `> ${categoryInfo?.name || '组件'}\n\n`

  // 组件概述
  md += `## 概述\n\n`
  md += `${componentName} 是 TH-UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。\n\n`

  // 安装和导入
  md += `## 安装\n\n`
  md += `\`\`\`bash\n`
  md += `npm install @th-ui/core\n`
  md += `\`\`\`\n\n`

  md += `## 导入\n\n`
  md += `\`\`\`tsx\n`
  md += `import { ${componentName} } from '@th-ui/core'\n`
  md += `\`\`\`\n\n`

  // 基础用法
  md += `## 基础用法\n\n`
  md += `\`\`\`tsx\n`
  md += `function Example() {\n`
  md += `  return (\n`

  if (componentName === 'Button') {
    md += `    <${componentName}>点击我</${componentName}>\n`
  } else if (componentName === 'Input' || componentName === 'Textarea') {
    md += `    <${componentName} placeholder="请输入..." />\n`
  } else if (componentName === 'Card') {
    md += `    <${componentName}>\n`
    md += `      <p>卡片内容</p>\n`
    md += `    </${componentName}>\n`
  } else {
    md += `    <${componentName} />\n`
  }

  md += `  )\n`
  md += `}\n`
  md += `\`\`\`\n\n`

  // API 参考
  if (propsInterface) {
    md += `## API 参考\n\n`
    md += `### Props\n\n`
    md += `| 属性 | 类型 | 默认值 | 必填 | 说明 |\n`
    md += `|------|------|--------|------|------|\n`

    propsInterface.props.forEach((prop: any) => {
      const required = prop.optional ? '否' : '是'
      const defaultValue = prop.optional ? '-' : '必填'
      const description = prop.description || '-'
      md += `| \`${prop.name}\` | \`${prop.type}\` | ${defaultValue} | ${required} | ${description} |\n`
    })
    md += `\n`
  }

  // 变体展示
  if (variants) {
    md += `## 变体\n\n`

    Object.entries(variants).forEach(([variantName, options]: [string, any]) => {
      if (options.length > 0) {
        md += `### ${variantName}\n\n`
        md += `\`\`\`tsx\n`
        options.forEach((option: string) => {
          md += `<${componentName} ${variantName}="${option}">示例</${componentName}>\n`
        })
        md += `\`\`\`\n\n`
      }
    })
  }

  // 可访问性
  md += `## 可访问性\n\n`
  md += `${componentName} 组件遵循 WCAG 2.1 AA 标准，支持：\n\n`
  md += `- 键盘导航\n`
  md += `- 屏幕阅读器支持\n`
  md += `- ARIA 属性标注\n`
  md += `- 焦点管理\n\n`

  // 主题支持
  md += `## 主题支持\n\n`
  md += `${componentName} 支持 TH-UI 的完整主题系统，包括：\n\n`
  md += `- 亮色/暗色模式自动切换\n`
  md += `- 10 种预设主题配色\n`
  md += `- 设计令牌系统集成\n`
  md += `- 动画效果配置\n\n`

  // TypeScript 支持
  md += `## TypeScript\n\n`
  md += `${componentName} 提供完整的 TypeScript 类型定义：\n\n`
  md += `\`\`\`tsx\n`
  if (propsInterface) {
    md += `interface ${propsInterface.name} {\n`
    propsInterface.props.slice(0, 5).forEach((prop: any) => {
      md += `  ${prop.name}${prop.optional ? '?' : ''}: ${prop.type}\n`
    })
    if (propsInterface.props.length > 5) {
      md += `  // ... 更多属性\n`
    }
    md += `}\n`
  }
  md += `\`\`\`\n\n`

  // 相关组件
  md += `## 相关组件\n\n`
  if (categoryInfo) {
    const relatedComponents = categoryInfo.components
      .filter(c => c !== componentName)
      .slice(0, 3)
    relatedComponents.forEach(comp => {
      md += `- [${comp}](./${comp}.md)\n`
    })
  }
  md += `\n`

  // 版本信息
  md += `---\n\n`
  md += `**版本**: 0.1.0  \n`
  md += `**最后更新**: ${new Date().toISOString().split('T')[0]}  \n`
  md += `**组件路径**: \`packages/core/src/components/${category}/${componentName}.tsx\`\n`

  return md
}

// 主函数
async function main() {
  console.log('🚀 开始生成 TH-UI 组件文档...\n')

  // 确保输出目录存在
  ensureDir(DOCS_OUTPUT_DIR)

  let successCount = 0
  let failCount = 0
  const results: any[] = []

  // 遍历所有分类和组件
  for (const [categoryKey, category] of Object.entries(COMPONENT_CATEGORIES)) {
    console.log(`\n📁 处理分类: ${category.name}`)

    const categoryDocsDir = path.join(DOCS_OUTPUT_DIR, categoryKey)
    ensureDir(categoryDocsDir)

    for (const componentName of category.components) {
      try {
        console.log(`  ⚙️  处理组件: ${componentName}`)

        // 读取源码
        const sourceCode = readComponentSource(category.path, componentName)
        if (!sourceCode) {
          failCount++
          results.push({ component: componentName, status: 'failed', reason: '源文件不存在' })
          continue
        }

        // 提取接口和变体
        const propsInterface = extractComponentInterface(sourceCode, componentName)
        const variants = extractCVAVariants(sourceCode)

        // 生成 Markdown
        const markdown = generateMarkdown(
          componentName,
          categoryKey,
          propsInterface,
          variants,
          sourceCode
        )

        // 写入文件
        const outputPath = path.join(categoryDocsDir, `${componentName}.md`)
        fs.writeFileSync(outputPath, markdown, 'utf-8')

        successCount++
        results.push({
          component: componentName,
          status: 'success',
          outputPath: path.relative(PROJECT_ROOT, outputPath),
          propsCount: propsInterface?.props.length || 0,
          variantsCount: variants ? Object.keys(variants).length : 0
        })

        console.log(`  ✅ 生成成功: ${componentName}.md`)
      } catch (error) {
        failCount++
        results.push({
          component: componentName,
          status: 'failed',
          reason: error instanceof Error ? error.message : String(error)
        })
        console.error(`  ❌ 生成失败: ${componentName}`, error)
      }
    }
  }

  // 生成总索引
  generateIndexReadme(results)

  // 输出统计信息
  console.log('\n' + '='.repeat(60))
  console.log('📊 文档生成统计')
  console.log('='.repeat(60))
  console.log(`✅ 成功: ${successCount} 个组件`)
  console.log(`❌ 失败: ${failCount} 个组件`)
  console.log(`📁 输出目录: ${path.relative(PROJECT_ROOT, DOCS_OUTPUT_DIR)}`)
  console.log('='.repeat(60) + '\n')

  // 生成详细报告
  generateReport(results)
}

// 生成索引页面
function generateIndexReadme(results: any[]) {
  let md = `# TH-UI 组件文档\n\n`
  md += `> TH-UI 组件库完整 API 文档\n\n`
  md += `## 组件总览\n\n`
  md += `TH-UI 提供 **42 个**高质量 React 组件，涵盖 UI、高级、反馈、导航和 Radix 集成等多个分类。\n\n`

  // 统计信息
  const successComponents = results.filter(r => r.status === 'success')
  const totalProps = successComponents.reduce((sum, r) => sum + (r.propsCount || 0), 0)
  const totalVariants = successComponents.reduce((sum, r) => sum + (r.variantsCount || 0), 0)

  md += `## 统计信息\n\n`
  md += `- **组件数量**: ${successComponents.length} / 42\n`
  md += `- **Props 总数**: ${totalProps}\n`
  md += `- **变体总数**: ${totalVariants}\n`
  md += `- **文档生成日期**: ${new Date().toLocaleDateString('zh-CN')}\n\n`

  // 分类列表
  for (const [categoryKey, category] of Object.entries(COMPONENT_CATEGORIES)) {
    md += `## ${category.name}\n\n`

    const categoryComponents = results.filter(r =>
      category.components.includes(r.component) && r.status === 'success'
    )

    if (categoryComponents.length > 0) {
      md += `| 组件 | Props 数量 | 变体数量 | 文档路径 |\n`
      md += `|------|------------|----------|----------|\n`

      categoryComponents.forEach(result => {
        md += `| [${result.component}](./${categoryKey}/${result.component}.md) | ${result.propsCount} | ${result.variantsCount} | \`${result.outputPath}\` |\n`
      })
    }
    md += `\n`
  }

  // 快速开始
  md += `## 快速开始\n\n`
  md += `### 安装\n\n`
  md += `\`\`\`bash\n`
  md += `npm install @th-ui/core\n`
  md += `\`\`\`\n\n`

  md += `### 基础使用\n\n`
  md += `\`\`\`tsx\n`
  md += `import { Button, Card, Input } from '@th-ui/core'\n\n`
  md += `function App() {\n`
  md += `  return (\n`
  md += `    <Card>\n`
  md += `      <Input placeholder="输入内容" />\n`
  md += `      <Button variant="primary">提交</Button>\n`
  md += `    </Card>\n`
  md += `  )\n`
  md += `}\n`
  md += `\`\`\`\n\n`

  md += `## 文档说明\n\n`
  md += `每个组件文档包含：\n\n`
  md += `- **概述**: 组件用途和设计理念\n`
  md += `- **API 参考**: 完整的 Props 类型定义\n`
  md += `- **变体展示**: 所有可用的 variants 和 sizes\n`
  md += `- **使用示例**: 基础和高级用法代码\n`
  md += `- **可访问性**: ARIA 属性和键盘操作说明\n`
  md += `- **主题支持**: 主题系统集成方式\n`
  md += `- **TypeScript**: 类型定义和使用方法\n\n`

  md += `## 资源链接\n\n`
  md += `- [项目主页](../../README.md)\n`
  md += `- [设计系统](../design-system/README.md)\n`
  md += `- [主题配置](../../packages/core/src/theme/README.md)\n`
  md += `- [示例代码](../../examples/README.md)\n\n`

  md += `---\n\n`
  md += `**维护**: TH-UI Team  \n`
  md += `**版本**: 0.1.0  \n`
  md += `**技术栈**: React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12\n`

  const indexPath = path.join(DOCS_OUTPUT_DIR, 'README.md')
  fs.writeFileSync(indexPath, md, 'utf-8')
  console.log(`\n📝 生成索引文件: ${path.relative(PROJECT_ROOT, indexPath)}`)
}

// 生成详细报告
function generateReport(results: any[]) {
  const reportPath = path.join(PROJECT_ROOT, 'docs', 'reports', `component-docs-generation-${Date.now()}.md`)
  ensureDir(path.dirname(reportPath))

  let md = `# TH-UI 组件文档生成报告\n\n`
  md += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n\n`

  md += `## 执行摘要\n\n`
  const successCount = results.filter(r => r.status === 'success').length
  const failCount = results.filter(r => r.status === 'failed').length
  md += `- **总计**: ${results.length} 个组件\n`
  md += `- **成功**: ${successCount} 个 (${((successCount / results.length) * 100).toFixed(1)}%)\n`
  md += `- **失败**: ${failCount} 个 (${((failCount / results.length) * 100).toFixed(1)}%)\n\n`

  md += `## 成功组件列表\n\n`
  md += `| 组件 | Props | 变体 | 输出路径 |\n`
  md += `|------|-------|------|----------|\n`
  results.filter(r => r.status === 'success').forEach(r => {
    md += `| ${r.component} | ${r.propsCount} | ${r.variantsCount} | \`${r.outputPath}\` |\n`
  })
  md += `\n`

  if (failCount > 0) {
    md += `## 失败组件列表\n\n`
    md += `| 组件 | 失败原因 |\n`
    md += `|------|----------|\n`
    results.filter(r => r.status === 'failed').forEach(r => {
      md += `| ${r.component} | ${r.reason} |\n`
    })
    md += `\n`
  }

  md += `## 技术细节\n\n`
  md += `- **文档格式**: GitHub Flavored Markdown\n`
  md += `- **Props 提取**: TypeScript AST 自动解析\n`
  md += `- **变体提取**: CVA 配置正则匹配\n`
  md += `- **输出目录**: \`docs/components/\`\n\n`

  md += `## 下一步行动\n\n`
  md += `- [ ] 审查生成的文档内容\n`
  md += `- [ ] 补充使用示例和最佳实践\n`
  md += `- [ ] 添加组件演示截图\n`
  md += `- [ ] 完善可访问性说明\n`
  if (failCount > 0) {
    md += `- [ ] 修复失败的组件文档生成\n`
  }

  fs.writeFileSync(reportPath, md, 'utf-8')
  console.log(`📄 生成详细报告: ${path.relative(PROJECT_ROOT, reportPath)}`)
}

// 执行主函数
main().catch(console.error)
