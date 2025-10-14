'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// ==============================
// Variants
// ==============================

const fieldsetVariants = cva(
  // 基础样式
  "rounded-lg border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
        bordered: "border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50",
        ghost: "border-0 bg-transparent",
      },
      size: {
        sm: "p-3 space-y-3",
        md: "p-4 space-y-4",
        lg: "p-6 space-y-6",
        xl: "p-8 space-y-8",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800",
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

const legendVariants = cva(
  // 基础样式
  "font-medium leading-relaxed",
  {
    variants: {
      variant: {
        default: "text-gray-900 dark:text-gray-100",
        bordered: "text-gray-900 dark:text-gray-100",
        ghost: "text-gray-900 dark:text-gray-100",
      },
      size: {
        sm: "text-sm mb-2",
        md: "text-base mb-3",
        lg: "text-lg mb-4",
        xl: "text-xl mb-5",
      },
      required: {
        true: "",
        false: "",
      },
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      required: false,
      disabled: false,
    },
  }
)

const descriptionVariants = cva(
  // 基础样式
  "text-gray-600 dark:text-gray-400",
  {
    variants: {
      variant: {
        default: "text-sm",
        bordered: "text-sm",
        ghost: "text-sm",
      },
      size: {
        sm: "text-xs mb-3",
        md: "text-sm mb-4",
        lg: "text-base mb-5",
        xl: "text-lg mb-6",
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

export interface FieldsetProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children'>,
    VariantProps<typeof fieldsetVariants> {
  legend?: string
  description?: string
  required?: boolean
  optional?: boolean
  showRequiredIndicator?: boolean
  showOptionalIndicator?: boolean
  disabled?: boolean
  children: React.ReactNode
}

// ==============================
// Fieldset Component
// ==============================

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(({
  className,
  variant,
  size,
  legend,
  description,
  required = false,
  optional = false,
  showRequiredIndicator = true,
  showOptionalIndicator = false,
  disabled = false,
  children,
  ...props
}, ref) => {
  // 生成ID
  const fieldsetId = React.useId()
  const legendId = `fieldset-${fieldsetId}-legend`
  const descriptionId = `fieldset-${fieldsetId}-description`

  // 构建aria-describedby
  const ariaDescribedBy = [
    description && descriptionId,
  ].filter(Boolean).join(' ')

  return (
    <fieldset
      ref={ref}
      className={cn(
        fieldsetVariants({ variant, size, disabled }),
        className
      )}
      disabled={disabled}
      aria-labelledby={legend ? legendId : undefined}
      aria-describedby={ariaDescribedBy || undefined}
      aria-required={required ? 'true' : 'false'}
      {...props}
    >
      {/* Legend */}
      {legend && (
        <legend
          id={legendId}
          className={cn(
            legendVariants({ variant, size, required, disabled }),
            // 移除浏览器默认的legend样式
            "float-none w-auto px-0 m-0"
          )}
        >
          {legend}
          {required && showRequiredIndicator && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
          {!required && showOptionalIndicator && (
            <span className="text-gray-400 ml-1 text-xs">
              (可选)
            </span>
          )}
        </legend>
      )}

      {/* Description */}
      {description && (
        <div
          id={descriptionId}
          className={descriptionVariants({ variant, size })}
        >
          {description}
        </div>
      )}

      {/* Field Content */}
      <div className="space-y-inherit">
        {children}
      </div>
    </fieldset>
  )
})

Fieldset.displayName = "Fieldset"

// ==============================
// Nested Fieldset Component
// ==============================

export interface NestedFieldsetProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children'> {
  title?: string
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  children: React.ReactNode
}

export const NestedFieldset = forwardRef<HTMLFieldSetElement, NestedFieldsetProps>(({
  className,
  title,
  description,
  collapsible = false,
  defaultCollapsed = false,
  children,
  ...props
}, ref) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const handleToggle = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <fieldset
      ref={ref}
      className={cn(
        "border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3",
        className
      )}
      {...props}
    >
      {/* Title */}
      {title && (
        <legend className="text-sm font-medium text-gray-900 dark:text-gray-100 float-none w-auto px-0 m-0">
          {collapsible && (
            <button
              type="button"
              onClick={handleToggle}
              className="mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-expanded={!isCollapsed}
              aria-controls={`nested-content-${React.useId()}`}
            >
              {isCollapsed ? '▶' : '▼'}
            </button>
          )}
          {title}
        </legend>
      )}

      {/* Description */}
      {description && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {description}
        </div>
      )}

      {/* Content */}
      <div
        id={`nested-content-${React.useId()}`}
        className={cn(
          "space-y-3",
          isCollapsed && collapsible && "hidden"
        )}
      >
        {children}
      </div>
    </fieldset>
  )
})

NestedFieldset.displayName = "NestedFieldset"

export { fieldsetVariants, legendVariants, descriptionVariants }