import React, { createContext, useContext, forwardRef, useCallback, ReactNode } from 'react'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'

// ==============================
// Types
// ==============================

export interface FormLayoutContextValue {
  layout: 'single' | 'double' | 'triple' | 'grid' | 'custom'
  columns?: number
  gap: 'sm' | 'md' | 'lg' | 'xl'
  labelWidth?: 'sm' | 'md' | 'lg' | 'xl'
  align: 'start' | 'center' | 'end' | 'stretch'
  sectionSpacing: 'sm' | 'md' | 'lg' | 'xl'
  disabled: boolean
}

export interface FormLayoutBreakpointConfig {
  breakpoint: 'sm' | 'md' | 'lg' | 'xl'
  columns?: number
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  labelWidth?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

// ==============================
// Context
// ==============================

const FormLayoutContext = createContext<FormLayoutContextValue | null>(null)

export const useFormLayout = () => {
  const context = useContext(FormLayoutContext)
  if (!context) {
    throw new Error('useFormLayout must be used within a FormLayout')
  }
  return context
}

// ==============================
// Variants
// ==============================

const formLayoutVariants = cva(
  // 基础样式
  "w-full",
  {
    variants: {
      layout: {
        single: "max-w-none",
        double: "grid grid-cols-1 md:grid-cols-2 gap-4",
        triple: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        grid: "grid gap-4",
        custom: "space-y-4",
      },
      columns: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
        6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
        7: "grid-cols-1 md:grid-cols-4 lg:grid-cols-7",
        8: "grid-cols-1 md:grid-cols-4 lg:grid-cols-8",
        9: "grid-cols-1 md:grid-cols-3 lg:grid-cols-9",
        10: "grid-cols-1 md:grid-cols-5 lg:grid-cols-10",
        11: "grid-cols-1 md:grid-cols-6 lg:grid-cols-11",
        12: "grid-cols-1 md:grid-cols-6 lg:grid-cols-12",
      },
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
      labelWidth: {
        sm: "data-[label-position=top]:max-w-[100px]",
        md: "data-[label-position=top]:max-w-[120px]",
        lg: "data-[label-position=top]:max-w-[150px]",
        xl: "data-[label-position=top]:max-w-[180px]",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      sectionSpacing: {
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-6",
        xl: "space-y-8",
      },
      labelPosition: {
        top: "flex-col",
        left: "flex-row items-center",
        right: "flex-row-reverse items-center",
        floating: "relative",
      },
    },
    compoundVariants: [
      // 单列布局不支持对齐方式
      {
        layout: 'single',
        align: 'start',
        className: 'max-w-none',
      },
      // 网格布局的约束
      {
        layout: 'grid',
        columns: 1,
        className: 'max-w-none',
      },
    ],
    defaultVariants: {
      layout: 'single',
      gap: 'md',
      align: 'stretch',
      sectionSpacing: 'md',
      labelPosition: 'top',
    },
  }
)

const formSectionVariants = cva(
  // 基础样式
  "w-full",
  {
    variants: {
      variant: {
        default: "border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-6",
        grouped: "bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4",
        card: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6",
        plain: "",
      },
      spacing: {
        sm: "pb-4 space-y-3",
        md: "pb-6 space-y-4",
        lg: "pb-8 space-y-6",
        xl: "pb-10 space-y-8",
      },
    },
    defaultVariants: {
      variant: 'default',
      spacing: 'md',
    },
  }
)

const formGroupVariants = cva(
  // 基础样式
  "w-full",
  {
    variants: {
      columns: {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-1 lg:col-span-3",
        4: "col-span-1 md:col-span-2 lg:col-span-4",
        5: "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-5",
        6: "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6",
        full: "col-span-full",
      },
      labelPosition: {
        top: "flex flex-col space-y-2",
        left: "grid grid-cols-[auto,1fr] gap-4 items-center",
        right: "grid grid-cols-[1fr,auto] gap-4 items-center",
        floating: "relative",
      },
      labelWidth: {
        sm: "w-[100px]",
        md: "w-[120px]",
        lg: "w-[150px]",
        xl: "w-[180px]",
        auto: "w-auto",
      },
    },
    compoundVariants: [
      {
        labelPosition: 'left',
        labelWidth: 'sm',
        className: 'grid-cols-[100px,1fr]',
      },
      {
        labelPosition: 'left',
        labelWidth: 'md',
        className: 'grid-cols-[120px,1fr]',
      },
      {
        labelPosition: 'left',
        labelWidth: 'lg',
        className: 'grid-cols-[150px,1fr]',
      },
      {
        labelPosition: 'left',
        labelWidth: 'xl',
        className: 'grid-cols-[180px,1fr]',
      },
    ],
    defaultVariants: {
      columns: 1,
      labelPosition: 'top',
      labelWidth: 'auto',
    },
  }
)

const sectionHeaderVariants = cva(
  // 基础样式
  "w-full",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      spaced: {
        true: "mb-3",
        false: "",
      },
    },
    defaultVariants: {
      size: 'md',
      weight: 'medium',
      spaced: true,
    },
  }
)

// ==============================
// Props
// ==============================

export interface FormLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof formLayoutVariants> {
  layout?: 'single' | 'double' | 'triple' | 'grid' | 'custom'
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  labelWidth?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  sectionSpacing?: 'sm' | 'md' | 'lg' | 'xl'
  labelPosition?: 'top' | 'left' | 'right' | 'floating'
  responsive?: boolean
  breakpoints?: FormLayoutBreakpointConfig[]
  disabled?: boolean
  children: ReactNode
}

export interface FormSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof formSectionVariants> {
  title?: string
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  icon?: ReactNode
  children: ReactNode
}

export interface FormGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof formGroupVariants> {
  label?: string
  description?: string
  required?: boolean
  optional?: boolean
  error?: string
  children: ReactNode
  labelPosition?: 'top' | 'left' | 'right' | 'floating'
  labelWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'auto'
}

export interface FormSectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof sectionHeaderVariants> {
  children: ReactNode
}

// ==============================
// FormLayout Component
// ==============================

export const FormLayout = forwardRef<HTMLDivElement, FormLayoutProps>(({
  className,
  layout = 'single',
  columns,
  gap = 'md',
  labelWidth = 'md',
  align = 'stretch',
  sectionSpacing = 'md',
  labelPosition = 'top',
  responsive = true,
  breakpoints,
  disabled = false,
  children,
  ...props
}, ref) => {
  // 合并断点配置
  const mergedColumns = breakpoints?.find(bp => bp.columns)?.columns || columns

  const contextValue: FormLayoutContextValue = {
    layout,
    columns: mergedColumns,
    gap,
    labelWidth,
    align,
    sectionSpacing,
    disabled,
  }

  // 渲染响应式类名
  const renderResponsiveClasses = () => {
    if (!responsive || !breakpoints || breakpoints.length === 0) {
      return {
        layout,
        columns: mergedColumns,
        gap,
        labelWidth,
        align,
      }
    }

    const classes: any = { layout, gap, labelWidth, align }

    // 为不同断点生成对应的类名
    breakpoints.forEach((bp) => {
      if (bp.columns) {
        classes[`col-${bp.breakpoint}`] = bp.columns
      }
      if (bp.gap) {
        classes[`gap-${bp.breakpoint}`] = bp.gap
      }
      if (bp.labelWidth) {
        classes[`labelWidth-${bp.breakpoint}`] = bp.labelWidth
      }
      if (bp.align) {
        classes[`align-${bp.breakpoint}`] = bp.align
      }
    })

    return classes
  }

  const variantClasses = formLayoutVariants({
    ...renderResponsiveClasses(),
    sectionSpacing,
    labelPosition,
    className,
  })

  return (
    <FormLayoutContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={variantClasses}
        data-label-position={labelPosition}
        {...props}
      >
        {children}
      </div>
    </FormLayoutContext.Provider>
  )
})

FormLayout.displayName = "FormLayout"

// ==============================
// FormSection Component
// ==============================

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(({
  className,
  variant,
  spacing,
  title,
  description,
  collapsible = false,
  defaultCollapsed = false,
  icon,
  children,
  ...props
}, ref) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const handleToggle = useCallback(() => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed)
    }
  }, [collapsible, isCollapsed])

  const sectionId = React.useId()
  const contentId = `section-content-${sectionId}`

  return (
    <div
      ref={ref}
      className={cn(formSectionVariants({ variant, spacing, className }))}
      {...props}
    >
      {/* Section Header */}
      {(title || description || collapsible) && (
        <div className="mb-4">
          <div
            id={`section-title-${sectionId}`}
            className={cn(
              sectionHeaderVariants({ spaced: true }),
              "text-gray-900 dark:text-gray-100"
            )}
          >
            {collapsible && (
              <button
                type="button"
                onClick={handleToggle}
                className="mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-expanded={!isCollapsed}
                aria-controls={contentId}
              >
                <span className="inline-block transition-transform duration-200"
                      style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                  ▶
                </span>
              </button>
            )}
            {icon && <span className="mr-2 inline-flex">{icon}</span>}
            {title}
          </div>
          {description && (
            <div
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
              id={`section-desc-${sectionId}`}
            >
              {description}
            </div>
          )}
        </div>
      )}

      {/* Section Content */}
      <div
        id={contentId}
        className={cn(
          "transition-all duration-200",
          isCollapsed && collapsible && "hidden"
        )}
      >
        {children}
      </div>
    </div>
  )
})

FormSection.displayName = "FormSection"

// ==============================
// FormGroup Component
// ==============================

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(({
  className,
  columns,
  labelPosition = 'top',
  labelWidth = 'auto',
  label,
  description,
  required = false,
  optional = false,
  error,
  children,
  ...props
}, ref) => {
  const layoutContext = useFormLayout()

  // 合并上下文和props
  const effectiveLabelPosition = labelPosition || 'top'
  const effectiveColumns = columns || 1

  const groupId = React.useId()
  const errorId = `group-error-${groupId}`

  return (
    <div
      ref={ref}
      className={cn(
        formGroupVariants({
          columns: effectiveColumns,
          labelPosition: effectiveLabelPosition,
          labelWidth,
        }),
        className
      )}
      data-label-position={effectiveLabelPosition}
      {...props}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={groupId}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
          {!required && optional && (
            <span className="text-gray-400 ml-1 text-xs">
              (可选)
            </span>
          )}
        </label>
      )}

      {/* Control Area */}
      <div className="flex-1">
        {children}

        {/* Description */}
        {description && !error && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            id={errorId}
            className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1"
            role="alert"
          >
            <span>●</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
})

FormGroup.displayName = "FormGroup"

// ==============================
// FormSectionHeader Component
// ==============================

export const FormSectionHeader = forwardRef<HTMLDivElement, FormSectionHeaderProps>(({
  className,
  size,
  weight,
  spaced,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        sectionHeaderVariants({ size, weight, spaced }),
        "text-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

FormSectionHeader.displayName = "FormSectionHeader"

export { formLayoutVariants, formSectionVariants, formGroupVariants, sectionHeaderVariants }
