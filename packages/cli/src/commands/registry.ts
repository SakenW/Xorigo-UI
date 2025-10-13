/**
 * registry:scan 命令实现 - 组件注册表扫描
 *
 * 功能：
 * - 扫描所有包的导出组件
 * - 提取组件元数据（名称、类型、props、分类）
 * - 生成 registry.json 文件
 * - 支持增量更新
 */

import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'

export interface RegistryScanOptions {
  packages?: string[]
  output?: string
  incremental?: boolean
}

// 组件元数据接口
interface ComponentMetadata {
  name: string
  category: string
  package: string
  path: string
  exportType: 'default' | 'named'
  props?: PropMetadata[]
  tags?: string[]
  a11y?: boolean
  description?: string
}

// Props 元数据接口
interface PropMetadata {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description?: string
}

// Registry 结构
interface Registry {
  version: string
  lastUpdated: string
  components: ComponentMetadata[]
  stats: {
    totalComponents: number
    byCategory: Record<string, number>
    byPackage: Record<string, number>
  }
}

/**
 * 扫描单个文件提取组件信息
 */
async function scanComponentFile(filePath: string, packageName: string): Promise<ComponentMetadata | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')

    // 提取组件名称（假设文件名即组件名）
    const fileName = path.basename(filePath, path.extname(filePath))

    // 跳过 index 文件和工具文件
    if (fileName === 'index' || fileName.startsWith('use') || fileName.includes('utils')) {
      return null
    }

    // 检查是否包含组件定义
    const hasComponent =
      content.includes(`export const ${fileName}`) ||
      content.includes(`export default ${fileName}`) ||
      content.includes(`export function ${fileName}`)

    if (!hasComponent) {
      return null
    }

    // 确定导出类型
    const exportType = content.includes(`export default ${fileName}`) ? 'default' : 'named'

    // 推断分类（基于文件路径）
    const relativePath = path.relative(process.cwd(), filePath)
    const pathParts = relativePath.split(path.sep)
    const category = pathParts.includes('base') ? 'base' :
                    pathParts.includes('feedback') ? 'feedback' :
                    pathParts.includes('navigation') ? 'navigation' :
                    pathParts.includes('form') ? 'form' :
                    pathParts.includes('data') ? 'data' :
                    pathParts.includes('layout') ? 'layout' :
                    'other'

    // 提取 Props 接口（简化版）
    const propsMatch = content.match(new RegExp(`interface ${fileName}Props[\\s\\S]*?\\{([\\s\\S]*?)\\}`))
    const props: PropMetadata[] = []

    if (propsMatch && propsMatch[1]) {
      const propsContent = propsMatch[1]
      // 简单的 prop 解析（实际项目中应使用 TypeScript Compiler API）
      const propLines = propsContent.split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('/*'))

      propLines.forEach(line => {
        const propMatch = line.match(/^\s*(\w+)\??\s*:\s*(.+?)\s*(?:\/\/\s*(.*))?$/)
        if (propMatch) {
          props.push({
            name: propMatch[1] || '',
            type: propMatch[2]?.trim() || 'unknown',
            required: !line.includes('?'),
            description: propMatch[3]?.trim(),
          })
        }
      })
    }

    // 提取 JSDoc 注释描述
    const docMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/)
    const description = docMatch ? docMatch[1] : undefined

    // 检查可访问性标记
    const a11y = content.includes('aria-') || content.includes('role=')

    // 推断标签
    const tags: string[] = []
    if (content.includes('onClick') || content.includes('onSubmit')) tags.push('interactive')
    if (content.includes('input') || content.includes('form')) tags.push('form')
    if (content.includes('motion') || content.includes('framer')) tags.push('animated')
    if (a11y) tags.push('accessible')

    return {
      name: fileName,
      category,
      package: packageName,
      path: relativePath,
      exportType,
      props,
      tags,
      a11y,
      description,
    }
  } catch (error) {
    console.warn(chalk.yellow(`  ⚠️  无法扫描文件: ${filePath}`))
    return null
  }
}

/**
 * 递归扫描目录
 */
async function scanDirectory(
  dir: string,
  packageName: string,
  components: ComponentMetadata[]
): Promise<void> {
  try {
    const items = await fs.readdir(dir, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(dir, item.name)

      if (item.isDirectory()) {
        // 跳过 node_modules 和其他无关目录
        if (!['node_modules', 'dist', '.git', 'tests'].includes(item.name)) {
          await scanDirectory(fullPath, packageName, components)
        }
      } else if (item.isFile() && /\.(tsx?)$/.test(item.name)) {
        const metadata = await scanComponentFile(fullPath, packageName)
        if (metadata) {
          components.push(metadata)
        }
      }
    }
  } catch (error) {
    console.warn(chalk.yellow(`  ⚠️  无法扫描目录: ${dir}`))
  }
}

/**
 * 扫描包
 */
async function scanPackage(
  packagePath: string,
  packageName: string
): Promise<ComponentMetadata[]> {
  const components: ComponentMetadata[] = []
  const srcPath = path.join(packagePath, 'src')

  try {
    await fs.access(srcPath)
    await scanDirectory(srcPath, packageName, components)
  } catch (error) {
    console.warn(chalk.yellow(`  ⚠️  包不存在或无法访问: ${packagePath}`))
  }

  return components
}

/**
 * 生成统计信息
 */
function generateStats(components: ComponentMetadata[]): Registry['stats'] {
  const byCategory: Record<string, number> = {}
  const byPackage: Record<string, number> = {}

  components.forEach(component => {
    byCategory[component.category] = (byCategory[component.category] || 0) + 1
    byPackage[component.package] = (byPackage[component.package] || 0) + 1
  })

  return {
    totalComponents: components.length,
    byCategory,
    byPackage,
  }
}

/**
 * 加载已有的 registry
 */
async function loadExistingRegistry(outputPath: string): Promise<Registry | null> {
  try {
    const content = await fs.readFile(outputPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

/**
 * 合并新旧 registry（增量更新）
 */
function mergeRegistries(
  existingRegistry: Registry | null,
  newComponents: ComponentMetadata[]
): ComponentMetadata[] {
  if (!existingRegistry) {
    return newComponents
  }

  // 创建组件映射
  const existingMap = new Map<string, ComponentMetadata>()
  existingRegistry.components.forEach(comp => {
    existingMap.set(`${comp.package}:${comp.name}`, comp)
  })

  // 合并新组件，保留已有的元数据
  const merged: ComponentMetadata[] = []
  newComponents.forEach(newComp => {
    const key = `${newComp.package}:${newComp.name}`
    const existing = existingMap.get(key)

    if (existing) {
      // 合并元数据，优先使用新扫描的结构信息
      merged.push({
        ...existing,
        ...newComp,
        // 保留手动添加的标签和描述
        tags: [...new Set([...(existing.tags || []), ...(newComp.tags || [])])],
        description: existing.description || newComp.description,
      })
      existingMap.delete(key)
    } else {
      merged.push(newComp)
    }
  })

  // 添加未被扫描到但在旧 registry 中存在的组件（可能已删除）
  // 这里选择不添加，以保持 registry 与代码同步

  return merged
}

/**
 * 生成报告
 */
function generateReport(registry: Registry): string {
  const report = [
    chalk.bold('\n📊 组件注册表扫描报告'),
    chalk.gray('━'.repeat(50)),
    '',
    `总计发现 ${chalk.cyan(registry.stats.totalComponents)} 个组件`,
    '',
    chalk.bold('按分类统计：'),
  ]

  Object.entries(registry.stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      report.push(`  ${chalk.yellow(count.toString().padStart(3))} - ${category}`)
    })

  report.push('')
  report.push(chalk.bold('按包统计：'))

  Object.entries(registry.stats.byPackage)
    .sort(([, a], [, b]) => b - a)
    .forEach(([pkg, count]) => {
      report.push(`  ${chalk.cyan(count.toString().padStart(3))} - ${pkg}`)
    })

  report.push('')
  return report.join('\n')
}

/**
 * 执行 registry:scan 命令
 */
export async function executeRegistryScanCommand(options: RegistryScanOptions): Promise<void> {
  const spinner = ora('扫描组件注册表...').start()

  try {
    // 确定要扫描的包
    const packagesDir = path.join(process.cwd(), 'packages')
    const defaultPackages = ['core', 'registry']
    const packagesToScan = options.packages || defaultPackages

    spinner.text = `扫描 ${packagesToScan.length} 个包...`

    // 扫描所有包
    const allComponents: ComponentMetadata[] = []

    for (const pkgName of packagesToScan) {
      const packagePath = path.join(packagesDir, pkgName)
      spinner.text = `扫描包: @xorigo-ui/${pkgName}...`

      const components = await scanPackage(packagePath, `@xorigo-ui/${pkgName}`)
      allComponents.push(...components)
    }

    if (allComponents.length === 0) {
      spinner.warn(chalk.yellow('未找到任何组件'))
      return
    }

    // 确定输出路径
    const outputDir = options.output || path.join(packagesDir, 'registry/src')
    const outputPath = path.join(outputDir, 'registry.json')

    // 增量更新：合并已有 registry
    let components = allComponents
    if (options.incremental) {
      spinner.text = '合并已有注册表...'
      const existingRegistry = await loadExistingRegistry(outputPath)
      components = mergeRegistries(existingRegistry, allComponents)
    }

    spinner.text = '生成注册表文件...'

    // 生成 registry
    const registry: Registry = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      components,
      stats: generateStats(components),
    }

    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true })

    // 写入文件
    await fs.writeFile(outputPath, JSON.stringify(registry, null, 2), 'utf-8')

    spinner.succeed(chalk.green('✨ 组件注册表扫描成功！'))

    // 输出报告
    console.log(generateReport(registry))

    console.log(chalk.bold('生成的文件：'))
    console.log(chalk.cyan(`  📋 Registry: ${outputPath}`))

    console.log(chalk.gray('\n使用方式：'))
    console.log(chalk.yellow(`  import registry from '@xorigo-ui/registry'`))
    console.log(chalk.yellow(`  const components = registry.components`))
  } catch (error) {
    spinner.fail(chalk.red('组件注册表扫描失败'))
    throw error
  }
}
