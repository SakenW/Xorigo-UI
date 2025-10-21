# API 设计标准验证 Skill

**触发条件**：当需要验证组件 API 设计一致性、检查 API 标准合规性、生成组件接口时触发

## 功能描述

基于 Xorigo UI API 设计标准文档，自动验证和生成组件 API，确保所有组件遵循统一的 API 设计模式。

## 核心能力

### 1. API 标准验证器
验证组件 API 是否符合 Xorigo UI 设计标准：

```typescript
// API 标准验证器
class APIDesignValidator {
  validateComponentAPI(componentName: string, componentDefinition: ComponentDefinition): APIValidationResult {
    const result: APIValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      recommendations: [],
      score: 100
    }

    // 1. 验证基础接口继承
    this.validateBaseInterfaces(componentDefinition, result)

    // 2. 验证Props命名规范
    this.validatePropsNaming(componentDefinition, result)

    // 3. 验证事件处理器
    this.validateEventHandlers(componentDefinition, result)

    // 4. 验证可访问性
    this.validateAccessibilityProps(componentDefinition, result)

    // 5. 验证变体系统
    this.validateVariantSystem(componentDefinition, result)

    // 6. 验证TypeScript类型
    this.validateTypeScriptTypes(componentDefinition, result)

    // 计算最终得分
    result.score = this.calculateValidationScore(result)

    return result
  }

  private validateBaseInterfaces(definition: ComponentDefinition, result: APIValidationResult): void {
    const requiredInterfaces = [
      'StandardSizes',
      'StandardVariants',
      'StandardStates',
      'StyleExtensions'
    ]

    // 检查是否继承了正确的接口
    if (!definition.extends || definition.extends.length === 0) {
      result.errors.push({
        type: 'interface_missing',
        message: '组件必须继承 BaseComponentProps 或相关接口',
        suggestion: 'extends BaseComponentProps',
        severity: 'error'
      })
    }

    // 检查具体接口类型
    if (definition.type === 'interactive' && !this.hasInteractiveInterface(definition)) {
      result.errors.push({
        type: 'interactive_interface_missing',
        message: '交互组件必须继承 InteractiveComponentProps',
        suggestion: 'extends InteractiveComponentProps',
        severity: 'error'
      })
    }

    if (definition.type === 'form' && !this.hasFormInterface(definition)) {
      result.errors.push({
        type: 'form_interface_missing',
        message: '表单组件必须继承 FormComponentProps',
        suggestion: 'extends FormComponentProps',
        severity: 'error'
      })
    }
  }

  private validatePropsNaming(definition: ComponentDefinition, result: APIValidationResult): void {
    const props = definition.props || []

    // 检查命名规范
    const namingViolations = props.filter(prop => {
      return !this.isValidPropName(prop.name)
    })

    namingViolations.forEach(violation => {
      result.warnings.push({
        type: 'naming_violation',
        message: `Prop名不符合规范: ${violation.name}`,
        suggestion: this.suggestPropName(violation.name),
        severity: 'warning'
      })
    })

    // 检查布尔值命名
    const booleanProps = props.filter(prop => prop.type === 'boolean')
    const namingIssues = booleanProps.filter(prop =>
      !prop.name.startsWith('is') &&
      !prop.name.startsWith('has') &&
      !prop.name.startsWith('should') &&
      prop.name !== 'disabled' &&
      prop.name !== 'loading' &&
      prop.name !== 'readonly'
    )

    namingIssues.forEach(issue => {
      result.warnings.push({
        type: 'boolean_naming',
        message: `布尔值Prop建议使用is/has/should前缀: ${issue.name}`,
        suggestion: this.suggestBooleanPropName(issue.name),
        severity: 'warning'
      })
    })

    // 检查事件处理器命名
    const eventHandlers = props.filter(prop =>
      prop.type.startsWith('Function') &&
      prop.name.startsWith('on')
    )

    eventHandlers.forEach(handler => {
      if (!this.isValidEventHandlerName(handler.name)) {
        result.errors.push({
          type: 'event_handler_naming',
          message: `事件处理器命名不正确: ${handler.name}`,
          suggestion: this.suggestEventHandlerName(handler.name),
          severity: 'error'
        })
      }
    })
  }

  private validateEventHandlers(definition: ComponentDefinition, result: APIValidationResult): void {
    const props = definition.props || []
    const eventHandlers = props.filter(prop =>
      prop.type.startsWith('Function') &&
      prop.name.startsWith('on')
    )

    // 检查必需的事件处理器
    const requiredHandlers = this.getRequiredEventHandlers(definition.type)
    requiredHandlers.forEach(handler => {
      if (!eventHandlers.find(h => h.name === handler.name)) {
        result.warnings.push({
          type: 'required_handler_missing',
          message: `建议添加事件处理器: ${handler.name}`,
          suggestion: `添加 ${handler.name} 属性以支持${handler.description}`,
          severity: 'warning'
        })
      }
    })

    // 检查事件处理器参数类型
    eventHandlers.forEach(handler => {
      if (!this.isValidEventHandlerSignature(handler.signature)) {
        result.errors.push({
          type: 'event_handler_signature',
          message: `事件处理器签名不正确: ${handler.name}`,
          suggestion: this.suggestEventHandlerSignature(handler.name, definition.type),
          severity: 'error'
        })
      }
    })
  }

  private validateAccessibilityProps(definition: ComponentDefinition, result: APIValidationResult): void {
    const props = definition.props || []

    // 检查必需的可访问性属性
    const requiredA11yProps = this.getRequiredAccessibilityProps(definition.type)
    requiredA11yProps.forEach(prop => {
      if (!props.find(p => p.name === prop.name)) {
        result.warnings.push({
          type: 'accessibility_prop_missing',
          message: `建议添加可访问性属性: ${prop.name}`,
          suggestion: `添加 ${prop.name} 属性以支持${prop.description}`,
          severity: 'warning'
        })
      }
    })

    // 检查ARIA属性
    const ariaProps = props.filter(prop => prop.name.startsWith('aria-'))
    ariaProps.forEach(prop => {
      if (!this.isValidAriaProp(prop.name, prop.type)) {
        result.errors.push({
          type: 'invalid_aria_prop',
          message: `无效的ARIA属性: ${prop.name}`,
          suggestion: `检查ARIA属性名称和类型`,
          severity: 'error'
        })
      }
    })

    // 检查语义化角色
    if (definition.interactive && !props.find(p => p.name === 'role')) {
      result.warnings.push({
        type: 'role_missing',
        message: '交互组件建议添加role属性',
        suggestion: '添加role属性以明确组件语义',
        severity: 'warning'
      })
    }
  }

  private validateVariantSystem(definition: ComponentDefinition, result: APIValidationResult): void {
    // 检查变体定义
    if (definition.variants) {
      // 验证尺寸变体
      const validSizes = ['xs', 'sm', 'md', 'lg', 'xl']
      const sizeVariant = definition.variants.find(v => v.name === 'size')
      if (sizeVariant) {
        const invalidSizes = Object.keys(sizeVariant.values).filter(size => !validSizes.includes(size))
        if (invalidSizes.length > 0) {
          result.errors.push({
            type: 'invalid_size_variant',
            message: `无效的尺寸变体: ${invalidSizes.join(', ')}`,
            suggestion: `使用标准尺寸: ${validSizes.join(', ')}`,
            severity: 'error'
          })
        }
      }

      // 验证变体类型
      const validVariants = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']
      const variantType = definition.variants.find(v => v.name === 'variant')
      if (variantType) {
        const invalidVariants = Object.keys(variantType.values).filter(v => !validVariants.includes(v))
        if (invalidVariants.length > 0) {
          result.warnings.push({
            type: 'non_standard_variant',
            message: `非标准变体: ${invalidVariants.join(', ')}`,
            suggestion: `考虑使用标准变体: ${validVariants.join(', ')}`,
            severity: 'warning'
          })
        }
      }
    }

    // 检查默认变体
    if (definition.defaultVariants) {
      if (!definition.defaultVariants.size) {
        result.warnings.push({
          type: 'default_size_missing',
          message: '建议设置默认尺寸',
          suggestion: '设置默认尺寸为md',
          severity: 'warning'
        })
      }

      if (!definition.defaultVariants.variant) {
        result.warnings.push({
          type: 'default_variant_missing',
          message: '建议设置默认变体',
          suggestion: '设置默认变体为primary',
          severity: 'warning'
        })
      }
    }
  }

  private validateTypeScriptTypes(definition: ComponentDefinition, result: APIValidationResult): void {
    // 检查类型定义完整性
    if (!definition.typeDefinition) {
      result.errors.push({
        type: 'type_definition_missing',
        message: '缺少TypeScript类型定义',
        suggestion: '添加完整的接口或类型定义',
        severity: 'error'
      })
    }

    // 检查泛型使用
    if (definition.type === 'form' && !definition.typeDefinition.includes('<T>')) {
      result.warnings.push({
        type: 'generic_missing',
        message: '表单组件建议使用泛型',
        suggestion: '使用<T extends any>提高类型安全性',
        severity: 'warning'
      })
    }

    // 检查HTML属性继承
    const requiredHTMLProps = this.getRequiredHTMLProps(definition.htmlElement)
    requiredHTMLProps.forEach(prop => {
      if (definition.typeDefinition && !definition.typeDefinition.includes(prop)) {
        result.warnings.push({
          type: 'html_prop_missing',
          message: `建议继承HTML属性: ${prop}`,
          suggestion: `extends React.${this.getHTMLPropInterface(definition.htmlElement)}Attributes`,
          severity: 'warning'
        })
      }
    })
  }

  private calculateValidationScore(result: APIValidationResult): number {
    let score = 100

    // 错误扣分
    score -= result.errors.length * 20

    // 警告扣分
    score -= result.warnings.length * 5

    // 额外加分项
    if (result.recommendations.length > 0) {
      score += Math.min(result.recommendations.length * 2, 10)
    }

    return Math.max(0, Math.min(100, score))
  }
}
```

### 2. 组件接口生成器
基于 API 标准自动生成组件接口：

```typescript
// 组件接口生成器
class ComponentInterfaceGenerator {
  generateComponentInterface(config: ComponentConfig): GeneratedInterface {
    const interfaceConfig = this.buildInterfaceConfig(config)

    return {
      interfaceDefinition: this.generateInterfaceCode(interfaceConfig),
      variantDefinition: this.generateVariantCode(interfaceConfig),
      typeDefinition: this.generateTypeCode(interfaceConfig),
      testProps: this.generateTestProps(interfaceConfig),
      accessibilityProps: this.generateAccessibilityProps(interfaceConfig),
      usageExamples: this.generateUsageExamples(interfaceConfig),
      migrationGuide: this.generateMigrationGuide(interfaceConfig)
    }
  }

  private buildInterfaceConfig(config: ComponentConfig): InterfaceConfig {
    return {
      name: config.name,
      type: config.type || 'base',
      htmlElement: config.htmlElement || 'div',
      extends: this.buildExtendsClause(config),
      props: this.buildPropsDefinition(config),
      variants: this.buildVariantsDefinition(config),
      events: this.buildEventsDefinition(config),
      accessibility: this.buildAccessibilityDefinition(config)
    }
  }

  private generateInterfaceCode(config: InterfaceConfig): string {
    const imports = this.generateImports(config)
    const baseInterface = this.generateBaseInterface(config)
    const propsInterface = this.generatePropsInterface(config)
    const componentDefinition = this.generateComponentDefinition(config)

    return `${imports}

${baseInterface}

${propsInterface}

${componentDefinition}`
  }

  private generateImports(config: InterfaceConfig): string {
    const imports = [
      "import React from 'react'",
      "import { cva, type VariantProps } from 'class-variance-authority'",
      "import { cn } from '../utils/cn'"
    ]

    // 根据组件类型添加额外导入
    if (config.type === 'interactive') {
      imports.push("import type { InteractiveComponentProps } from '../types'")
    } else if (config.type === 'form') {
      imports.push("import type { FormComponentProps } from '../types'")
    } else {
      imports.push("import type { BaseComponentProps } from '../types'")
    }

    // 根据HTML元素添加导入
    if (config.htmlElement !== 'div') {
      const htmlElement = config.htmlElement.charAt(0).toUpperCase() + config.htmlElement.slice(1)
      imports.push(`import type { ${htmlElement}HTMLAttributes } from 'react'`)
    }

    return imports.join('\n')
  }

  private generateBaseInterface(config: InterfaceConfig): string {
    const baseType = this.getBaseType(config.type, config.htmlElement)

    return `export interface ${config.name}Props
  extends ${baseType}${config.extends ? ', ' + config.extends : ''} {
  // 组件特定属性
  ${config.props.map(prop => this.generatePropDefinition(prop)).join('\n  ')}
}`
  }

  private generateVariantCode(config: InterfaceConfig): string {
    if (!config.variants || config.variants.length === 0) {
      return '// 无变体定义'
    }

    const baseClasses = config.variants.find(v => v.name === 'base')?.classes || ''
    const variantDefinitions = config.variants
      .filter(v => v.name !== 'base')
      .map(v => this.generateVariantDefinition(v))
      .join(',\n    ')

    const defaultVariants = this.generateDefaultVariants(config.variants)

    return `export const ${config.name.toLowerCase()}Variants = cva(
  '${baseClasses}',
  {
    ${variantDefinitions}
  },
  {
    defaultVariants: {
      ${defaultVariants}
    }
  }
)`
  }

  private generatePropsInterface(config: InterfaceConfig): string {
    const props = config.props || []

    return `// Props 类型定义
export type ${config.name}Variants = VariantProps<typeof ${config.name.toLowerCase()}Variants>

// 测试Props
export interface ${config.name}TestProps {
  testId?: string
  'data-testid'?: string
  'data-component'?: string
  'data-variant'?: string
  'data-size'?: string
  'data-state'?: string
}

// 可访问性Props
export interface ${config.name}AccessibilityProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-selected'?: boolean
  'aria-disabled'?: boolean
  role?: string
  tabIndex?: number
}`
  }

  private generateComponentDefinition(config: InterfaceConfig): string {
    const refType = this.getRefType(config.htmlElement)
    const displayName = config.name

    return `export const ${config.name} = React.forwardRef<${refType}, ${config.name}Props>(
  ({ className, children, ${config.variants ? 'variant, size,' : ''} ...props }, ref) => {
    return (
      <${config.htmlElement}
        ref={ref}
        className={cn(${config.variants ? `${config.name.toLowerCase()}Variants({ variant, size, className })` : 'className'})}
        {...props}
      >
        {children}
      </${config.htmlElement}>
    )
  }
)

${displayName}.displayName = "${displayName}"`
  }

  private generateUsageExamples(config: InterfaceConfig): UsageExample[] {
    const examples: UsageExample[] = []

    // 基础用法
    examples.push({
      title: '基础用法',
      description: '最简单的使用方式',
      code: this.generateBasicUsageExample(config),
      props: {}
    })

    // 变体用法
    if (config.variants) {
      examples.push({
        title: '变体用法',
        description: '使用不同的变体和尺寸',
        code: this.generateVariantUsageExample(config),
        props: this.generateVariantProps(config.variants)
      })
    }

    // 事件处理
    if (config.type === 'interactive' || config.type === 'form') {
      examples.push({
        title: '事件处理',
        description: '处理用户交互事件',
        code: this.generateEventHandlingExample(config),
        props: { onClick: 'handleClick' }
      })
    }

    // 可访问性
    examples.push({
      title: '可访问性',
      description: '添加可访问性支持',
      code: this.generateAccessibilityExample(config),
      props: { 'aria-label': '描述文字', role: 'button' }
    })

    return examples
  }
}
```

### 3. API 一致性检查器
检查多个组件间的 API 一致性：

```typescript
// API 一致性检查器
class APIConsistencyChecker {
  checkConsistency(components: ComponentDefinition[]): ConsistencyReport {
    const report: ConsistencyReport = {
      overallScore: 0,
      inconsistencies: [],
      recommendations: [],
      componentScores: {}
    }

    // 检查尺寸系统一致性
    const sizeConsistency = this.checkSizeConsistency(components)
    report.inconsistencies.push(...sizeConsistency.inconsistencies)
    report.componentScores = { ...report.componentScores, ...sizeConsistency.scores }

    // 检查变体系统一致性
    const variantConsistency = this.checkVariantConsistency(components)
    report.inconsistencies.push(...variantConsistency.inconsistencies)
    report.componentScores = { ...report.componentScores, ...variantConsistency.scores }

    // 检查事件处理器一致性
    const eventConsistency = this.checkEventConsistency(components)
    report.inconsistencies.push(...eventConsistency.inconsistencies)
    report.componentScores = { ...report.componentScores, ...eventConsistency.scores }

    // 检查可访问性一致性
    const accessibilityConsistency = this.checkAccessibilityConsistency(components)
    report.inconsistencies.push(...accessibilityConsistency.inconsistencies)
    report.componentScores = { ...report.componentScores, ...accessibilityConsistency.scores }

    // 计算总分
    report.overallScore = this.calculateOverallScore(report.componentScores)
    report.recommendations = this.generateConsistencyRecommendations(report.inconsistencies)

    return report
  }

  private checkSizeConsistency(components: ComponentDefinition[]): ConsistencyCheck {
    const check: ConsistencyCheck = {
      type: 'size_consistency',
      inconsistencies: [],
      scores: {}
    }

    // 标准尺寸
    const standardSizes = ['xs', 'sm', 'md', 'lg', 'xl']
    const sizeUsage: Record<string, number> = {}

    // 统计尺寸使用情况
    standardSizes.forEach(size => {
      sizeUsage[size] = 0
    })

    components.forEach(component => {
      let componentScore = 100
      const componentSizes = this.getComponentSizes(component)

      // 检查是否使用了标准尺寸
      const nonStandardSizes = componentSizes.filter(size => !standardSizes.includes(size))
      if (nonStandardSizes.length > 0) {
        check.inconsistencies.push({
          component: component.name,
          type: 'non_standard_sizes',
          message: `使用了非标准尺寸: ${nonStandardSizes.join(', ')}`,
          severity: 'warning',
          suggestion: `使用标准尺寸: ${standardSizes.join(', ')}`
        })
        componentScore -= nonStandardSizes.length * 10
      }

      // 检查尺寸完整性
      const missingSizes = standardSizes.filter(size => !componentSizes.includes(size))
      if (missingSizes.length > 0) {
        check.inconsistencies.push({
          component: component.name,
          type: 'incomplete_sizes',
          message: `缺少尺寸: ${missingSizes.join(', ')}`,
          severity: 'info',
          suggestion: `考虑添加缺失的尺寸以提高一致性`
        })
        componentScore -= missingSizes.length * 5
      }

      check.scores[component.name] = Math.max(0, componentScore)

      // 统计使用情况
      componentSizes.forEach(size => {
        if (standardSizes.includes(size)) {
          sizeUsage[size]++
        }
      })
    })

    // 检查尺寸使用分布
    const totalComponents = components.length
    Object.entries(sizeUsage).forEach(([size, count]) => {
      const usage = (count / totalComponents) * 100
      if (usage < 50) {
        check.inconsistencies.push({
          component: 'global',
          type: 'low_size_usage',
          message: `尺寸 ${size} 使用率较低: ${usage.toFixed(1)}%`,
          severity: 'info',
          suggestion: `考虑在更多组件中使用尺寸 ${size}`
        })
      }
    })

    return check
  }

  private checkVariantConsistency(components: ComponentDefinition[]): ConsistencyCheck {
    const check: ConsistencyCheck = {
      type: 'variant_consistency',
      inconsistencies: [],
      scores: {}
    }

    // 标准变体
    const standardVariants = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']
    const variantUsage: Record<string, number> = {}

    // 统计变体使用情况
    standardVariants.forEach(variant => {
      variantUsage[variant] = 0
    })

    components.forEach(component => {
      let componentScore = 100
      const componentVariants = this.getComponentVariants(component)

      // 检查是否使用了标准变体
      const nonStandardVariants = componentVariants.filter(variant => !standardVariants.includes(variant))
      if (nonStandardVariants.length > 0) {
        check.inconsistencies.push({
          component: component.name,
          type: 'non_standard_variants',
          message: `使用了非标准变体: ${nonStandardVariants.join(', ')}`,
          severity: 'warning',
          suggestion: `使用标准变体: ${standardVariants.join(', ')}`
        })
        componentScore -= nonStandardVariants.length * 10
      }

      // 检查默认变体
      if (component.defaultVariants) {
        if (!component.defaultVariants.variant) {
          check.inconsistencies.push({
            component: component.name,
            type: 'missing_default_variant',
            message: '缺少默认变体',
            severity: 'warning',
            suggestion: '设置默认变体为primary'
          })
          componentScore -= 15
        } else if (!standardVariants.includes(component.defaultVariants.variant)) {
          check.inconsistencies.push({
            component: component.name,
            type: 'non_standard_default_variant',
            message: `默认变体不是标准变体: ${component.defaultVariants.variant}`,
            severity: 'warning',
            suggestion: '使用标准变体作为默认值'
          })
          componentScore -= 10
        }
      }

      check.scores[component.name] = Math.max(0, componentScore)

      // 统计使用情况
      componentVariants.forEach(variant => {
        if (standardVariants.includes(variant)) {
          variantUsage[variant]++
        }
      })
    })

    return check
  }

  private generateConsistencyRecommendations(inconsistencies: Inconsistency[]): Recommendation[] {
    const recommendations: Recommendation[] = []

    // 按类型分组不一致项
    const groupedInconsistencies = inconsistencies.reduce((groups, item) => {
      if (!groups[item.type]) {
        groups[item.type] = []
      }
      groups[item.type].push(item)
      return groups
    }, {} as Record<string, Inconsistency[]>)

    // 为每种不一致生成建议
    Object.entries(groupedInconsistencies).forEach(([type, items]) => {
      const highSeverityItems = items.filter(item => item.severity === 'error')
      const mediumSeverityItems = items.filter(item => item.severity === 'warning')

      if (highSeverityItems.length > 0) {
        recommendations.push({
          type: 'api_standardization',
          priority: 'high',
          title: `修复${this.getInconsistencyTypeDescription(type)}问题`,
          description: `发现 ${highSeverityItems.length} 个严重的不一致问题`,
          action: highSeverityItems.map(item => item.suggestion).join('; ')
        })
      }

      if (mediumSeverityItems.length > 0) {
        recommendations.push({
          type: 'api_improvement',
          priority: 'medium',
          title: `改进${this.getInconsistencyTypeDescription(type)}一致性`,
          description: `发现 ${mediumSeverityItems.length} 个可改进的地方`,
          action: mediumSeverityItems.map(item => item.suggestion).join('; ')
        })
      }
    })

    return recommendations
  }
}
```

### 4. API 迁移助手
帮助从旧 API 迁移到新标准：

```typescript
// API 迁移助手
class APIMigrationHelper {
  generateMigrationPlan(oldAPI: ComponentDefinition, newAPI: ComponentDefinition): MigrationPlan {
    return {
      breakingChanges: this.identifyBreakingChanges(oldAPI, newAPI),
      migrationSteps: this.generateMigrationSteps(oldAPI, newAPI),
      codeMapping: this.generateCodeMapping(oldAPI, newAPI),
      compatibilityLayer: this.generateCompatibilityLayer(oldAPI, newAPI),
      timeline: this.estimateMigrationTimeline(oldAPI, newAPI),
      risks: this.identifyMigrationRisks(oldAPI, newAPI)
    }
  }

  private identifyBreakingChanges(oldAPI: ComponentDefinition, newAPI: ComponentDefinition): BreakingChange[] {
    const changes: BreakingChange[] = []

    // 检查Props变更
    const oldProps = new Set(oldAPI.props?.map(p => p.name) || [])
    const newProps = new Set(newAPI.props?.map(p => p.name) || [])

    // 被移除的Props
    const removedProps = [...oldProps].filter(prop => !newProps.has(prop))
    removedProps.forEach(prop => {
      changes.push({
        type: 'prop_removed',
        prop,
        description: `属性 ${prop} 已被移除`,
        impact: 'breaking',
        migration: this.getPropMigration(prop, oldAPI, newAPI)
      })
    })

    // 类型变更的Props
    const commonProps = [...oldProps].filter(prop => newProps.has(prop))
    commonProps.forEach(prop => {
      const oldProp = oldAPI.props?.find(p => p.name === prop)
      const newProp = newAPI.props?.find(p => p.name === prop)

      if (oldProp && newProp && oldProp.type !== newProp.type) {
        changes.push({
          type: 'prop_type_changed',
          prop,
          description: `属性 ${prop} 类型从 ${oldProp.type} 变更为 ${newProp.type}`,
          impact: 'breaking',
          migration: `更新 ${prop} 的类型为 ${newProp.type}`
        })
      }
    })

    // 检查事件处理器变更
    const oldEvents = oldAPI.props?.filter(p => p.name.startsWith('on')) || []
    const newEvents = newAPI.props?.filter(p => p.name.startsWith('on')) || []

    const removedEvents = oldEvents.filter(event =>
      !newEvents.find(new => new.name === event.name)
    )

    removedEvents.forEach(event => {
      changes.push({
        type: 'event_removed',
        prop: event.name,
        description: `事件处理器 ${event.name} 已被移除`,
        impact: 'breaking',
        migration: `使用 ${this.getEventReplacement(event.name)} 替代`
      })
    })

    return changes
  }

  private generateMigrationSteps(oldAPI: ComponentDefinition, newAPI: ComponentDefinition): MigrationStep[] {
    const steps: MigrationStep[] = []

    // Step 1: 备份现有代码
    steps.push({
      order: 1,
      title: '备份现有代码',
      description: '在开始迁移前，备份所有使用旧API的代码',
      action: '创建代码备份分支',
      estimatedTime: '30分钟'
    })

    // Step 2: 更新导入
    steps.push({
      order: 2,
      title: '更新导入语句',
      description: '更新组件导入以使用新的API',
      action: '将 import 语句更新为新格式',
      estimatedTime: '15分钟',
      codeExample: this.generateImportMigration(oldAPI, newAPI)
    })

    // Step 3: 迁移Props
    steps.push({
      order: 3,
      title: '迁移组件Props',
      description: '更新所有组件Props以符合新API',
      action: '根据映射表更新Props名称和类型',
      estimatedTime: '2-4小时',
      codeExample: this.generatePropsMigration(oldAPI, newAPI)
    })

    // Step 4: 更新事件处理器
    steps.push({
      order: 4,
      title: '更新事件处理器',
      description: '更新所有事件处理器名称和签名',
      action: '使用新的事件处理器命名规范',
      estimatedTime: '1-2小时',
      codeExample: this.generateEventMigration(oldAPI, newAPI)
    })

    // Step 5: 测试验证
    steps.push({
      order: 5,
      title: '测试验证',
      description: '全面测试迁移后的代码',
      action: '运行单元测试和集成测试',
      estimatedTime: '1-2小时'
    })

    // Step 6: 清理代码
    steps.push({
      order: 6,
      title: '清理和优化',
      description: '移除废弃代码，优化新代码',
      action: '删除旧API相关代码，优化性能',
      estimatedTime: '30分钟'
    })

    return steps
  }

  private generateCodeMapping(oldAPI: ComponentDefinition, newAPI: ComponentDefinition): CodeMapping {
    const mapping: CodeMapping = {
      props: {},
      events: {},
      variants: {},
      examples: {}
    }

    // Props映射
    const oldProps = oldAPI.props || []
    const newProps = newAPI.props || []

    oldProps.forEach(oldProp => {
      const newProp = newProps.find(p => this.isEquivalentProp(oldProp, p))
      if (newProp) {
        mapping.props[oldProp.name] = {
          newName: newProp.name,
          newType: newProp.type,
          mapping: this.generatePropMapping(oldProp, newProp)
        }
      } else {
        // 查找替代方案
        const replacement = this.findPropReplacement(oldProp, newAPI)
        if (replacement) {
          mapping.props[oldProp.name] = replacement
        }
      }
    })

    // 事件映射
    const oldEvents = oldAPI.props?.filter(p => p.name.startsWith('on')) || []
    const newEvents = newAPI.props?.filter(p => p.name.startsWith('on')) || []

    oldEvents.forEach(oldEvent => {
      const newEvent = newEvents.find(e => this.isEquivalentEvent(oldEvent, e))
      if (newEvent) {
        mapping.events[oldEvent.name] = {
          newName: newEvent.name,
          newSignature: newEvent.signature,
          mapping: this.generateEventMapping(oldEvent, newEvent)
        }
      } else {
        const replacement = this.findEventReplacement(oldEvent, newAPI)
        if (replacement) {
          mapping.events[oldEvent.name] = replacement
        }
      }
    })

    return mapping
  }

  private generateCompatibilityLayer(oldAPI: ComponentDefinition, newAPI: ComponentDefinition): CompatibilityLayer {
    return {
      shimComponent: this.generateShimComponent(oldAPI, newAPI),
      deprecatedWarnings: this.generateDeprecatedWarnings(oldAPI, newAPI),
      polyfillProps: this.generatePolyfillProps(oldAPI, newAPI),
      adapterFunction: this.generateAdapterFunction(oldAPI, newAPI)
    }
  }
```

## API 设计标准

### 基础Props 标准
- **StandardSizes**: xs | sm | md | lg | xl
- **StandardVariants**: primary | secondary | success | warning | danger | neutral
- **StandardStates**: disabled | loading | error | required
- **StyleExtensions**: className | style | testId | data-testid

### 接口继承层次
```
BaseComponentProps (基础组件)
├─ InteractiveComponentProps (交互组件)
├─ FormComponentProps (表单组件)
└─ CompositeComponentProps (复合组件)
```

### 命名规范
- **布尔值**: is/has/should 前缀
- **事件处理器**: on + 驼峰命名
- **测试属性**: testId, data-testid
- **可访问性**: aria-* 前缀

## 使用示例

```bash
# 验证组件API
"验证 Button 组件的 API 设计是否符合 Xorigo UI 标准"

# 生成组件接口
"为新的 Toast 组件生成符合标准的 API 接口"

# 检查一致性
"检查所有组件的 API 一致性，识别不一致的地方"

# 生成迁移计划
"为现有组件生成从旧 API 到新标准的迁移计划"
```

## 输出格式

1. **验证报告**: 详细的 API 验证结果和得分
2. **生成接口**: 完整的 TypeScript 接口代码
3. **一致性报告**: 组件间 API 一致性分析
4. **迁移计划**: 从旧 API 到新标准的迁移指导

## 技术依据

基于 Xorigo UI API 设计标准文档：

- **统一性**: 所有组件遵循相同的设计模式
- **可预测性**: 开发者可以轻松预测组件 API
- **可扩展性**: 支持未来功能扩展
- **类型安全**: 完整的 TypeScript 类型支持

确保所有组件 API 的一致性、可维护性和开发者体验。