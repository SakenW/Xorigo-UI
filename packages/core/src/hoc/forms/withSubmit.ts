/**
 * @fileoverview withSubmit HOC - 提交处理高阶组件
 * @description 为表单提供高级提交功能，包括防重复提交、加载状态、错误处理等
 */

import React, { useState, useCallback, useRef } from 'react'
import { HOC, ComponentType, FormSubmitHandler } from '../types'

/**
 * 提交配置接口
 */
export interface SubmitConfig<Values = Record<string, any>> {
  /**
   * 提交处理函数
   */
  onSubmit: FormSubmitHandler<Values>

  /**
   * 是否防重复提交
   */
  preventDoubleSubmit?: boolean

  /**
   * 提交前验证函数
   */
  validate?: (values: Values) => Promise<boolean> | boolean

  /**
   * 提交成功回调
   */
  onSuccess?: (values: Values, result?: any) => void

  /**
   * 提交失败回调
   */
  onError?: (error: Error, values: Values) => void

  /**
   * 提交中断回调
   */
  onAbort?: (values: Values) => void

  /**
   * 重置表单的函数
   */
  resetForm?: (values: Values) => void

  /**
   * 最大重试次数
   */
  maxRetries?: number

  /**
   * 重试延迟（毫秒）
   */
  retryDelay?: number

  /**
   * 提交超时时间（毫秒）
   */
  timeout?: number

  /**
   * 提交加载延迟（毫秒）
   */
  loadingDelay?: number

  /**
   * 是否在提交成功后重置表单
   */
  resetOnSuccess?: boolean

  /**
   * 是否在提交成功后清空表单
   */
  clearOnSuccess?: boolean

  /**
   * 是否在提交失败后重试
   */
  retryOnError?: boolean
}

/**
 * 提交状态接口
 */
export interface SubmitState {
  isSubmitting: boolean
  isLoading: boolean
  hasSubmitted: boolean
  lastSubmitTime: number
  submitCount: number
  lastResult: any
  lastError: Error | null
  retryCount: number
}

/**
 * 提交上下文接口
 */
export interface SubmitContextValue {
  /**
   * 提交状态
   */
  submitState: SubmitState

  /**
   * 提交方法
   */
  submit: (values: any) => Promise<void>

  /**
   * 重试方法
   */
  retry: () => Promise<void>

  /**
   * 重置提交状态
   */
  reset: () => void

  /**
   * 取消提交
   */
  abort: () => void

  /**
   * 检查是否可以提交
   */
  canSubmit: () => boolean
}

/**
 * withSubmit HOC - 提供高级提交功能
 *
 * @param config 提交配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const SubmitButton = withSubmit({
 *   onSubmit: async (values) => {
 *     const response = await fetch('/api/submit', {
 *       method: 'POST',
 *       body: JSON.stringify(values)
 *     })
 *     return response.json()
 *   },
 *   preventDoubleSubmit: true,
 *   onSuccess: (result) => {
 *     console.log('Success:', result)
 *   },
 *   onError: (error) => {
 *     console.error('Error:', error)
 *   }
 * })(Button)
 * ```
 */
export function withSubmit<Values = Record<string, any>, T extends Record<string, any> = {}>(
  config: SubmitConfig<Values>
): HOC<T, T & SubmitContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      onSubmit,
      preventDoubleSubmit = true,
      validate,
      onSuccess,
      onError,
      onAbort,
      resetForm,
      maxRetries = 3,
      retryDelay = 2000,
      timeout = 30000,
      loadingDelay = 300,
      resetOnSuccess = false,
      clearOnSuccess = false,
      retryOnError = false,
    } = config

    const displayName = `withSubmit(${Component.displayName || Component.name || 'Component'})`

    const SubmitComponent = React.forwardRef<any, T & SubmitContextValue>((props, ref) => {
      // 提交状态
      const [submitState, setSubmitState] = useState<SubmitState>({
        isSubmitting: false,
        isLoading: false,
        hasSubmitted: false,
        lastSubmitTime: 0,
        submitCount: 0,
        lastResult: null,
        lastError: null,
        retryCount: 0,
      })

      // refs
      const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
      const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
      const submitControllerRef = useRef<AbortController | null>(null)

      // 从props获取表单数据
      const {
        values,
        errors,
        isValid,
        handleSubmit: propHandleSubmit,
        onSubmit: propOnSubmit,
        ...componentProps
      } = props

      // 检查是否可以提交
      const canSubmit = useCallback(() => {
        if (submitState.isSubmitting) return false
        if (preventDoubleSubmit && submitState.lastSubmitTime > 0) {
          // 检查是否在防重复提交窗口内
          const timeSinceLastSubmit = Date.now() - submitState.lastSubmitTime
          if (timeSinceLastSubmit < 1000) return false
        }
        return true
      }, [submitState.isSubmitting, submitState.lastSubmitTime, preventDoubleSubmit])

      // 执行提交
      const executeSubmit = useCallback(async (submitValues: Values): Promise<void> => {
        // 创建取消控制器
        submitControllerRef.current = new AbortController()
        const { signal } = submitControllerRef.current

        // 设置超时
        if (timeout > 0) {
          submitTimeoutRef.current = setTimeout(() => {
            submitControllerRef.current?.abort()
          }, timeout)
        }

        // 设置加载状态延迟
        if (loadingDelay > 0) {
          loadingTimeoutRef.current = setTimeout(() => {
            setSubmitState(prev => ({ ...prev, isLoading: true }))
          }, loadingDelay)
        }

        try {
          setSubmitState(prev => ({
            ...prev,
            isSubmitting: true,
            hasSubmitted: true,
            retryCount: prev.retryCount + 1,
          }))

          // 执行提交
          const result = await onSubmit(submitValues)

          // 检查是否已取消
          if (signal.aborted) {
            onAbort?.(submitValues)
            return
          }

          // 清除超时
          if (submitTimeoutRef.current) {
            clearTimeout(submitTimeoutRef.current)
          }

          // 更新状态
          setSubmitState(prev => ({
            ...prev,
            isSubmitting: false,
            isLoading: false,
            lastSubmitTime: Date.now(),
            submitCount: prev.submitCount + 1,
            lastResult: result,
            lastError: null,
            retryCount: 0,
          }))

          // 执行成功回调
          onSuccess?.(submitValues, result)

          // 重置或清空表单
          if (resetOnSuccess && resetForm) {
            resetForm(submitValues)
          } else if (clearOnSuccess && resetForm) {
            resetForm({} as Values)
          }

        } catch (error) {
          // 清除超时
          if (submitTimeoutRef.current) {
            clearTimeout(submitTimeoutRef.current)
          }

          const errorObj = error instanceof Error ? error : new Error(String(error))

          setSubmitState(prev => ({
            ...prev,
            isSubmitting: false,
            isLoading: false,
            lastSubmitTime: Date.now(),
            lastError: errorObj,
            retryCount: prev.retryCount + 1,
          }))

          // 执行错误回调
          onError?.(errorObj, submitValues)

          // 自动重试
          if (retryOnError && submitState.retryCount < maxRetries) {
            setTimeout(() => {
              executeSubmit(submitValues)
            }, retryDelay)
          }
        } finally {
          // 清理资源
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current)
            setSubmitState(prev => ({ ...prev, isLoading: false }))
          }

          submitControllerRef.current = null
        }
      }, [
        onSubmit,
        onSuccess,
        onError,
        onAbort,
        resetForm,
        resetOnSuccess,
        clearOnSuccess,
        timeout,
        loadingDelay,
        retryOnError,
        maxRetries,
        retryDelay,
        submitState.retryCount,
      ])

      // 主要提交方法
      const submit = useCallback(async (submitValues?: Values) => {
        const valuesToSubmit = submitValues || values

        // 检查是否可以提交
        if (!canSubmit()) {
          return
        }

        // 验证表单
        if (validate) {
          const isValid = await validate(valuesToSubmit)
          if (!isValid) {
            return
          }
        }

        // 执行提交
        await executeSubmit(valuesToSubmit as Values)
      }, [values, validate, executeSubmit, canSubmit])

      // 重试方法
      const retry = useCallback(async () => {
        if (submitState.lastError && !submitState.isSubmitting) {
          setSubmitState(prev => ({ ...prev, retryCount: 0 }))
          await executeSubmit(values as Values)
        }
      }, [submitState.lastError, submitState.isSubmitting, executeSubmit, values])

      // 重置提交状态
      const reset = useCallback(() => {
        setSubmitState({
          isSubmitting: false,
          isLoading: false,
          hasSubmitted: false,
          lastSubmitTime: 0,
          submitCount: 0,
          lastResult: null,
          lastError: null,
          retryCount: 0,
        })

        // 清理资源
        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current)
        }
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
        }
        if (submitControllerRef.current) {
          submitControllerRef.current.abort()
        }
      }, [])

      // 取消提交
      const abort = useCallback(() => {
        submitControllerRef.current?.abort()
        setSubmitState(prev => ({
          ...prev,
          isSubmitting: false,
          isLoading: false,
        }))
      }, [])

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        ref,
        values,
        errors,
        isValid,
        isSubmitting: submitState.isSubmitting,
        isLoading: submitState.isLoading,
        hasSubmitted: submitState.hasSubmitted,
        lastSubmitTime: submitState.lastSubmitTime,
        submitCount: submitState.submitCount,
        lastResult: submitState.lastResult,
        lastError: submitState.lastError,
        retryCount: submitState.retryCount,
        disabled: submitState.isSubmitting,
        'aria-busy': submitState.isSubmitting,
        'aria-disabled': submitState.isSubmitting,
        submit,
        retry,
        reset,
        abort,
        canSubmit,
        submitState,
      }

      return <Component {...enhancedProps} />
    })

    SubmitComponent.displayName = displayName

    return SubmitComponent
  }
}

// 便捷导出
export const WithSubmit = withSubmit

// 预设提交配置
export const withAutoRetrySubmit = <Values = Record<string, any>>(
  config: Omit<SubmitConfig<Values>, 'retryOnError' | 'maxRetries' | 'retryDelay'>
) => withSubmit({
  ...config,
  retryOnError: true,
  maxRetries: 3,
  retryDelay: 2000,
})

export const withQuickSubmit = <Values = Record<string, any>>(
  config: Omit<SubmitConfig<Values>, 'loadingDelay' | 'timeout'>
) => withSubmit({
  ...config,
  loadingDelay: 100,
  timeout: 15000,
})

export const withSafeSubmit = <Values = Record<string, any>>(
  config: Omit<SubmitConfig<Values>, 'preventDoubleSubmit' | 'validate'>
) => withSubmit({
  ...config,
  preventDoubleSubmit: true,
  validate: (values: Values) => Object.keys(values).length > 0,
})

export default withSubmit
