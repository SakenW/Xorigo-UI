'use client'

import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// Switch变体配置
const switchVariants = cva(
  // 基础样式
  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent rounded-full transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // 默认样式 - 灰色主题
        default:
          'bg-gray-200 dark:bg-gray-700 checked:bg-gray-600 dark:checked:bg-gray-300 focus:ring-gray-500/20',

        // 主要样式 - 蓝色主题
        primary:
          'bg-gray-200 dark:bg-gray-700 checked:bg-blue-600 dark:checked:bg-blue-500 focus:ring-blue-500/20',

        // 成功样式 - 绿色主题
        success:
          'bg-gray-200 dark:bg-gray-700 checked:bg-green-600 dark:checked:bg-green-500 focus:ring-green-500/20',

        // 危险样式 - 红色主题
        danger:
          'bg-gray-200 dark:bg-gray-700 checked:bg-red-600 dark:checked:bg-red-500 focus:ring-red-500/20',

        // 霓虹样式 - 赛博朋克风格
        neon:
          'bg-black/50 border-cyan-400 checked:bg-cyan-600 checked:border-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.3)] focus:ring-cyan-400/20',
      },
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
      status: {
        default: '',
        error: 'checked:border-red-500 focus:ring-red-500/20',
        success: 'checked:border-green-500 focus:ring-green-500/20',
        warning: 'checked:border-yellow-500 focus:ring-yellow-500/20',
      },
      loading: {
        true: '',
      },
    },
    compoundVariants: [
      // variant + status 组合
      {
        variant: 'default',
        status: 'error',
        className: 'checked:bg-red-600 dark:checked:bg-red-500',
      },
      {
        variant: 'default',
        status: 'success',
        className: 'checked:bg-green-600 dark:checked:bg-green-500',
      },
      {
        variant: 'default',
        status: 'warning',
        className: 'checked:bg-yellow-600 dark:checked:bg-yellow-500',
      },
      {
        variant: 'primary',
        status: 'error',
        className: 'checked:bg-red-600 dark:checked:bg-red-500',
      },
      {
        variant: 'primary',
        status: 'success',
        className: 'checked:bg-green-600 dark:checked:bg-green-500',
      },
      {
        variant: 'primary',
        status: 'warning',
        className: 'checked:bg-yellow-600 dark:checked:bg-yellow-500',
      },
      {
        variant: 'success',
        status: 'error',
        className: 'checked:bg-red-600 dark:checked:bg-red-500',
      },
      {
        variant: 'success',
        status: 'warning',
        className: 'checked:bg-yellow-600 dark:checked:bg-yellow-500',
      },
      {
        variant: 'danger',
        status: 'success',
        className: 'checked:bg-green-600 dark:checked:bg-green-500',
      },
      {
        variant: 'danger',
        status: 'warning',
        className: 'checked:bg-yellow-600 dark:checked:bg-yellow-500',
      },
      // loading + variant
      {
        loading: true,
        variant: 'neon',
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

// Thumb变体配置
const thumbVariants = cva(
  // 基础样式
  'inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 pointer-events-none',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      checked: {
        true: 'translate-x-5',
      },
      variant: {
        default: 'ring-gray-700/5',
        primary: 'ring-blue-600/5',
        success: 'ring-green-600/5',
        danger: 'ring-red-600/5',
        neon: 'ring-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]',
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

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof switchVariants> {
  label?: string
  description?: string
  loading?: boolean
  labelPosition?: 'right' | 'left'
  thumbIcon?: React.ReactNode
  onCheckedChange?: (checked: boolean) => void
}

// Loading Spinner Component
const LoadingSpinner: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const sizeMap = {
    sm: 'h-2.5 w-2.5 border-2 border-gray-300 border-t-transparent',
    md: 'h-3 w-3 border-2 border-gray-300 border-t-transparent',
    lg: 'h-3.5 w-3.5 border-2 border-gray-300 border-t-transparent',
  }

  return (
    <div className={cn('animate-spin rounded-full', sizeMap[size])} />
  )
}

// Switch Component
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

    // 获取主题样式
    const getSwitchThemeStyle = (): React.CSSProperties => {
      if (effectiveVariant === 'neon') {
        return {
          boxShadow: `0 0 5px ${themeConfig.glow}`,
        }
      }
      return {}
    }

    // 获取thumb主题样式
    const getThumbThemeStyle = (): React.CSSProperties => {
      if (effectiveVariant === 'neon') {
        return {
          boxShadow: `0 0 10px ${themeConfig.glow}`,
        }
      }
      return {}
    }

    // 渲染thumb内容
    const renderThumbContent = () => {
      if (loading) {
        return <LoadingSpinner size={size || 'md'} />
      }
      if (thumbIcon) {
        return (
          <div className="flex items-center justify-center h-full w-full">
            {thumbIcon}
          </div>
        )
      }
      return null
    }

    return (
      <div className={cn('flex items-start gap-3', className)}>
        {/* 根据labelPosition调整顺序 */}
        {labelPosition === 'left' && (
          <div className="flex flex-col">
            {label && (
              <span
                className={cn(
                  'text-sm font-medium text-gray-900 dark:text-gray-100',
                  disabled && 'opacity-50'
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={cn(
                  'text-sm text-gray-500 dark:text-gray-400',
                  disabled && 'opacity-50'
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
              }),
              // 额外的样式处理
              variant === 'neon' && 'text-cyan-400'
            )}
            style={getSwitchThemeStyle()}
            whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
            whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
            transition={{ duration: 0.2 }}
          >
            {/* 隐藏的原生input */}
            <input
              ref={ref}
              id={switchId}
              type="checkbox"
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={handleChange}
              disabled={disabled || loading}
              className="sr-only peer"
              {...props}
            />

            {/* Switch轨道 */}
            <div className="absolute inset-0 rounded-full" />

            {/* Switch thumb */}
            <motion.div
              className={cn(
                thumbVariants({
                  variant: effectiveVariant,
                  size,
                  checked,
                  loading,
                }),
                variant === 'neon' && 'bg-black text-cyan-400 border border-cyan-400'
              )}
              style={getThumbThemeStyle()}
              animate={{
                x: checked ? (size === 'sm' ? 20 : size === 'md' ? 24 : 28) : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 700,
                damping: 30,
              }}
            >
              {renderThumbContent()}
            </motion.div>
          </motion.label>
        </div>

        {/* 标签和描述 */}
        {labelPosition === 'right' && (
          <div className="flex flex-col">
            {label && (
              <span
                className={cn(
                  'text-sm font-medium text-gray-900 dark:text-gray-100',
                  disabled && 'opacity-50'
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={cn(
                  'text-sm text-gray-500 dark:text-gray-400',
                  disabled && 'opacity-50'
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