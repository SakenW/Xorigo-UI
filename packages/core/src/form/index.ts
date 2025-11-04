/**
 * Forms category - 表单管理与校验分类
 *
 * 提供 6 个核心表单管理组件，专注表单结构、布局、校验和状态管理
 * 与 SSOT v2025.11.03 架构严格对齐：forms = 表单结构与校验
 *
 * 组件清单：
 * 1. Form - 表单容器，提供数据管理和提交逻辑
 * 2. FormField - 字段容器，整合标签、输入、错误提示
 * 3. Fieldset - 字段集，支持分组和图例
 * 4. ValidationMessage - 校验消息，统一错误/警告/成功提示
 * 5. InputGroup - 输入组，前后缀组合布局
 * 6. ButtonGroup - 按钮组，互斥/多选按钮布局
 *
 * 与 inputs 分类的关系：
 * - forms 专注于表单管理和校验逻辑
 * - inputs 专注于具体的输入控件实现
 * - 两者配合使用，提供完整的表单解决方案
 *
 * 技术特性：
 * ✅ 完整的表单状态管理
 * ✅ 内置校验引擎和规则系统
 * ✅ 关联校验和条件校验
 * ✅ 表单数据分析和统计
 * ✅ 多步表单支持
 * ✅ 无障碍访问优化
 */

// ============================================================================
// 1. 核心表单组件 (Core Form Components)
// ============================================================================

// Form - 表单容器
export { Form } from './form'
export type { FormProps, FormValues, FormErrors, FormTouched } from './form'

// FormField - 字段容器
export { FormField } from './form-field'
export type { FormFieldProps, FormFieldState } from './form-field'

// ============================================================================
// 2. 表单布局组件 (Form Layout Components)
// ============================================================================

// Fieldset - 字段集
export { Fieldset } from './fieldset'
export type { FieldsetProps, FieldsetState } from './fieldset'

// InputGroup - 输入组（前后缀组合）
export { InputGroup } from './input-group'
export type { InputGroupProps, InputGroupSlot } from './input-group'

// ButtonGroup - 按钮组
export { ButtonGroup } from './button-group'
export type { ButtonGroupProps, ButtonGroupVariant } from './button-group'

// ============================================================================
// 3. 表单校验组件 (Form Validation Components)
// ============================================================================

// ValidationMessage - 校验消息
export { ValidationMessage } from './validation-message'
export type { ValidationMessageProps, ValidationType, ValidationState } from './validation-message'

// ============================================================================
// 4. 类型重导出 (Type Re-exports)
// ============================================================================

// 表单相关类型定义
export type {
  // 表单状态类型
  FormState,
  FormStatus,
  FormMode,

  // 校验相关类型
  ValidationRule,
  ValidationSchema,
  ValidationTrigger,
  ValidateResult,

  // 字段相关类型
  FieldName,
  FieldValue,
  FieldError,
  FieldTouched,

  // 事件类型
  FormSubmitHandler,
  FormResetHandler,
  FormChangeHandler,
  FieldChangeHandler,

  // 工具类型
  FormikLikeValues,
  FormikLikeErrors,
  FormikLikeTouched
} from '../types'

// 重导出 inputs 分类组件（便于使用）
// 注意：这里仅重导出类型，实际组件从 inputs 分类导入
export type {
  // 基础输入控件类型
  InputProps as FormInputProps,
  SelectProps as FormSelectProps,
  TextareaProps as FormTextareaProps,
  CheckboxProps as FormCheckboxProps,
  RadioProps as FormRadioProps,
  SwitchProps as FormSwitchProps,
  SliderProps as FormSliderProps,
  ComboboxProps as FormComboboxProps,
  InputNumberProps as FormInputNumberProps,
  PasswordInputProps as FormPasswordInputProps,
  SearchInputProps as FormSearchInputProps
} from '../inputs'

// ============================================================================
// 5. 组件元数据 (Component Metadata)
// ============================================================================

/**
 * forms 分类组件元数据
 * 符合 v2025.11.03 SSOT 规范
 */
export const formsCategoryMetadata = {
  category: 'forms',
  title: '表单管理与校验',
  description: '专注于表单结构、布局、校验和状态管理的核心组件，与 inputs 分类配合提供完整表单解决方案',
  componentCount: 6,
  stability: 'stable' as const,

  // 组件列表
  components: [
    {
      name: 'Form',
      description: '表单容器，提供数据管理和提交逻辑',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['受控/非受控模式', '表单校验', '提交/重置', '多步表单']
    },
    {
      name: 'FormField',
      description: '字段容器，整合标签、输入、错误提示',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['标签管理', '错误显示', '描述文本', '必填标识']
    },
    {
      name: 'Fieldset',
      description: '字段集，支持分组和图例',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['字段分组', '图例标题', '禁用状态', '嵌套支持']
    },
    {
      name: 'ValidationMessage',
      description: '校验消息，统一错误/警告/成功提示',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['多种状态', '图标支持', '动画效果', '无障碍访问']
    },
    {
      name: 'InputGroup',
      description: '输入组，前后缀组合布局',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['前缀后缀', '组合布局', '紧凑模式', '主题适配']
    },
    {
      name: 'ButtonGroup',
      description: '按钮组，互斥/多选按钮布局',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['互斥选择', '多选模式', '垂直布局', '按钮变体']
    }
  ],

  // 设计原则
  designPrinciples: [
    '职责分离：forms 管理逻辑，inputs 提供控件',
    '完整的表单状态管理',
    '内置校验引擎',
    '关联校验支持',
    '无障碍访问优先'
  ],

  // 使用指南
  usage: {
    basic: '使用 Form 作为容器，FormField 包装字段，ValidationMessage 显示错误',
    validation: '内置校验规则，支持自定义校验函数和异步校验',
    layout: 'InputGroup 和 ButtonGroup 提供组合布局',
    accessibility: '完整的 ARIA 支持和键盘导航'
  },

  // 与 inputs 分类的关系
  relationshipWithInputs: {
    dependency: 'forms 依赖 inputs 提供具体输入控件',
    collaboration: 'forms 提供管理逻辑，inputs 提供交互能力',
    separation: '清晰的职责边界，避免功能重叠',
    integration: '通过 props 和回调无缝集成'
  },

  // 架构对齐
  architectureAlignment: {
    ssotVersion: 'v2025.11.03',
    taxonomyCategory: 'forms',
    layer: 'Component Layer',
    dependencyLevel: 4,
    dependencies: ['inputs', 'primitives', 'system', 'foundations']
  }
} as const

// ============================================================================
// 6. 工具函数 (Utility Functions)
// ============================================================================

/**
 * 创建表单校验规则
 */
export const createValidationRule = (
  rule: Omit<ValidationRule, 'id'>
): ValidationRule => ({
  ...rule,
  id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9)
})

/**
 * 创建表单初始状态
 */
export const createFormState = <T extends Record<string, any>>(
  initialValues: T
): {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
} => ({
  values: initialValues,
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true
})