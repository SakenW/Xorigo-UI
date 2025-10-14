/**
 * Forms 表单容器 - 表单逻辑
 * 提供表单构建和验证支持的完整表单系统
 */

// ===========================
// 核心表单组件
// ===========================

export { Form, FormField, useForm, useFormField } from './Form'
export type {
  FormProps,
  FormFieldProps,
  FormValue,
  FormError,
  FormContextValue,
  FormFieldContextValue,
  FormHelpers
} from './Form'

// ===========================
// 表单字段组件
// ===========================

export { FormField as FormFieldUI } from './FormField'
export type { FormFieldProps as FormFieldUIProps } from './FormField'
export {
  formFieldVariants,
  labelVariants,
  helperTextVariants,
  errorTextVariants
} from './FormField'

// ===========================
// 字段集组件
// ===========================

export { Fieldset, NestedFieldset } from './Fieldset'
export type { FieldsetProps, NestedFieldsetProps } from './Fieldset'
export { fieldsetVariants, legendVariants, descriptionVariants } from './Fieldset'

// ===========================
// 输入组合组件
// ===========================

export {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  useInputGroup
} from './InputGroup'
export type {
  InputGroupProps,
  InputGroupAddonProps,
  InputGroupInputProps
} from './InputGroup'
export { inputGroupVariants, inputGroupAddonVariants } from './InputGroup'

// ===========================
// 验证消息组件
// ===========================

export { ValidationMessage, ValidationSummary } from './ValidationMessage'
export type {
  ValidationMessageProps,
  ValidationSummaryProps,
  ValidationMessageItem
} from './ValidationMessage'
export {
  validationMessageVariants,
  iconVariants,
  textVariants,
  listVariants
} from './ValidationMessage'

// ===========================
// 便捷导出 - 常用组合
// ===========================

// 表单常用组件重新导出
export {
  Form as FormContainer,
  FormField as FormFieldComponent,
  Fieldset as FormFieldset,
  ValidationMessage as FormValidation,
  InputGroup as FormInputGroup,
} from '.'

// 类型别名
export type {
  FormProps as FormContainerProps,
  FormFieldProps as FormFieldComponentProps,
  FieldsetProps as FormFieldsetProps,
  ValidationMessageProps as FormValidationProps,
  InputGroupProps as FormInputGroupProps,
} from '.'

// ===========================
// 实用工具类型
// ===========================

export type FormValidationRule<T = any> = {
  required?: boolean
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  custom?: (value: T) => string | boolean | Promise<string | boolean>
}

export type FormSchema<T = any> = {
  [K in keyof T]: FormValidationRule<T[K]>
}

export type FormSubmitHandler<T = any> = (values: T, helpers: import('./Form').FormHelpers) => void | Promise<void>

export type FormAsyncValidationRule<T = any> = {
  validate: (value: T) => Promise<string | boolean>
  debounce?: number
}

// ===========================
// React Hook Form 集成
// ===========================

export interface UseFormIntegrationProps<T = any> {
  defaultValues?: T
  validationSchema?: FormSchema<T>
  onSubmit?: FormSubmitHandler<T>
  mode?: 'onSubmit' | 'onChange' | 'onBlur' | 'onTouched'
  revalidateMode?: 'onChange' | 'onBlur'
  shouldFocusError?: boolean
  shouldUnregister?: boolean
  shouldUseNativeValidation?: boolean
  delayError?: number
}

// ===========================
// 常用验证规则
// ===========================

export const commonValidationRules = {
  required: (message = '此字段为必填项') => ({
    required: true,
    custom: (value: any) => {
      if (value === undefined || value === null || value === '') {
        return message
      }
      return true
    },
  }),

  email: (message = '请输入有效的邮箱地址') => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || message
    },
  }),

  minLength: (min: number, message?: string) => ({
    minLength: min,
    custom: (value: string) => {
      if (!value) return true
      return value.length >= min || (message || `最少需要 ${min} 个字符`)
    },
  }),

  maxLength: (max: number, message?: string) => ({
    maxLength: max,
    custom: (value: string) => {
      if (!value) return true
      return value.length <= max || (message || `最多允许 ${max} 个字符`)
    },
  }),

  pattern: (regex: RegExp, message = '格式不正确') => ({
    pattern: regex,
    custom: (value: string) => {
      if (!value) return true
      return regex.test(value) || message
    },
  }),

  phone: (message = '请输入有效的手机号码') => ({
    pattern: /^1[3-9]\d{9}$/,
    custom: (value: string) => {
      if (!value) return true
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(value) || message
    },
  }),

  url: (message = '请输入有效的网址') => ({
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return message
      }
    },
  }),

  number: (message = '请输入有效的数字') => ({
    custom: (value: any) => {
      if (!value) return true
      return !isNaN(Number(value)) || message
    },
  }),

  positive: (message = '请输入正数') => ({
    custom: (value: any) => {
      if (!value) return true
      const num = Number(value)
      return (num > 0) || message
    },
  }),

  integer: (message = '请输入整数') => ({
    custom: (value: any) => {
      if (!value) return true
      return Number.isInteger(Number(value)) || message
    },
  }),
}

// ===========================
// 表单状态枚举
// ===========================

export enum FormStatus {
  IDLE = 'idle',
  VALIDATING = 'validating',
  SUBMITTING = 'submitting',
  SUBMITTED = 'submitted',
  ERROR = 'error',
}

export enum ValidationStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  PENDING = 'pending',
  UNTOUCHED = 'untouched',
}

// ===========================
// 默认配置
// ===========================

export const defaultFormConfig = {
  validateOnChange: true,
  validateOnBlur: true,
  reinitializeOnPropsChange: false,
  shouldFocusError: true,
  delayError: 100,
}

// ===========================
// 主题集成
// ===========================

export const formThemeConfig = {
  // 表单容器样式
  container: {
    default: 'space-y-6',
    compact: 'space-y-3',
    spaced: 'space-y-8',
  },

  // 字段样式
  field: {
    default: 'flex flex-col space-y-2',
    stacked: 'flex flex-col space-y-1',
    inline: 'flex items-center space-x-3',
    floating: 'relative',
  },

  // 标签样式
  label: {
    default: 'text-sm font-medium text-gray-700 dark:text-gray-300',
    stacked: 'text-xs font-medium text-gray-600 dark:text-gray-400',
    inline: 'text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap',
    floating: 'text-sm font-medium text-gray-700 dark:text-gray-300',
  },

  // 错误样式
  error: {
    default: 'text-xs text-red-600 dark:text-red-400 mt-1',
    stacked: 'text-xs text-red-600 dark:text-red-400',
    inline: 'text-xs text-red-600 dark:text-red-400 ml-2',
    floating: 'text-xs text-red-600 dark:text-red-400 mt-1',
  },
}