'use client'

import React, { createContext, useContext, forwardRef, useCallback } from 'react'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils'

// ==============================
// Types
// ==============================

export interface FormValue {
  [key: string]: any
}

export interface FormError {
  [key: string]: string | string[]
}

export interface FormContextValue {
  values: FormValue
  errors: FormError
  touched: { [key: string]: boolean }
  disabled: boolean
  readonly: boolean
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  setFieldValue: (name: string, value: any) => void
  setFieldError: (name: string, error: string | string[]) => void
  setFieldTouched: (name: string, touched: boolean) => void
  validateField: (name: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  resetForm: () => void
  handleSubmit: (onSubmit: (values: FormValue) => void | Promise<void>) => (e?: React.FormEvent) => void
}

export interface FormFieldContextValue {
  name: string
  value: any
  error: string | string[] | undefined
  touched: boolean
  disabled: boolean
  readonly: boolean
  required: boolean
  onChange: (value: any) => void
  onBlur: () => void
  onFocus: () => void
}

// ==============================
// Context
// ==============================

const FormContext = createContext<FormContextValue | null>(null)
const FormFieldContext = createContext<FormFieldContextValue | null>(null)

export const useForm = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForm must be used within a FormProvider')
  }
  return context
}

export const useFormField = () => {
  const context = useContext(FormFieldContext)
  if (!context) {
    throw new Error('useFormField must be used within a FormField')
  }
  return context
}

// ==============================
// Variants
// ==============================

const formVariants = cva(
  // 基础样式
  "space-y-6",
  {
    variants: {
      variant: {
        default: "space-y-6",
        compact: "space-y-3",
        spaced: "space-y-8",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// ==============================
// Props
// ==============================

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>,
    VariantProps<typeof formVariants> {
  initialValues?: FormValue
  initialErrors?: FormError
  initialTouched?: { [key: string]: boolean }
  onSubmit?: (values: FormValue, helpers: FormHelpers) => void | Promise<void>
  onValuesChange?: (values: FormValue) => void
  onErrorsChange?: (errors: FormError) => void
  onTouchedChange?: (touched: { [key: string]: boolean }) => void
  validate?: (values: FormValue) => FormError | Promise<FormError>
  disabled?: boolean
  readonly?: boolean
  validateOnChange?: boolean
  validateOnBlur?: boolean
  reinitialize?: boolean
  enableReinitialize?: boolean
}

export interface FormHelpers {
  setFieldValue: (name: string, value: any) => void
  setFieldError: (name: string, error: string | string[]) => void
  setFieldTouched: (name: string, touched: boolean) => void
  setValues: (values: FormValue) => void
  setErrors: (errors: FormError) => void
  setTouched: (touched: { [key: string]: boolean }) => void
  validateField: (name: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  resetForm: () => void
  setSubmitting: (isSubmitting: boolean) => void
}

// ==============================
// Form Component
// ==============================

export const Form = forwardRef<HTMLFormElement, FormProps>(({
  className,
  variant,
  size,
  initialValues = {},
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
  reinitialize = false,
  enableReinitialize = false,
  children,
  ...props
}, ref) => {
  // 状态管理
  const [values, setValues] = React.useState<FormValue>(initialValues)
  const [errors, setErrors] = React.useState<FormError>(initialErrors)
  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>(initialTouched)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)

  // 计算属性
  const isValid = Object.keys(errors).length === 0
  const isDirty = Object.keys(touched).length > 0

  // 处理初始化值变化
  React.useEffect(() => {
    if (enableReinitialize || reinitialize) {
      setValues(initialValues)
      setErrors(initialErrors)
      setTouched(initialTouched)
    }
  }, [initialValues, initialErrors, initialTouched, enableReinitialize, reinitialize])

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
  const setFieldError = useCallback((name: string, error: string | string[]) => {
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
  const setFieldTouched = useCallback((name: string, touched: boolean) => {
    setTouched(prev => ({ ...prev, [name]: touched }))

    if (validateOnBlur && touched) {
      validateField(name)
    }
  }, [validateOnBlur])

  // 设置多个值
  const setValuesCallback = useCallback((newValues: FormValue) => {
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
  const setTouchedCallback = useCallback((newTouched: { [key: string]: boolean }) => {
    setTouched(newTouched)
  }, [])

  // 验证单个字段
  const validateField = useCallback(async (name: string): Promise<boolean> => {
    if (!validate) return true

    try {
      setIsValidating(true)
      const fieldErrors = await validate(values)
      const fieldError = fieldErrors[name]

      if (fieldError) {
        setFieldError(name, fieldError)
        return false
      } else {
        setFieldError(name, '')
        return true
      }
    } catch (error) {
      console.error('Field validation error:', error)
      return false
    } finally {
      setIsValidating(false)
    }
  }, [validate, values, setFieldError])

  // 验证整个表单
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validate) return true

    try {
      setIsValidating(true)
      const formErrors = await validate(values)
      setErrors(formErrors)
      return Object.keys(formErrors).length === 0
    } catch (error) {
      console.error('Form validation error:', error)
      return false
    } finally {
      setIsValidating(false)
    }
  }, [validate, values])

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors(initialErrors)
    setTouched(initialTouched)
    setIsSubmitting(false)
  }, [initialValues, initialErrors, initialTouched])

  // 设置提交状态
  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting)
  }, [])

  // 提交处理
  const handleSubmit = useCallback((onSubmitHandler: (values: FormValue, helpers: FormHelpers) => void | Promise<void>) => {
    return async (event?: React.FormEvent) => {
      event?.preventDefault()

      if (disabled || readonly || isSubmitting || isValidating) {
        return
      }

      setIsSubmitting(true)

      // 标记所有字段为已触摸
      const allFieldsTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {} as { [key: string]: boolean })
      setTouched(allFieldsTouched)

      // 验证表单
      const isValid = await validateForm()

      if (isValid && onSubmitHandler) {
        try {
          await onSubmitHandler(values, {
            setFieldValue,
            setFieldError,
            setFieldTouched,
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
    onSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValuesCallback,
    setErrorsCallback,
    setTouchedCallback,
    validateField,
    resetForm,
    setSubmitting,
  ])

  // Context值
  const contextValue: FormContextValue = {
    values,
    errors,
    touched,
    disabled,
    readonly,
    isSubmitting,
    isValid,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    handleSubmit,
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form
        ref={ref}
        className={cn(formVariants({ variant, size, className }))}
        noValidate
        {...props}
      >
        {typeof children === 'function'
          ? children(contextValue)
          : children
        }
      </form>
    </FormContext.Provider>
  )
})

Form.displayName = "Form"

// ==============================
// FormField Component
// ==============================

export interface FormFieldProps {
  name: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  children: (field: FormFieldContextValue) => React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  required = false,
  disabled = false,
  readonly = false,
  children,
}) => {
  const formContext = useForm()

  // 字段值
  const value = formContext.values[name]

  // 字段错误
  const error = formContext.errors[name]

  // 字段触摸状态
  const touched = formContext.touched[name] || false

  // 合并禁用/只读状态
  const isDisabled = disabled || formContext.disabled
  const isReadonly = readonly || formContext.readonly

  // 处理值变化
  const onChange = useCallback((newValue: any) => {
    formContext.setFieldValue(name, newValue)
  }, [formContext, name])

  // 处理失焦
  const onBlur = useCallback(() => {
    formContext.setFieldTouched(name, true)
  }, [formContext, name])

  // 处理聚焦
  const onFocus = useCallback(() => {
    // 聚焦时不需要特殊处理，但保留接口
  }, [])

  const fieldContext: FormFieldContextValue = {
    name,
    value,
    error,
    touched,
    disabled: isDisabled,
    readonly: isReadonly,
    required,
    onChange,
    onBlur,
    onFocus,
  }

  return (
    <FormFieldContext.Provider value={fieldContext}>
      {children(fieldContext)}
    </FormFieldContext.Provider>
  )
}

FormField.displayName = "FormField"

export { formVariants }