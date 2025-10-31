/**
 * 🔍 API 一致性验证器
 *
 * 确保所有组件 API 符合统一的设计标准
 */

import { basename, dirname, extname, join, relative } from 'path';
import { readFile, readdir, stat } from 'fs/promises';
import { glob } from 'glob';

// API 标准定义
export interface StandardComponentAPI {
  // 基础属性
  variant?: string;
  size?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;

  // 事件处理
  onClick?: (event: Event) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;

  // 主题集成
  theme?: ThemeOverride;
  colorScheme?: ColorScheme;

  // 可访问性
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;

  // 扩展属性
  [key: string]: any;
}

export interface ThemeOverride {
  mode?: 'light' | 'dark' | 'auto';
  hue?: string;
  saturation?: 'muted' | 'normal' | 'vibrant';
  lightness?: 'bright' | 'normal' | 'dim';
  density?: 'compact' | 'normal' | 'spacious';
  roundness?: 'sharp' | 'rounded' | 'circular';
  contrast?: 'low' | 'normal' | 'high';
}

export interface ColorScheme {
  primary?: string;
  secondary?: string;
  accent?: string;
  neutral?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}

export interface APIValidationRule {
  property: string;
  type: 'required' | 'recommended' | 'optional' | 'deprecated';
  valueType?: string;
  defaultValue?: any;
  validation?: (value: any) => boolean;
  deprecationWarning?: string;
  category: 'core' | 'event' | 'theme' | 'accessibility' | 'layout' | 'styling';
}

export interface ComponentAPIDefinition {
  name: string;
  filePath: string;
  props: PropDefinition[];
  extends?: string[];
  defaultProps?: Record<string, any>;
  validationRules: APIValidationRule[];
  category: ComponentCategory;
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
  deprecated?: boolean;
  deprecatedMessage?: string;
}

export type ComponentCategory =
  | 'layout'      // 布局组件
  | 'navigation'  // 导航组件
  | 'feedback'    // 反馈组件
  | 'input'       // 输入组件
  | 'display'     // 展示组件
  | 'overlay'     // 覆盖层组件
  | 'form'        // 表单组件
  | 'utility'     // 工具组件;

// 标准变体和尺寸定义
export const STANDARD_VARIANTS = {
  button: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
  input: ['default', 'filled', 'outlined', 'underlined'],
  card: ['default', 'elevated', 'outlined', 'filled'],
  modal: ['default', 'fullscreen', 'drawer'],
  alert: ['info', 'success', 'warning', 'error'],
  badge: ['default', 'primary', 'secondary', 'success', 'warning', 'error']
} as const;

export const STANDARD_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

// 基础 API 验证规则
export const BASE_VALIDATION_RULES: APIValidationRule[] = [
  // 核心属性
  {
    property: 'className',
    type: 'optional',
    valueType: 'string',
    category: 'styling',
    validation: (value) => typeof value === 'string' || value === undefined
  },
  {
    property: 'children',
    type: 'optional',
    valueType: 'ReactNode',
    category: 'core',
    validation: (value) => value !== null && value !== undefined
  },
  {
    property: 'disabled',
    type: 'optional',
    valueType: 'boolean',
    defaultValue: false,
    category: 'core',
    validation: (value) => typeof value === 'boolean' || value === undefined
  },

  // 事件处理
  {
    property: 'onClick',
    type: 'optional',
    valueType: 'function',
    category: 'event',
    validation: (value) => typeof value === 'function' || value === undefined
  },
  {
    property: 'onFocus',
    type: 'optional',
    valueType: 'function',
    category: 'event',
    validation: (value) => typeof value === 'function' || value === undefined
  },
  {
    property: 'onBlur',
    type: 'optional',
    valueType: 'function',
    category: 'event',
    validation: (value) => typeof value === 'function' || value === undefined
  },

  // 主题集成
  {
    property: 'theme',
    type: 'optional',
    valueType: 'ThemeOverride',
    category: 'theme',
    validation: (value) => typeof value === 'object' || value === undefined
  },

  // 可访问性
  {
    property: 'aria-label',
    type: 'optional',
    valueType: 'string',
    category: 'accessibility',
    validation: (value) => typeof value === 'string' || value === undefined
  },
  {
    property: 'aria-describedby',
    type: 'optional',
    valueType: 'string',
    category: 'accessibility',
    validation: (value) => typeof value === 'string' || value === undefined
  }
];

// 组件特定验证规则
export const COMPONENT_SPECIFIC_RULES: Record<string, APIValidationRule[]> = {
  Button: [
    ...BASE_VALIDATION_RULES,
    {
      property: 'variant',
      type: 'optional',
      valueType: 'string',
      defaultValue: 'primary',
      category: 'styling',
      validation: (value) =>
        value === undefined || STANDARD_VARIANTS.button.includes(value as any)
    },
    {
      property: 'size',
      type: 'optional',
      valueType: 'string',
      defaultValue: 'md',
      category: 'styling',
      validation: (value) =>
        value === undefined || STANDARD_SIZES.includes(value as any)
    },
    {
      property: 'loading',
      type: 'optional',
      valueType: 'boolean',
      defaultValue: false,
      category: 'core',
      validation: (value) => typeof value === 'boolean' || value === undefined
    }
  ],

  Input: [
    ...BASE_VALIDATION_RULES,
    {
      property: 'variant',
      type: 'optional',
      valueType: 'string',
      defaultValue: 'default',
      category: 'styling',
      validation: (value) =>
        value === undefined || STANDARD_VARIANTS.input.includes(value as any)
    },
    {
      property: 'size',
      type: 'optional',
      valueType: 'string',
      defaultValue: 'md',
      category: 'styling',
      validation: (value) =>
        value === undefined || STANDARD_SIZES.includes(value as any)
    },
    {
      property: 'placeholder',
      type: 'optional',
      valueType: 'string',
      category: 'core',
      validation: (value) => typeof value === 'string' || value === undefined
    },
    {
      property: 'value',
      type: 'optional',
      valueType: 'string | number',
      category: 'core',
      validation: (value) =>
        value === undefined || typeof value === 'string' || typeof value === 'number'
    },
    {
      property: 'error',
      type: 'optional',
      valueType: 'boolean | string',
      category: 'feedback',
      validation: (value) =>
        value === undefined || typeof value === 'boolean' || typeof value === 'string'
    }
  ],

  Card: [
    ...BASE_VALIDATION_RULES.filter(rule => rule.property !== 'onClick'),
    {
      property: 'variant',
      type: 'optional',
      valueType: 'string',
      defaultValue: 'default',
      category: 'styling',
      validation: (value) =>
        value === undefined || STANDARD_VARIANTS.card.includes(value as any)
    },
    {
      property: 'elevated',
      type: 'deprecated',
      valueType: 'boolean',
      category: 'styling',
      deprecationWarning: 'Use variant="elevated" instead of elevated prop',
      validation: (value) => typeof value === 'boolean' || value === undefined
    }
  ],

  Modal: [
    ...BASE_VALIDATION_RULES,
    {
      property: 'open',
      type: 'required',
      valueType: 'boolean',
      category: 'core',
      validation: (value) => typeof value === 'boolean'
    },
    {
      property: 'onClose',
      type: 'required',
      valueType: 'function',
      category: 'event',
      validation: (value) => typeof value === 'function'
    },
    {
      property: 'variant',
      type: 'optional',
      valueType: 'string',
      defaultValue: 'default',
      category: 'styling',
      validation: (value) =>
        value === undefined || STANDARD_VARIANTS.modal.includes(value as any)
    },
    {
      property: 'size',
      type: 'optional',
      valueType: 'string',
      defaultValue: 'md',
      category: 'styling',
      validation: (value) =>
        value === undefined || ['sm', 'md', 'lg', 'xl', 'fullscreen'].includes(value as any)
    }
  ]
};

export class APIConsistencyValidator {
  private rules: Record<string, APIValidationRule[]>;
  private componentDefinitions: Map<string, ComponentAPIDefinition> = new Map();

  constructor() {
    this.rules = {
      base: BASE_VALIDATION_RULES,
      ...COMPONENT_SPECIFIC_RULES
    };
  }

  /**
   * 扫描并解析组件文件
   */
  async scanComponents(rootPath: string): Promise<ComponentAPIDefinition[]> {
    const componentFiles = await glob(`${rootPath}/**/*.{tsx,ts}`, {
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**', '**/dist/**']
    });

    const definitions: ComponentAPIDefinition[] = [];

    for (const filePath of componentFiles) {
      const definition = await this.parseComponentFile(filePath);
      if (definition) {
        definitions.push(definition);
        this.componentDefinitions.set(definition.name, definition);
      }
    }

    return definitions;
  }

  /**
   * 解析组件文件以提取 API 定义
   */
  private async parseComponentFile(filePath: string): Promise<ComponentAPIDefinition | null> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const fileName = basename(filePath, extname(filePath));

      // 基础解析 - 这里可以扩展为更复杂的 AST 解析
      const props = this.extractPropsFromContent(content);
      const category = this.determineComponentCategory(filePath, content);

      return {
        name: fileName,
        filePath,
        props,
        validationRules: this.getValidationRules(fileName),
        category
      };
    } catch (error) {
      console.warn(`Failed to parse component file: ${filePath}`, error);
      return null;
    }
  }

  /**
   * 从文件内容中提取 props 定义
   */
  private extractPropsFromContent(content: string): PropDefinition[] {
    const props: PropDefinition[] = [];

    // 使用正则表达式提取接口定义
    const interfaceRegex = /interface\s+(\w*Props)\s*{([^}]+)}/gs;
    let match;

    while ((match = interfaceRegex.exec(content)) !== null) {
      const interfaceContent = match[2];
      const propMatches = interfaceContent.matchAll(/(\w+)(\?)?:\s*([^;]+);/g);

      for (const propMatch of propMatches) {
        const [_, name, optional, type] = propMatch;

        props.push({
          name,
          type: type.trim(),
          required: !optional,
          defaultValue: undefined, // 需要进一步解析
          description: undefined,
          deprecated: type.includes('deprecated') || name.includes('deprecated')
        });
      }
    }

    return props;
  }

  /**
   * 确定组件类别
   */
  private determineComponentCategory(filePath: string, content: string): ComponentCategory {
    const pathLower = filePath.toLowerCase();
    const contentLower = content.toLowerCase();

    if (pathLower.includes('/layout/') || pathLower.includes('grid') || pathLower.includes('flex')) {
      return 'layout';
    } else if (pathLower.includes('/navigation/') || contentLower.includes('nav') || contentLower.includes('menu')) {
      return 'navigation';
    } else if (pathLower.includes('/feedback/') || contentLower.includes('alert') || contentLower.includes('toast')) {
      return 'feedback';
    } else if (pathLower.includes('/input/') || contentLower.includes('input') || contentLower.includes('form')) {
      return 'input';
    } else if (pathLower.includes('/display/') || contentLower.includes('card') || contentLower.includes('badge')) {
      return 'display';
    } else if (pathLower.includes('/overlay/') || contentLower.includes('modal') || contentLower.includes('dialog')) {
      return 'overlay';
    } else if (pathLower.includes('/form/')) {
      return 'form';
    } else {
      return 'utility';
    }
  }

  /**
   * 获取组件的验证规则
   */
  private getValidationRules(componentName: string): APIValidationRule[] {
    const specificRules = this.rules[componentName] || [];
    return [...BASE_VALIDATION_RULES, ...specificRules];
  }

  /**
   * 验证单个组件的 API 一致性
   */
  validateComponent(componentName: string): APIValidationResult {
    const definition = this.componentDefinitions.get(componentName);
    if (!definition) {
      return {
        component: componentName,
        valid: false,
        errors: [`Component ${componentName} not found`],
        warnings: [],
        suggestions: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 验证基础属性
    this.validateBasicProperties(definition, errors, warnings, suggestions);

    // 验证命名规范
    this.validateNamingConventions(definition, errors, warnings);

    // 验证类型定义
    this.validateTypeDefinitions(definition, errors, warnings);

    // 验证默认值
    this.validateDefaultValues(definition, errors, warnings);

    // 验证事件处理
    this.validateEventHandlers(definition, errors, warnings);

    // 验证可访问性属性
    this.validateAccessibilityProps(definition, errors, warnings, suggestions);

    return {
      component: componentName,
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * 验证基础属性
   */
  private validateBasicProperties(
    definition: ComponentAPIDefinition,
    errors: string[],
    warnings: string[],
    suggestions: string[]
  ): void {
    const props = definition.props.map(p => p.name);
    const rules = definition.validationRules;

    for (const rule of rules) {
      if (rule.type === 'required' && !props.includes(rule.property)) {
        errors.push(`Missing required property: ${rule.property}`);
      } else if (rule.type === 'recommended' && !props.includes(rule.property)) {
        suggestions.push(`Consider adding recommended property: ${rule.property}`);
      } else if (rule.type === 'deprecated' && props.includes(rule.property)) {
        warnings.push(`Deprecated property found: ${rule.property} - ${rule.deprecationWarning}`);
      }
    }
  }

  /**
   * 验证命名规范
   */
  private validateNamingConventions(
    definition: ComponentAPIDefinition,
    errors: string[],
    warnings: string[]
  ): void {
    for (const prop of definition.props) {
      // 检查布尔值属性命名
      if (prop.type.includes('boolean') && !prop.name.startsWith('is') && !prop.name.startsWith('has') && !prop.name.startsWith('should') && !['disabled', 'loading', 'open'].includes(prop.name)) {
        warnings.push(`Boolean property "${prop.name}" should use is/has/should prefix`);
      }

      // 检查事件处理器命名
      if (prop.type.includes('function') && prop.name.startsWith('on') && !prop.name.match(/^on[A-Z]/)) {
        errors.push(`Event handler "${prop.name}" should use PascalCase after "on" prefix (e.g., onClick)`);
      }

      // 检查 ARIA 属性命名
      if (prop.name.startsWith('aria-') && !prop.name.match(/^aria-[a-z-]+$/)) {
        errors.push(`ARIA property "${prop.name}" should use kebab-case (e.g., aria-label)`);
      }
    }
  }

  /**
   * 验证类型定义
   */
  private validateTypeDefinitions(
    definition: ComponentAPIDefinition,
    errors: string[],
    warnings: string[]
  ): void {
    for (const prop of definition.props) {
      // 检查是否使用了 any 类型
      if (prop.type.includes('any') && !prop.deprecated) {
        errors.push(`Property "${prop.name}" should not use "any" type`);
      }

      // 检查可选属性是否有默认值
      if (!prop.required && !prop.defaultValue && prop.name !== 'children') {
        warnings.push(`Optional property "${prop.name}" should have a default value`);
      }
    }
  }

  /**
   * 验证默认值
   */
  private validateDefaultValues(
    definition: ComponentAPIDefinition,
    errors: string[],
    warnings: string[]
  ): void {
    // 这里可以添加默认值验证逻辑
    // 例如检查默认值是否符合类型定义
  }

  /**
   * 验证事件处理器
   */
  private validateEventHandlers(
    definition: ComponentAPIDefinition,
    errors: string[],
    warnings: string[]
  ): void {
    for (const prop of definition.props) {
      if (prop.type.includes('function')) {
        // 检查事件处理器参数类型
        if (prop.name.startsWith('on') && !prop.type.includes('Event') && !prop.type.includes('React.')) {
          warnings.push(`Event handler "${prop.name}" should specify proper event parameter type`);
        }
      }
    }
  }

  /**
   * 验证可访问性属性
   */
  private validateAccessibilityProps(
    definition: ComponentAPIDefinition,
    errors: string[],
    warnings: string[],
    suggestions: string[]
  ): void {
    const hasInteractiveProps = definition.props.some(prop =>
      prop.type.includes('function') || prop.name === 'disabled'
    );

    if (hasInteractiveProps) {
      const hasAriaLabel = definition.props.some(prop => prop.name === 'aria-label');
      const hasAriaDescribedBy = definition.props.some(prop => prop.name === 'aria-describedby');

      if (!hasAriaLabel && !hasAriaDescribedBy) {
        suggestions.push(`Consider adding aria-label or aria-describedby for better accessibility`);
      }
    }
  }

  /**
   * 验证所有组件
   */
  validateAllComponents(): APIValidationResult[] {
    const results: APIValidationResult[] = [];

    for (const componentName of this.componentDefinitions.keys()) {
      results.push(this.validateComponent(componentName));
    }

    return results;
  }

  /**
   * 生成 API 一致性报告
   */
  generateReport(): APIConsistencyReport {
    const validationResults = this.validateAllComponents();
    const validComponents = validationResults.filter(r => r.valid);
    const invalidComponents = validationResults.filter(r => !r.valid);

    const totalErrors = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = validationResults.reduce((sum, r) => sum + r.warnings.length, 0);
    const totalSuggestions = validationResults.reduce((sum, r) => sum + r.suggestions.length, 0);

    return {
      summary: {
        totalComponents: validationResults.length,
        validComponents: validComponents.length,
        invalidComponents: invalidComponents.length,
        totalErrors,
        totalWarnings,
        totalSuggestions,
        overallScore: Math.max(0, 100 - (totalErrors * 10) - (totalWarnings * 2) - (totalSuggestions * 0.5))
      },
      componentResults: validationResults,
      categoryBreakdown: this.generateCategoryBreakdown(validationResults),
      recommendations: this.generateRecommendations(validationResults)
    };
  }

  /**
   * 生成分类统计
   */
  private generateCategoryBreakdown(results: APIValidationResult[]): Record<ComponentCategory, any> {
    const breakdown: Record<string, any> = {};

    for (const result of results) {
      const definition = this.componentDefinitions.get(result.component);
      if (definition) {
        const category = definition.category;
        if (!breakdown[category]) {
          breakdown[category] = {
            total: 0,
            valid: 0,
            errors: 0,
            warnings: 0,
            suggestions: 0
          };
        }

        breakdown[category].total++;
        if (result.valid) breakdown[category].valid++;
        breakdown[category].errors += result.errors.length;
        breakdown[category].warnings += result.warnings.length;
        breakdown[category].suggestions += result.suggestions.length;
      }
    }

    return breakdown;
  }

  /**
   * 生成改进建议
   */
  private generateRecommendations(results: APIValidationResult[]): string[] {
    const recommendations: string[] = [];

    // 分析常见问题并生成建议
    const commonErrors = this.analyzeCommonErrors(results);
    const commonWarnings = this.analyzeCommonWarnings(results);

    if (commonErrors.missingRequired > 0) {
      recommendations.push(`${commonErrors.missingRequired} components are missing required properties. Consider reviewing base component standards.`);
    }

    if (commonWarnings.naming > 0) {
      recommendations.push(`${commonWarnings.naming} components have naming convention issues. Consider establishing clear naming standards.`);
    }

    if (commonWarnings.accessibility > 0) {
      recommendations.push(`${commonWarnings.accessibility} components could benefit from improved accessibility properties.`);
    }

    return recommendations;
  }

  /**
   * 分析常见错误
   */
  private analyzeCommonErrors(results: APIValidationResult[]) {
    const missingRequired = results.filter(r =>
      r.errors.some(e => e.includes('Missing required property'))
    ).length;

    return { missingRequired };
  }

  /**
   * 分析常见警告
   */
  private analyzeCommonWarnings(results: APIValidationResult[]) {
    const naming = results.filter(r =>
      r.warnings.some(w => w.includes('should use') || w.includes('should use'))
    ).length;

    const accessibility = results.filter(r =>
      r.suggestions.some(s => s.includes('accessibility') || s.includes('aria-'))
    ).length;

    return { naming, accessibility };
  }
}

// 类型定义
export interface APIValidationResult {
  component: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface APIConsistencyReport {
  summary: {
    totalComponents: number;
    validComponents: number;
    invalidComponents: number;
    totalErrors: number;
    totalWarnings: number;
    totalSuggestions: number;
    overallScore: number;
  };
  componentResults: APIValidationResult[];
  categoryBreakdown: Record<ComponentCategory, any>;
  recommendations: string[];
}

// 使用示例
export async function runAPIConsistencyValidation(rootPath: string): Promise<APIConsistencyReport> {
  const validator = new APIConsistencyValidator();

  // 扫描组件
  await validator.scanComponents(rootPath);

  // 生成报告
  return validator.generateReport();
}