/**
 * @fileoverview withField HOC - 字段增强高阶组件
 * @description 为表单字段组件提供增强功能，包括标签、错误显示、帮助文本等
 */

import React, { forwardRef, useMemo } from 'react'
import { HOC, ComponentType } from '../types'

/**
 * 字段配置接口
 */
export interface FieldConfig {
  /**
   * 字段名
   */
  name: string

  /**
   * 标签文本
   */
  label?: string

  /**
   * 帮助文本
   */
  helperText?: string

  /**
   * 占位符文本
   */
  placeholder?: string

  /**
   * 是否必填
   */
  required?: boolean

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 是否只读
   */
  readOnly?: boolean

  /**
   * 自定义标签类名
   */
  labelClassName?: string

  /**
   * 自定义输入框类名
   */
  inputClassName?: string

  /**
   * 自定义错误类名
   */
  errorClassName?: string

  /**
   * 自定义帮助文本类名
   */
  helperClassName?: string
}

/**
 * 字段上下文接口
 */
export interface FieldContextValue {
  /**
   * 字段配置
   */
  config: FieldConfig

  /**
   * 字段元数据
   */
  meta: {
    value: any
    error?: string
    touched: boolean
    initialValue: any
  }

  /**
   * 字段属性
   */
  field: {
    name: string
    value: any
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: () => void
    onFocus: () => void
  }

  /**
   * 标签属性
   */
  labelProps: {
    htmlFor?: string
    className?: string
    children?: React.ReactNode
  }

  /**
   * 输入框属性
   */
  inputProps: {
    id?: string
    name: string
    value: any
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    className?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: () => void
    onFocus: () => void
  }

  /**
   * 错误属性
   */
  errorProps: {
    className?: string
    children?: React.ReactNode
  }

  /**
   * 帮助文本属性
   */
  helperProps: {
    className?: string
    children?: React.ReactNode
  }
}

/**
 * withField HOC - 增强表单字段
 *
 * @param config 字段配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const FormInput = withField({
 *   name: 'email',
 *   label: '邮箱地址',
 *   helperText: '请输入有效的邮箱地址',
 *   required: true
 * })(Input)
 * ```
 */
export function withField<T extends Record<string, any> = {}>(
  config: FieldConfig
): HOC<T, T & FieldContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      name,
      label,
      helperText,
      placeholder,
      required,
      disabled,
      readOnly,
      labelClassName,
      inputClassName,
      errorClassName,
      helperClassName,
    } = config

    const displayName = `withField(${Component.displayName || Component.name || 'Component'})`

    const FieldComponent = forwardRef<any, T & FieldContextValue>((props, ref) => {
      const {
        // 字段值相关props
        value,
        error,
        touched,
        initialValue,
        onChange,
        onBlur,
        onFocus,

        // 表单方法
        getFieldProps,
        getFieldMeta,
        setFieldValue,
        setFieldError,
        setFieldTouched,

        // 其他props
        ...componentProps
      } = props

      // 生成字段ID
      const fieldId = useMemo(() => {
        return `${name}-field`
      }, [name])

      // 获取字段元数据
      const fieldMeta = useMemo(() => {
        if (getFieldMeta) {
          return getFieldMeta(name)
        }
        return {
          value: value || '',
          error,
          touched: touched || false,
          initialValue,
        }
      }, [name, value, error, touched, initialValue, getFieldMeta])

      // 获取字段属性
      const fieldProps = useMemo(() => {
        if (getFieldProps) {
          return getFieldProps(name)
        }
        return {
          name,
          value: fieldMeta.value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
              onChange(e)
            }
            if (setFieldValue) {
              setFieldValue(name, e.target.value)
            }
          },
          onBlur: () => {
            if (onBlur) {
              onBlur()
            }
            if (setFieldTouched) {
              setFieldTouched(name, true)
            }
          },
          onFocus,
        }
      }, [name, fieldMeta.value, onChange, onBlur, onFocus, getFieldProps, setFieldValue, setFieldTouched])

      // 标签属性
      const labelProps = {
        htmlFor: fieldId,
        className: labelClassName,
        children: label && (
          <>
            {label}
            {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
          </>
        ),
      }

      // 输入框属性
      const inputProps = {
        id: fieldId,
        name: fieldProps.name,
        value: fieldProps.value,
        placeholder: placeholder || label,
        required,
        disabled,
        readOnly,
        className: inputClassName,
        onChange: fieldProps.onChange,
        onBlur: fieldProps.onBlur,
        onFocus: fieldProps.onFocus,
      }

      // 错误属性
      const errorProps = {
        className: errorClassName,
        children: fieldMeta.touched && fieldMeta.error ? fieldMeta.error : null,
      }

      // 帮助文本属性
      const helperProps = {
        className: helperClassName,
        children: helperText && !errorProps.children ? helperText : null,
      }

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        ref,
        config,
        meta: fieldMeta,
        field: fieldProps,
        labelProps,
        inputProps,
        errorProps,
        helperProps,
      }

      return <Component {...enhancedProps} />
    })

    FieldComponent.displayName = displayName

    return FieldComponent
  }
}

// 便捷导出
export const WithField = withField

// 预设字段配置
export const withRequiredField = (config: Omit<FieldConfig, 'required'>) =>
  withField({ ...config, required: true })

export const withLabeledField = (config: Omit<FieldConfig, 'label'>) =>
  withField({ ...config })

export const withHelperField = (config: Omit<FieldConfig, 'helperText'>) =>
  withField({ ...config })

export default withField
