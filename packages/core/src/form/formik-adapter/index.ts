/**
 * FormikAdapter - Formik 表单适配器
 *
 * 提供 Formik 表单库与 Xorigo UI 组件的深度集成
 *
 * 主要功能：
 * - Formik 表单状态管理与验证
 * - 支持异步验证和字段级验证
 * - 提供 3 种视觉变体（default、minimal、bordered）
 * - 提供 4 种尺寸规格（sm、md、lg、xl）
 * - 支持提交状态管理和重置功能
 * - 支持表单禁用和只读状态
 * - 4 个自定义 Hook 简化开发
 * - 完整的 TypeScript 类型安全
 * - 全面的可访问性支持
 *
 * @example 基本用法
 * ```tsx
 * <FormikAdapter
 *   initialValues={{ email: '', password: '' }}
 *   onSubmit={(values) => console.log(values)}
 * >
 *   {(formik) => (
 *     <div className="space-y-4">
 *       <Input {...formik.getFieldProps('email')} />
 *       <Input type="password" {...formik.getFieldProps('password')} />
 *     </div>
 *   )}
 * </FormikAdapter>
 * ```
 *
 * @example 带验证
 * ```tsx
 * <FormikAdapter
 *   initialValues={{ email: '' }}
 *   validate={(values) => {
 *     const errors: any = {}
 *     if (!values.email) {
 *       errors.email = 'Required'
 *     }
 *     return errors
 *   }}
 *   onSubmit={(values) => console.log(values)}
 * >
 *   {(formik) => (
 *     <Input {...formik.getFieldProps('email')} />
 *   )}
 * </FormikAdapter>
 * ```
 *
 * @example 使用 Hooks
 * ```tsx
 * const { field, meta } = useFormikField('email')
 * const form = useFormikForm()
 *
 * return (
 *   <Input
 *     {...field}
 *     error={meta.touched && meta.error ? meta.error : undefined}
 *   />
 * )
 * ```
 */

// ============================================================================
// 1. 核心组件 (Core Component)
// ============================================================================

export { FormikAdapter } from './formik-adapter'
export type { FormikAdapterProps } from './formik-adapter'

// ============================================================================
// 2. Hooks (自定义钩子)
// ============================================================================

// useFormikAdapter - 获取 FormikAdapter 上下文
export { useFormikAdapter } from './formik-adapter'

// useFormikField - 获取 Formik 字段属性
export { useFormikField } from './formik-adapter'

// useFormikForm - 获取 Formik 表单状态
export { useFormikForm } from './formik-adapter'

// useFormikSubmit - 获取表单提交处理函数
export { useFormikSubmit } from './formik-adapter'

// useFormikReset - 获取表单重置处理函数
export { useFormikReset } from './formik-adapter'

// ============================================================================
// 3. 样式变量 (Style Variants)
// ============================================================================

export { formikAdapterVariants, formContentVariants, submitButtonVariants, resetButtonVariants } from './formik-adapter'
export type { VariantProps as FormikAdapterVariantProps } from './formik-adapter'

// ============================================================================
// 4. 工具类型 (Utility Types)
// ============================================================================

// FormikValues 类型重导出
export type { FormikValues } from 'formik'

// FormikProps 类型重导出（用于泛型支持）
export type { FormikProps } from 'formik'

// FormikConfig 类型重导出
export type { FormikConfig } from 'formik'

// ============================================================================
// 5. 常量 (Constants)
// ============================================================================

/**
 * FormikAdapter 变体常量
 */
export const FORMIK_ADAPTER_VARIANTS = {
  DEFAULT: 'default' as const,
  MINIMAL: 'minimal' as const,
  BORDERED: 'bordered' as const,
} as const

/**
 * FormikAdapter 尺寸常量
 */
export const FORMIK_ADAPTER_SIZES = {
  SM: 'sm' as const,
  MD: 'md' as const,
  LG: 'lg' as const,
  XL: 'xl' as const,
} as const

/**
 * FormikAdapter 默认配置
 */
export const FORMIK_ADAPTER_DEFAULTS = {
  variant: 'default' as const,
  size: 'md' as const,
  disabled: false,
  readonly: false,
  showSubmitButton: true,
  showResetButton: false,
  showSubmittingState: true,
  showValidationErrors: true,
  enableReinitialize: true,
  enableUntouch: true,
  enableResetForm: true,
} as const

// ============================================================================
// 6. 类型守卫 (Type Guards)
// ============================================================================

/**
 * 检查是否为有效的 FormikAdapter 变体
 */
export const isFormikAdapterVariant = (
  variant: string
): variant is keyof typeof FORMIK_ADAPTER_VARIANTS => {
  return Object.keys(FORMIK_ADAPTER_VARIANTS).includes(variant.toUpperCase())
}

/**
 * 检查是否为有效的 FormikAdapter 尺寸
 */
export const isFormikAdapterSize = (
  size: string
): size is keyof typeof FORMIK_ADAPTER_SIZES => {
  return Object.keys(FORMIK_ADAPTER_SIZES).includes(size.toUpperCase())
}

// ============================================================================
// 7. 工具函数 (Utility Functions)
// ============================================================================

/**
 * 创建 FormikAdapter 配置
 */
export const createFormikAdapterConfig = (options?: {
  variant?: 'default' | 'minimal' | 'bordered'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  readonly?: boolean
  showSubmitButton?: boolean
  showResetButton?: boolean
  showSubmittingState?: boolean
  showValidationErrors?: boolean
  enableReinitialize?: boolean
  enableUntouch?: boolean
  enableResetForm?: boolean
  submitButtonLabel?: string
  resetButtonLabel?: string
}) => {
  return {
    ...FORMIK_ADAPTER_DEFAULTS,
    ...options,
  }
}

/**
 * 创建 Formik 字段验证规则
 */
export const createFormikValidationRule = (
  validateFn: (value: any) => string | undefined | Promise<string | undefined>
) => {
  return validateFn
}

/**
 * 创建异步验证函数
 */
export const createAsyncValidator = (
  validatorFn: (value: any) => Promise<boolean>,
  errorMessage: string
) => {
  return async (value: any) => {
    const isValid = await validatorFn(value)
    return isValid ? undefined : errorMessage
  }
}

/**
 * 创建字段必填验证
 */
export const createRequiredValidator = (errorMessage: string = '此字段为必填项') => {
  return (value: any) => {
    if (value === undefined || value === null || value === '') {
      return errorMessage
    }
    if (typeof value === 'string' && value.trim() === '') {
      return errorMessage
    }
    return undefined
  }
}

/**
 * 创建邮箱验证
 */
export const createEmailValidator = (errorMessage: string = '邮箱格式不正确') => {
  return (value: string) => {
    if (!value) {
      return undefined
    }
    const emailRegex = /^\S+@\S+\.\S+$/
    return emailRegex.test(value) ? undefined : errorMessage
  }
}

/**
 * 创建最小长度验证
 */
export const createMinLengthValidator = (
  minLength: number,
  errorMessage?: string
) => {
  const defaultMessage = `至少需要 ${minLength} 个字符`
  return (value: string) => {
    if (!value) {
      return undefined
    }
    return value.length >= minLength ? undefined : (errorMessage || defaultMessage)
  }
}

/**
 * 创建最大长度验证
 */
export const createMaxLengthValidator = (
  maxLength: number,
  errorMessage?: string
) => {
  const defaultMessage = `最多允许 ${maxLength} 个字符`
  return (value: string) => {
    if (!value) {
      return undefined
    }
    return value.length <= maxLength ? undefined : (errorMessage || defaultMessage)
  }
}

// ============================================================================
// 8. 组件元数据 (Component Metadata)
// ============================================================================

/**
 * FormikAdapter 组件元数据
 */
export const formikAdapterMetadata = {
  name: 'FormikAdapter',
  version: '1.0.0',
  category: 'forms',
  stability: 'stable' as const,
  description: 'Formik 表单适配器，提供表单状态管理与 Xorigo UI 组件集成',
  features: [
    'Formik 表单库深度集成',
    '表单验证和错误处理',
    '支持异步验证',
    '支持字段级验证',
    '支持提交状态管理',
    '支持重置功能',
    '支持表单禁用状态',
    '支持实时验证',
    '支持错误消息映射',
    'TypeScript 类型安全',
    '可访问性支持',
  ],
  dependencies: [
    'react',
    'react-dom',
    'formik',
    '@xorigo-ui/core',
  ],
  peerDependencies: [
    'formik',
  ],
} as const

// ============================================================================
// 9. 默认导出 (Default Export)
// ============================================================================

export default FormikAdapter
