import React, { forwardRef, createContext, useContext, useMemo } from 'react'
import { Formik, FormikProps, FormikValues, FormikConfig } from 'formik'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'

// ==============================
// Context
// ==============================

interface FormikAdapterContextValue extends FormikProps<any> {
  adapterDisabled?: boolean
  adapterReadonly?: boolean
  adapterVariant?: 'default' | 'minimal' | 'bordered'
  adapterSize?: 'sm' | 'md' | 'lg' | 'xl'
}

const FormikAdapterContext = createContext<FormikAdapterContextValue | null>(null)

export const useFormikAdapter = () => {
  const context = useContext(FormikAdapterContext)
  if (!context) {
    throw new Error('useFormikAdapter must be used within a FormikAdapter component')
  }
  return context
}

// ==============================
// Variants
// ==============================

const formikAdapterVariants = cva(
  // 基础样式
  "relative transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-background",
        minimal: "bg-transparent",
        bordered: "border border-border rounded-lg bg-background p-4",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    },
  }
)

const formContentVariants = cva(
  // 基础样式
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "space-y-4",
        minimal: "space-y-2",
        bordered: "space-y-3",
      },
      size: {
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-5",
        xl: "space-y-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const submitButtonVariants = cva(
  // 基础样式
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        minimal: "flex justify-end",
        bordered: "flex justify-end space-x-2",
      },
      size: {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-2.5",
        xl: "text-lg px-6 py-3",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  }
)

const resetButtonVariants = cva(
  // 基础样式
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "mt-2 flex w-full justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        minimal: "flex justify-end text-sm text-muted-foreground hover:text-foreground",
        bordered: "flex justify-end space-x-2 text-sm",
      },
      size: {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-2.5",
        xl: "text-lg px-6 py-3",
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

export interface FormikAdapterProps<TValues extends FormikValues = FormikValues>
  extends Omit<FormikConfig<TValues>, 'children'>,
    VariantProps<typeof formikAdapterVariants> {
  children: React.ReactNode | ((props: FormikProps<TValues>) => React.ReactNode)
  showSubmitButton?: boolean
  showResetButton?: boolean
  submitButtonLabel?: string
  resetButtonLabel?: string
  showSubmittingState?: boolean
  showValidationErrors?: boolean
  enableReinitialize?: boolean
  enableUntouch?: boolean
  enableResetForm?: boolean
  onSubmit?: (values: TValues, formikBag: FormikProps<TValues>) => void | Promise<void>
  adapterDisabled?: boolean
  adapterReadonly?: boolean
  className?: string
}

// ==============================
// FormikAdapter Component
// ==============================

export const FormikAdapter = <TValues extends FormikValues = FormikValues>({
  children,
  variant,
  size,
  disabled,
  showSubmitButton = true,
  showResetButton = false,
  submitButtonLabel = '提交',
  resetButtonLabel = '重置',
  showSubmittingState = true,
  showValidationErrors = true,
  enableReinitialize = true,
  enableUntouch = true,
  enableResetForm = true,
  onSubmit,
  adapterDisabled = false,
  adapterReadonly = false,
  className,
  ...formikConfig
}: FormikAdapterProps<TValues>) => {
  const mergedDisabled = adapterDisabled || disabled || false
  const mergedReadonly = adapterReadonly

  // 自定义提交处理
  const handleSubmit = async (values: TValues, formikBag: FormikProps<TValues>) => {
    if (onSubmit) {
      await onSubmit(values, formikBag)
    } else if (formikConfig.onSubmit) {
      await formikConfig.onSubmit(values, formikBag)
    }
  }

  // 构建表单内容
  const renderFormContent = (formikProps: FormikProps<TValues>) => {
    const { isSubmitting, errors, touched, resetForm, isValid } = formikProps
    const hasErrors = showValidationErrors && Object.keys(errors).length > 0
    const hasTouched = Object.keys(touched).length > 0

    return (
      <FormikAdapterContext.Provider
        value={{
          ...formikProps,
          adapterDisabled: mergedDisabled,
          adapterReadonly: mergedReadonly,
          adapterVariant: variant,
          adapterSize: size,
        }}
      >
        <div
          className={cn(
            formikAdapterVariants({
              variant,
              size,
              disabled: mergedDisabled,
            }),
            className
          )}
          role="form"
          aria-busy={isSubmitting}
          aria-invalid={hasErrors ? 'true' : 'false'}
          aria-describedby={hasErrors && showValidationErrors ? 'formik-adapter-errors' : undefined}
        >
          {/* 渲染表单内容 */}
          <div
            className={formContentVariants({
              variant,
              size,
            })}
          >
            {typeof children === 'function' ? children(formikProps) : children}
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
                disabled={mergedDisabled || mergedReadonly || isSubmitting || (!isValid && hasTouched)}
                onClick={(e) => {
                  e.preventDefault()
                  formikProps.handleSubmit(e as any)
                }}
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

              {showResetButton && enableResetForm && (
                <button
                  type="button"
                  className={resetButtonVariants({
                    variant,
                    size,
                  })}
                  disabled={mergedDisabled || mergedReadonly || isSubmitting}
                  onClick={() => {
                    if (enableResetForm) {
                      resetForm()
                    }
                  }}
                >
                  {resetButtonLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </FormikAdapterContext.Provider>
    )
  }

  return (
    <Formik<TValues>
      {...formikConfig}
      onSubmit={handleSubmit}
      enableReinitialize={enableReinitialize}
      enableUntouch={enableUntouch}
      enableResetForm={enableResetForm}
    >
      {renderFormContent}
    </Formik>
  )
}

FormikAdapter.displayName = "FormikAdapter"

// ==============================
// Hooks
// ==============================

/**
 * 使用 Formik 字段属性
 */
export const useFormikField = <TValues extends FormikValues = FormikValues>(
  name: string
) => {
  const { getFieldProps, getFieldMeta, getFieldHelpers } = useFormikAdapter<TValues>()
  return {
    field: getFieldProps(name),
    meta: getFieldMeta(name),
    helpers: getFieldHelpers(name),
  }
}

/**
 * 使用 Formik 表单状态
 */
export const useFormikForm = <TValues extends FormikValues = FormikValues>() => {
  const formik = useFormikAdapter<TValues>()
  const { values, errors, touched, isSubmitting, isValidating, isValid, dirty, isDirty } = formik

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isValid,
    dirty,
    isDirty,
    ...formik,
  }
}

/**
 * 使用 Formik 提交
 */
export const useFormikSubmit = <TValues extends FormikValues = FormikValues>() => {
  const { handleSubmit } = useFormikAdapter<TValues>()
  return handleSubmit
}

/**
 * 使用 Formik 重置
 */
export const useFormikReset = <TValues extends FormikValues = FormikValues>() => {
  const { resetForm } = useFormikAdapter<TValues>()
  return resetForm
}

export { formikAdapterVariants, formContentVariants, submitButtonVariants, resetButtonVariants }
