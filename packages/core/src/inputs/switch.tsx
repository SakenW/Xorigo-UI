import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

/**
 * Switch Component - 开关切换组件
 *
 * 基于 Xorigo UI 七轴主题系统的开关组件，支持多种样式、大小和状态
 *
 * 特性：
 * - 7种主题配方支持
 * - 4种变体样式 (default, primary, success, danger)
 * - 3种尺寸规格 (sm, md, lg)
 * - 加载状态支持
 * - 可访问性支持 (ARIA)
 * - Framer Motion 12 动画效果
 * - TypeScript 类型安全
 */

// Switch变体配置 - 使用七轴主题系统设计令牌
const switchVariants = cva(
  // 基础样式 - 使用设计令牌
  'relative inline-flex flex-shrink-0 cursor-pointer border-2 border-transparent rounded-full transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // 默认样式 - 使用设计令牌
        default:
          'bg-[var(--color-surface-200)] dark:bg-[var(--color-surface-700)] checked:bg-[var(--color-neutral-600)] dark:checked:bg-[var(--color-neutral-400)] focus:ring-[var(--color-neutral-500)]/20',

        // 主要样式 - 使用主色调令牌
        primary:
          'bg-[var(--color-surface-200)] dark:bg-[var(--color-surface-700)] checked:bg-[var(--color-primary-600)] dark:checked:bg-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]/20',

        // 成功样式 - 使用成功色调令牌
        success:
          'bg-[var(--color-surface-200)] dark:bg-[var(--color-surface-700)] checked:bg-[var(--color-success-600)] dark:checked:bg-[var(--color-success-500)] focus:ring-[var(--color-success-500)]/20',

        // 危险样式 - 使用危险色调令牌
        danger:
          'bg-[var(--color-surface-200)] dark:bg-[var(--color-surface-700)] checked:bg-[var(--color-danger-600)] dark:checked:bg-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)]/20',

        // 外观样式 - 边框样式
        outline:
          'bg-transparent border-[var(--color-border-300)] dark:border-[var(--color-border-600)] checked:border-[var(--color-primary-600)] dark:checked:border-[var(--color-primary-500)] checked:bg-[var(--color-primary-600)]/10 dark:checked:bg-[var(--color-primary-500)]/10',
      },
      size: {
        sm: 'h-[var(--spacing-5)] w-[var(--spacing-9)]', // 20px x 36px
        md: 'h-[var(--spacing-6)] w-[var(--spacing-11)]', // 24px x 44px
        lg: 'h-[var(--spacing-7)] w-[var(--spacing-14)]', // 28px x 56px
      },
      status: {
        default: '',
        error: 'checked:border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)]/20',
        success: 'checked:border-[var(--color-success-500)] focus:ring-[var(--color-success-500)]/20',
        warning: 'checked:border-[var(--color-warning-500)] focus:ring-[var(--color-warning-500)]/20',
      },
      loading: {
        true: '',
      },
    },
    compoundVariants: [
      // variant + status 组合 - 使用设计令牌
      {
        variant: 'default',
        status: 'error',
        className: 'checked:bg-[var(--color-danger-600)] dark:checked:bg-[var(--color-danger-500)]',
      },
      {
        variant: 'default',
        status: 'success',
        className: 'checked:bg-[var(--color-success-600)] dark:checked:bg-[var(--color-success-500)]',
      },
      {
        variant: 'default',
        status: 'warning',
        className: 'checked:bg-[var(--color-warning-600)] dark:checked:bg-[var(--color-warning-500)]',
      },
      {
        variant: 'primary',
        status: 'error',
        className: 'checked:bg-[var(--color-danger-600)] dark:checked:bg-[var(--color-danger-500)]',
      },
      {
        variant: 'primary',
        status: 'success',
        className: 'checked:bg-[var(--color-success-600)] dark:checked:bg-[var(--color-success-500)]',
      },
      {
        variant: 'primary',
        status: 'warning',
        className: 'checked:bg-[var(--color-warning-600)] dark:checked:bg-[var(--color-warning-500)]',
      },
      {
        variant: 'success',
        status: 'error',
        className: 'checked:bg-[var(--color-danger-600)] dark:checked:bg-[var(--color-danger-500)]',
      },
      {
        variant: 'success',
        status: 'warning',
        className: 'checked:bg-[var(--color-warning-600)] dark:checked:bg-[var(--color-warning-500)]',
      },
      {
        variant: 'danger',
        status: 'success',
        className: 'checked:bg-[var(--color-success-600)] dark:checked:bg-[var(--color-success-500)]',
      },
      {
        variant: 'danger',
        status: 'warning',
        className: 'checked:bg-[var(--color-warning-600)] dark:checked:bg-[var(--color-warning-500)]',
      },
      // loading + variant
      {
        loading: true,
        className: 'cursor-wait',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      status: 'default',
      loading: false,
    },
  }
)

// Thumb变体配置 - 使用七轴主题系统设计令牌
const thumbVariants = cva(
  // 基础样式 - 使用设计令牌
  'inline-block rounded-full bg-[var(--color-surface-0)] shadow-[var(--shadow-sm)] ring-0 transition-transform duration-200 ease-in-out pointer-events-none',
  {
    variants: {
      size: {
        sm: 'h-[var(--spacing-4)] w-[var(--spacing-4)]', // 16px x 16px
        md: 'h-[var(--spacing-5)] w-[var(--spacing-5)]', // 20px x 20px
        lg: 'h-[var(--spacing-6)] w-[var(--spacing-6)]', // 24px x 24px
      },
      checked: {
        true: '',
      },
      variant: {
        default: 'ring-[var(--color-neutral-600)]/5',
        primary: 'ring-[var(--color-primary-600)]/5',
        success: 'ring-[var(--color-success-600)]/5',
        danger: 'ring-[var(--color-danger-600)]/5',
        outline: 'ring-[var(--color-primary-600)]/10',
      },
      loading: {
        true: 'scale-75',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
      variant: 'primary',
      loading: false,
    },
  }
)

/**
 * Switch组件属性接口
 */
export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof switchVariants> {
  /**
   * 开关标签文本
   */
  label?: string

  /**
   * 开关描述文本
   */
  description?: string

  /**
   * 加载状态
   * @default false
   */
  loading?: boolean

  /**
   * 标签位置
   * @default 'right'
   */
  labelPosition?: 'right' | 'left'

  /**
   * thumb图标
   */
  thumbIcon?: React.ReactNode

  /**
   * 开关状态变化回调
   */
  onCheckedChange?: (checked: boolean) => void

  /**
   * 自定义thumb样式类名
   */
  thumbClassName?: string

  /**
   * 自定义标签样式类名
   */
  labelClassName?: string

  /**
   * 自定义描述文本样式类名
   */
  descriptionClassName?: string
}

/**
 * 加载指示器组件 - 使用设计令牌
 */
const LoadingSpinner: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const sizeMap = {
    sm: 'h-[var(--spacing-2.5)] w-[var(--spacing-2.5)] border-[2px] border-[var(--color-border-300)] border-t-transparent',
    md: 'h-[var(--spacing-3)] w-[var(--spacing-3)] border-[2px] border-[var(--color-border-300)] border-t-transparent',
    lg: 'h-[var(--spacing-3.5)] w-[var(--spacing-3.5)] border-[2px] border-[var(--color-border-300)] border-t-transparent',
  }

  return (
    <div className={cn('animate-spin rounded-full', sizeMap[size])} />
  )
}

/**
 * Switch组件主实现 - 基于七轴主题系统
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      id,
      checked = false,
      defaultChecked,
      onChange,
      onCheckedChange,
      disabled = false,
      loading = false,
      variant = 'primary',
      size = 'md',
      status,
      labelPosition = 'right',
      thumbIcon,
      thumbClassName,
      labelClassName,
      descriptionClassName,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()
    const switchId = id || `switch-${React.useId()}`

    // 处理状态
    const effectiveStatus = status || 'default'
    const effectiveVariant = variant

    // 处理变化事件
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      onChange?.(e)
      onCheckedChange?.(newChecked)
    }

    // 计算thumb位移 - 使用设计令牌间距
    const getThumbTranslateX = (): number => {
      const spacingMap = {
        sm: 20, // var(--spacing-5) - thumbSize
        md: 24, // var(--spacing-6) - thumbSize
        lg: 28, // var(--spacing-7) - thumbSize
      }
      return spacingMap[size || 'md']
    }

    // 渲染thumb内容
    const renderThumbContent = () => {
      if (loading) {
        return <LoadingSpinner size={size || 'md'} />
      }
      if (thumbIcon) {
        return (
          <div className="flex items-center justify-center h-full w-full text-[var(--color-text-secondary)]">
            {thumbIcon}
          </div>
        )
      }
      return null
    }

    return (
      <div
        className={cn('flex items-center gap-[var(--spacing-3)]', className)}
        role="group"
        aria-labelledby={label ? `${switchId}-label` : undefined}
        aria-describedby={description ? `${switchId}-description` : undefined}
      >
        {/* 根据labelPosition调整顺序 */}
        {labelPosition === 'left' && (
          <div className="flex flex-col gap-[var(--spacing-1)]">
            {label && (
              <span
                id={`${switchId}-label`}
                className={cn(
                  'text-sm font-medium text-[var(--color-text-primary)]',
                  disabled && 'opacity-50',
                  labelClassName
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                id={`${switchId}-description`}
                className={cn(
                  'text-sm text-[var(--color-text-secondary)]',
                  disabled && 'opacity-50',
                  descriptionClassName
                )}
              >
                {description}
              </span>
            )}
          </div>
        )}

        {/* Switch容器 */}
        <div className="relative">
          <motion.label
            htmlFor={switchId}
            className={cn(
              switchVariants({
                variant: effectiveVariant,
                size,
                status: effectiveStatus as any,
                loading,
              })
            )}
            whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
            whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1] // Framer Motion 12 缓动函数
            }}
          >
            {/* 隐藏的原生input - 保持可访问性 */}
            <input
              ref={ref}
              id={switchId}
              type="checkbox"
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={handleChange}
              disabled={disabled || loading}
              className="sr-only peer"
              aria-checked={checked}
              aria-busy={loading}
              {...props}
            />

            {/* Switch轨道 */}
            <div
              className="absolute inset-0 rounded-full bg-inherit pointer-events-none"
              aria-hidden="true"
            />

            {/* Switch thumb */}
            <motion.div
              className={cn(
                thumbVariants({
                  variant: effectiveVariant,
                  size,
                  checked,
                  loading,
                }),
                thumbClassName
              )}
              animate={{
                x: checked ? getThumbTranslateX() : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 700,
                damping: 30,
              }}
              aria-hidden="true"
            >
              {renderThumbContent()}
            </motion.div>
          </motion.label>
        </div>

        {/* 标签和描述 */}
        {labelPosition === 'right' && (
          <div className="flex flex-col gap-[var(--spacing-1)]">
            {label && (
              <span
                id={`${switchId}-label`}
                className={cn(
                  'text-sm font-medium text-[var(--color-text-primary)]',
                  disabled && 'opacity-50',
                  labelClassName
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                id={`${switchId}-description`}
                className={cn(
                  'text-sm text-[var(--color-text-secondary)]',
                  disabled && 'opacity-50',
                  descriptionClassName
                )}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'