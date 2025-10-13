/**
 * sync 命令实现 - 文档同步和生成
 *
 * 功能：
 * - 从 registry 读取组件列表
 * - 生成 Props 表
 * - 生成示例代码
 * - 更新搜索索引
 * - 监听模式
 */

import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { watch } from 'chokidar'

// Registry 类型定义
interface RegistryComponent {
  name: string
  description?: string
  props?: any[]
  examples?: any[]
  category?: string
  tags?: string[]
}

interface Registry {
  components?: RegistryComponent[]
  version?: string
  lastUpdated?: string
}

export interface SyncOptions {
  watch?: boolean
  verbose?: boolean
  outputPath?: string
  generateExamples?: boolean
  generateProps?: boolean
  generateIndex?: boolean
}

// 组件信息接口
interface ComponentInfo {
  name: string
  description?: string
  props: PropInfo[]
  examples: ExampleInfo[]
  category: string
  tags: string[]
}

interface PropInfo {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description?: string
}

interface ExampleInfo {
  title: string
  description?: string
  code: string
  live?: boolean
}

// 搜索索引条目
interface SearchIndexEntry {
  id: string
  title: string
  content: string
  url: string
  category: string
  tags: string[]
  lastModified: string
}

/**
 * 执行同步操作
 */
export async function runSync(options: SyncOptions): Promise<void> {
  const spinner = ora('🔄 同步文档和组件信息...').start()

  try {
    const rootPath = process.cwd()
    const outputPath = options.outputPath || path.join(rootPath, 'docs/generated')

    // 确保输出目录存在
    await fs.mkdir(outputPath, { recursive: true })

    // 1. 读取 Registry
    const registry = await loadRegistry(rootPath)

    if (!registry) {
      spinner.fail(chalk.red('❌ 无法加载 Registry'))
      return
    }

    // 2. 生成组件文档
    if (options.generateProps !== false) {
      await generatePropsDocs(registry, outputPath, options.verbose)
    }

    // 3. 生成示例代码
    if (options.generateExamples !== false) {
      await generateExamples(registry, outputPath, options.verbose)
    }

    // 4. 生成搜索索引
    if (options.generateIndex !== false) {
      await generateSearchIndex(registry, outputPath, options.verbose)
    }

    // 5. 生成组件列表
    await generateComponentList(registry, outputPath, options.verbose)

    spinner.succeed(chalk.green('✅ 文档同步完成'))

    // 启动监听模式
    if (options.watch) {
      startWatchMode(rootPath, outputPath, options)
    }

  } catch (error) {
    spinner.fail(chalk.red('❌ 文档同步失败'))
    throw error
  }
}

/**
 * 加载 Registry
 */
async function loadRegistry(rootPath: string): Promise<Registry | null> {
  try {
    const registryPath = path.join(rootPath, 'packages/registry/registry.json')
    const content = await fs.readFile(registryPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(chalk.red('无法加载 Registry:', error))
    return null
  }
}

/**
 * 生成 Props 文档
 */
async function generatePropsDocs(registry: Registry, outputPath: string, verbose?: boolean): Promise<void> {
  const spinner = ora('📝 生成 Props 文档...').start()

  try {
    const propsDir = path.join(outputPath, 'props')
    await fs.mkdir(propsDir, { recursive: true })

    const components = registry.components || []

    for (const component of components) {
      const componentInfo = await analyzeComponent(component.name)
      const propsTable = generatePropsTable(componentInfo)
      const markdownContent = generatePropsMarkdown(componentInfo, propsTable)

      const filePath = path.join(propsDir, `${component.name}.md`)
      await fs.writeFile(filePath, markdownContent, 'utf-8')

      if (verbose) {
        console.log(chalk.gray(`生成 Props 文档: ${component.name}`))
      }
    }

    // 生成 Props 索引
    const indexContent = generatePropsIndex(components)
    await fs.writeFile(path.join(propsDir, 'index.md'), indexContent, 'utf-8')

    spinner.succeed(chalk.green('✅ Props 文档生成完成'))

  } catch (error) {
    spinner.fail(chalk.red('❌ Props 文档生成失败'))
    throw error
  }
}

/**
 * 生成示例代码
 */
async function generateExamples(registry: Registry, outputPath: string, verbose?: boolean): Promise<void> {
  const spinner = ora('💡 生成示例代码...').start()

  try {
    const examplesDir = path.join(outputPath, 'examples')
    await fs.mkdir(examplesDir, { recursive: true })

    const components = registry.components || []

    for (const component of components) {
      const componentInfo = await analyzeComponent(component.name)
      const examples = componentInfo.examples
      const markdownContent = generateExamplesMarkdown(component.name, examples)

      const filePath = path.join(examplesDir, `${component.name}.md`)
      await fs.writeFile(filePath, markdownContent, 'utf-8')

      if (verbose) {
        console.log(chalk.gray(`生成示例代码: ${component.name}`))
      }
    }

    // 生成示例索引
    const indexContent = generateExamplesIndex(components)
    await fs.writeFile(path.join(examplesDir, 'index.md'), indexContent, 'utf-8')

    spinner.succeed(chalk.green('✅ 示例代码生成完成'))

  } catch (error) {
    spinner.fail(chalk.red('❌ 示例代码生成失败'))
    throw error
  }
}

/**
 * 生成搜索索引
 */
async function generateSearchIndex(registry: Registry, outputPath: string, verbose?: boolean): Promise<void> {
  const spinner = ora('🔍 生成搜索索引...').start()

  try {
    const components = registry.components || []
    const searchIndex: SearchIndexEntry[] = []

    for (const component of components) {
      const componentInfo = await analyzeComponent(component.name)

      // 组件主条目
      searchIndex.push({
        id: component.name,
        title: component.name,
        content: `${component.name} ${componentInfo.description || ''} ${componentInfo.tags.join(' ')}`,
        url: `/components/${component.name}`,
        category: componentInfo.category,
        tags: componentInfo.tags,
        lastModified: new Date().toISOString()
      })

      // Props 条目
      for (const prop of componentInfo.props) {
        searchIndex.push({
          id: `${component.name}-${prop.name}`,
          title: `${component.name}.${prop.name}`,
          content: `${prop.name} ${prop.type} ${prop.description || ''}`,
          url: `/components/${component.name}#${prop.name}`,
          category: 'Props',
          tags: [componentInfo.category, 'props'],
          lastModified: new Date().toISOString()
        })
      }
    }

    // 写入 JSON 索引
    const indexPath = path.join(outputPath, 'search-index.json')
    await fs.writeFile(indexPath, JSON.stringify(searchIndex, null, 2), 'utf-8')

    // 写入 JavaScript 索引
    const jsIndexPath = path.join(outputPath, 'search-index.js')
    const jsContent = `// Auto-generated search index
window.XorigoSearchIndex = ${JSON.stringify(searchIndex, null, 2)};`
    await fs.writeFile(jsIndexPath, jsContent, 'utf-8')

    if (verbose) {
      console.log(chalk.gray(`生成搜索索引: ${searchIndex.length} 个条目`))
    }

    spinner.succeed(chalk.green('✅ 搜索索引生成完成'))

  } catch (error) {
    spinner.fail(chalk.red('❌ 搜索索引生成失败'))
    throw error
  }
}

/**
 * 生成组件列表
 */
async function generateComponentList(registry: Registry, outputPath: string, verbose?: boolean): Promise<void> {
  const spinner = ora('📋 生成组件列表...').start()

  try {
    const components = registry.components || []

    // 按类别分组
    const byCategory = new Map<string, typeof components>()
    for (const component of components) {
      const info = await analyzeComponent(component.name)
      if (!byCategory.has(info.category)) {
        byCategory.set(info.category, [])
      }
      byCategory.get(info.category)!.push(component)
    }

    // 生成 Markdown 列表
    const markdownContent = await generateComponentListMarkdown(byCategory)
    const listPath = path.join(outputPath, 'components.md')
    await fs.writeFile(listPath, markdownContent, 'utf-8')

    // 生成 JSON 列表
    const jsonContent = {
      categories: Object.fromEntries(
        Array.from(byCategory.entries()).map(([category, comps]) => [
          category,
          comps.map(c => c.name)
        ])
      ),
      total: components.length,
      lastUpdated: new Date().toISOString()
    }
    const jsonPath = path.join(outputPath, 'components.json')
    await fs.writeFile(jsonPath, JSON.stringify(jsonContent, null, 2), 'utf-8')

    if (verbose) {
      console.log(chalk.gray(`生成组件列表: ${components.length} 个组件，${byCategory.size} 个类别`))
    }

    spinner.succeed(chalk.green('✅ 组件列表生成完成'))

  } catch (error) {
    spinner.fail(chalk.red('❌ 组件列表生成失败'))
    throw error
  }
}

/**
 * 分析组件信息
 */
async function analyzeComponent(componentName: string): Promise<ComponentInfo> {
  const rootPath = process.cwd()
  const componentPath = path.join(rootPath, 'packages/core/src', componentName)

  try {
    // 读取组件入口文件
    const indexPath = path.join(componentPath, 'index.ts')
    const indexContent = await fs.readFile(indexPath, 'utf-8')

    // 读取组件文件
    const componentFilePath = path.join(componentPath, `${componentName}.tsx`)
    let componentContent = ''
    try {
      componentContent = await fs.readFile(componentFilePath, 'utf-8')
    } catch {
      // 尝试读取 .ts 文件
      componentContent = await fs.readFile(
        path.join(componentPath, `${componentName}.ts`),
        'utf-8'
      )
    }

    // 解析 Props
    const props = extractProps(componentContent)

    // 解析示例
    const examples = extractExamples(componentContent, componentName)

    // 确定类别
    const category = determineCategory(componentName)

    // 提取标签
    const tags = extractTags(indexContent, componentContent)

    return {
      name: componentName,
      description: extractDescription(componentContent),
      props,
      examples,
      category,
      tags
    }

  } catch (error) {
    console.warn(chalk.yellow(`警告: 无法分析组件 ${componentName}: ${error}`))

    return {
      name: componentName,
      props: [],
      examples: [],
      category: 'Unknown',
      tags: []
    }
  }
}

/**
 * 提取 Props 信息
 */
function extractProps(componentContent: string): PropInfo[] {
  const props: PropInfo[] = []

  // 查找 interface 定义
  const interfaceMatch = componentContent.match(/interface\s+(\w+Props)\s*{([^}]+)}/s)
  if (!interfaceMatch) return props

  const interfaceBody = interfaceMatch[2]
  if (!interfaceBody) return props

  const propMatches = interfaceBody.matchAll(/(\w+)(\?)?:\s*([^;]+);/g)

  for (const match of propMatches) {
    const [, name, optional, type] = match
    const required = !optional
    const cleanType = type?.trim().replace(/\s+/g, ' ') || ''

    props.push({
      name: name || '',
      type: cleanType,
      required,
      description: extractPropDescription(componentContent, name || '')
    })
  }

  return props
}

/**
 * 提取示例代码
 */
function extractExamples(componentContent: string, componentName: string): ExampleInfo[] {
  const examples: ExampleInfo[] = []

  // 查找 @example 注释
  const exampleMatches = componentContent.matchAll(/@example\s*\n\s*```(tsx?)\n(.*?)\n```/gs)

  for (const match of exampleMatches) {
    const [, lang, code] = match
    examples.push({
      title: `示例 ${examples.length + 1}`,
      code: code?.trim() || '',
      live: lang === 'tsx'
    })
  }

  // 如果没有找到示例，生成一个基础示例
  if (examples.length === 0) {
    examples.push({
      title: '基础用法',
      code: `import { ${componentName} } from '@xorigo-ui/core'

function Example() {
  return (
    <${componentName}>
      内容
    </${componentName}>
  )
}`
    })
  }

  return examples
}

/**
 * 确定组件类别
 */
function determineCategory(componentName: string): string {
  const categories: Record<string, string> = {
    // 基础组件
    button: 'Basic',
    input: 'Basic',
    textarea: 'Basic',
    select: 'Basic',
    checkbox: 'Basic',
    radio: 'Basic',
    switch: 'Basic',

    // 布局组件
    card: 'Layout',
    grid: 'Layout',
    flex: 'Layout',
    container: 'Layout',

    // 导航组件
    tabs: 'Navigation',
    breadcrumb: 'Navigation',
    menu: 'Navigation',
    pagination: 'Navigation',

    // 反馈组件
    alert: 'Feedback',
    modal: 'Feedback',
    toast: 'Feedback',
    loading: 'Feedback',
    progress: 'Feedback',

    // 数据组件
    table: 'Data',
    list: 'Data',
    tree: 'Data',
    chart: 'Data'
  }

  return categories[componentName.toLowerCase()] || 'Other'
}

/**
 * 提取标签
 */
function extractTags(indexContent: string, componentContent: string): string[] {
  const tags = new Set<string>()

  // 从注释中提取标签
  const tagMatches = componentContent.matchAll(/@tag\s+(\w+)/g)
  for (const match of tagMatches) {
    if (match[1]) tags.add(match[1])
  }

  // 基于文件名推断标签
  if (componentContent.includes('theme')) tags.add('theming')
  if (componentContent.includes('accessibility') || componentContent.includes('a11y')) tags.add('accessibility')
  if (componentContent.includes('animation') || componentContent.includes('motion')) tags.add('animation')
  if (componentContent.includes('responsive')) tags.add('responsive')

  return Array.from(tags)
}

/**
 * 提取描述
 */
function extractDescription(componentContent: string): string {
  // 查找文件顶部的注释
  const commentMatch = componentContent.match(/\/\*\*\s*\n\s*\*\s*(.*?)\s*\n/s)
  if (commentMatch) {
    return commentMatch[1]?.trim() || ''
  }

  return ''
}

/**
 * 提取 Prop 描述
 */
function extractPropDescription(componentContent: string, propName: string): string {
  // 查找 Prop 上面的 JSDoc 注释
  const regex = new RegExp(`\\*\\s*${propName}.*?\\*\\s*(.*?)\\s*\\n`, 's')
  const match = componentContent.match(regex)
  return match?.[1]?.trim() || ''
}

/**
 * 生成 Props 表格
 */
function generatePropsTable(componentInfo: ComponentInfo): string {
  if (componentInfo.props.length === 0) {
    return '该组件没有 Props。'
  }

  let table = '| 属性名 | 类型 | 必填 | 默认值 | 描述 |\n'
  table += '|--------|------|------|--------|------|\n'

  for (const prop of componentInfo.props) {
    const required = prop.required ? '✅' : '❌'
    const defaultValue = prop.defaultValue || '-'
    const description = prop.description || '-'

    table += `| \`${prop.name}\` | \`${prop.type}\` | ${required} | \`${defaultValue}\` | ${description} |\n`
  }

  return table
}

/**
 * 生成 Props Markdown
 */
function generatePropsMarkdown(componentInfo: ComponentInfo, propsTable: string): string {
  let content = `# ${componentInfo.name} Props\n\n`

  if (componentInfo.description) {
    content += `${componentInfo.description}\n\n`
  }

  content += `## 属性\n\n`
  content += propsTable
  content += '\n'

  if (componentInfo.tags.length > 0) {
    content += `## 标签\n\n`
    content += componentInfo.tags.map(tag => `\`${tag}\``).join(' ') + '\n\n'
  }

  content += `---\n\n`
  content += `*此文档由 Xorigo UI CLI 自动生成*\n`

  return content
}

/**
 * 生成 Props 索引
 */
function generatePropsIndex(components: any[]): string {
  let content = '# Props 文档索引\n\n'

  content += '本文档包含所有组件的 Props 详细说明。\n\n'

  content += '## 组件列表\n\n'

  for (const component of components) {
    content += `- [${component.name}](./${component.name}.md)\n`
  }

  content += '\n---\n\n'
  content += `*共 ${components.length} 个组件的 Props 文档*\n`

  return content
}

/**
 * 生成示例 Markdown
 */
function generateExamplesMarkdown(componentName: string, examples: ExampleInfo[]): string {
  let content = `# ${componentName} 示例\n\n`

  for (const example of examples) {
    content += `## ${example.title}\n\n`

    if (example.description) {
      content += `${example.description}\n\n`
    }

    content += '```' + (example.live ? 'tsx' : 'ts') + '\n'
    content += example.code
    content += '\n```\n\n'
  }

  content += `---\n\n`
  content += `*此文档由 Xorigo UI CLI 自动生成*\n`

  return content
}

/**
 * 生成示例索引
 */
function generateExamplesIndex(components: any[]): string {
  let content = '# 示例代码索引\n\n'

  content += '本文档包含所有组件的使用示例。\n\n'

  content += '## 组件示例\n\n'

  for (const component of components) {
    content += `- [${component.name}](./${component.name}.md)\n`
  }

  content += '\n---\n\n'
  content += `*共 ${components.length} 个组件的示例代码*\n`

  return content
}

/**
 * 生成组件列表 Markdown
 */
async function generateComponentListMarkdown(byCategory: Map<string, RegistryComponent[]>): Promise<string> {
  let content = '# 组件列表\n\n'

  content += 'Xorigo UI 提供了以下组件：\n\n'

  for (const [category, components] of byCategory.entries()) {
    content += `## ${category}\n\n`

    for (const component of components) {
      const info = await analyzeComponent(component.name)
      content += `### ${component.name}\n\n`

      if (info.description) {
        content += `${info.description}\n\n`
      }

      if (info.props.length > 0) {
        content += `**主要 Props:** ${info.props.slice(0, 3).map(p => `\`${p.name}\``).join(', ')}\n\n`
      }

      if (info.tags.length > 0) {
        content += `**标签:** ${info.tags.map(tag => `\`${tag}\``).join(' ')}\n\n`
      }

      content += `- [Props 文档](./props/${component.name}.md)\n`
      content += `- [示例代码](./examples/${component.name}.md)\n\n`
    }
  }

  content += `---\n\n`
  content += `*总计 ${Array.from(byCategory.values()).flat().length} 个组件，${byCategory.size} 个类别*\n`

  return content
}

/**
 * 启动监听模式
 */
function startWatchMode(rootPath: string, outputPath: string, options: SyncOptions): void {
  console.log(chalk.blue('\n👁️  启动监听模式...'))

  const pathsToWatch = [
    'packages/core/src/**/*.{ts,tsx}',
    'packages/registry/registry.json'
  ]

  const watcher = watch(pathsToWatch, {
    cwd: rootPath,
    ignored: /node_modules|dist/,
    persistent: true
  })

  watcher.on('change', async (filePath: string) => {
    console.log(chalk.yellow(`\n📝 检测到文件变更: ${filePath}`))

    try {
      await runSync(options)
      console.log(chalk.green('✅ 自动同步完成'))
    } catch (error) {
      console.error(chalk.red('❌ 自动同步失败:', error))
    }
  })

  watcher.on('add', async (filePath: string) => {
    console.log(chalk.cyan(`\n➕ 检测到新增文件: ${filePath}`))

    try {
      await runSync(options)
      console.log(chalk.green('✅ 自动同步完成'))
    } catch (error) {
      console.error(chalk.red('❌ 自动同步失败:', error))
    }
  })

  // 优雅关闭
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n👋 停止监听...'))
    watcher.close()
    process.exit(0)
  })

  console.log(chalk.green('✅ 监听已启动，按 Ctrl+C 退出'))
}