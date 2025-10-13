import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@xorigo-ui/theme'
import { useFormField } from './Form'

const fieldVariants = cva(
  "space-y-2",
  {
    variants: {
      layout: {
        vertical: "flex flex-col space-y-2",
        horizontal: "flex flex-col sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4",
        inline: "flex items-center space-x-2",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      required: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      layout: "vertical",
      size: "md",
      required: false,
    },
  }
)

const labelVariants = cva(
  "font-medium",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      disabled: {
        true: "text-gray-400 cursor-not-allowed",
        false: "text-gray-700",
      },
      error: {
        true: "text-red-600",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      disabled: false,
      error: false,
    },
  }
)

const helperTextVariants = cva(
  "",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      error: {
        true: "text-red-600",
        false: "text-gray-500",
      },
    },
    defaultVariants: {
      size: "md",
      error: false,
    },
  }
)

export interface FieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fieldVariants> {
  label?: string
  description?: string
  error?: string
  required?: boolean
  disabled?: boolean
  children: React.ReactNode
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({
    className,
    layout,
    size,
    label,
    description,
    error,
    required = false,
    disabled: propDisabled = false,
    children,
    ...props
  }, ref) => {
    const formContext = useFormField()
    const disabled = propDisabled || formContext.disabled
    const readonly = formContext.readonly

    return (
      <div
        className={cn(fieldVariants({ layout, size, required, className }))}
        ref={ref}
        {...props}
      >
        {label && (
          <label className={cn(labelVariants({ size, disabled, error: !!error }))}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={cn(
          layout === 'horizontal' ? 'flex-1' : '',
          disabled || readonly ? 'opacity-60' : ''
        )}>
          {children}
        </div>

        {(description || error) && (
          <p className={cn(helperTextVariants({ size, error: !!error }))}>
            {error || description}
          </p>
        )}
      </div>
    )
  }
)

Field.displayName = "Field"

export { Field, fieldVariants, labelVariants, helperTextVariants }