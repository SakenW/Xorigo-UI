// @ts-nocheck
/**
 * Matrix 可访问性验证系统 - 单元测试
 */

import { describe, it, expect } from 'vitest'
import {
  DEFAULT_MATRIX_CONFIG,
  STRICT_MATRIX_CONFIG,
  type ValidationIssue,
} from './config'
import {
  calculateContrastRatio,
  validateContrast,
  validateContrastBatch,
  validatePaletteContrast,
} from './contrast-validator'
import {
  simulateCVD,
  simulateCVDBatch,
  simulateAllCVD,
  isDistinguishableWithCVD,
  validateCVDDistinguishability,
} from './cvd-simulator'
import {
  validateFontSize,
  validateLineHeight,
  validateLetterSpacing,
  validateLineLength,
  validateReadability,
} from './readability-checker'
import {
  validateFocusThickness,
  validateFocusOffset,
  validateFocusContrast,
  validateFocus,
} from './focus-validator'
import {
  validateTabIndex,
  validateRole,
  validateAccessibleLabel,
  validateKeyboardAccessibility,
} from './keyboard-validator'
import {
  generateMarkdownReport,
  generateJSONReport,
  generateConsoleReport,
} from './report-generator'

describe('Matrix 配置', () => {
  it('应该有默认配置', () => {
    expect(DEFAULT_MATRIX_CONFIG).toBeDefined()
    expect(DEFAULT_MATRIX_CONFIG.strictness).toBe('AA')
    expect(DEFAULT_MATRIX_CONFIG.contrast.normalTextAA).toBe(4.5)
  })

  it('应该有严格配置', () => {
    expect(STRICT_MATRIX_CONFIG).toBeDefined()
    expect(STRICT_MATRIX_CONFIG.strictness).toBe('AAA')
  })
})

describe('对比度验证器', () => {
  describe('calculateContrastRatio', () => {
    it('应该计算黑白对比度为 21:1', () => {
      const ratio = calculateContrastRatio('#000000', '#FFFFFF')
      expect(ratio).toBeGreaterThan(20)
    })

    it('应该计算相同颜色对比度为 1:1', () => {
      const ratio = calculateContrastRatio('#FF0000', '#FF0000')
      expect(ratio).toBeCloseTo(1, 1)
    })
  })

  describe('validateContrast', () => {
    it('应该通过高对比度验证 (AA)', () => {
      const result = validateContrast(
        '#FFFFFF',
        '#000000',
        'normal',
        DEFAULT_MATRIX_CONFIG
      )
      expect(result.passed).toBe(true)
      expect(result.ratio).toBeGreaterThan(4.5)
    })

    it('应该不通过低对比度验证 (AA)', () => {
      const result = validateContrast(
        '#CCCCCC',
        '#FFFFFF',
        'normal',
        DEFAULT_MATRIX_CONFIG
      )
      expect(result.passed).toBe(false)
    })

    it('大文本应该使用较低标准 (3:1)', () => {
      const result = validateContrast(
        '#767676',
        '#FFFFFF',
        'large',
        DEFAULT_MATRIX_CONFIG
      )
      // 这个对比度应该通过大文本标准但不通过正常文本标准
      expect(result.requiredRatio).toBe(3.0)
    })

    it('UI 组件应该使用 3:1 标准', () => {
      const result = validateContrast(
        '#767676',
        '#FFFFFF',
        'ui-component',
        DEFAULT_MATRIX_CONFIG
      )
      expect(result.requiredRatio).toBe(3.0)
    })
  })

  describe('validateContrastBatch', () => {
    it('应该批量验证颜色对', () => {
      const pairs = [
        {
          foreground: '#000000',
          background: '#FFFFFF',
          textType: 'normal' as const,
          label: '黑白组合',
        },
        {
          foreground: '#CCCCCC',
          background: '#FFFFFF',
          textType: 'normal' as const,
          label: '浅灰白组合',
        },
      ]

      const issues = validateContrastBatch(pairs, DEFAULT_MATRIX_CONFIG)
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].type).toBe('contrast')
    })
  })

  describe('validatePaletteContrast', () => {
    it('应该验证调色板对比度', () => {
      const palette = {
        'text-primary': '#000000',
        'surface-primary': '#FFFFFF',
        'text-on-primary': '#FFFFFF',
        'color-primary': '#0066CC',
      }

      const issues = validatePaletteContrast(palette, DEFAULT_MATRIX_CONFIG)
      // 应该没有问题或只有轻微警告
      expect(issues.filter((i) => i.severity === 'error').length).toBe(0)
    })
  })
})

describe('色盲模拟器', () => {
  describe('simulateCVD', () => {
    it('应该模拟红色盲', () => {
      const original = '#FF0000'
      const simulated = simulateCVD(original, 'protanopia')
      expect(simulated).toBeDefined()
      expect(simulated).not.toBe(original)
    })

    it('应该模拟绿色盲', () => {
      const original = '#00FF00'
      const simulated = simulateCVD(original, 'deuteranopia')
      expect(simulated).toBeDefined()
      expect(simulated).not.toBe(original)
    })

    it('应该模拟蓝色盲', () => {
      const original = '#0000FF'
      const simulated = simulateCVD(original, 'tritanopia')
      expect(simulated).toBeDefined()
      expect(simulated).not.toBe(original)
    })

    it('应该模拟全色盲为灰度', () => {
      const original = '#FF0000'
      const simulated = simulateCVD(original, 'achromatopsia')
      expect(simulated).toBeDefined()
      // 全色盲应该将颜色转换为灰度
      const rgb = simulated.match(/^#(.{2})(.{2})(.{2})$/)
      if (rgb) {
        const r = parseInt(rgb[1], 16)
        const g = parseInt(rgb[2], 16)
        const b = parseInt(rgb[3], 16)
        // RGB 值应该接近 (灰度)
        expect(Math.abs(r - g)).toBeLessThan(5)
        expect(Math.abs(g - b)).toBeLessThan(5)
      }
    })
  })

  describe('simulateCVDBatch', () => {
    it('应该批量模拟色盲', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF']
      const simulated = simulateCVDBatch(colors, 'protanopia')
      expect(simulated).toHaveLength(3)
      expect(simulated[0]).not.toBe(colors[0])
    })
  })

  describe('simulateAllCVD', () => {
    it('应该模拟所有色盲类型', () => {
      const original = '#FF0000'
      const allSimulated = simulateAllCVD(original)
      expect(allSimulated).toHaveProperty('protanopia')
      expect(allSimulated).toHaveProperty('deuteranopia')
      expect(allSimulated).toHaveProperty('tritanopia')
      expect(allSimulated).toHaveProperty('achromatopsia')
    })
  })

  describe('isDistinguishableWithCVD', () => {
    it('黑白应该在色盲下可区分', () => {
      const distinguishable = isDistinguishableWithCVD(
        '#000000',
        '#FFFFFF',
        'protanopia'
      )
      expect(distinguishable).toBe(true)
    })

    it('相似颜色在色盲下可能不可区分', () => {
      const distinguishable = isDistinguishableWithCVD(
        '#FF0000',
        '#00FF00',
        'protanopia',
        10
      )
      // 红绿色盲可能无法区分红色和绿色
      expect(distinguishable).toBeDefined()
    })
  })

  describe('validateCVDDistinguishability', () => {
    it('应该验证多种色盲类型', () => {
      const result = validateCVDDistinguishability(
        '#000000',
        '#FFFFFF',
        ['protanopia', 'deuteranopia', 'tritanopia']
      )
      expect(result).toHaveProperty('protanopia')
      expect(result).toHaveProperty('deuteranopia')
      expect(result).toHaveProperty('tritanopia')
    })
  })
})

describe('可读性检查器', () => {
  describe('validateFontSize', () => {
    it('应该通过合适的字体大小', () => {
      const issues = validateFontSize(
        { fontSize: 16 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('应该标记过小的字体', () => {
      const issues = validateFontSize(
        { fontSize: 10 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].severity).toBe('error')
    })

    it('应该警告低于推荐值的字体', () => {
      const issues = validateFontSize(
        { fontSize: 13 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].severity).toBe('warning')
    })
  })

  describe('validateLineHeight', () => {
    it('应该通过合适的行高', () => {
      const issues = validateLineHeight(
        { fontSize: 16, lineHeight: 1.5 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('应该标记过小的行高', () => {
      const issues = validateLineHeight(
        { fontSize: 16, lineHeight: 1.0 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
    })

    it('应该警告未设置行高', () => {
      const issues = validateLineHeight(
        { fontSize: 16 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].severity).toBe('warning')
    })

    it('应该解析 px 单位的行高', () => {
      const issues = validateLineHeight(
        { fontSize: 16, lineHeight: '24px' },
        DEFAULT_MATRIX_CONFIG
      )
      // 24px / 16px = 1.5, 应该通过
      expect(issues.length).toBe(0)
    })
  })

  describe('validateLetterSpacing', () => {
    it('应该通过合适的字母间距', () => {
      const issues = validateLetterSpacing(
        { fontSize: 16, letterSpacing: 0 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('应该警告过小的字母间距', () => {
      const issues = validateLetterSpacing(
        { fontSize: 16, letterSpacing: -0.1 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
    })
  })

  describe('validateLineLength', () => {
    it('应该通过合适的行长度', () => {
      const issues = validateLineLength(
        { fontSize: 16, lineLength: 70 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('应该警告过长的行', () => {
      const issues = validateLineLength(
        { fontSize: 16, lineLength: 120 },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
    })
  })

  describe('validateReadability', () => {
    it('应该综合验证可读性', () => {
      const issues = validateReadability(
        {
          fontSize: 16,
          lineHeight: 1.5,
          letterSpacing: 0,
          lineLength: 70,
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })
  })
})

describe('焦点验证器', () => {
  describe('validateFocusThickness', () => {
    it('应该通过合适的焦点厚度', () => {
      const issues = validateFocusThickness(
        {
          outlineColor: '#0066CC',
          outlineWidth: 2,
          backgroundColor: '#FFFFFF',
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('应该标记过薄的焦点指示器', () => {
      const issues = validateFocusThickness(
        {
          outlineColor: '#0066CC',
          outlineWidth: 1,
          backgroundColor: '#FFFFFF',
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
    })
  })

  describe('validateFocusOffset', () => {
    it('应该通过合适的焦点偏移', () => {
      const issues = validateFocusOffset(
        {
          outlineColor: '#0066CC',
          outlineWidth: 2,
          outlineOffset: 2,
          backgroundColor: '#FFFFFF',
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('应该警告过小的焦点偏移', () => {
      const issues = validateFocusOffset(
        {
          outlineColor: '#0066CC',
          outlineWidth: 2,
          outlineOffset: 0,
          backgroundColor: '#FFFFFF',
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
    })
  })

  describe('validateFocusContrast', () => {
    it('应该通过高对比度焦点指示器', () => {
      const issues = validateFocusContrast(
        {
          outlineColor: '#000000',
          outlineWidth: 2,
          backgroundColor: '#FFFFFF',
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('应该标记低对比度焦点指示器', () => {
      const issues = validateFocusContrast(
        {
          outlineColor: '#CCCCCC',
          outlineWidth: 2,
          backgroundColor: '#FFFFFF',
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
    })
  })

  describe('validateFocus', () => {
    it('应该综合验证焦点状态', () => {
      const issues = validateFocus(
        {
          outlineColor: '#0066CC',
          outlineWidth: 2,
          outlineOffset: 2,
          outlineStyle: 'solid',
          backgroundColor: '#FFFFFF',
        },
        DEFAULT_MATRIX_CONFIG
      )
      // 可能有轻微警告，但不应有错误
      expect(issues.filter((i) => i.severity === 'error').length).toBe(0)
    })
  })
})

describe('键盘导航验证器', () => {
  describe('validateTabIndex', () => {
    it('原生交互元素不需要 tabIndex', () => {
      const issues = validateTabIndex(
        {
          type: 'button',
          aria: {},
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('自定义元素应该有 tabIndex', () => {
      const issues = validateTabIndex(
        {
          type: 'custom',
          aria: {},
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].severity).toBe('error')
    })

    it('应该警告正数 tabIndex', () => {
      const issues = validateTabIndex(
        {
          type: 'custom',
          aria: { tabIndex: 1 },
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].severity).toBe('warning')
    })

    it('应该接受 tabIndex={0}', () => {
      const issues = validateTabIndex(
        {
          type: 'custom',
          aria: { tabIndex: 0 },
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })
  })

  describe('validateRole', () => {
    it('自定义元素应该有 role', () => {
      const issues = validateRole(
        {
          type: 'custom',
          aria: {},
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
    })

    it('应该接受合适的 role', () => {
      const issues = validateRole(
        {
          type: 'custom',
          aria: { role: 'button' },
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })
  })

  describe('validateAccessibleLabel', () => {
    it('有文本内容的元素不需要额外标签', () => {
      const issues = validateAccessibleLabel(
        {
          type: 'button',
          aria: {},
          hasTextContent: true,
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })

    it('图标按钮应该有 aria-label', () => {
      const issues = validateAccessibleLabel(
        {
          type: 'button',
          aria: {},
          hasIcon: true,
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].severity).toBe('error')
    })

    it('应该接受 aria-label', () => {
      const issues = validateAccessibleLabel(
        {
          type: 'button',
          aria: { ariaLabel: '关闭' },
          hasIcon: true,
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })
  })

  describe('validateKeyboardAccessibility', () => {
    it('应该综合验证键盘可访问性', () => {
      const issues = validateKeyboardAccessibility(
        {
          type: 'custom',
          aria: {
            role: 'button',
            ariaLabel: '自定义按钮',
            tabIndex: 0,
          },
        },
        DEFAULT_MATRIX_CONFIG
      )
      expect(issues.length).toBe(0)
    })
  })
})

describe('报告生成器', () => {
  const mockResult = {
    passed: false,
    recipeName: '测试配方',
    issues: [
      {
        type: 'contrast',
        severity: 'error' as const,
        message: '对比度不足',
        actual: 3.0,
        expected: 4.5,
        suggestion: '增加对比度',
      },
      {
        type: 'font-size',
        severity: 'warning' as const,
        message: '字体过小',
        actual: 12,
        expected: 14,
      },
    ],
    timestamp: new Date('2024-01-01T00:00:00Z'),
    config: DEFAULT_MATRIX_CONFIG,
  }

  describe('generateMarkdownReport', () => {
    it('应该生成 Markdown 报告', () => {
      const report = generateMarkdownReport(mockResult)
      expect(report).toContain('# Matrix 可访问性验证报告')
      expect(report).toContain('测试配方')
      expect(report).toContain('对比度不足')
      expect(report).toContain('错误')
      expect(report).toContain('警告')
    })
  })

  describe('generateJSONReport', () => {
    it('应该生成 JSON 报告', () => {
      const report = generateJSONReport(mockResult)
      expect(report).toHaveProperty('summary')
      expect(report).toHaveProperty('statistics')
      expect(report).toHaveProperty('issues')
      expect(report).toHaveProperty('issuesByType')
    })
  })

  describe('generateConsoleReport', () => {
    it('应该生成控制台报告', () => {
      const report = generateConsoleReport(mockResult)
      expect(report).toContain('Matrix 可访问性验证')
      expect(report).toContain('测试配方')
      expect(report).toContain('❌ 未通过')
      expect(report).toContain('错误')
    })
  })
})
