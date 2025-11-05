/**
 * @fileoverview FormGroup 模块导出
 * @description 表单组组件的完整导出，包含所有相关组件和工具
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 */


// ============================================================================
// 主组件导出
// ============================================================================

export { FormGroup, NestedFormGroup } from './form-group'
export type { FormGroupProps, FormGroupContextValue, NestedFormGroupProps } from './form-group'

// ============================================================================
// 样式变体导出
// ============================================================================

export {
  formGroupVariants,
  headerVariants,
  legendVariants,
  descriptionVariants,
  errorSummaryVariants
} from './form-group'

// ============================================================================
// 工具函数导出
// ============================================================================

/**
 * 创建表单组配置
 */
export const createFormGroupConfig = (
  options?: {
    variant?: 'default' | 'bordered' | 'ghost' | 'filled'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    layout?: 'single' | 'grid' | 'double' | 'triple'
    required?: boolean
    disabled?: boolean
    collapsible?: boolean
  }
) => {
  return {
    variant: options?.variant || 'default',
    size: options?.size || 'md',
    layout: options?.layout || 'single',
    required: options?.required || false,
    disabled: options?.disabled || false,
    collapsible: options?.collapsible || false,
  }
}

/**
 * 创建表单组验证规则
 */
export const createFormGroupValidation = (
  validate: (values: any) => string | string[] | undefined
) => {
  return {
    validate,
    // 转换验证结果
    validateAndFormat: (values: any) => {
      const result = validate(values)
      if (!result) return { isValid: true, errors: [] }

      const errors = Array.isArray(result) ? result : [result]
      return { isValid: false, errors }
    },
  }
}

/**
 * 表单组错误类型
 */
export type FormGroupError = {
  field: string
  message: string
}

/**
 * 创建表单组错误汇总
 */
export const createFormGroupErrorSummary = (
  errors: Array<{ field: string; message: string }>
) => {
  return {
    total: errors.length,
    fields: errors.map(err => ({
      name: err.field,
      message: err.message,
    })),
    messages: errors.map(err => err.message),
  }
}

// ============================================================================
// 常量定义
// ============================================================================

/**
 * FormGroup 变体常量
 */
export const FORM_GROUP_VARIANTS = {
  DEFAULT: 'default' as const,
  BORDERED: 'bordered' as const,
  GHOST: 'ghost' as const,
  FILLED: 'filled' as const,
} as const

/**
 * FormGroup 尺寸常量
 */
export const FORM_GROUP_SIZES = {
  SM: 'sm' as const,
  MD: 'md' as const,
  LG: 'lg' as const,
  XL: 'xl' as const,
} as const

/**
 * FormGroup 布局常量
 */
export const FORM_GROUP_LAYOUTS = {
  SINGLE: 'single' as const,
  GRID: 'grid' as const,
  DOUBLE: 'double' as const,
  TRIPLE: 'triple' as const,
} as const

/**
 * FormGroup 默认配置
 */
export const FORM_GROUP_DEFAULTS = {
  variant: 'default' as const,
  size: 'md' as const,
  layout: 'single' as const,
  required: false,
  disabled: false,
  collapsible: false,
  showRequiredIndicator: true,
  showOptionalIndicator: false,
  defaultCollapsed: false,
} as const

// ============================================================================
// 验证规则
// ============================================================================

/**
 * 验证表单组必填字段
 */
export const validateFormGroupRequired = (
  group: {
    fields: Array<{ name: string; value: any; required?: boolean }>
  }
) => {
  const errors: Array<{ field: string; message: string }> = []

  group.fields.forEach(field => {
    if (field.required && (!field.value || field.value.toString().trim() === '')) {
      errors.push({
        field: field.name,
        message: `${field.name} 是必填字段`,
      })
    }
  })

  return errors
}

/**
 * 验证表单组字段格式
 */
export const validateFormGroupFormat = (
  group: {
    fields: Array<{
      name: string
      value: any
      type?: 'email' | 'phone' | 'url' | 'number'
    }>
  }
) => {
  const errors: Array<{ field: string; message: string }> = []

  const validators = {
    email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value: string) => /^[\d\s\-\+\(\)]+$/.test(value),
    url: (value: string) => /^https?:\/\/[^\s]+$/.test(value),
    number: (value: string) => !isNaN(Number(value)),
  }

  group.fields.forEach(field => {
    if (field.type && field.value) {
      const isValid = validators[field.type](field.value)
      if (!isValid) {
        errors.push({
          field: field.name,
          message: `${field.name} 格式不正确`,
        })
      }
    }
  })

  return errors
}

/**
 * 验证表单组字段长度
 */
export const validateFormGroupLength = (
  group: {
    fields: Array<{
      name: string
      value: string
      min?: number
      max?: number
    }>
  }
) => {
  const errors: Array<{ field: string; message: string }> = []

  group.fields.forEach(field => {
    if (typeof field.value === 'string') {
      const length = field.value.length

      if (field.min !== undefined && length < field.min) {
        errors.push({
          field: field.name,
          message: `${field.name} 长度不能少于 ${field.min} 个字符`,
        })
      }

      if (field.max !== undefined && length > field.max) {
        errors.push({
          field: field.name,
          message: `${field.name} 长度不能超过 ${field.max} 个字符`,
        })
      }
    }
  })

  return errors
}

// ============================================================================
// 工具类型
// ============================================================================

/**
 * FormGroup 变体类型
 */
export type FormGroupVariant = typeof FORM_GROUP_VARIANTS[keyof typeof FORM_GROUP_VARIANTS]

/**
 * FormGroup 尺寸类型
 */
export type FormGroupSize = typeof FORM_GROUP_SIZES[keyof typeof FORM_GROUP_SIZES]

/**
 * FormGroup 布局类型
 */
export type FormGroupLayout = typeof FORM_GROUP_LAYOUTS[keyof typeof FORM_GROUP_LAYOUTS]

/**
 * FormGroup 配置类型
 */
export type FormGroupConfig = {
  variant: FormGroupVariant
  size: FormGroupSize
  layout: FormGroupLayout
  required: boolean
  disabled: boolean
  collapsible: boolean
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * 使用表单组状态管理
 */
export const useFormGroup = (initialState?: Partial<FormGroupProps>) => {
  const [state, setState] = React.useState({
    collapsed: initialState?.defaultCollapsed || false,
    errors: initialState?.errors || [],
    ...initialState,
  })

  const setCollapsed = React.useCallback((collapsed: boolean) => {
    setState(prev => ({ ...prev, collapsed }))
  }, [])

  const addError = React.useCallback((field: string, message: string) => {
    setState(prev => ({
      ...prev,
      errors: [...prev.errors, { field, message }],
    }))
  }, [])

  const removeError = React.useCallback((field: string) => {
    setState(prev => ({
      ...prev,
      errors: prev.errors.filter(err => err.field !== field),
    }))
  }, [])

  const clearErrors = React.useCallback(() => {
    setState(prev => ({ ...prev, errors: [] }))
  }, [])

  return {
    ...state,
    setCollapsed,
    addError,
    removeError,
    clearErrors,
  }
}

// ============================================================================
// 组件元数据
// ============================================================================

export const formGroupMetadata = {
  name: 'FormGroup',
  version: '1.0.0',
  category: 'forms',
  layer: 'component',
  stability: 'stable' as const,
  since: 'v1.0.0',
  features: [
    '表单字段分组',
    '组标题和描述',
    '组级别验证',
    '必填组标记',
    '禁用状态',
    '折叠展开',
    '网格布局',
    '响应式设计',
    '嵌套组',
    '错误汇总',
    '自定义间距',
    'TypeScript 类型安全',
    'React Context 集成',
    '可访问性支持',
  ],
  useCases: [
    '用户信息分组',
    '地址信息分组',
    '支付信息分组',
    '多步骤表单',
    '高级设置',
  ],
}

// ============================================================================
// 默认导出
// ============================================================================

export default FormGroup
