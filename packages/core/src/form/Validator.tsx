import React, { useState, useCallback } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@xorigo-ui/theme'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  email?: boolean
  url?: boolean
  custom?: (value: any) => string | null
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface ValidatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof validatorVariants> {
  rules?: ValidationRule
  value?: any
  onValidate?: (result: ValidationResult) => void
  showErrors?: boolean
  children?: React.ReactNode
}

const validatorVariants = cva(
  "",
  {
    variants: {
      variant: {
        error: "text-red-600 text-sm mt-1",
        warning: "text-yellow-600 text-sm mt-1",
        success: "text-green-600 text-sm mt-1",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  }
)

export const Validator = React.forwardRef<HTMLDivElement, ValidatorProps>(
  ({
    className,
    variant,
    rules = {},
    value,
    onValidate,
    showErrors = true,
    children,
    ...props
  }, ref) => {
    const [validationResult, setValidationResult] = useState<ValidationResult>({
      isValid: true,
    })

    const validate = useCallback((inputValue: any): ValidationResult => {
      // Required validation
      if (rules.required && (!inputValue || inputValue.toString().trim() === '')) {
        return {
          isValid: false,
          error: '此字段为必填项',
        }
      }

      // Skip other validations if value is empty and not required
      if (!inputValue || inputValue.toString().trim() === '') {
        return { isValid: true }
      }

      const stringValue = inputValue.toString()

      // Min length validation
      if (rules.minLength && stringValue.length < rules.minLength) {
        return {
          isValid: false,
          error: `最少需要 ${rules.minLength} 个字符`,
        }
      }

      // Max length validation
      if (rules.maxLength && stringValue.length > rules.maxLength) {
        return {
          isValid: false,
          error: `最多允许 ${rules.maxLength} 个字符`,
        }
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(stringValue)) {
        return {
          isValid: false,
          error: '格式不正确',
        }
      }

      // Number range validation
      if (typeof inputValue === 'number') {
        if (rules.min !== undefined && inputValue < rules.min) {
          return {
            isValid: false,
            error: `数值不能小于 ${rules.min}`,
          }
        }
        if (rules.max !== undefined && inputValue > rules.max) {
          return {
            isValid: false,
            error: `数值不能大于 ${rules.max}`,
          }
        }
      }

      // Email validation
      if (rules.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(stringValue)) {
          return {
            isValid: false,
            error: '请输入有效的邮箱地址',
          }
        }
      }

      // URL validation
      if (rules.url) {
        try {
          new URL(stringValue)
        } catch {
          return {
            isValid: false,
            error: '请输入有效的URL地址',
          }
        }
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(inputValue)
        if (customError) {
          return {
            isValid: false,
            error: customError,
          }
        }
      }

      return { isValid: true }
    }, [rules])

    React.useEffect(() => {
      if (value !== undefined) {
        const result = validate(value)
        setValidationResult(result)
        onValidate?.(result)
      }
    }, [value, validate, onValidate])

    if (!showErrors || validationResult.isValid) {
      return <>{children}</>
    }

    return (
      <div
        className={cn(validatorVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {validationResult.error}
        {children}
      </div>
    )
  }
)

Validator.displayName = "Validator"

// Utility functions for common validation rules
export const ValidationRules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    custom: () => message || '此字段为必填项',
  }),

  email: (): ValidationRule => ({
    email: true,
  }),

  minLength: (length: number): ValidationRule => ({
    minLength: length,
  }),

  maxLength: (length: number): ValidationRule => ({
    maxLength: length,
  }),

  password: (): ValidationRule => ({
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return '密码必须包含小写字母'
      if (!/(?=.*[A-Z])/.test(value)) return '密码必须包含大写字母'
      if (!/(?=.*\d)/.test(value)) return '密码必须包含数字'
      return null
    },
  }),

  phone: (): ValidationRule => ({
    pattern: /^1[3-9]\d{9}$/,
    custom: () => '请输入有效的手机号码',
  }),

  range: (min: number, max: number): ValidationRule => ({
    min,
    max,
  }),

  custom: (validator: (value: any) => string | null): ValidationRule => ({
    custom: validator,
  }),
}

export { Validator, validatorVariants }