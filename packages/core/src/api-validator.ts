/**
 * Xorigo UI API 一致性验证器
 *
 * 提供自动化API一致性验证功能，确保所有组件符合设计规范
 */

import type {
  APIValidationRule,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationInfo,
  ComponentMetadata,
  BaseComponentProps,
  ThemedComponentProps,
  FormComponentProps,
  ButtonLikeComponentProps,
  InputLikeComponentProps,
} from './api-standards'

// ============================================================================
// 验证规则定义
// ============================================================================

/**
 * API一致性验证规则集合
 */
export const API_VALIDATION_RULES: APIValidationRule[] = [
  // 基础Props验证
  {
    name: 'base-props-compliance',
    description: '验证组件是否实现基础Props接口',
    level: 'error',
    validate: (component) => validateBaseProps(component),
  },

  // 命名规范验证
  {
    name: 'naming-convention',
    description: '验证组件命名是否符合规范',
    level: 'error',
    validate: (component) => validateNamingConvention(component),
  },

  // TypeScript类型验证
  {
    name: 'typescript-types',
    description: '验证TypeScript类型定义的完整性',
    level: 'error',
    validate: (component) => validateTypeScriptTypes(component),
  },

  // 主题系统集成验证
  {
    name: 'theme-integration',
    description: '验证组件是否正确集成主题系统',
    level: 'warning',
    validate: (component) => validateThemeIntegration(component),
  },

  // 可访问性验证
  {
    name: 'accessibility-compliance',
    description: '验证组件的可访问性实现',
    level: 'warning',
    validate: (component) => validateAccessibility(component),
  },

  // 事件处理器验证
  {
    name: 'event-handlers',
    description: '验证事件处理器命名和类型',
    level: 'error',
    validate: (component) => validateEventHandlers(component),
  },

  // 组件文档验证
  {
    name: 'component-documentation',
    description: '验证组件文档的完整性',
    level: 'info',
    validate: (component) => validateDocumentation(component),
  },

  // Props一致性验证
  {
    name: 'props-consistency',
    description: '验证Props命名和类型的一致性',
    level: 'error',
    validate: (component) => validatePropsConsistency(component),
  },

  // 七轴主题系统验证
  {
    name: 'seven-axis-theme-support',
    description: '验证组件是否支持七轴主题系统',
    level: 'warning',
    validate: (component) => validateSevenAxisThemeSupport(component),
  },

  // 测试覆盖验证
  {
    name: 'test-coverage',
    description: '验证组件测试覆盖率',
    level: 'info',
    validate: (component) => validateTestCoverage(component),
  },
]

// ============================================================================
// 验证函数实现
// ============================================================================

/**
 * 验证基础Props接口实现
 */
function validateBaseProps(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查必需的基础Props
  const requiredBaseProps = [
    'className',
    'id',
    'disabled',
    'children',
    'aria-label',
    'data-testid',
  ]

  if (component.props) {
    requiredBaseProps.forEach(prop => {
      if (!(prop in component.props)) {
        errors.push({
          message: `缺少必需的基础Props: ${prop}`,
          location: `${component.name}.props`,
          code: 'MISSING_BASE_PROP',
          fix: `添加 ${prop} 属性到组件Props接口`,
        })
      }
    })
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info,
    suggestions: [
      '确保所有组件都实现BaseComponentProps接口',
      '使用TypeScript接口继承确保类型安全',
    ],
  }
}

/**
 * 验证命名规范
 */
function validateNamingConvention(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查组件名称（PascalCase）
  if (component.name && !/^[A-Z][a-zA-Z0-9]*$/.test(component.name)) {
    errors.push({
      message: '组件名称必须使用PascalCase命名',
      location: `${component.name}`,
      code: 'INVALID_COMPONENT_NAME',
      fix: '将组件名称改为PascalCase格式',
    })
  }

  // 检查Props命名（camelCase）
  if (component.props) {
    Object.keys(component.props).forEach(propName => {
      if (!/^[a-z][a-zA-Z0-9]*$/.test(propName)) {
        errors.push({
          message: `Props名称必须使用camelCase: ${propName}`,
          location: `${component.name}.props.${propName}`,
          code: 'INVALID_PROP_NAME',
          fix: `将 ${propName} 改为camelCase格式`,
        })
      }
    })
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info,
    suggestions: [
      '组件名称使用PascalCase',
      'Props名称使用camelCase',
      '事件处理器使用on前缀',
      '布尔值使用is/has/should前缀',
    ],
  }
}

/**
 * 验证TypeScript类型定义
 */
function validateTypeScriptTypes(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查是否导出Props类型
  if (!component.exportedTypes?.includes(`${component.name}Props`)) {
    warnings.push({
      message: `未导出 ${component.name}Props 类型`,
      location: `${component.name}`,
      code: 'MISSING_PROPS_TYPE_EXPORT',
      suggestion: '导出Props类型以便外部使用',
    })
  }

  // 检查是否使用泛型
  if (component.usesGenerics && !component.genericConstraints) {
    warnings.push({
      message: '使用泛型但未定义约束',
      location: `${component.name}`,
      code: 'MISSING_GENERIC_CONSTRAINTS',
      suggestion: '为泛型添加适当的约束',
    })
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info,
    suggestions: [
      '导出所有公共类型定义',
      '为泛型添加约束条件',
      '使用联合类型而不是枚举',
      '优先使用interface而不是type（除非需要联合类型）',
    ],
  }
}

/**
 * 验证主题系统集成
 */
function validateThemeIntegration(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查是否支持主题相关Props
  const themeProps = ['variant', 'size', 'colorTheme', 'borderRadius']
  const supportedThemeProps = themeProps.filter(prop => prop in (component.props || {}))

  if (supportedThemeProps.length === 0) {
    warnings.push({
      message: '组件不支持任何主题相关属性',
      location: `${component.name}`,
      code: 'NO_THEME_SUPPORT',
      suggestion: '考虑添加variant、size等主题属性',
    })
  }

  // 检查是否使用主题令牌
  if (!component.usesThemeTokens && supportedThemeProps.length > 0) {
    warnings.push({
      message: '组件支持主题属性但未使用主题令牌',
      location: `${component.name}`,
      code: 'THEME_PROPS_NO_TOKENS',
      suggestion: '使用主题令牌而不是硬编码样式',
    })
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info: supportedThemeProps.length > 0 ? [{
      message: `组件支持 ${supportedThemeProps.length} 个主题属性`,
      location: `${component.name}`,
      type: 'suggestion',
    }] : [],
    suggestions: [
      '使用主题令牌而不是硬编码颜色',
      '支持标准尺寸变体 (sm, md, lg)',
      '支持标准变体 (primary, secondary, outline)',
      '确保在所有主题下都能正常显示',
    ],
  }
}

/**
 * 验证可访问性实现
 */
function validateAccessibility(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查可交互组件的可访问性
  if (component.isInteractive) {
    const requiredAriaProps = ['aria-label', 'role']

    requiredAriaProps.forEach(prop => {
      if (!(prop in (component.props || {}))) {
        warnings.push({
          message: `可交互组件建议添加 ${prop} 属性`,
          location: `${component.name}.props`,
          code: 'MISSING_ARIA_PROP',
          suggestion: `添加 ${prop} 提升可访问性`,
        })
      }
    })

    // 检查键盘导航支持
    if (!component.supportsKeyboardNavigation) {
      warnings.push({
        message: '可交互组件应支持键盘导航',
        location: `${component.name}`,
        code: 'NO_KEYBOARD_SUPPORT',
        suggestion: '实现onKeyDown等键盘事件处理器',
      })
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info,
    suggestions: [
      '为可交互元素添加适当的ARIA属性',
      '支持键盘导航',
      '确保颜色对比度符合WCAG标准',
      '提供focus状态的视觉反馈',
      '使用语义化HTML标签',
    ],
  }
}

/**
 * 验证事件处理器
 */
function validateEventHandlers(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查事件处理器命名规范
  if (component.props) {
    Object.keys(component.props).forEach(propName => {
      if (propName.startsWith('on') && typeof component.props[propName] === 'function') {
        // 检查是否使用正确的事件类型
        const expectedEventTypes = {
          onClick: 'React.MouseEvent',
          onFocus: 'React.FocusEvent',
          onBlur: 'React.FocusEvent',
          onKeyDown: 'React.KeyboardEvent',
          onKeyUp: 'React.KeyboardEvent',
          onChange: 'React.ChangeEvent',
          onSubmit: 'React.FormEvent',
        }

        const expectedType = expectedEventTypes[propName as keyof typeof expectedEventTypes]
        if (expectedType && component.props[propName].type !== expectedType) {
          warnings.push({
            message: `事件处理器 ${propName} 应使用 ${expectedType} 类型`,
            location: `${component.name}.props.${propName}`,
            code: 'INVALID_EVENT_TYPE',
            suggestion: `修改 ${propName} 的类型为 ${expectedType}`,
          })
        }
      }
    })
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info,
    suggestions: [
      '事件处理器使用正确的React事件类型',
      '避免使用any类型作为事件处理器参数',
      '为复杂交互提供防抖和节流处理',
    ],
  }
}

/**
 * 验证组件文档
 */
function validateDocumentation(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查JSDoc注释
  if (!component.hasJSDoc) {
    warnings.push({
      message: '组件缺少JSDoc注释',
      location: `${component.name}`,
      code: 'MISSING_JSDOC',
      suggestion: '添加完整的JSDoc注释',
    })
  }

  // 检查示例代码
  if (!component.hasExamples) {
    info.push({
      message: '建议添加组件使用示例',
      location: `${component.name}`,
      type: 'suggestion',
    })
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info,
    suggestions: [
      '为组件添加完整的JSDoc注释',
      '提供基础使用示例',
      '提供高级用法示例',
      '文档化所有Props和事件',
    ],
  }
}

/**
 * 验证Props一致性
 */
function validatePropsConsistency(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查标准Props的实现
  const standardProps = {
    variant: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    size: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    disabled: 'boolean',
    className: 'string',
  }

  Object.entries(standardProps).forEach(([propName, expectedValue]) => {
    if (component.props && propName in component.props) {
      if (Array.isArray(expectedValue)) {
        // 检查枚举值
        const propValue = component.props[propName]
        if (propValue.enum && !expectedValue.every(v => propValue.enum.includes(v))) {
          warnings.push({
            message: `${propName} 属性的枚举值不符合标准`,
            location: `${component.name}.props.${propName}`,
            code: 'NON_STANDARD_PROP_VALUES',
            suggestion: `使用标准值: ${expectedValue.join(', ')}`,
          })
        }
      }
    }
  })

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info,
    suggestions: [
      '使用标准的Props名称和类型',
      '保持枚举值的一致性',
      '避免使用缩写的Props名称',
    ],
  }
}

/**
 * 验证七轴主题系统支持
 */
function validateSevenAxisThemeSupport(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查是否支持七轴主题
  if (!component.supportsSevenAxis && component.isThemed) {
    warnings.push({
      message: '主题组件建议支持七轴主题系统',
      location: `${component.name}`,
      code: 'NO_SEVEN_AXIS_SUPPORT',
      suggestion: '实现七轴主题系统支持以获得更好的主题体验',
    })
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info,
    suggestions: [
      '支持七轴主题系统',
      '测试在所有主题配方下的表现',
      '使用DTCG标准的设计令牌',
    ],
  }
}

/**
 * 验证测试覆盖
 */
function validateTestCoverage(component: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const info: ValidationInfo[] = []

  // 检查测试文件存在性
  if (!component.hasTests) {
    warnings.push({
      message: '组件缺少测试文件',
      location: `${component.name}`,
      code: 'NO_TESTS',
      suggestion: '为组件添加单元测试和集成测试',
    })
  }

  // 检查测试覆盖率
  if (component.testCoverage && component.testCoverage < 80) {
    warnings.push({
      message: `测试覆盖率低于80%: ${component.testCoverage}%`,
      location: `${component.name}`,
      code: 'LOW_TEST_COVERAGE',
      suggestion: '提高测试覆盖率到80%以上',
    })
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    info: component.testCoverage >= 80 ? [{
      message: `测试覆盖率达标: ${component.testCoverage}%`,
      location: `${component.name}`,
      type: 'best-practice',
    }] : [],
    suggestions: [
      '编写单元测试覆盖所有Props',
      '测试用户交互场景',
      '测试可访问性功能',
      '添加视觉回归测试',
      '测试主题切换功能',
    ],
  }
}

// ============================================================================
// API验证器主类
// ============================================================================

/**
 * API一致性验证器
 */
export class APIValidator {
  private rules: APIValidationRule[]

  constructor(customRules?: APIValidationRule[]) {
    this.rules = customRules || API_VALIDATION_RULES
  }

  /**
   * 验证单个组件
   */
  validateComponent(component: any): ValidationResult {
    const allErrors: ValidationError[] = []
    const allWarnings: ValidationWarning[] = []
    const allInfo: ValidationInfo[] = []
    const allSuggestions: string[] = []

    this.rules.forEach(rule => {
      try {
        const result = rule.validate(component)
        allErrors.push(...result.errors)
        allWarnings.push(...result.warnings)
        allInfo.push(...result.info)
        allSuggestions.push(...result.suggestions)
      } catch (error) {
        allErrors.push({
          message: `验证规则 ${rule.name} 执行失败: ${error.message}`,
          location: 'APIValidator',
          code: 'VALIDATION_RULE_ERROR',
        })
      }
    })

    return {
      passed: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      info: allInfo,
      suggestions: [...new Set(allSuggestions)], // 去重
    }
  }

  /**
   * 验证多个组件
   */
  validateComponents(components: any[]): { component: string; result: ValidationResult }[] {
    return components.map(component => ({
      component: component.name,
      result: this.validateComponent(component),
    }))
  }

  /**
   * 添加自定义验证规则
   */
  addRule(rule: APIValidationRule): void {
    this.rules.push(rule)
  }

  /**
   * 移除验证规则
   */
  removeRule(ruleName: string): void {
    this.rules = this.rules.filter(rule => rule.name !== ruleName)
  }

  /**
   * 获取所有验证规则
   */
  getRules(): APIValidationRule[] {
    return [...this.rules]
  }

  /**
   * 生成验证报告
   */
  generateReport(results: { component: string; result: ValidationResult }[]): string {
    let report = '# API一致性验证报告\n\n'

    const totalComponents = results.length
    const passedComponents = results.filter(r => r.result.passed).length
    const totalErrors = results.reduce((sum, r) => sum + r.result.errors.length, 0)
    const totalWarnings = results.reduce((sum, r) => sum + r.result.warnings.length, 0)

    report += `## 概览\n\n`
    report += `- 总组件数: ${totalComponents}\n`
    report += `- 通过验证: ${passedComponents}\n`
    report += `- 失败验证: ${totalComponents - passedComponents}\n`
    report += `- 错误总数: ${totalErrors}\n`
    report += `- 警告总数: ${totalWarnings}\n\n`

    // 失败的组件
    const failedComponents = results.filter(r => !r.result.passed)
    if (failedComponents.length > 0) {
      report += `## 失败的组件\n\n`
      failedComponents.forEach(({ component, result }) => {
        report += `### ${component}\n\n`
        result.errors.forEach(error => {
          report += `- **错误**: ${error.message} (${error.code})\n`
          report += `  - 位置: ${error.location}\n`
          if (error.fix) {
            report += `  - 修复: ${error.fix}\n`
          }
          report += '\n'
        })
      })
    }

    // 警告信息
    const componentsWithWarnings = results.filter(r => r.result.warnings.length > 0)
    if (componentsWithWarnings.length > 0) {
      report += `## 警告信息\n\n`
      componentsWithWarnings.forEach(({ component, result }) => {
        report += `### ${component}\n\n`
        result.warnings.forEach(warning => {
          report += `- **警告**: ${warning.message} (${warning.code})\n`
          report += `  - 位置: ${warning.location}\n`
          if (warning.suggestion) {
            report += `  - 建议: ${warning.suggestion}\n`
          }
          report += '\n'
        })
      })
    }

    return report
  }
}

// ============================================================================
// 导出验证器实例和工具函数
// ============================================================================

export const apiValidator = new APIValidator()

/**
 * 验证组件API一致性的快捷函数
 */
export function validateComponentAPI(component: any): ValidationResult {
  return apiValidator.validateComponent(component)
}

/**
 * 批量验证组件API一致性
 */
export function validateComponentsAPI(components: any[]): { component: string; result: ValidationResult }[] {
  return apiValidator.validateComponents(components)
}