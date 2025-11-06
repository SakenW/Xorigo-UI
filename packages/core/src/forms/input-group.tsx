'use client'
import React, { forwardRef, createContext, useContext } from 'react'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils'

// ==============================
// Context
// ==============================

interface InputGroupContextValue {
  variant: InputGroupProps['variant']
  size: InputGroupProps['size']
  disabled: boolean
  hasLeftAddon: boolean
  hasRightAddon: boolean
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null)

export const useInputGroup = () => {
  const context = useContext(InputGroupContext)
  if (!context) {
    throw new Error('useInputGroup must be used within an InputGroup component')
  }
  return context
}

// ==============================
// Variants
// ==============================

const inputGroupVariants = cva(
  // 基础样式
  "relative flex items-stretch",
  {
    variants: {
      variant: {
        default: "border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20",
        segmented: "border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 overflow-hidden",
        merged: "border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 overflow-hidden",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
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

// ==============================
// InputGroup Component
// ==============================

export interface InputGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof inputGroupVariants> {
  disabled?: boolean
  children: React.ReactNode
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(({
  className,
  variant,
  size,
  disabled = false,
  children,
  ...props
}, ref) => {
  // 检查左右附加元素
  const childrenArray = React.Children.toArray(children)
  const hasLeftAddon = childrenArray.some(
    child => React.isValidElement(child) && child.type === InputGroupAddon && child.props.position === 'left'
  )
  const hasRightAddon = childrenArray.some(
    child => React.isValidElement(child) && child.type === InputGroupAddon && child.props.position === 'right'
  )

  const contextValue: InputGroupContextValue = {
    variant,
    size,
    disabled,
    hasLeftAddon,
    hasRightAddon,
  }

  return (
    <InputGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn(
          inputGroupVariants({ variant, size, disabled }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  )
})

InputGroup.displayName = "InputGroup"

// ==============================
// InputGroupAddon Component
// ==============================

const inputGroupAddonVariants = cva(
  // 基础样式
  "flex items-center justify-center transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400",
        segmented: "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400",
        merged: "bg-transparent text-gray-600 dark:text-gray-400",
      },
      size: {
        sm: "px-2 text-xs",
        md: "px-3 text-sm",
        lg: "px-4 text-base",
        xl: "px-5 text-lg",
      },
      position: {
        left: "border-r",
        right: "border-l",
        both: "border-x",
      },
      type: {
        text: "",
        icon: "",
        button: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "left",
      type: "text",
      disabled: false,
    },
  }
)

export interface InputGroupAddonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof inputGroupAddonVariants> {
  position?: 'left' | 'right'
  type?: 'text' | 'icon' | 'button'
  children: React.ReactNode
}

export const InputGroupAddon = forwardRef<HTMLDivElement, InputGroupAddonProps>(({
  className,
  position = 'left',
  type = 'text',
  children,
  ...props
}, ref) => {
  const inputGroupContext = useInputGroup()

  // 继承父组件的variant和size
  const addonVariant = inputGroupContext.variant
  const addonSize = inputGroupContext.size
  const isDisabled = inputGroupContext.disabled

  // 计算边框样式
  let borderStyle = ""
  if (addonVariant === 'default') {
    borderStyle = position === 'left' ? 'border-r' : 'border-l'
  } else if (addonVariant === 'segmented') {
    if (position === 'left') {
      borderStyle = 'border-r'
    } else if (position === 'right') {
      borderStyle = 'border-l'
    }
  } else if (addonVariant === 'merged') {
    if (position === 'left' && inputGroupContext.hasRightAddon) {
      borderStyle = 'border-r-0'
    } else if (position === 'right' && inputGroupContext.hasLeftAddon) {
      borderStyle = 'border-l-0'
    }
  }

  // 调整子元素样式
  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        // 如果是按钮，调整样式
        if (child.type === 'button' || (child.props as any)?.as === 'button') {
          const buttonProps: any = {
            className: cn(
              // 移除按钮的默认样式
              "bg-transparent border-none p-0 m-0 shadow-none",
              // 继承addon样式
              addonVariant === 'merged' ? "px-2" : "",
              // 禁用状态
              isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-700",
              child.props.className
            ),
            disabled: isDisabled || child.props.disabled,
            type: child.props.type || 'button',
          }

          return React.cloneElement(child, buttonProps)
        }

        // 如果是图标，调整大小
        if (type === 'icon' && typeof child === 'object') {
          const iconProps: any = {
            className: cn(
              "w-4 h-4",
              child.props.className
            ),
          }

          return React.cloneElement(child, iconProps)
        }
      }
      return child
    })
  }

  return (
    <div
      ref={ref}
      className={cn(
        inputGroupAddonVariants({
          variant: addonVariant,
          size: addonSize,
          position,
          type,
          disabled: isDisabled,
        }),
        borderStyle,
        className
      )}
      {...props}
    >
      {renderChildren()}
    </div>
  )
})

InputGroupAddon.displayName = "InputGroupAddon"

// ==============================
// InputGroupInput Component
// ==============================

export interface InputGroupInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputGroupProps['variant']
  size?: InputGroupProps['size']
}

export const InputGroupInput = forwardRef<HTMLInputElement, InputGroupInputProps>(({
  className,
  variant,
  size,
  ...props
}, ref) => {
  const inputGroupContext = useInputGroup()

  // 使用上下文中的variant和size，或者props中的值
  const inputVariant = variant || inputGroupContext.variant
  const inputSize = size || inputGroupContext.size
  const isDisabled = inputGroupContext.disabled

  // 计算输入框样式
  const getInputStyles = () => {
    const baseStyles = "flex-1 bg-transparent border-none outline-none transition-all duration-200"

    const sizeStyles = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
      xl: "px-5 py-4 text-lg",
    }

    const variantStyles = {
      default: "",
      segmented: inputGroupContext.hasLeftAddon && inputGroupContext.hasRightAddon ? "rounded-none" : "",
      merged: "rounded-none",
    }

    // 处理圆角
    let borderRadiusStyles = ""
    if (inputVariant === 'default') {
      if (inputGroupContext.hasLeftAddon && inputGroupContext.hasRightAddon) {
        borderRadiusStyles = "rounded-none"
      } else if (inputGroupContext.hasLeftAddon) {
        borderRadiusStyles = "rounded-r-lg"
      } else if (inputGroupContext.hasRightAddon) {
        borderRadiusStyles = "rounded-l-lg"
      } else {
        borderRadiusStyles = "rounded-lg"
      }
    } else if (inputVariant === 'segmented') {
      if (inputGroupContext.hasLeftAddon && inputGroupContext.hasRightAddon) {
        borderRadiusStyles = "rounded-none"
      } else if (inputGroupContext.hasLeftAddon) {
        borderRadiusStyles = "rounded-r-lg"
      } else if (inputGroupContext.hasRightAddon) {
        borderRadiusStyles = "rounded-l-lg"
      } else {
        borderRadiusStyles = "rounded-lg"
      }
    } else if (inputVariant === 'merged') {
      borderRadiusStyles = "rounded-none"
    }

    return cn(
      baseStyles,
      sizeStyles[inputSize as keyof typeof sizeStyles],
      variantStyles[inputVariant as keyof typeof variantStyles],
      borderRadiusStyles,
      {
        "opacity-50 cursor-not-allowed": isDisabled,
      }
    )
  }

  return (
    <input
      ref={ref}
      className={cn(getInputStyles(), className)}
      disabled={isDisabled || props.disabled}
      {...props}
    />
  )
})

InputGroupInput.displayName = "InputGroupInput"

export { inputGroupVariants, inputGroupAddonVariants }