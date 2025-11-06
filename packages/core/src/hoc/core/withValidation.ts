/**
 * @fileoverview withValidation HOC - 表单验证高阶组件
 * @description 为组件提供表单验证功能，支持同步和异步验证、错误显示和字段验证
 */

import React, { forwardRef, useState, useEffect, useMemo } from 'react'
import { HOC, ComponentType, ValidationRule } from '../types'

/**
 * 验证配置接口
 */
export interface ValidationConfig<T = any> {
  rules?: ValidationRule<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnMount?: boolean
  customValidators?: Record<string, (value: any, allValues?: any) => string | boolean>
  asyncValidators?: Record<string, (value: any, allValues?: any) => Promise<string | boolean>>
  debounceMs?: number
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean
  error: string | null
  errors: Record<string, string | null>
}

/**
 * 验证上下文接口
 */
export interface ValidationContextValue {
  value: any
  error: string | null
  isValid: boolean
  isValidating: boolean
  validate: () => Promise<ValidationResult>
  validateField: (fieldName: string) => Promise<string | null>
  validateAll: () => Promise<ValidationResult>
  resetValidation: () => void
  rules: ValidationRule
}

/**
 * 同步验证函数
 */
type SyncValidator = (value: any) => string | boolean

/**
 * 异步验证函数
 */
type AsyncValidator = (value: any) => Promise<string | boolean>

/**
 * withValidation HOC - 为组件注入验证功能
 *
 * @param config 验证配置选项
 * @returns 高阶组件函数
 *
 * @example
 * ```tsx
 * const ValidatedInput = withValidation({
 *   rules: {
 *     required: '用户名不能为空',
 *     minLength: { value: 3, message: '用户名至少3个字符' }
 *   },
 *   validateOnChange: true
 * })(Input)
 * ```
 */
export function withValidation<T extends Record<string, any> = {}>(
  config: ValidationConfig = {}
): HOC<T, T & ValidationContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      rules = {},
      validateOnChange = false,
      validateOnBlur = true,
      validateOnMount = false,
      customValidators = {},
      asyncValidators = {},
      debounceMs = 300,
    } = config

    const displayName = config.displayName || `withValidation(${Component.displayName || Component.name || 'Component'})`

    const ValidationComponent = forwardRef<any, T & ValidationContextValue>((props, ref) => {
      const {
        value: propValue,
        onValidate,
        onValidationChange,
        ...componentProps
      } = props

      // 内部状态
      const [internalValue, setInternalValue] = useState<any>('')
      const [isValidating, setIsValidating] = useState(false)
      const [validationError, setValidationError] = useState<string | null>(null)
      const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({})

      // 当前值
      const currentValue = propValue !== undefined ? propValue : internalValue

      // 验证规则缓存
      const validationRules = useMemo(() => rules, [rules])

      // 执行同步验证
      const executeSyncValidation = (value: any): string | null => {
        // 必填验证
        if (validationRules.required) {
          const requiredMessage = validationRules.required === true ? '此字段为必填项' : validationRules.required
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return requiredMessage as string
          }
        }

        // 最小长度验证
        if (validationRules.minLength && value) {
          const minLen = typeof validationRules.minLength === 'object'
            ? validationRules.minLength.value
            : validationRules.minLength
          const minMessage = typeof validationRules.minLength === 'object'
            ? validationRules.minLength.message
            : `至少需要 ${minLen} 个字符`
          if (typeof value === 'string' && value.length < minLen) {
            return minMessage as string
          }
        }

        // 最大长度验证
        if (validationRules.maxLength && value) {
          const maxLen = typeof validationRules.maxLength === 'object'
            ? validationRules.maxLength.value
            : validationRules.maxLength
          const maxMessage = typeof validationRules.maxLength === 'object'
            ? validationRules.maxLength.message
            : `最多允许 ${maxLen} 个字符`
          if (typeof value === 'string' && value.length > maxLen) {
            return maxMessage as string
          }
        }

        // 模式验证
        if (validationRules.pattern && value) {
          const pattern = typeof validationRules.pattern === 'object'
            ? validationRules.pattern.value
            : validationRules.pattern
          const patternMessage = typeof validationRules.pattern === 'object'
            ? validationRules.pattern.message
            : '格式不正确'
          if (typeof value === 'string' && !pattern.test(value)) {
            return patternMessage as string
          }
        }

        // 自定义验证
        if (validationRules.custom) {
          const customResult = validationRules.custom(value)
          if (customResult !== true) {
            return customResult as string
          }
        }

        // 自定义同步验证器
        for (const [key, validator] of Object.entries(customValidators)) {
          const result = validator(value, currentValue)
          if (result !== true) {
            return result as string
          }
        }

        return null
      }

      // 执行异步验证
      const executeAsyncValidation = async (value: any): Promise<string | null> => {
        const asyncResults = await Promise.all(
          Object.entries(asyncValidators).map(async ([key, validator]) => {
            try {
              const result = await validator(value, currentValue)
              return { key, result }
            } catch (error) {
              return { key, result: '验证失败' }
            }
          })
        )

        for (const { result } of asyncResults) {
          if (result !== true) {
            return result as string
          }
        }

        return null
      }

      // 执行完整验证
      const executeValidation = async (value: any): Promise<ValidationResult> => {
        setIsValidating(true)

        try {
          // 同步验证
          const syncError = executeSyncValidation(value)

          if (syncError) {
            setValidationError(syncError)
            return { isValid: false, error: syncError, errors: validationErrors }
          }

          // 异步验证
          const asyncError = await executeAsyncValidation(value)

          setValidationError(asyncError)

          return {
            isValid: !asyncError,
            error: asyncError,
            errors: validationErrors,
          }
        } finally {
          setIsValidating(false)
        }
      }

      // 验证函数
      const validate = useMemo(() => executeValidation(currentValue), [currentValue])

      // 单个字段验证
      const validateField = async (fieldName: string): Promise<string | null> => {
        const result = await executeValidation(currentValue)
        return result.error
      }

      // 验证所有字段
      const validateAll = async (): Promise<ValidationResult> => {
        const result = await executeValidation(currentValue)
        if (onValidationChange) {
          onValidationChange(result)
        }
        return result
      }

      // 重置验证
      const resetValidation = () => {
        setValidationError(null)
        setValidationErrors({})
        setIsValidating(false)
      }

      // 变更处理
      const handleChange = (value: any, event?: any) => {
        if (propValue === undefined) {
          setInternalValue(value)
        }

        if (validateOnChange && debounceMs === 0) {
          executeValidation(value)
        }

        if (onValidate) {
          onValidate(value, event)
        }
      }

      // 失焦验证
      const handleBlur = () => {
        if (validateOnBlur) {
          executeValidation(currentValue)
        }
      }

      // 初始化验证
      useEffect(() => {
        if (validateOnMount) {
          executeValidation(currentValue)
        }
      }, [])

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        value: currentValue,
        error: validationError,
        isValid: !validationError,
        isValidating,
        validate: executeValidation,
        validateField,
        validateAll,
        resetValidation,
        rules: validationRules,
        onValidate: handleChange,
        onBlur: handleBlur,
      }

      return <Component ref={ref} {...enhancedProps} />
    })

    ValidationComponent.displayName = displayName

    return ValidationComponent
  }
}

// 便捷导出
export const WithValidation = withValidation({})

// 常用验证规则
export const emailValidator = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || '请输入有效的邮箱地址'
}

export const phoneValidator = (value: string) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(value) || '请输入有效的手机号码'
}

export const passwordValidator = (value: string) => {
  if (value.length < 8) return '密码至少8个字符'
  if (!/[A-Z]/.test(value)) return '密码必须包含大写字母'
  if (!/[a-z]/.test(value)) return '密码必须包含小写字母'
  if (!/\d/.test(value)) return '密码必须包含数字'
  return true
}

export default withValidation
