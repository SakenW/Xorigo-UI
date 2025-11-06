/**
 * @fileoverview withForm HOC - 表单管理高阶组件
 * @description 为组件提供完整的表单管理功能，包括字段管理、验证、提交等
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { HOC, ComponentType, FormErrors, FormTouched, FormSubmitHandler } from '../types'

/**
 * 表单值类型
 */
export type FormValues = Record<string, any>

/**
 * 表单配置接口
 */
export interface FormConfig<Values extends FormValues = FormValues> {
  /**
   * 初始值
   */
  initialValues?: Values

  /**
   * 验证函数
   */
  validate?: (values: Values) => FormErrors<Values>

  /**
   * 提交处理函数
   */
  onSubmit: FormSubmitHandler<Values>

  /**
   * 重置处理函数
   */
  onReset?: (values: Values) => void

  /**
   * 验证触发时机
   */
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnMount?: boolean

  /**
   * 重置到初始值
   */
  resetOnSubmit?: boolean

  /**
   * 表单验证间隔
   */
  validationDebounce?: number
}

/**
 * 表单上下文接口
 */
export interface FormContextValue<Values extends FormValues = FormValues> {
  /**
   * 表单值
   */
  values: Values

  /**
   * 表单错误
   */
  errors: FormErrors<Values>

  /**
   * 表单触摸状态
   */
  touched: FormTouched<Values>

  /**
   * 表单提交状态
   */
  isSubmitting: boolean

  /**
   * 表单验证状态
   */
  isValidating: boolean

  /**
   * 表单是否有效
   */
  isValid: boolean

  /**
   * 表单是否脏
   */
  isDirty: boolean

  /**
   * 注册字段
   */
  registerField: (name: string) => {
    name: string
    value: any
    error?: string
    touched: boolean
    onChange: (value: any) => void
    onBlur: () => void
    onFocus: () => void
  }

  /**
   * 设置字段值
   */
  setFieldValue: (name: string, value: any) => void

  /**
   * 设置字段错误
   */
  setFieldError: (name: string, error?: string) => void

  /**
   * 设置字段触摸状态
   */
  setFieldTouched: (name: string, touched?: boolean) => void

  /**
   * 设置多个字段值
   */
  setValues: (values: Partial<Values>) => void

  /**
   * 设置多个字段错误
   */
  setErrors: (errors: FormErrors<Values>) => void

  /**
   * 设置多个触摸状态
   */
  setTouched: (touched: FormTouched<Values>) => void

  /**
   * 验证单个字段
   */
  validateField: (name: string) => Promise<boolean>

  /**
   * 验证所有字段
   */
  validateForm: () => Promise<boolean>

  /**
   * 提交表单
   */
  handleSubmit: (e?: React.FormEvent) => Promise<void>

  /**
   * 重置表单
   */
  handleReset: () => void

  /**
   * 获取字段属性
   */
  getFieldProps: (name: string) => {
    name: string
    value: any
    error?: string
    touched: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: () => void
    onFocus: () => void
  }

  /**
   * 获取字段元数据
   */
  getFieldMeta: (name: string) => {
    value: any
    error?: string
    touched: boolean
    initialValue: any
  }
}

/**
 * 默认验证函数
 */
const defaultValidate = (values: FormValues): FormErrors => ({})

/**
 * withForm HOC - 提供表单管理功能
 *
 * @param config 表单配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const MyForm = withForm({
 *   initialValues: { name: '', email: '' },
 *   validate: (values) => {
 *     const errors: FormErrors = {}
 *     if (!values.name) errors.name = '必填'
 *     if (!values.email) errors.email = '必填'
 *     return errors
 *   },
 *   onSubmit: async (values) => {
 *     console.log('Submit:', values)
 *   }
 * })(BaseForm)
 * ```
 */
export function withForm<Values extends FormValues = FormValues>(
  config: FormConfig<Values>
): HOC<any, any> {
  return function(Component: ComponentType<any>) {
    const {
      initialValues = {} as Values,
      validate = defaultValidate,
      onSubmit,
      onReset,
      validateOnChange = false,
      validateOnBlur = true,
      validateOnMount = false,
      resetOnSubmit = true,
      validationDebounce = 300,
    } = config

    const displayName = `withForm(${Component.displayName || Component.name || 'Component'})`

    const FormComponent = React.forwardRef<any, any>((props, ref) => {
      // 表单状态
      const [values, setValuesState] = useState<Values>(initialValues)
      const [errors, setErrorsState] = useState<FormErrors<Values>>({})
      const [touched, setTouchedState] = useState<FormTouched<Values>>({})
      const [isSubmitting, setIsSubmitting] = useState(false)
      const [isValidating, setIsValidating] = useState(false)
      const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null)

      // 计算派生状态
      const isValid = useMemo(() => {
        return Object.keys(errors).length === 0
      }, [errors])

      const isDirty = useMemo(() => {
        return JSON.stringify(values) !== JSON.stringify(initialValues)
      }, [values, initialValues])

      // 延迟验证
      const debouncedValidate = useCallback((valuesToValidate: Values) => {
        if (validationTimeout) {
          clearTimeout(validationTimeout)
        }

        const timeout = setTimeout(() => {
          const newErrors = validate(valuesToValidate)
          setErrorsState(newErrors)
          setIsValidating(false)
        }, validationDebounce)

        setValidationTimeout(timeout)
        setIsValidating(true)
      }, [validate, validationDebounce, validationTimeout])

      // 设置字段值
      const setFieldValue = useCallback((name: string, value: any) => {
        setValuesState(prev => ({ ...prev, [name]: value }))

        if (validateOnChange) {
          debouncedValidate({ ...values, [name]: value })
        }
      }, [validateOnChange, debouncedValidate, values])

      // 设置字段错误
      const setFieldError = useCallback((name: string, error?: string) => {
        setErrorsState(prev => ({ ...prev, [name]: error }))
      }, [])

      // 设置字段触摸状态
      const setFieldTouched = useCallback((name: string, touched: boolean = true) => {
        setTouchedState(prev => ({ ...prev, [name]: touched }))
      }, [])

      // 设置多个字段值
      const setValues = useCallback((newValues: Partial<Values>) => {
        const mergedValues = { ...values, ...newValues }
        setValuesState(mergedValues)

        if (validateOnChange) {
          debouncedValidate(mergedValues)
        }
      }, [values, validateOnChange, debouncedValidate])

      // 设置多个字段错误
      const setErrors = useCallback((newErrors: FormErrors<Values>) => {
        setErrorsState(newErrors)
      }, [])

      // 设置多个触摸状态
      const setTouched = useCallback((newTouched: FormTouched<Values>) => {
        setTouchedState(newTouched)
      }, [])

      // 验证单个字段
      const validateField = useCallback(async (name: string): Promise<boolean> => {
        const newErrors = validate(values)
        const fieldError = newErrors[name]

        setErrorsState(prev => ({ ...prev, [name]: fieldError }))

        return !fieldError
      }, [values, validate])

      // 验证所有字段
      const validateForm = useCallback(async (): Promise<boolean> => {
        const newErrors = validate(values)
        setErrorsState(newErrors)
        return Object.keys(newErrors).length === 0
      }, [values, validate])

      // 提交表单
      const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) {
          e.preventDefault()
        }

        setIsSubmitting(true)

        // 验证表单
        const isValid = await validateForm()
        if (!isValid) {
          setIsSubmitting(false)
          return
        }

        try {
          await onSubmit(values)

          if (resetOnSubmit) {
            setValuesState(initialValues)
            setErrorsState({})
            setTouchedState({})
          }
        } catch (error) {
          console.error('Form submission error:', error)
        } finally {
          setIsSubmitting(false)
        }
      }, [values, onSubmit, validateForm, resetOnSubmit, initialValues])

      // 重置表单
      const handleReset = useCallback(() => {
        setValuesState(initialValues)
        setErrorsState({})
        setTouchedState({})

        if (onReset) {
          onReset(initialValues)
        }
      }, [initialValues, onReset])

      // 获取字段属性
      const getFieldProps = useCallback((name: string) => ({
        name,
        value: values[name] || '',
        error: errors[name],
        touched: touched[name] || false,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setFieldValue(name, e.target.value)
        },
        onBlur: () => {
          setFieldTouched(name, true)
          if (validateOnBlur) {
            validateField(name)
          }
        },
        onFocus: () => {
          // 处理焦点事件
        },
      }), [values, errors, touched, setFieldValue, setFieldTouched, validateField])

      // 获取字段元数据
      const getFieldMeta = useCallback((name: string) => ({
        value: values[name] || '',
        error: errors[name],
        touched: touched[name] || false,
        initialValue: initialValues[name],
      }), [values, errors, touched, initialValues])

      // 注册字段
      const registerField = useCallback((name: string) => ({
        name,
        value: values[name] || '',
        error: errors[name],
        touched: touched[name] || false,
        onChange: (value: any) => setFieldValue(name, value),
        onBlur: () => {
          setFieldTouched(name, true)
          if (validateOnBlur) {
            validateField(name)
          }
        },
        onFocus: () => {},
      }), [values, errors, touched, setFieldValue, setFieldTouched, validateField])

      // 初始化验证
      useEffect(() => {
        if (validateOnMount) {
          validateForm()
        }
      }, [])

      // 表单上下文
      const formContext: FormContextValue<Values> = {
        values,
        errors,
        touched,
        isSubmitting,
        isValidating,
        isValid,
        isDirty,
        registerField,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        setValues,
        setErrors,
        setTouched,
        validateField,
        validateForm,
        handleSubmit,
        handleReset,
        getFieldProps,
        getFieldMeta,
      }

      // 传递给组件的增强props
      const enhancedProps = {
        ...props,
        ref,
        form: formContext,
        values,
        errors,
        touched,
        isSubmitting,
        isValidating,
        isValid,
        isDirty,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        setValues,
        setErrors,
        setTouched,
        validateField,
        validateForm,
        handleSubmit,
        handleReset,
        getFieldProps,
        getFieldMeta,
      }

      return <Component {...enhancedProps} />
    })

    FormComponent.displayName = displayName

    return FormComponent
  }
}

// 便捷导出
export const WithForm = withForm

// 预设配置
export const withSimpleForm = withForm({
  validateOnChange: false,
  validateOnBlur: true,
  resetOnSubmit: false,
})

export const withLiveForm = withForm({
  validateOnChange: true,
  validateOnBlur: true,
  validationDebounce: 300,
})

export default withForm
