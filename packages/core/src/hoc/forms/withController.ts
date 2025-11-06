/**
 * @fileoverview withController HOC - 受控组件高阶组件
 * @description 为表单字段提供受控组件功能，与React Hook Form兼容
 */

import React, { forwardRef, useState, useEffect } from 'react'
import { HOC, ComponentType } from '../types'

/**
 * 控制器配置接口
 */
export interface ControllerConfig {
  /**
   * 字段名
   */
  name: string

  /**
   * 默认值
   */
  defaultValue?: any

  /**
   * 规则
   */
  rules?: {
    required?: boolean | string
    min?: number | { value: number; message?: string }
    max?: number | { value: number; message?: string }
    minLength?: number | { value: number; message?: string }
    maxLength?: number | { value: number; message?: string }
    pattern?: RegExp | { value: RegExp; message?: string }
    validate?: (value: any) => boolean | string
  }

  /**
   * 转换值函数
   */
  transformValue?: (value: any) => any

  /**
   * 转换显示值函数
   */
  transformDisplayValue?: (value: any) => any

  /**
   * 自定义控制逻辑
   */
  control?: (value: any, onChange: (value: any) => void) => {
    value: any
    onChange: (value: any) => void
    onBlur: () => void
  }
}

/**
 * 控制器上下文接口
 */
export interface ControllerContextValue {
  /**
   * 字段值
   */
  value: any

  /**
   * 显示值
   */
  displayValue: any

  /**
   * 字段错误
   */
  error?: string

  /**
   * 字段状态
   */
  isValid: boolean
  isDirty: boolean
  isTouched: boolean

  /**
   * 字段方法
   */
  onChange: (value: any) => void
  onBlur: () => void
  onFocus: () => void

  /**
   * 设置值
   */
  setValue: (value: any) => void

  /**
   * 设置错误
   */
  setError: (error?: string) => void

  /**
   * 清空字段
   */
  clear: () => void

  /**
   * 重置字段
   */
  reset: () => void

  /**
   * 字段元数据
   */
  meta: {
    name: string
    value: any
    displayValue: any
    error?: string
    isValid: boolean
    isDirty: boolean
    isTouched: boolean
  }
}

/**
 * withController HOC - 提供受控组件功能
 *
 * @param config 控制器配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const ControllerInput = withController({
 *   name: 'username',
 *   defaultValue: '',
 *   rules: {
 *     required: '用户名不能为空',
 *     minLength: { value: 3, message: '至少3个字符' }
 *   }
 * })(Input)
 * ```
 */
export function withController<T extends Record<string, any> = {}>(
  config: ControllerConfig
): HOC<T, T & ControllerContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      name,
      defaultValue = '',
      rules = {},
      transformValue,
      transformDisplayValue,
      control,
    } = config

    const displayName = `withController(${Component.displayName || Component.name || 'Component'})`

    const ControllerComponent = forwardRef<any, T & ControllerContextValue>((props, ref) => {
      // 内部状态
      const [internalValue, setInternalValue] = useState(defaultValue)
      const [internalError, setInternalError] = useState<string | undefined>()
      const [isTouched, setIsTouched] = useState(false)

      // 从props获取值
      const {
        value: propValue,
        onChange: propOnChange,
        onBlur: propOnBlur,
        onFocus: propOnFocus,
        error: propError,
        setValue: propSetValue,
        setError: propSetError,
        getFieldProps,
        getFieldMeta,
        ...componentProps
      } = props

      // 决定使用哪个值
      const currentValue = propValue !== undefined ? propValue : internalValue
      const currentError = propError || internalError

      // 转换值
      const displayValue = transformDisplayValue
        ? transformDisplayValue(currentValue)
        : currentValue

      // 验证函数
      const validateField = (value: any): string | undefined => {
        // 必填验证
        if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          const message = typeof rules.required === 'string' ? rules.required : '此字段为必填项'
          return message
        }

        // 数值范围验证
        if (rules.min && value !== undefined && value !== null && value !== '') {
          const min = typeof rules.min === 'object' ? rules.min.value : rules.min
          const message = typeof rules.min === 'object' ? rules.min.message : `最小值为 ${min}`
          if (Number(value) < min) {
            return message
          }
        }

        if (rules.max && value !== undefined && value !== null && value !== '') {
          const max = typeof rules.max === 'object' ? rules.max.value : rules.max
          const message = typeof rules.max === 'object' ? rules.max.message : `最大值为 ${max}`
          if (Number(value) > max) {
            return message
          }
        }

        // 长度验证
        if (rules.minLength && typeof value === 'string') {
          const minLength = typeof rules.minLength === 'object' ? rules.minLength.value : rules.minLength
          const message = typeof rules.minLength === 'object' ? rules.minLength.message : `至少 ${minLength} 个字符`
          if (value.length < minLength) {
            return message
          }
        }

        if (rules.maxLength && typeof value === 'string') {
          const maxLength = typeof rules.maxLength === 'object' ? rules.maxLength.value : rules.maxLength
          const message = typeof rules.maxLength === 'object' ? rules.maxLength.message : `最多 ${maxLength} 个字符`
          if (value.length > maxLength) {
            return message
          }
        }

        // 模式验证
        if (rules.pattern && typeof value === 'string') {
          const pattern = typeof rules.pattern === 'object' ? rules.pattern.value : rules.pattern
          const message = typeof rules.pattern === 'object' ? rules.pattern.message : '格式不正确'
          if (!pattern.test(value)) {
            return message
          }
        }

        // 自定义验证
        if (rules.validate) {
          const result = rules.validate(value)
          if (result !== true) {
            return result as string
          }
        }

        return undefined
      }

      // 变更处理
      const handleChange = (newValue: any) => {
        let processedValue = newValue

        // 应用值转换
        if (transformValue) {
          processedValue = transformValue(newValue)
        }

        if (propSetValue) {
          propSetValue(name, processedValue)
        } else if (propOnChange) {
          propOnChange(processedValue)
        } else {
          setInternalValue(processedValue)
        }

        // 如果不是受控组件，验证新值
        if (propValue === undefined) {
          const error = validateField(processedValue)
          setInternalError(error)
        }

        // 触发外部变更事件
        if (getFieldProps) {
          const fieldProps = getFieldProps(name)
          if (fieldProps.onChange) {
            fieldProps.onChange(processedValue as any)
          }
        }
      }

      // 失焦处理
      const handleBlur = () => {
        setIsTouched(true)

        if (propOnBlur) {
          propOnBlur()
        }

        // 验证字段
        const error = validateField(currentValue)
        setInternalError(error)

        if (getFieldProps) {
          const fieldProps = getFieldProps(name)
          if (fieldProps.onBlur) {
            fieldProps.onBlur()
          }
        }
      }

      // 焦点处理
      const handleFocus = () => {
        if (propOnFocus) {
          propOnFocus()
        }

        if (getFieldProps) {
          const fieldProps = getFieldProps(name)
          if (fieldProps.onFocus) {
            fieldProps.onFocus()
          }
        }
      }

      // 设置值
      const setValue = (value: any) => {
        handleChange(value)
      }

      // 设置错误
      const setError = (error?: string) => {
        if (propSetError) {
          propSetError(name, error)
        } else {
          setInternalError(error)
        }
      }

      // 清空字段
      const clear = () => {
        setValue('')
        setError(undefined)
        setIsTouched(false)
      }

      // 重置字段
      const reset = () => {
        setValue(defaultValue)
        setError(undefined)
        setIsTouched(false)
      }

      // 字段元数据
      const meta = {
        name,
        value: currentValue,
        displayValue,
        error: currentError,
        isValid: !currentError,
        isDirty: JSON.stringify(currentValue) !== JSON.stringify(defaultValue),
        isTouched,
      }

      // 控制器上下文
      const controllerContext: ControllerContextValue = {
        value: currentValue,
        displayValue,
        error: currentError,
        isValid: !currentError,
        isDirty: meta.isDirty,
        isTouched,
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: handleFocus,
        setValue,
        setError,
        clear,
        reset,
        meta,
      }

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        ref,
        name,
        value: currentValue,
        displayValue,
        error: currentError,
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: handleFocus,
        isValid: !currentError,
        isDirty: meta.isDirty,
        isTouched,
        setValue,
        setError,
        clear,
        reset,
        meta,
        controller: controllerContext,
      }

      return <Component {...enhancedProps} />
    })

    ControllerComponent.displayName = displayName

    return ControllerComponent
  }
}

// 便捷导出
export const WithController = withController

// 预设控制器配置
export const withRequiredController = (config: Omit<ControllerConfig, 'rules'>) =>
  withController({
    ...config,
    rules: {
      ...config.rules,
      required: true,
    },
  })

export const withEmailController = (config: Omit<ControllerConfig, 'rules'>) =>
  withController({
    ...config,
    rules: {
      ...config.rules,
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入有效的邮箱地址',
      },
    },
  })

export const withNumberController = (config: Omit<ControllerConfig, 'rules' | 'transformValue'>) =>
  withController({
    ...config,
    transformValue: (value: string) => {
      const num = Number(value)
      return isNaN(num) ? value : num
    },
    rules: {
      ...config.rules,
      validate: (value: number) => {
        if (value !== undefined && value !== null && typeof value === 'number') {
          if (isNaN(value)) return '请输入有效数字'
          return true
        }
        return true
      },
    },
  })

export default withController
