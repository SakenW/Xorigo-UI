import React, {
  forwardRef,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback
} from 'react'
import { z, ZodSchema, ZodError, ZodIssue } from 'zod'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'

// ==============================
// Types & Context
// ==============================

interface ZodAdapterContextValue {
  schema: ZodSchema<any>
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  validating: Record<string, boolean>
  validateField: (name: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  setFieldValue: (name: string, value: any) => void
  setFieldTouched: (name: string, touched?: boolean) => void
  resetForm: () => void
  getFieldProps: (name: string) => {
    name: string
    value: any
    error?: string
    touched: boolean
    validating: boolean
    onChange: (value: any) => void
    onBlur: () => void
  }
}

const ZodAdapterContext = createContext<ZodAdapterContextValue | null>(null)

export const useZodAdapter = () => {
  const context = useContext(ZodAdapterContext)
  if (!context) {
    throw new Error('useZodAdapter must be used within a ZodAdapter component')
  }
  return context
}

// ==============================
// Variants
// ==============================

const zodAdapterVariants = cva(
  'relative transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-background',
        minimal: 'bg-transparent',
        bordered: 'border border-border rounded-lg bg-background p-4',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false,
    },
  }
)

const formContentVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'space-y-4',
        minimal: 'space-y-2',
        bordered: 'space-y-3',
      },
      size: {
        sm: 'space-y-2',
        md: 'space-y-4',
        lg: 'space-y-5',
        xl: 'space-y-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const submitButtonVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        minimal: 'flex justify-end',
        bordered: 'flex justify-end space-x-2',
      },
      size: {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-5 py-2.5',
        xl: 'text-lg px-6 py-3',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: false,
    },
  }
)

const resetButtonVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'mt-2 flex w-full justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        minimal: 'flex justify-end text-sm text-muted-foreground hover:text-foreground',
        bordered: 'flex justify-end space-x-2 text-sm',
      },
      size: {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-5 py-2.5',
        xl: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// ==============================
// Props
// ==============================

export interface ZodAdapterProps<T extends Record<string, any>>
  extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onReset'>,
    VariantProps<typeof zodAdapterVariants> {
  schema: ZodSchema<T>
  initialValues?: Partial<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  showSubmitButton?: boolean
  showResetButton?: boolean
  submitButtonLabel?: string
  resetButtonLabel?: string
  showSubmittingState?: boolean
  showValidationErrors?: boolean
  enableReinitialize?: boolean
  onSubmit?: (values: T, context: ZodAdapterContextValue) => void | Promise<void>
  onReset?: () => void
  adapterDisabled?: boolean
  adapterReadonly?: boolean
  children: React.ReactNode | ((context: ZodAdapterContextValue) => React.ReactNode)
}

// ==============================
// Utility Functions
// ==============================

/**
 * Convert ZodError to field errors object
 */
const zodErrorToFieldErrors = (error: ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {}

  error.errors.forEach((issue: ZodIssue) => {
    const path = issue.path.join('.')
    if (path) {
      fieldErrors[path] = issue.message
    }
  })

  return fieldErrors
}

/**
 * Create validation trigger handler
 */
const createValidationHandler = (
  handler: () => Promise<boolean>,
  deps: React.DependencyList
) => {
  return useCallback(handler, deps)
}

// ==============================
// ZodAdapter Component
// ==============================

export const ZodAdapter = <T extends Record<string, any>>(
  props: ZodAdapterProps<T>
) => {
  const {
    schema,
    initialValues,
    variant,
    size,
    disabled,
    validateOnChange = true,
    validateOnBlur = true,
    showSubmitButton = true,
    showResetButton = false,
    submitButtonLabel = '提交',
    resetButtonLabel = '重置',
    showSubmittingState = true,
    showValidationErrors = true,
    enableReinitialize = true,
    onSubmit,
    onReset,
    adapterDisabled = false,
    adapterReadonly = false,
    className,
    children,
    ...formProps
  } = props

  // State
  const [values, setValues] = useState<Record<string, any>>(initialValues || {})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [validating, setValidating] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mergedDisabled = adapterDisabled || disabled || false
  const mergedReadonly = adapterReadonly

  // Reinitialize values when initialValues change
  useEffect(() => {
    if (enableReinitialize && initialValues) {
      setValues(initialValues)
      setErrors({})
      setTouched({})
    }
  }, [initialValues, enableReinitialize])

  // Validate single field
  const validateField = useCallback(
    async (name: string): Promise<boolean> => {
      setValidating(prev => ({ ...prev, [name]: true }))

      try {
        const fieldSchema = schema.pick({ [name]: true } as any)
        const result = await fieldSchema.safeParseAsync({
          [name]: values[name]
        })

        if (result.success) {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[name]
            return newErrors
          })
          return true
        } else {
          const fieldError = result.error.errors[0]?.message || '验证失败'
          setErrors(prev => ({ ...prev, [name]: fieldError }))
          return false
        }
      } catch (error) {
        console.error('Field validation error:', error)
        return false
      } finally {
        setValidating(prev => ({ ...prev, [name]: false }))
      }
    },
    [schema, values]
  )

  // Validate entire form
  const validateForm = useCallback(
    async (): Promise<boolean> => {
      try {
        const result = await schema.safeParseAsync(values)

        if (result.success) {
          setErrors({})
          return true
        } else {
          const fieldErrors = zodErrorToFieldErrors(result.error)
          setErrors(fieldErrors)
          return false
        }
      } catch (error) {
        console.error('Form validation error:', error)
        return false
      }
    },
    [schema, values]
  )

  // Set field value
  const setFieldValue = useCallback(
    (name: string, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }))

      if (validateOnChange) {
        validateField(name)
      }
    },
    [validateOnChange, validateField]
  )

  // Set field touched
  const setFieldTouched = useCallback(
    (name: string, isTouched: boolean = true) => {
      setTouched(prev => ({ ...prev, [name]: isTouched }))

      if (validateOnBlur && isTouched) {
        validateField(name)
      }
    },
    [validateOnBlur, validateField]
  )

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues || {})
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
    onReset?.()
  }, [initialValues, onReset])

  // Get field props
  const getFieldProps = useCallback(
    (name: string) => ({
      name,
      value: values[name] || '',
      error: errors[name],
      touched: touched[name] || false,
      validating: validating[name] || false,
      onChange: (value: any) => setFieldValue(name, value),
      onBlur: () => setFieldTouched(name, true),
    }),
    [values, errors, touched, validating, setFieldValue, setFieldTouched]
  )

  // Submit handler
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (mergedDisabled || mergedReadonly || isSubmitting) {
        return
      }

      setIsSubmitting(true)

      try {
        // Mark all fields as touched
        const allFieldsTouched = Object.keys(values).reduce(
          (acc, key) => {
            acc[key] = true
            return acc
          },
          {} as Record<string, boolean>
        )
        setTouched(allFieldsTouched)

        // Validate entire form
        const isValid = await validateForm()

        if (isValid && onSubmit) {
          await onSubmit(values as T, contextValue)
        }
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [mergedDisabled, mergedReadonly, isSubmitting, values, validateForm, onSubmit]
  )

  // Reset handler
  const handleReset = useCallback(() => {
    if (mergedDisabled || mergedReadonly || isSubmitting) {
      return
    }
    resetForm()
  }, [mergedDisabled, mergedReadonly, isSubmitting, resetForm])

  // Context value
  const contextValue: ZodAdapterContextValue = useMemo(
    () => ({
      schema,
      values,
      errors,
      touched,
      validating,
      validateField,
      validateForm,
      setFieldValue,
      setFieldTouched,
      resetForm,
      getFieldProps,
    }),
    [
      schema,
      values,
      errors,
      touched,
      validating,
      validateField,
      validateForm,
      setFieldValue,
      setFieldTouched,
      resetForm,
      getFieldProps,
    ]
  )

  const hasErrors = showValidationErrors && Object.keys(errors).length > 0
  const hasTouched = Object.keys(touched).length > 0

  // Render form content
  const renderFormContent = () => {
    return (
      <ZodAdapterContext.Provider value={contextValue}>
        <form
          {...formProps}
          className={cn(
            zodAdapterVariants({
              variant,
              size,
              disabled: mergedDisabled,
            }),
            className
          )}
          onSubmit={handleSubmit}
          onReset={handleReset}
          role="form"
          aria-busy={isSubmitting}
          aria-invalid={hasErrors ? 'true' : 'false'}
          aria-describedby={
            hasErrors && showValidationErrors ? 'zod-adapter-errors' : undefined
          }
        >
          {/* 渲染表单内容 */}
          <div className={formContentVariants({ variant, size })}>
            {typeof children === 'function' ? children(contextValue) : children}
          </div>

          {/* 提交和重置按钮 */}
          {showSubmitButton && (
            <div className={cn('pt-2', variant === 'bordered' ? 'mt-4' : '')}>
              <button
                type="submit"
                className={submitButtonVariants({
                  variant,
                  size,
                  fullWidth: variant === 'default',
                })}
                disabled={
                  mergedDisabled ||
                  mergedReadonly ||
                  isSubmitting ||
                  (!isSubmitting && hasTouched && hasErrors)
                }
              >
                {isSubmitting && showSubmittingState ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    提交中...
                  </span>
                ) : (
                  submitButtonLabel
                )}
              </button>

              {showResetButton && (
                <button
                  type="reset"
                  className={resetButtonVariants({
                    variant,
                    size,
                  })}
                  disabled={mergedDisabled || mergedReadonly || isSubmitting}
                >
                  {resetButtonLabel}
                </button>
              )}
            </div>
          )}
        </form>
      </ZodAdapterContext.Provider>
    )
  }

  return renderFormContent()
}

ZodAdapter.displayName = 'ZodAdapter'

// ==============================
// Hooks
// ==============================

/**
 * Use Zod field properties
 */
export const useZodField = (name: string) => {
  const context = useZodAdapter()
  const fieldProps = context.getFieldProps(name)

  return {
    field: fieldProps,
    error: fieldProps.error,
    touched: fieldProps.touched,
    validating: fieldProps.validating,
  }
}

/**
 * Use Zod form state
 */
export const useZodForm = () => {
  const context = useZodAdapter()
  const { values, errors, touched, validating, isSubmitting } = context

  const isValid = Object.keys(errors).length === 0
  const isDirty = Object.values(touched).some(Boolean)

  return {
    values,
    errors,
    touched,
    validating,
    isSubmitting,
    isValid,
    isDirty,
    ...context,
  }
}

/**
 * Use Zod form submission
 */
export const useZodSubmit = () => {
  const context = useZodAdapter()
  const { setFieldValue, setFieldTouched } = context

  return {
    setFieldValue,
    setFieldTouched,
  }
}

/**
 * Use Zod form reset
 */
export const useZodReset = () => {
  const context = useZodAdapter()
  return context.resetForm
}

// ==============================
// Export variants
// ==============================

export {
  zodAdapterVariants,
  formContentVariants,
  submitButtonVariants,
  resetButtonVariants,
}

// ==============================
// Constants
// ==============================

export const ZOD_ADAPTER_VARIANTS = {
  DEFAULT: 'default' as const,
  MINIMAL: 'minimal' as const,
  BORDERED: 'bordered' as const,
} as const

export const ZOD_ADAPTER_SIZES = {
  SM: 'sm' as const,
  MD: 'md' as const,
  LG: 'lg' as const,
  XL: 'xl' as const,
} as const

export const ZOD_ADAPTER_DEFAULTS = {
  variant: 'default' as const,
  size: 'md' as const,
  validateOnChange: true,
  validateOnBlur: true,
  showSubmitButton: true,
  showResetButton: false,
  showSubmittingState: true,
  showValidationErrors: true,
  enableReinitialize: true,
} as const

// ==============================
// Utility Functions
// ==============================

/**
 * Create Zod validation rule from schema
 */
export const createZodValidationRule = <T extends Record<string, any>>(
  schema: ZodSchema<T>
) => {
  return {
    schema,
    validate: (values: T) => schema.safeParse(values),
  }
}

/**
 * Create async Zod validator
 */
export const createAsyncZodValidator = <T extends Record<string, any>>(
  schema: ZodSchema<T>,
  validateFn: (values: T) => Promise<boolean>
) => {
  return async (values: T) => {
    const zodResult = await schema.safeParseAsync(values)
    if (!zodResult.success) {
      return zodErrorToFieldErrors(zodResult.error)
    }

    const asyncValid = await validateFn(values)
    return asyncValid
  }
}

/**
 * Create required field validator
 */
export const createRequiredValidator = (message: string = '此字段为必填项') => {
  return (value: any) => {
    if (value === undefined || value === null || value === '') {
      return message
    }
    return true
  }
}

/**
 * Create email validator using Zod
 */
export const createEmailValidator = (
  message: string = '请输入有效的邮箱地址'
) => {
  const emailSchema = z.string().email(message)
  return (value: string) => {
    if (!value) return true
    const result = emailSchema.safeParse(value)
    return result.success ? true : message
  }
}

/**
 * Create min length validator using Zod
 */
export const createMinLengthValidator = (
  min: number,
  message?: string
) => {
  const defaultMessage = message || `最少需要 ${min} 个字符`
  return (value: string) => {
    if (!value) return true
    return value.length >= min || defaultMessage
  }
}

/**
 * Create max length validator using Zod
 */
export const createMaxLengthValidator = (
  max: number,
  message?: string
) => {
  const defaultMessage = message || `最多允许 ${max} 个字符`
  return (value: string) => {
    if (!value) return true
    return value.length <= max || defaultMessage
  }
}
