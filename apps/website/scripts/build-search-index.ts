#!/usr/bin/env tsx
/**
 * 🔍 Search Index Builder
 *
 * 从 Registry 生成优化的搜索索引
 * 支持多字段搜索、预计算权重、生成 JSON 文件
 *
 * 使用方式:
 *   npm run build:search-index
 *   tsx scripts/build-search-index.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { getRegistryAdapter } from '../src/data/registry.readonly'
import type { ComponentSearchData, RecipeSearchData } from '../src/app/api/search/types'

// ============================================================================
// 配置
// ============================================================================

const OUTPUT_DIR = join(process.cwd(), 'public', 'search-index')
const COMPONENT_INDEX_PATH = join(OUTPUT_DIR, 'components.json')
const RECIPE_INDEX_PATH = join(OUTPUT_DIR, 'recipes.json')

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  console.log('🔍 开始构建搜索索引...\n')

  const startTime = performance.now()

  try {
    // 1. 构建组件索引
    console.log('📦 构建组件索引...')
    const componentIndex = buildComponentIndex()
    console.log(`   ✅ 组件索引: ${componentIndex.length} 项\n`)

    // 2. 构建配方索引
    console.log('🎨 构建配方索引...')
    const recipeIndex = buildRecipeIndex()
    console.log(`   ✅ 配方索引: ${recipeIndex.length} 项\n`)

    // 3. 写入文件
    console.log('💾 写入索引文件...')
    writeSearchIndex(componentIndex, recipeIndex)
    console.log('   ✅ 索引文件已生成\n')

    // 4. 统计信息
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    console.log('📊 统计信息:')
    console.log(`   - 组件数量: ${componentIndex.length}`)
    console.log(`   - 配方数量: ${recipeIndex.length}`)
    console.log(`   - 总条目数: ${componentIndex.length + recipeIndex.length}`)
    console.log(`   - 耗时: ${duration}ms`)
    console.log(`   - 输出目录: ${OUTPUT_DIR}\n`)

    console.log('✅ 搜索索引构建完成！\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ 构建失败:', error)
    process.exit(1)
  }
}

// ============================================================================
// 组件索引构建
// ============================================================================

function buildComponentIndex(): ComponentSearchData[] {
  const registry = getRegistryAdapter()
  const components = registry.getComponents()

  return components.map((component, index) => {
    // 从组件元数据中提取搜索数据
    const searchData: ComponentSearchData = {
      id: `component-${component.name}`,
      name: component.name,
      description: component.description || '',
      category: component.category,
      tags: extractComponentTags(component),
      path: `/components/${component.name}`,
    }

    return searchData
  })
}

/**
 * 从组件中提取标签
 */
function extractComponentTags(component: any): string[] {
  const tags: string[] = []

  // 1. 类别作为标签
  if (component.category) {
    tags.push(component.category)
  }

  // 2. 可访问性特性
  if (component.accessibility?.wai_aria) {
    tags.push('accessible', 'aria')
  }

  // 3. 其他特性
  if (component.rtl) tags.push('rtl')
  if (component.responsive) tags.push('responsive')
  if (component.animated) tags.push('animated')

  // 4. 从描述中提取关键词
  if (component.description) {
    const keywords = extractKeywords(component.description)
    tags.push(...keywords)
  }

  // 去重并过滤空值
  return Array.from(new Set(tags.filter(Boolean)))
}

/**
 * 从文本中提取关键词
 */
function extractKeywords(text: string): string[] {
  // 简单的关键词提取：取常见的 UI 术语
  const uiTerms = [
    'button', 'input', 'form', 'card', 'modal', 'dialog',
    'navigation', 'menu', 'dropdown', 'select', 'checkbox',
    'radio', 'switch', 'slider', 'progress', 'spinner',
    'alert', 'toast', 'tooltip', 'popover', 'table',
    'list', 'grid', 'tabs', 'accordion', 'carousel',
  ]

  const lowerText = text.toLowerCase()
  return uiTerms.filter(term => lowerText.includes(term))
}

// ============================================================================
// 配方索引构建
// ============================================================================

function buildRecipeIndex(): RecipeSearchData[] {
  const registry = getRegistryAdapter()
  const themes = registry.getThemes()

  // 从主题系统中提取配方数据
  const recipes: RecipeSearchData[] = themes.map((theme, index) => {
    return {
      id: `recipe-${theme.id}`,
      name: theme.name,
      description: theme.description || generateRecipeDescription(theme),
      category: categorizeTheme(theme),
      tags: generateRecipeTags(theme),
      mode: theme.mode || 'light',
      base: theme.base,
      accent: theme.accent,
      tone: theme.tone,
      density: theme.density,
      motion: theme.motion,
      surface: theme.surface,
      path: `/recipes/${theme.id}`,
    }
  })

  return recipes
}

/**
 * 生成配方描述
 */
function generateRecipeDescription(theme: any): string {
  const parts: string[] = []

  if (theme.mode) {
    parts.push(`${theme.mode === 'light' ? '明亮' : '暗色'}模式`)
  }

  if (theme.base) {
    parts.push(`${theme.base}基调`)
  }

  if (theme.accent) {
    parts.push(`${theme.accent}强调`)
  }

  if (theme.tone) {
    parts.push(`${theme.tone}色调`)
  }

  if (theme.density) {
    parts.push(`${theme.density}密度`)
  }

  return parts.join('，') || '自定义主题配方'
}

/**
 * 对主题进行分类
 */
function categorizeTheme(theme: any): string {
  // 根据主题特征分类
  if (theme.mode === 'dark') {
    return 'dark-themes'
  } else if (theme.mode === 'light') {
    return 'light-themes'
  } else if (theme.base) {
    return `${theme.base}-themes`
  }

  return 'custom-themes'
}

/**
 * 生成配方标签
 */
function generateRecipeTags(theme: any): string[] {
  const tags: string[] = []

  // 添加所有轴的值作为标签
  if (theme.mode) tags.push(theme.mode)
  if (theme.base) tags.push(theme.base)
  if (theme.accent) tags.push(theme.accent)
  if (theme.tone) tags.push(theme.tone)
  if (theme.density) tags.push(theme.density)
  if (theme.motion) tags.push(theme.motion)
  if (theme.surface) tags.push(theme.surface)

  // 添加分类标签
  tags.push(categorizeTheme(theme))

  return Array.from(new Set(tags.filter(Boolean)))
}

// ============================================================================
// 写入文件
// ============================================================================

function writeSearchIndex(
  componentIndex: ComponentSearchData[],
  recipeIndex: RecipeSearchData[]
) {
  // 确保输出目录存在
  const fs = require('fs')
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // 写入组件索引
  writeFileSync(
    COMPONENT_INDEX_PATH,
    JSON.stringify(componentIndex, null, 2),
    'utf-8'
  )
  console.log(`   📄 ${COMPONENT_INDEX_PATH}`)

  // 写入配方索引
  writeFileSync(
    RECIPE_INDEX_PATH,
    JSON.stringify(recipeIndex, null, 2),
    'utf-8'
  )
  console.log(`   📄 ${RECIPE_INDEX_PATH}`)

  // 写入元数据
  const metadata = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    componentCount: componentIndex.length,
    recipeCount: recipeIndex.length,
    totalCount: componentIndex.length + recipeIndex.length,
  }

  const metadataPath = join(OUTPUT_DIR, 'metadata.json')
  writeFileSync(
    metadataPath,
    JSON.stringify(metadata, null, 2),
    'utf-8'
  )
  console.log(`   📄 ${metadataPath}`)
}

// ============================================================================
// 执行
// ============================================================================

main()
