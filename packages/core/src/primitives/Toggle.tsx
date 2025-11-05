import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// Toggle变体配置
const toggleVariants = cva(
  // 基础样式
  'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-13',
      },
      variant: {
        solid: '',
        subtle: 'border-current/20',
      },
      color: {
        default: 'focus:ring-[var(--color-primary-500)]',
        primary: 'focus:ring-[var(--color-primary-500)]',
        secondary: 'focus:ring-[var(--color-secondary-500)]',
        success: 'focus:ring-[var(--color-success-500)]',
        warning: 'focus:ring-[var(--color-warning-500)]',
        error: 'focus:ring-[var(--color-error-500)]',
        info: 'focus:ring-[var(--color-info-500)]',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'solid',
      color: 'default',
    },
  }
)

// Toggle按钮变体
const thumbVariants = cva(
  'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'>,
    VariantProps<typeof toggleVariants> {
  /** 是否激活状态 */
  checked?: boolean
  /** 默认状态（非受控模式） */
  defaultChecked?: boolean
  /** 状态变化回调 */
  onCheckedChange?: (checked: boolean) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 标签文本 */
  label?: string
  /** 标签位置 */
  labelPosition?: 'left' | 'right'
  /** 描述文本 */
  description?: string
  /** 是否显示动画 */
  animated?: boolean
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  loading = false,
  label,
  labelPosition = 'right',
  description,
  animated = true,
  size,
  variant,
  color,
  className,
  ...props
}, ref) => {
  // 内部状态管理
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  // 状态变化处理
  const handleToggle = () => {
    if (disabled || loading) return

    const newChecked = !isChecked

    if (!isControlled) {
      setInternalChecked(newChecked)
    }

    onCheckedChange?.(newChecked)
  }

  // 获取颜色映射
  const getColorClasses = () => {
    if (isChecked) {
      switch (color) {
        case 'primary':
          return 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]'
        case 'secondary':
          return 'bg-[var(--color-secondary-500)] hover:bg-[var(--color-secondary-600)]'
        case 'success':
          return 'bg-[var(--color-success-500)] hover:bg-[var(--color-success-600)]'
        case 'warning':
          return 'bg-[var(--color-warning-500)] hover:bg-[var(--color-warning-600)]'
        case 'error':
          return 'bg-[var(--color-error-500)] hover:bg-[var(--color-error-600)]'
        case 'info':
          return 'bg-[var(--color-info-500)] hover:bg-[var(--color-info-600)]'
        default:
          return 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]'
      }
    } else {
      switch (variant) {
        case 'subtle':
          return 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
        default:
          return 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-quaternary)]'
      }
    }
  }

  // 拇指按钮位置
  const thumbTranslate = {
    sm: isChecked ? 'translate-x-4' : 'translate-x-0.5',
    md: isChecked ? 'translate-x-5' : 'translate-x-0.5',
    lg: isChecked ? 'translate-x-6' : 'translate-x-0.5',
  }

  const toggleElement = (
    <motion.button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled || loading}
      className={cn(
        toggleVariants({ size, variant, color }),
        getColorClasses(),
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleToggle}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
      whileHover={!disabled && !loading ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {/* 拇指按钮 */}
      <motion.span
        className={cn(thumbVariants({ size }))}
        style={{
          translateX: 0,
          x: thumbTranslate[size]
        }}
        animate={{
          x: thumbTranslate[size],
          scale: loading ? [1, 1.1, 1] : 1,
        }}
        transition={{
          x: { duration: 0.2, ease: "easeInOut" },
          scale: loading ? { repeat: Infinity, duration: 1.5 } : {},
        }}
      >
        {loading && (
          <motion.svg
            className="h-3 w-3 animate-spin text-[var(--color-primary-500)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
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
          </motion.svg>
        )}
      </motion.span>

      {/* 加载状态的脉冲效果 */}
      {loading && (
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          style={{
            background: isChecked
              ? 'var(--color-primary-500)'
              : 'var(--bg-tertiary)'
          }}
        />
      )}
    </motion.button>
  )

  // 如果没有标签，直接返回开关
  if (!label && !description) {
    return toggleElement
  }

  // 带标签的开关组件
  const labelElement = (
    <div className={cn('space-y-1', labelPosition === 'left' && 'text-right')}>
      {label && (
        <span className={cn(
          'text-sm font-medium',
          disabled ? 'text-[var(--text-disabled)]' : 'text-[var(--text-primary)]'
        )}>
          {label}
        </span>
      )}
      {description && (
        <p className={cn(
          'text-xs',
          disabled ? 'text-[var(--text-disabled)]' : 'text-[var(--text-secondary)]'
        )}>
          {description}
        </p>
      )}
    </div>
  )

  return (
    <div className={cn(
      'flex items-center gap-3',
      labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'
    )}>
      {labelElement}
      {toggleElement}
    </div>
  )
})

Toggle.displayName = 'Toggle'

// Toggle组组件（用于多个开关的组合）
export interface ToggleGroupProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  className,
}) => {
  const spacingClasses = {
    horizontal: {
      sm: 'space-x-2',
      md: 'space-x-4',
      lg: 'space-x-6',
    },
    vertical: {
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
    },
  }

  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        spacingClasses[orientation][spacing],
        className
      )}
    >
      {children}
    </div>
  )
}

ToggleGroup.displayName = 'ToggleGroup'