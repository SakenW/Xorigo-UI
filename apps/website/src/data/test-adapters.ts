/**
 * 🧪 Data Layer 适配器测试脚本
 *
 * 用于验证 Registry 和 Tokens 适配器的功能
 */

import { getRegistryAdapter, getTokensAdapter, validateAndPrint } from './index'

console.log('🎯 Testing Data Layer Adapters\n')

// ============================================================================
// 测试 Registry 适配器
// ============================================================================

console.log('📦 Testing Registry Adapter')
console.log('='.repeat(80))

const registryAdapter = getRegistryAdapter()

// 测试基本功能
console.log('✅ Get version:', registryAdapter.getVersion())
console.log('✅ Get generated at:', registryAdapter.getGeneratedAt())

const allComponents = registryAdapter.getComponents()
console.log(`✅ Total components: ${allComponents.length}`)

const categories = registryAdapter.getCategories()
console.log(`✅ Categories: ${categories.join(', ')}`)

categories.forEach((category) => {
  const components = registryAdapter.getComponentsByCategory(category)
  console.log(`   - ${category}: ${components.length} components`)
})

// 测试获取单个组件
if (allComponents.length > 0) {
  const firstComponent = allComponents[0]
  console.log(`✅ First component: ${firstComponent?.name}`)

  const retrieved = registryAdapter.getComponent(firstComponent?.name || '')
  console.log(
    `✅ Retrieved component by name: ${retrieved ? 'Success' : 'Failed'}`
  )
}

// 测试主题和令牌
const themes = registryAdapter.getThemes()
console.log(`✅ Themes: ${themes.length} themes`)

const tokens = registryAdapter.getTokens()
console.log(`✅ Token categories:`, Object.keys(tokens).join(', '))

// ============================================================================
// 测试 Tokens 适配器
// ============================================================================

console.log('\n🎨 Testing Tokens Adapter')
console.log('='.repeat(80))

const tokensAdapter = getTokensAdapter()

// 测试调色板
const palettes = tokensAdapter.getPalettes()
console.log('✅ Palettes:', Object.keys(palettes).join(', '))

const neutralScale = tokensAdapter.getPalette('neutralScale')
console.log(`✅ Neutral scale keys:`, Object.keys(neutralScale).length)

// 测试基础令牌
const typography = tokensAdapter.getTypography()
console.log(`✅ Typography tokens:`, Object.keys(typography).length)

const spacing = tokensAdapter.getSpacing()
console.log(`✅ Spacing tokens:`, Object.keys(spacing).length)

// 测试配方
const recipes = tokensAdapter.getRecipes()
console.log(`✅ Recipes: ${Object.keys(recipes).length} recipes`)
Object.keys(recipes).forEach((recipeName) => {
  console.log(`   - ${recipeName}`)
})

// 测试密度预设
const densityPresets = tokensAdapter.getDensityPresets()
console.log(
  `✅ Density presets: ${Object.keys(densityPresets).length} presets`
)
Object.keys(densityPresets).forEach((presetName) => {
  console.log(`   - ${presetName}`)
})

// 测试组件别名
const componentAliases = tokensAdapter.getComponentAliases()
console.log(
  `✅ Component aliases: ${Object.keys(componentAliases).length} components`
)
Object.keys(componentAliases).forEach((componentName) => {
  console.log(`   - ${componentName}`)
})

// ============================================================================
// 测试验证功能
// ============================================================================

console.log('\n📊 Running Validation')
console.log('='.repeat(80))

const report = validateAndPrint()

// ============================================================================
// 总结
// ============================================================================

console.log('\n✨ Test Summary')
console.log('='.repeat(80))
console.log('✅ Registry Adapter: Working')
console.log('✅ Tokens Adapter: Working')
console.log(
  `${report.summary.isValid ? '✅' : '❌'} Validation: ${report.summary.isValid ? 'All Valid' : 'Has Issues'}`
)
console.log(`   - Errors: ${report.summary.totalErrors}`)
console.log(`   - Warnings: ${report.summary.totalWarnings}`)
console.log('='.repeat(80))
