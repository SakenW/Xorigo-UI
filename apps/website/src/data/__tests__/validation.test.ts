/**
 * @fileoverview 统一验证层单元测试
 */

import { describe, it, expect } from 'vitest'
import { validateAllConsistency, getValidationSummary } from '../validation'

describe('Validation Layer', () => {
  describe('validateAllConsistency', () => {
    it('应该返回完整的验证报告', () => {
      const report = validateAllConsistency()

      expect(report).toHaveProperty('registry')
      expect(report).toHaveProperty('recipes')
      expect(report).toHaveProperty('i18n')
      expect(report).toHaveProperty('timestamp')
      expect(report).toHaveProperty('summary')
    })

    it('验证报告应该有正确的结构', () => {
      const report = validateAllConsistency()

      // Registry 验证结果
      expect(report.registry).toHaveProperty('valid')
      expect(report.registry).toHaveProperty('errors')
      expect(report.registry).toHaveProperty('warnings')

      // Recipes 验证结果
      expect(report.recipes).toHaveProperty('valid')
      expect(report.recipes).toHaveProperty('errors')
      expect(report.recipes).toHaveProperty('warnings')

      // I18n 验证结果
      expect(report.i18n).toHaveProperty('valid')
      expect(report.i18n).toHaveProperty('errors')
      expect(report.i18n).toHaveProperty('warnings')

      // Summary
      expect(report.summary).toHaveProperty('totalErrors')
      expect(report.summary).toHaveProperty('totalWarnings')
      expect(report.summary).toHaveProperty('isValid')
    })

    it('summary 应该正确统计错误和警告', () => {
      const report = validateAllConsistency()

      const expectedErrors =
        report.registry.errors.length +
        report.recipes.errors.length +
        report.i18n.errors.length

      const expectedWarnings =
        report.registry.warnings.length +
        report.recipes.warnings.length +
        report.i18n.warnings.length

      expect(report.summary.totalErrors).toBe(expectedErrors)
      expect(report.summary.totalWarnings).toBe(expectedWarnings)
    })

    it('isValid 应该正确反映整体验证状态', () => {
      const report = validateAllConsistency()

      const allValid =
        report.registry.valid &&
        report.recipes.valid &&
        report.i18n.valid

      expect(report.summary.isValid).toBe(allValid)
    })

    it('timestamp 应该是有效的 ISO 日期字符串', () => {
      const report = validateAllConsistency()
      const date = new Date(report.timestamp)
      expect(date.toString()).not.toBe('Invalid Date')
    })
  })

  describe('getValidationSummary', () => {
    it('应该返回验证摘要', () => {
      const summary = getValidationSummary()

      expect(summary).toHaveProperty('isValid')
      expect(summary).toHaveProperty('errorCount')
      expect(summary).toHaveProperty('warningCount')

      expect(typeof summary.isValid).toBe('boolean')
      expect(typeof summary.errorCount).toBe('number')
      expect(typeof summary.warningCount).toBe('number')
    })

    it('摘要应该与完整报告一致', () => {
      const report = validateAllConsistency()
      const summary = getValidationSummary()

      expect(summary.isValid).toBe(report.summary.isValid)
      expect(summary.errorCount).toBe(report.summary.totalErrors)
      expect(summary.warningCount).toBe(report.summary.totalWarnings)
    })
  })
})
