#!/usr/bin/env node
/**
 * @fileoverview 数据完整性检查脚本 (开发时使用)
 *
 * 提供更详细的数据完整性检查和统计信息
 * 不阻断构建,仅用于开发调试
 *
 * 使用: npm run check:data
 * 或: tsx scripts/check-data-integrity.ts
 */

import { readonlyRegistry } from '../src/data/registry.readonly'
import { readonlyRecipes } from '../src/data/recipes.readonly'
import { readonlyI18n } from '../src/data/i18n.readonly'

/**
 * 主函数
 */
async function main() {
  console.log('\n' + '='.repeat(80))
  console.log('📊 Data Layer Integrity Check')
  console.log('='.repeat(80))

  try {
    // Registry 统计
    console.log('\n' + '-'.repeat(80))
    console.log('📦 Registry Statistics')
    console.log('-'.repeat(80))

    const components = readonlyRegistry.getComponents()
    const categories = readonlyRegistry.getCategories()
    const metadata = readonlyRegistry.getMetadata()

    console.log(`✓ Total Components: ${components.length}`)
    console.log(`✓ Categories: ${categories.join(', ')}`)
    console.log(`✓ Registry Version: ${metadata.version}`)
    console.log(`✓ Last Updated: ${metadata.updated}`)

    // 按类别统计
    console.log('\nComponents by Category:')
    categories.forEach((category) => {
      const count = readonlyRegistry.getComponentsByCategory(category).length
      console.log(`  - ${category}: ${count}`)
    })

    // Recipes 统计
    console.log('\n' + '-'.repeat(80))
    console.log('🎨 Recipes Statistics')
    console.log('-'.repeat(80))

    const allRecipes = readonlyRecipes.getAllRecipes()
    const recipeStats = readonlyRecipes.getStatistics()
    const modes = readonlyRecipes.getModes()
    const tones = readonlyRecipes.getTones()
    const densities = readonlyRecipes.getDensities()
    const accentHues = readonlyRecipes.getAccentHues()

    console.log(`✓ Total Recipes: ${allRecipes.length}`)
    console.log(`✓ Modes: ${modes.join(', ')}`)
    console.log(`✓ Tones: ${tones.join(', ')}`)
    console.log(`✓ Densities: ${densities.join(', ')}`)
    console.log(`✓ Accent Hues: ${accentHues.join(', ')}`)

    console.log('\nRecipes by Mode:')
    console.log(`  - Light: ${recipeStats.byMode.light}`)
    console.log(`  - Dark: ${recipeStats.byMode.dark}`)
    console.log(`  - High Contrast: ${recipeStats.byMode.hc}`)

    console.log('\nRecipes by Tone:')
    console.log(`  - Calm: ${recipeStats.byTone.calm}`)
    console.log(`  - Standard: ${recipeStats.byTone.standard}`)
    console.log(`  - Vivid: ${recipeStats.byTone.vivid}`)

    console.log('\nRecipes by Density:')
    console.log(`  - Compact: ${recipeStats.byDensity.compact}`)
    console.log(`  - Comfortable: ${recipeStats.byDensity.comfortable}`)
    console.log(`  - Spacious: ${recipeStats.byDensity.spacious}`)

    // I18n 统计
    console.log('\n' + '-'.repeat(80))
    console.log('🌐 I18n Statistics')
    console.log('-'.repeat(80))

    const i18nConfig = readonlyI18n.getConfig()
    const i18nStats = readonlyI18n.getStatistics()

    console.log(`✓ Default Locale: ${i18nConfig.defaultLocale}`)
    console.log(`✓ Supported Locales: ${i18nConfig.supportedLocales.join(', ')}`)
    console.log(`✓ Fallback Locale: ${i18nConfig.fallbackLocale}`)

    console.log('\nTranslations by Locale:')
    Object.entries(i18nStats).forEach(([locale, stats]) => {
      console.log(`  - ${locale}: ${stats.totalKeys} keys`)
      console.log(`    Categories: ${stats.categories.join(', ')}`)
    })

    // 数据访问示例
    console.log('\n' + '-'.repeat(80))
    console.log('🔍 Data Access Examples')
    console.log('-'.repeat(80))

    console.log('\n1. Get Component by Name:')
    const exampleComponent = readonlyRegistry.getComponent('Button')
    if (exampleComponent) {
      console.log(`   Component: ${exampleComponent.name}`)
      console.log(`   Category: ${exampleComponent.category}`)
      console.log(`   Description: ${exampleComponent.description || 'N/A'}`)
    }

    console.log('\n2. Get Recipe by ID:')
    const exampleRecipe = readonlyRecipes.getRecipeById('corporate-blue')
    if (exampleRecipe) {
      console.log(`   Recipe: ${exampleRecipe.name}`)
      console.log(`   Mode: ${exampleRecipe.axes.mode}`)
      console.log(`   Tone: ${exampleRecipe.axes.tone}`)
      console.log(`   Density: ${exampleRecipe.axes.density}`)
    }

    console.log('\n3. Get Translation:')
    const exampleTranslation = readonlyI18n.getTranslation('common.loading', 'zh-CN')
    console.log(`   Key: common.loading`)
    console.log(`   Value (zh-CN): ${exampleTranslation}`)
    const exampleTranslationEn = readonlyI18n.getTranslation('common.loading', 'en-US')
    console.log(`   Value (en-US): ${exampleTranslationEn}`)

    console.log('\n' + '='.repeat(80))
    console.log('✅ Data Integrity Check Complete')
    console.log('='.repeat(80) + '\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Data Integrity Check Failed:\n')
    console.error(error)
    console.error('\n' + '='.repeat(80) + '\n')
    process.exit(1)
  }
}

// 执行主函数
main()
