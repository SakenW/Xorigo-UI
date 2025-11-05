/**
 * FormProvider - 表单提供者
 *
 * 提供完整的表单状态管理、验证和处理功能
 * 专注于表单上下文管理，不包含 DOM 表单元素
 */

// ============================================================================
// 1. 核心组件 (Core Component)
// ============================================================================

export { FormProvider } from './form-provider'
export type { FormProviderProps } from './form-provider'

// ============================================================================
// 2. Context 和 Hooks (Context & Hooks)
// ============================================================================

export { useForm } from './form-provider'

// ============================================================================
// 3. 类型定义 (Type Definitions)
// ============================================================================

export type {
  FormValue,
  FormError,
  FormTouched,
  FormValidating,
  FormContextValue,
  FormHelpers,
} from './form-provider'

// ============================================================================
// 4. 组件元数据 (Component Metadata)
// ============================================================================

export const formProviderMetadata = {
  name: 'FormProvider',
  category: 'forms',
  stability: 'stable' as const,
  version: '1.0.0',
  since: 'v0.1.0',

  description: '表单上下文提供者组件，提供完整的表单状态管理、验证和处理功能',

  features: [
    '表单状态管理',
    '字段验证',
    '表单提交处理',
    '嵌套表单支持',
    '动态字段管理',
    'TypeScript 类型安全',
  ],

  // 使用示例
  usage: {
    basic: '使用 FormProvider 包装表单组件，通过 useForm Hook 获取上下文',
    validation: '传递 validate 函数进行表单验证，支持同步和异步验证',
    nested: '支持嵌套对象和数组值管理复杂表单',
  },

  // 与其他组件的关系
  relatedComponents: {
    parents: [],
    children: [],
    siblings: [
      'Form',
      'FormField',
      'Fieldset',
      'ValidationMessage',
      'InputGroup',
      'ButtonGroup',
    ],
  },

  // 技术信息
  technical: {
    layer: 'Component Layer',
    dependencies: ['primitives', 'system', 'foundations'],
    providedContext: 'FormContext',
    requiredHooks: ['useForm'],
  },

  // 文档链接
  documentation: {
    api: '/docs/api/form-provider',
    examples: '/docs/examples/form-provider',
    guide: '/docs/guides/form-provider-guide',
  },

  // 架构对齐
  architectureAlignment: {
    ssotVersion: 'v2025.11.03',
    taxonomyCategory: 'forms',
    layer: 'Component Layer',
    dependencyLevel: 3,
  },
} as const

// ============================================================================
// 5. 工具函数 (Utility Functions)
// ============================================================================

/**
 * 创建表单初始状态
 */
export const createFormInitialState = <T extends Record<string, any>>(
  initialValues: T
) => ({
  values: initialValues,
  errors: {},
  touched: {},
  validating: {},
})

/**
 * 创建表单验证规则
 */
export const createFormValidationRule = <T extends Record<string, any>>(
  validate: (values: T) => Partial<Record<keyof T, string>>
) => validate

// ============================================================================
// 6. 重新导出相关组件 (Re-exports)
// ============================================================================

// 重新导出表单相关类型，便于使用
export type {
  InputProps,
  SelectProps,
  TextareaProps,
  CheckboxProps,
  RadioProps,
  SwitchProps,
  SliderProps,
  ComboboxProps,
} from '../../inputs'

// ============================================================================
// 7. 常量 (Constants)
// ============================================================================

/**
 * 表单验证触发器
 */
export const VALIDATION_TRIGGERS = {
  ON_CHANGE: 'onChange',
  ON_BLUR: 'onBlur',
  ON_SUBMIT: 'onSubmit',
} as const

/**
 * 表单状态
 */
export const FORM_STATUS = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

// ============================================================================
// 8. 默认配置 (Default Configuration)
// ============================================================================

/**
 * FormProvider 默认配置
 */
export const FORM_PROVIDER_DEFAULTS = {
  validateOnChange: true,
  validateOnBlur: true,
  disabled: false,
  readonly: false,
  enableReinitialize: false,
} as const

// ============================================================================
// 9. 类型守卫 (Type Guards)
// ============================================================================

/**
 * 检查是否为有效的表单值
 */
export const isFormValue = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === 'object'
}

/**
 * 检查表单是否有效
 */
export const isFormValid = (errors: FormError): boolean => {
  return Object.keys(errors).length === 0
}

/**
 * 检查表单是否已被修改
 */
export const isFormDirty = (touched: FormTouched): boolean => {
  return Object.values(touched).some(Boolean)
}
