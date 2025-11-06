/**
 * @fileoverview withAsyncValidation HOC - 异步验证高阶组件
 * @description 为表单字段提供异步验证功能，支持服务器端验证
 */

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { HOC, ComponentType } from '../types'

/**
 * 异步验证配置
 */
export interface AsyncValidationConfig {
  /**
   * 验证函数
   */
  validator: (value: any) => Promise<boolean | string>

  /**
   * 验证延迟（毫秒）
   */
  delay?: number

  /**
   * 最大重试次数
   */
  maxRetries?: number

  /**
   * 重试延迟（毫秒）
   */
  retryDelay?: number

  /**
   * 是否在值改变时验证
   */
  validateOnChange?: boolean

  /**
   * 是否在失焦时验证
   */
  validateOnBlur?: boolean

  /**
   * 缓存结果
   */
  cacheResults?: boolean

  /**
   * 缓存过期时间（毫秒）
   */
  cacheExpiry?: number
}

/**
 * 异步验证上下文
 */
export interface AsyncValidationContextValue {
  /**
   * 验证结果
   */
  validationResult: {
    isValid: boolean
    isValidating: boolean
    error: string | null
  }

  /**
   * 验证状态
   */
  isValidating: boolean
  isValid: boolean
  error: string | null

  /**
   * 验证方法
   */
  validate: () => Promise<boolean>
  cancelValidation: () => void
  retry: () => Promise<boolean>

  /**
   * 验证历史
   */
  validationHistory: Array<{
    timestamp: number
    value: any
    isValid: boolean
    error?: string
  }>
}

/**
 * 验证结果缓存
 */
const validationCache = new Map<string, {
  result: boolean | string
  timestamp: number
}>()

/**
 * 生成缓存键
 */
function generateCacheKey(value: any, validator: Function): string {
  return `${JSON.stringify(value)}_${validator.toString().slice(0, 50)}`
}

/**
 * withAsyncValidation HOC - 提供异步验证功能
 *
 * @param config 异步验证配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const AsyncInput = withAsyncValidation({
 *   validator: async (email) => {
 *     const response = await fetch('/api/check-email', {
 *       method: 'POST',
 *       body: JSON.stringify({ email })
 *     })
 *     const result = await response.json()
 *     return result.available || '该邮箱已被注册'
 *   },
 *   delay: 500,
 *   validateOnBlur: true
 * })(Input)
 * ```
 */
export function withAsyncValidation<T extends Record<string, any> = {}>(
  config: AsyncValidationConfig
): HOC<T, T & AsyncValidationContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      validator,
      delay = 1000,
      maxRetries = 3,
      retryDelay = 2000,
      validateOnChange = false,
      validateOnBlur = true,
      cacheResults = true,
      cacheExpiry = 5 * 60 * 1000, // 5分钟
    } = config

    const displayName = `withAsyncValidation(${Component.displayName || Component.name || 'Component'})`

    const AsyncValidationComponent = React.forwardRef<any, T & AsyncValidationContextValue>(
      (props, ref) => {
        // 状态
        const [isValidating, setIsValidating] = useState(false)
        const [isValid, setIsValid] = useState(true)
        const [error, setError] = useState<string | null>(null)
        const [validationHistory, setValidationHistory] = useState<Array<{
          timestamp: number
          value: any
          isValid: boolean
          error?: string
        }>>([])

        // refs
        const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
        const validationControllerRef = useRef<AbortController | null>(null)
        const retryCountRef = useRef(0)
        const lastValidationValueRef = useRef<any>(null)

        // 从props获取值
        const {
          value: propValue,
          onChange: propOnChange,
          onBlur: propOnBlur,
          setFieldError,
          getFieldProps,
          ...componentProps
        } = props

        // 执行异步验证
        const executeValidation = useCallback(async (value: any): Promise<boolean> => {
          // 检查缓存
          if (cacheResults) {
            const cacheKey = generateCacheKey(value, validator)
            const cached = validationCache.get(cacheKey)

            if (cached && Date.now() - cached.timestamp < cacheExpiry) {
              const result = cached.result
              if (result !== true) {
                setError(result as string)
                setIsValid(false)
                return false
              }
              setError(null)
              setIsValid(true)
              return true
            }
          }

          // 取消之前的验证
          if (validationControllerRef.current) {
            validationControllerRef.current.abort()
          }

          // 创建新的AbortController
          validationControllerRef.current = new AbortController()
          const { signal } = validationControllerRef.current

          // 延迟验证
          if (delay > 0) {
            await new Promise(resolve => {
              validationTimeoutRef.current = setTimeout(resolve, delay)
            })
          }

          // 检查是否已取消
          if (signal.aborted) {
            return false
          }

          setIsValidating(true)
          setError(null)

          try {
            const result = await validator(value)
            lastValidationValueRef.current = value

            // 检查是否已取消
            if (signal.aborted) {
              return false
            }

            const isValidResult = result === true
            setIsValid(isValidResult)
            setError(isValidResult ? null : (result as string))

            // 更新缓存
            if (cacheResults) {
              const cacheKey = generateCacheKey(value, validator)
              validationCache.set(cacheKey, {
                result,
                timestamp: Date.now(),
              })
            }

            // 记录验证历史
            setValidationHistory(prev => [
              ...prev.slice(-9), // 保留最近10条记录
              {
                timestamp: Date.now(),
                value,
                isValid: isValidResult,
                error: isValidResult ? undefined : (result as string),
              },
            ])

            return isValidResult
          } catch (error) {
            // 验证失败，记录错误
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++
              setError(`验证失败，正在重试...`)

              // 等待重试延迟
              await new Promise(resolve => setTimeout(resolve, retryDelay))

              // 递归重试
              return executeValidation(value)
            } else {
              const errorMessage = error instanceof Error ? error.message : '验证失败'
              setError(errorMessage)
              setIsValid(false)
              retryCountRef.current = 0
              return false
            }
          } finally {
            setIsValidating(false)
          }
        }, [validator, delay, maxRetries, retryDelay, cacheResults, cacheExpiry])

        // 主要验证方法
        const validate = useCallback(async (): Promise<boolean> => {
          const currentValue = propValue || ''
          return executeValidation(currentValue)
        }, [propValue, executeValidation])

        // 取消验证
        const cancelValidation = useCallback(() => {
          if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current)
            validationTimeoutRef.current = null
          }

          if (validationControllerRef.current) {
            validationControllerRef.current.abort()
            validationControllerRef.current = null
          }

          setIsValidating(false)
        }, [])

        // 重试验证
        const retry = useCallback(async (): Promise<boolean> => {
          retryCountRef.current = 0
          return validate()
        }, [validate])

        // 变更处理
        const handleChange = useCallback((newValue: any) => {
          if (propOnChange) {
            propOnChange(newValue)
          }

          if (validateOnChange) {
            // 延迟验证
            setTimeout(() => {
              executeValidation(newValue)
            }, delay)
          }
        }, [propOnChange, validateOnChange, delay, executeValidation])

        // 失焦处理
        const handleBlur = useCallback(() => {
          if (propOnBlur) {
            propOnBlur()
          }

          if (validateOnBlur) {
            executeValidation(propValue || '')
          }
        }, [propOnBlur, validateOnBlur, propValue, executeValidation])

        // 设置字段错误（同步更新）
        useEffect(() => {
          if (setFieldError && error) {
            setFieldError(error)
          }
        }, [error, setFieldError])

        // 清理资源
        useEffect(() => {
          return () => {
            cancelValidation()
          }
        }, [cancelValidation])

        // 传递给组件的增强props
        const enhancedProps = {
          ...componentProps,
          ref,
          value: propValue,
          error,
          isValidating,
          isValid,
          onChange: handleChange,
          onBlur: handleBlur,
          validate,
          cancelValidation,
          retry,
          validationHistory,
          validationResult: {
            isValid,
            isValidating,
            error,
          },
        }

        return <Component {...enhancedProps} />
      }
    )

    AsyncValidationComponent.displayName = displayName

    return AsyncValidationComponent
  }
}

// 便捷导出
export const WithAsyncValidation = withAsyncValidation

// 预设异步验证器
export const createAsyncValidator = (url: string, fieldName: string, errorMessage: string) => {
  return async (value: string) => {
    if (!value || value.trim() === '') return true

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [fieldName]: value }),
      })

      const result = await response.json()
      return result.available || errorMessage
    } catch (error) {
      return errorMessage
    }
  }
}

export const withEmailAvailabilityValidator = (config: {
  apiEndpoint?: string
  errorMessage?: string
}) => {
  const { apiEndpoint = '/api/check-email', errorMessage = '该邮箱已被注册' } = config

  return withAsyncValidation({
    validator: createAsyncValidator(apiEndpoint, 'email', errorMessage),
    delay: 1000,
    validateOnBlur: true,
  })
}

export const withUsernameAvailabilityValidator = (config: {
  apiEndpoint?: string
  errorMessage?: string
}) => {
  const { apiEndpoint = '/api/check-username', errorMessage = '该用户名已被使用' } = config

  return withAsyncValidation({
    validator: createAsyncValidator(apiEndpoint, 'username', errorMessage),
    delay: 1000,
    validateOnBlur: true,
  })
}

export default withAsyncValidation
