#!/usr/bin/env tsx
/**
 * @fileoverview 组件分类验证脚本
 * @description 验证 Registry 中的组件分类符合规范
 *
 * 使用方法:
 *   npm run check:categories
 *   tsx scripts/validate-categories.ts
 *
 * 验证项:
 *   1. 所有组件有 category 字段
 *   2. category 值在允许范围内
 *   3. 唯一归属（无重复）
 *   4. 命名规范检查
 *   5. 生成统计报告
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { z } from 'zod'

// ============================================================================
// 常量定义
// ============================================================================

const VALID_CATEGORIES = [
  'ui',
  'inputs',
  'forms',
  'navigation',
  'layout',
  'feedback',
  'overlays',
  'datadisplay',
  'charts',
  'utilities',
] as const

type ComponentCategory = typeof VALID_CATEGORIES[number]

const CATEGORY_DESCRIPTIONS: Record<ComponentCategory, string> = {
  ui: '基础UI（视觉原子）',
  inputs: '输入控件',
  forms: '表单容器/逻辑',
  navigation: '导航与结构',
  layout: '布局与分区',
  feedback: '反馈与状态',
  overlays: '弹层与遮罩',
  datadisplay: '数据展示',
  charts: '数据可视化',
  utilities: '技术基元',
}

// ============================================================================
// 类型定义
// ============================================================================

const ComponentSchema = z.object({
  name: z.string().regex(/^[A-Z][A-Za-z0-9]*$/, '组件名必须是 PascalCase'),
  title: z.string().optional(),
  category: z.enum(VALID_CATEGORIES),
  tags: z.array(z.string()).optional(),
  tokens: z.array(z.string()).optional(),
  a11y: z.enum(['ok', 'warn', 'na']).optional(),
  rtl: z.boolean().optional(),
  i18n: z.array(z.string()).optional(),
  preview: z.object({
    module: z.string(),
  }).optional(),
})

type Component = z.infer<typeof ComponentSchema>

const RegistrySchema = z.object({
  version: z.string(),
  components: z.array(ComponentSchema),
})

type Registry = z.infer<typeof RegistrySchema>

// ============================================================================
// 验证结果类型
// ============================================================================

interface ValidationError {
  component: string
  field: string
  message: string
  severity: 'error' | 'warning'
}

interface CategoryStats {
  category: ComponentCategory
  description: string
  count: number
  components: string[]
}

interface ValidationResult {
  success: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  stats: CategoryStats[]
  summary: {
    totalComponents: number
    categorizedComponents: number
    uncategorizedComponents: number
    duplicates: number
    invalidCategories: number
  }
}

// ============================================================================
// 核心验证逻辑
// ============================================================================

class CategoryValidator {
  private registry: Registry | null = null
  private errors: ValidationError[] = []
  private warnings: ValidationError[] = []

  /**
   * 加载 Registry 文件
   */
  async loadRegistry(registryPath: string): Promise<void> {
    if (!existsSync(registryPath)) {
      throw new Error(`Registry 文件不存在: ${registryPath}`)
    }

    try {
      const content = readFileSync(registryPath, 'utf-8')
      const data = JSON.parse(content)

      // 使用 Zod 验证 Schema
      this.registry = RegistrySchema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Registry Schema 验证失败:\n${JSON.stringify(error.issues, null, 2)}`)
      }
      throw error
    }
  }

  /**
   * 验证所有组件有 category 字段
   */
  validateCategoryField(): void {
    if (!this.registry) return

    this.registry.components.forEach(component => {
      if (!component.category) {
        this.errors.push({
          component: component.name,
          field: 'category',
          message: '缺少 category 字段',
          severity: 'error',
        })
      }
    })
  }

  /**
   * 验证 category 值在允许范围内
   */
  validateCategoryValues(): void {
    if (!this.registry) return

    this.registry.components.forEach(component => {
      if (component.category && !VALID_CATEGORIES.includes(component.category)) {
        this.errors.push({
          component: component.name,
          field: 'category',
          message: `无效的 category 值: "${component.category}"。允许的值: ${VALID_CATEGORIES.join(', ')}`,
          severity: 'error',
        })
      }
    })
  }

  /**
   * 验证唯一归属（无重复）
   */
  validateUniqueAttribution(): void {
    if (!this.registry) return

    const componentNames = new Map<string, number>()

    this.registry.components.forEach(component => {
      const count = componentNames.get(component.name) || 0
      componentNames.set(component.name, count + 1)
    })

    componentNames.forEach((count, name) => {
      if (count > 1) {
        this.errors.push({
          component: name,
          field: 'name',
          message: `组件名重复 (出现 ${count} 次)`,
          severity: 'error',
        })
      }
    })
  }

  /**
   * 验证命名规范
   */
  validateNamingConvention(): void {
    if (!this.registry) return

    const pascalCaseRegex = /^[A-Z][A-Za-z0-9]*$/

    this.registry.components.forEach(component => {
      if (!pascalCaseRegex.test(component.name)) {
        this.errors.push({
          component: component.name,
          field: 'name',
          message: `组件名不符合 PascalCase 规范: "${component.name}"`,
          severity: 'error',
        })
      }
    })
  }

  /**
   * 验证 utilities 分类的特殊规则
   */
  validateUtilitiesCategory(): void {
    if (!this.registry) return

    const utilitiesComponents = this.registry.components.filter(
      c => c.category === 'utilities'
    )

    if (utilitiesComponents.length === 0) {
      this.warnings.push({
        component: 'utilities',
        field: 'category',
        message: 'utilities 分类没有组件',
        severity: 'warning',
      })
    }

    // 检查 Portal 是否只在 utilities 中
    const portalComponents = this.registry.components.filter(
      c => c.name === 'Portal'
    )

    if (portalComponents.length > 1) {
      this.errors.push({
        component: 'Portal',
        field: 'category',
        message: 'Portal 在多个分类中重复，应该只在 utilities 分类中',
        severity: 'error',
      })
    } else if (portalComponents.length === 1 && portalComponents[0].category !== 'utilities') {
      this.errors.push({
        component: 'Portal',
        field: 'category',
        message: `Portal 应该在 utilities 分类中，当前在: ${portalComponents[0].category}`,
        severity: 'error',
      })
    }
  }

  /**
   * 生成分类统计
   */
  generateStats(): CategoryStats[] {
    if (!this.registry) return []

    const stats: CategoryStats[] = VALID_CATEGORIES.map(category => ({
      category,
      description: CATEGORY_DESCRIPTIONS[category],
      count: 0,
      components: [],
    }))

    this.registry.components.forEach(component => {
      if (component.category) {
        const stat = stats.find(s => s.category === component.category)
        if (stat) {
          stat.count++
          stat.components.push(component.name)
        }
      }
    })

    // 按组件数量排序
    return stats.sort((a, b) => b.count - a.count)
  }

  /**
   * 执行所有验证
   */
  async validate(registryPath: string): Promise<ValidationResult> {
    await this.loadRegistry(registryPath)

    // 执行所有验证
    this.validateCategoryField()
    this.validateCategoryValues()
    this.validateUniqueAttribution()
    this.validateNamingConvention()
    this.validateUtilitiesCategory()

    // 生成统计
    const stats = this.generateStats()

    const totalComponents = this.registry?.components.length || 0
    const categorizedComponents = this.registry?.components.filter(c => c.category).length || 0
    const uncategorizedComponents = totalComponents - categorizedComponents
    const duplicates = this.errors.filter(e => e.message.includes('重复')).length
    const invalidCategories = this.errors.filter(e => e.field === 'category').length

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      stats,
      summary: {
        totalComponents,
        categorizedComponents,
        uncategorizedComponents,
        duplicates,
        invalidCategories,
      },
    }
  }
}

// ============================================================================
// 报告生成
// ============================================================================

function generateReport(result: ValidationResult): string {
  let report = ''

  report += '🔍 组件分类验证报告\n'
  report += '='.repeat(60) + '\n\n'

  // 总体摘要
  report += '📊 总体摘要\n'
  report += '-'.repeat(60) + '\n'
  report += `总组件数: ${result.summary.totalComponents}\n`
  report += `已分类组件: ${result.summary.categorizedComponents}\n`
  report += `未分类组件: ${result.summary.uncategorizedComponents}\n`
  report += `重复组件: ${result.summary.duplicates}\n`
  report += `无效分类: ${result.summary.invalidCategories}\n`
  report += '\n'

  // 分类统计
  report += '📂 分类统计\n'
  report += '-'.repeat(60) + '\n'
  result.stats.forEach(stat => {
    report += `${stat.category.padEnd(15)} (${stat.description}): ${stat.count} 个组件\n`
    if (stat.components.length > 0) {
      report += `  └─ ${stat.components.join(', ')}\n`
    }
  })
  report += '\n'

  // 错误列表
  if (result.errors.length > 0) {
    report += '❌ 错误列表\n'
    report += '-'.repeat(60) + '\n'
    result.errors.forEach((error, index) => {
      report += `${index + 1}. [${error.component}] ${error.field}: ${error.message}\n`
    })
    report += '\n'
  }

  // 警告列表
  if (result.warnings.length > 0) {
    report += '⚠️ 警告列表\n'
    report += '-'.repeat(60) + '\n'
    result.warnings.forEach((warning, index) => {
      report += `${index + 1}. [${warning.component}] ${warning.field}: ${warning.message}\n`
    })
    report += '\n'
  }

  // 验证结果
  report += '✅ 验证结果\n'
  report += '-'.repeat(60) + '\n'
  if (result.success) {
    report += '✅ 所有检查通过！\n'
  } else {
    report += `❌ 验证失败: 发现 ${result.errors.length} 个错误\n`
  }

  return report
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  const registryPath = join(process.cwd(), '../../packages/registry/registry.json')

  console.log('🚀 开始验证组件分类...\n')

  const validator = new CategoryValidator()

  try {
    const result = await validator.validate(registryPath)

    // 生成并打印报告
    const report = generateReport(result)
    console.log(report)

    // 根据结果设置退出码
    process.exit(result.success ? 0 : 1)
  } catch (error) {
    console.error('❌ 验证失败:', error)
    process.exit(1)
  }
}

// 如果直接执行此脚本
if (require.main === module) {
  main()
}

export { CategoryValidator }
export type { ValidationResult, CategoryStats }
