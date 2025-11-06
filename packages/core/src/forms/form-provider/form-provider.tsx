'use client'
import React, { createContext, useContext, forwardRef, useCallback, useMemo } from 'react'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'

// ==============================
// Types
// ==============================

export interface FormValue {
  [key: string]: any
}

export interface FormError {
  [key: string]: string | string[] | undefined
}

export interface FormTouched {
  [key: string]: boolean
}

export interface FormValidating {
  [key: string]: boolean
}

export interface FormContextValue<TValues extends FormValue = FormValue> {
  // 状态
  values: TValues
  errors: FormError
  touched: FormTouched
  validating: FormValidating
  disabled: boolean
  readonly: boolean
  isSubmitting: boolean
  isValidating: boolean
  isValid: boolean
  isDirty: boolean

  // 操作方法
  setFieldValue: (name: string, value: any) => void
  setFieldError: (name: string, error: string | string[] | undefined) => void
  setFieldTouched: (name: string, touched: boolean) => void
  setFieldValidating: (name: string, validating: boolean) => void

  setValues: (values: TValues) => void
  setErrors: (errors: FormError) => void
  setTouched: (touched: FormTouched) => void

  validateField: (name: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  resetForm: () => void

  // 事件处理器
  handleSubmit: (onSubmit: (values: TValues, helpers: FormHelpers<TValues>) => void | Promise<void>) => (e?: React.FormEvent) => void
  handleReset: () => void

  // 工具方法
  getFieldProps: (name: string) => {
    name: string
    value: any
    error?: string | string[]
    touched: boolean
    validating: boolean
    disabled: boolean
    readonly: boolean
    onChange: (value: any) => void
    onBlur: () => void
  }
}

export interface FormHelpers<TValues extends FormValue = FormValue> {
  setFieldValue: (name: string, value: any) => void
  setFieldError: (name: string, error: string | string[] | undefined) => void
  setFieldTouched: (name: string, touched: boolean) => void
  setFieldValidating: (name: string, validating: boolean) => void
  setValues: (values: TValues) => void
  setErrors: (errors: FormError) => void
  setTouched: (touched: FormTouched) => void
  validateField: (name: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  resetForm: () => void
  setSubmitting: (isSubmitting: boolean) => void
}

// ==============================
// Context
// ==============================

const FormContext = createContext<FormContextValue | null>(null)

export const useForm = <TValues extends FormValue = FormValue>() => {
  const context = useContext(FormContext as React.Context<FormContextValue<TValues> | null>)
  if (!context) {
    throw new Error('useForm must be used within a FormProvider')
  }
  return context
}

// ==============================
// Variants
// ==============================

const formProviderVariants = cva(
  '',
  {
    variants: {},
    defaultVariants: {},
  }
)

// ==============================
// Props
// ==============================

export interface FormProviderProps<TValues extends FormValue = FormValue>
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formProviderVariants> {
  initialValues?: TValues
  initialErrors?: FormError
  initialTouched?: FormTouched
  onSubmit?: (values: TValues, helpers: FormHelpers<TValues>) => void | Promise<void>
  onValuesChange?: (values: TValues) => void
  onErrorsChange?: (errors: FormError) => void
  onTouchedChange?: (touched: FormTouched) => void
  validate?: (values: TValues) => FormError | Promise<FormError>
  disabled?: boolean
  readonly?: boolean
  validateOnChange?: boolean
  validateOnBlur?: boolean
  enableReinitialize?: boolean
  children: React.ReactNode
}

// ==============================
// FormProvider Component
// ==============================

export const FormProvider = forwardRef<HTMLDivElement, FormProviderProps>(({
  className,
  variant,
  size,
  initialValues = {} as TValues,
  initialErrors = {},
  initialTouched = {},
  onSubmit,
  onValuesChange,
  onErrorsChange,
  onTouchedChange,
  validate,
  disabled = false,
  readonly = false,
  validateOnChange = true,
  validateOnBlur = true,
  enableReinitialize = false,
  children,
  ...props
}, ref) => {
  // 状态管理
  const [values, setValues] = React.useState<TValues>(initialValues)
  const [errors, setErrors] = React.useState<FormError>(initialErrors)
  const [touched, setTouched] = React.useState<FormTouched>(initialTouched)
  const [validating, setValidating] = React.useState<FormValidating>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // 计算属性
  const isValidating = Object.values(validating).some(Boolean)
  const isValid = Object.keys(errors).length === 0 && !isValidating
  const isDirty = Object.keys(touched).some(key => touched[key])

  // 处理初始化值变化
  React.useEffect(() => {
    if (enableReinitialize) {
      setValues(initialValues)
      setErrors(initialErrors)
      setTouched(initialTouched)
    }
  }, [initialValues, initialErrors, initialTouched, enableReinitialize])

  // 通知外部状态变化
  React.useEffect(() => {
    onValuesChange?.(values)
  }, [values, onValuesChange])

  React.useEffect(() => {
    onErrorsChange?.(errors)
  }, [errors, onErrorsChange])

  React.useEffect(() => {
    onTouchedChange?.(touched)
  }, [touched, onTouchedChange])

  // 设置字段值
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))

    if (validateOnChange) {
      validateField(name)
    }
  }, [validateOnChange])

  // 设置字段错误
  const setFieldError = useCallback((name: string, error: string | string[] | undefined) => {
    setErrors(prev => {
      if (error) {
        return { ...prev, [name]: error }
      } else {
        const { [name]: removed, ...rest } = prev
        return rest
      }
    })
  }, [])

  // 设置字段触摸状态
  const setFieldTouched = useCallback((name: string, touchedField: boolean) => {
    setTouched(prev => ({ ...prev, [name]: touchedField }))

    if (validateOnBlur && touchedField) {
      validateField(name)
    }
  }, [validateOnBlur])

  // 设置字段验证状态
  const setFieldValidating = useCallback((name: string, validatingField: boolean) => {
    setValidating(prev => ({ ...prev, [name]: validatingField }))
  }, [])

  // 设置多个值
  const setValuesCallback = useCallback((newValues: TValues) => {
    setValues(newValues)
    if (validateOnChange) {
      validateForm()
    }
  }, [validateOnChange])

  // 设置多个错误
  const setErrorsCallback = useCallback((newErrors: FormError) => {
    setErrors(newErrors)
  }, [])

  // 设置多个触摸状态
  const setTouchedCallback = useCallback((newTouched: FormTouched) => {
    setTouched(newTouched)
  }, [])

  // 验证单个字段
  const validateField = useCallback(async (name: string): Promise<boolean> => {
    if (!validate) return true

    try {
      setFieldValidating(name, true)
      const fieldErrors = await validate(values)
      const fieldError = fieldErrors[name]

      setFieldError(name, fieldError)
      setFieldValidating(name, false)

      return !fieldError
    } catch (error) {
      console.error('Field validation error:', error)
      setFieldError(name, 'Validation failed')
      setFieldValidating(name, false)
      return false
    }
  }, [validate, values, setFieldError, setFieldValidating])

  // 验证整个表单
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validate) return true

    try {
      const formErrors = await validate(values)
      setErrors(formErrors)
      return Object.keys(formErrors).length === 0
    } catch (error) {
      console.error('Form validation error:', error)
      setErrors({ ...errors, _root: 'Validation failed' })
      return false
    }
  }, [validate, values, errors])

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors(initialErrors)
    setTouched(initialTouched)
    setValidating({})
    setIsSubmitting(false)
  }, [initialValues, initialErrors, initialTouched])

  // 设置提交状态
  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting)
  }, [])

  // 提交处理
  const handleSubmit = useCallback((onSubmitHandler: (values: TValues, helpers: FormHelpers<TValues>) => void | Promise<void>) => {
    return async (event?: React.FormEvent) => {
      event?.preventDefault?.()

      if (disabled || readonly || isSubmitting || isValidating) {
        return
      }

      setIsSubmitting(true)

      // 标记所有字段为已触摸
      const allFieldsTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {} as FormTouched)
      setTouched(allFieldsTouched)

      // 验证表单
      const isValid = await validateForm()

      if (isValid && onSubmitHandler) {
        try {
          await onSubmitHandler(values, {
            setFieldValue,
            setFieldError,
            setFieldTouched,
            setFieldValidating,
            setValues: setValuesCallback,
            setErrors: setErrorsCallback,
            setTouched: setTouchedCallback,
            validateField,
            validateForm,
            resetForm,
            setSubmitting,
          })
        } catch (error) {
          console.error('Form submission error:', error)
        }
      }

      setIsSubmitting(false)
    }
  }, [
    disabled,
    readonly,
    isSubmitting,
    isValidating,
    values,
    validateForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setFieldValidating,
    setValuesCallback,
    setErrorsCallback,
    setTouchedCallback,
    validateField,
    resetForm,
    setSubmitting,
  ])

  // 重置处理
  const handleReset = useCallback(() => {
    resetForm()
  }, [resetForm])

  // 获取字段属性
  const getFieldProps = useCallback((name: string) => {
    return {
      name,
      value: values[name],
      error: errors[name],
      touched: touched[name] || false,
      validating: validating[name] || false,
      disabled: disabled || readonly,
      readonly,
      onChange: (value: any) => setFieldValue(name, value),
      onBlur: () => setFieldTouched(name, true),
    }
  }, [values, errors, touched, validating, disabled, readonly, setFieldValue, setFieldTouched])

  // Context值
  const contextValue = useMemo<FormContextValue<TValues>>(() => ({
    values,
    errors,
    touched,
    validating,
    disabled,
    readonly,
    isSubmitting,
    isValidating,
    isValid,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setFieldValidating,
    setValues: setValuesCallback,
    setErrors: setErrorsCallback,
    setTouched: setTouchedCallback,
    validateField,
    validateForm,
    resetForm,
    handleSubmit,
    handleReset,
    getFieldProps,
  }), [
    values,
    errors,
    touched,
    validating,
    disabled,
    readonly,
    isSubmitting,
    isValidating,
    isValid,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setFieldValidating,
    setValuesCallback,
    setErrorsCallback,
    setTouchedCallback,
    validateField,
    validateForm,
    resetForm,
    handleSubmit,
    handleReset,
    getFieldProps,
  ])

  return (
    <FormContext.Provider value={contextValue as FormContextValue}>
      <div
        ref={ref}
        className={cn(formProviderVariants({ variant, size, className }))}
        role="form"
        {...props}
      >
        {children}
      </div>
    </FormContext.Provider>
  )
})

FormProvider.displayName = "FormProvider"

// ==============================
// Export variants for external use
// ==============================

export { formProviderVariants }
