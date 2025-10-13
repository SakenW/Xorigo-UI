/**
 * 🛡️ 统一验证层
 *
 * 提供跨所有数据适配器的统一验证接口
 * 生成完整的验证报告，确保数据一致性
 * 四层架构验证：Registry、Tokens、Docs、Recipes、I18n
 *
 * @author Hive Mind Coder Agent
 * @version 2.0.0
 */

import { readonlyRegistry } from './registry.readonly'
import { readonlyTokens } from './tokens.readonly'
import { readonlyDocs } from './docs.readonly'
import { readonlyRecipes } from './recipes.readonly'
import { readonlyI18n } from './i18n.readonly'
import type { ValidationResult, DataErrorCode } from './types'

/**
 * 完整验证报告
 */
export interface ValidationReport {
  registry: ValidationResult
  tokens: ValidationResult
  docs: ValidationResult
  recipes: ValidationResult
  i18n: ValidationResult
  timestamp: string
  summary: {
    totalErrors: number
    totalWarnings: number
    isValid: boolean
  }
  performance: {
    registryTime: number
    tokensTime: number
    docsTime: number
    recipesTime: number
    i18nTime: number
    totalTime: number
  }
}

/**
 * 验证统计信息
 */
export interface ValidationStats {
  totalComponents: number
  totalTokens: number
  totalDocs: number
  totalRecipes: number
  totalI18nKeys: number
  categories: {
    components: string[]
    docs: string[]
  }
}

/**
 * 验证所有数据层的一致性
 */
export function validateAllConsistency(): ValidationReport {
  const startTime = performance.now()

  // 验证 Registry
  const registryStartTime = performance.now()
  const registryResult = readonlyRegistry.validateConsistency()
  const registryTime = performance.now() - registryStartTime

  // 验证 Tokens
  const tokensStartTime = performance.now()
  const tokensResult = readonlyTokens.validateConsistency()
  const tokensTime = performance.now() - tokensStartTime

  // 验证 Docs
  const docsStartTime = performance.now()
  const docsResult = readonlyDocs.validateConsistency()
  const docsTime = performance.now() - docsStartTime

  // 验证 Recipes
  const recipesStartTime = performance.now()
  const recipesResult = readonlyRecipes.validateConsistency()
  const recipesTime = performance.now() - recipesStartTime

  // 验证 I18n
  const i18nStartTime = performance.now()
  const i18nResult = readonlyI18n.validateConsistency()
  const i18nTime = performance.now() - i18nStartTime

  const totalTime = performance.now() - startTime

  // 生成报告
  const report: ValidationReport = {
    registry: registryResult,
    tokens: tokensResult,
    docs: docsResult,
    recipes: recipesResult,
    i18n: i18nResult,
    timestamp: new Date().toISOString(),
    summary: {
      totalErrors:
        registryResult.errors.length +
        tokensResult.errors.length +
        docsResult.errors.length +
        recipesResult.errors.length +
        i18nResult.errors.length,
      totalWarnings:
        registryResult.warnings.length +
        tokensResult.warnings.length +
        docsResult.warnings.length +
        recipesResult.warnings.length +
        i18nResult.warnings.length,
      isValid:
        registryResult.valid && tokensResult.valid && docsResult.valid && recipesResult.valid && i18nResult.valid,
    },
    performance: {
      registryTime,
      tokensTime,
      docsTime,
      recipesTime,
      i18nTime,
      totalTime
    }
  }

  return report
}

/**
 * 打印验证报告到控制台
 */
export function printValidationReport(report: ValidationReport): void {
  console.log('\n' + '='.repeat(100))
  console.log('📊 四层架构数据层验证报告 (4-Layer Data Validation Report)')
  console.log('='.repeat(100))
  console.log(`🕐 生成时间: ${report.timestamp}`)
  console.log(`⏱️  总耗时: ${report.performance.totalTime.toFixed(2)}ms`)
  console.log(`✅ 整体状态: ${report.summary.isValid ? 'VALID' : 'INVALID'}`)
  console.log(`❌ 错误总数: ${report.summary.totalErrors}`)
  console.log(`⚠️  警告总数: ${report.summary.totalWarnings}`)

  // Registry 验证结果
  console.log('\n' + '-'.repeat(100))
  console.log('📦 Registry 组件注册表验证')
  console.log('-'.repeat(100))
  console.log(`状态: ${report.registry.valid ? '✅ VALID' : '❌ INVALID'} (${report.performance.registryTime.toFixed(2)}ms)`)

  if (report.registry.errors.length > 0) {
    console.log(`\n❌ 错误 (${report.registry.errors.length}):`)
    report.registry.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. [${error.code || 'ERROR'}] ${error.path || 'unknown'}`)
      console.log(`     ${error.message}`)
      if (error.component) console.log(`     组件: ${error.component}`)
    })
  }

  if (report.registry.warnings.length > 0) {
    console.log(`\n⚠️  警告 (${report.registry.warnings.length}):`)
    report.registry.warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning.path || 'unknown'}`)
      console.log(`     ${warning.message}`)
      if (warning.component) console.log(`     组件: ${warning.component}`)
    })
  }

  if (report.registry.errors.length === 0 && report.registry.warnings.length === 0) {
    console.log('✨ 无问题发现')
  }

  // Tokens 验证结果
  console.log('\n' + '-'.repeat(100))
  console.log('🎨 Tokens 设计令牌验证')
  console.log('-'.repeat(100))
  console.log(`状态: ${report.tokens.valid ? '✅ VALID' : '❌ INVALID'} (${report.performance.tokensTime.toFixed(2)}ms)`)

  if (report.tokens.errors.length > 0) {
    console.log(`\n❌ 错误 (${report.tokens.errors.length}):`)
    report.tokens.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. [${error.code || 'ERROR'}] ${error.path || 'unknown'}`)
      console.log(`     ${error.message}`)
      if (error.token) console.log(`     令牌: ${error.token}`)
    })
  }

  if (report.tokens.warnings.length > 0) {
    console.log(`\n⚠️  警告 (${report.tokens.warnings.length}):`)
    report.tokens.warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning.path || 'unknown'}`)
      console.log(`     ${warning.message}`)
      if (warning.token) console.log(`     令牌: ${warning.token}`)
    })
  }

  if (report.tokens.errors.length === 0 && report.tokens.warnings.length === 0) {
    console.log('✨ 无问题发现')
  }

  // Docs 验证结果
  console.log('\n' + '-'.repeat(100))
  console.log('📚 Docs 文档验证')
  console.log('-'.repeat(100))
  console.log(`状态: ${report.docs.valid ? '✅ VALID' : '❌ INVALID'} (${report.performance.docsTime.toFixed(2)}ms)`)

  if (report.docs.errors.length > 0) {
    console.log(`\n❌ 错误 (${report.docs.errors.length}):`)
    report.docs.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. [${error.code || 'ERROR'}] ${error.path || 'unknown'}`)
      console.log(`     ${error.message}`)
    })
  }

  if (report.docs.warnings.length > 0) {
    console.log(`\n⚠️  警告 (${report.docs.warnings.length}):`)
    report.docs.warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning.path || 'unknown'}`)
      console.log(`     ${warning.message}`)
    })
  }

  if (report.docs.errors.length === 0 && report.docs.warnings.length === 0) {
    console.log('✨ 无问题发现')
  }

  // Recipes 验证结果
  console.log('\n' + '-'.repeat(100))
  console.log('🎨 Recipes 配方验证')
  console.log('-'.repeat(100))
  console.log(`状态: ${report.recipes.valid ? '✅ VALID' : '❌ INVALID'} (${report.performance.recipesTime.toFixed(2)}ms)`)

  if (report.recipes.errors.length > 0) {
    console.log(`\n❌ 错误 (${report.recipes.errors.length}):`)
    report.recipes.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. [${error.type || 'ERROR'}] ${error.message}`)
      if (error.component) console.log(`     组件: ${error.component}`)
    })
  }

  if (report.recipes.warnings.length > 0) {
    console.log(`\n⚠️  警告 (${report.recipes.warnings.length}):`)
    report.recipes.warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning.message}`)
      if (warning.component) console.log(`     组件: ${warning.component}`)
    })
  }

  if (report.recipes.errors.length === 0 && report.recipes.warnings.length === 0) {
    console.log('✨ 无问题发现')
  }

  // I18n 验证结果
  console.log('\n' + '-'.repeat(100))
  console.log('🌐 I18n 国际化验证')
  console.log('-'.repeat(100))
  console.log(`状态: ${report.i18n.valid ? '✅ VALID' : '❌ INVALID'} (${report.performance.i18nTime.toFixed(2)}ms)`)

  if (report.i18n.errors.length > 0) {
    console.log(`\n❌ 错误 (${report.i18n.errors.length}):`)
    report.i18n.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. [${error.type || 'ERROR'}] ${error.message}`)
      if (error.path) console.log(`     路径: ${error.path}`)
    })
  }

  if (report.i18n.warnings.length > 0) {
    console.log(`\n⚠️  警告 (${report.i18n.warnings.length}):`)
    report.i18n.warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning.message}`)
      if (warning.path) console.log(`     路径: ${warning.path}`)
    })
  }

  if (report.i18n.errors.length === 0 && report.i18n.warnings.length === 0) {
    console.log('✨ 无问题发现')
  }

  // 性能统计
  console.log('\n' + '-'.repeat(100))
  console.log('⚡ 性能统计')
  console.log('-'.repeat(100))
  console.log(`Registry:  ${report.performance.registryTime.toFixed(2)}ms`)
  console.log(`Tokens:    ${report.performance.tokensTime.toFixed(2)}ms`)
  console.log(`Docs:      ${report.performance.docsTime.toFixed(2)}ms`)
  console.log(`Recipes:   ${report.performance.recipesTime.toFixed(2)}ms`)
  console.log(`I18n:      ${report.performance.i18nTime.toFixed(2)}ms`)
  console.log(`Total:     ${report.performance.totalTime.toFixed(2)}ms`)

  console.log('\n' + '='.repeat(100))
  console.log(`🎯 最终结果: ${report.summary.isValid ? '✅ 全部验证通过' : '❌ 验证失败'}`)
  console.log('='.repeat(100) + '\n')
}

/**
 * 验证并打印报告（便捷方法）
 */
export function validateAndPrint(): ValidationReport {
  const report = validateAllConsistency()
  printValidationReport(report)
  return report
}

/**
 * 获取验证摘要信息（适合用于状态显示）
 */
export function getValidationSummary(): {
  isValid: boolean
  errorCount: number
  warningCount: number
} {
  const report = validateAllConsistency()
  return {
    isValid: report.summary.isValid,
    errorCount: report.summary.totalErrors,
    warningCount: report.summary.totalWarnings,
  }
}
