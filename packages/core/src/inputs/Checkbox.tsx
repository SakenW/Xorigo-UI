import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'
import { Check, Minus } from 'lucide-react'

// Checkbox变体配置
const checkboxVariants = cva(
  // 基础样式
  'flex items-center justify-center border rounded transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        // 默认样式 - 实心方块
        default:
          'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-600 focus:ring-blue-500/20 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500',

        // 填充样式 - 背景色填充
        filled:
          'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-blue-600 focus:ring-blue-500/20 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500',

        // 轮廓样式 - 粗边框
        outlined:
          'border-2 border-gray-300 dark:border-gray-600 bg-transparent text-blue-600 focus:ring-blue-500/20 checked:border-blue-600 dark:checked:border-blue-500',

        // 霓虹样式 - 赛博朋克风格
        neon:
          'border-cyan-400 bg-black/50 text-cyan-400 focus:ring-cyan-400/20 checked:bg-cyan-600 checked:border-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.3)] checked:shadow-[0_0_10px_rgba(6,182,212,0.5)]',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      status: {
        default: '',
        error: 'border-red-500 focus:ring-red-500/20 checked:border-red-600 dark:checked:border-red-500',
        success: 'border-green-500 focus:ring-green-500/20 checked:border-green-600 dark:checked:border-green-500',
        warning: 'border-yellow-500 focus:ring-yellow-500/20 checked:border-yellow-600 dark:checked:border-yellow-500',
      },
      indeterminate: {
        true: '',
      },
    },
    compoundVariants: [
      // indeterminate + variant 样式
      {
        indeterminate: true,
        variant: 'default',
        className: 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500',
      },
      {
        indeterminate: true,
        variant: 'filled',
        className: 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500',
      },
      {
        indeterminate: true,
        variant: 'outlined',
        className: 'border-blue-600 dark:border-blue-500',
      },
      {
        indeterminate: true,
        variant: 'neon',
        className: 'bg-cyan-600 border-cyan-400',
      },
      // indeterminate + status 样式
      {
        indeterminate: true,
        status: 'error',
        className: 'bg-red-600 border-red-600 dark:bg-red-500 dark:border-red-500',
      },
      {
        indeterminate: true,
        status: 'success',
        className: 'bg-green-600 border-green-600 dark:bg-green-500 dark:border-green-500',
      },
      {
        indeterminate: true,
        status: 'warning',
        className: 'bg-yellow-600 border-yellow-600 dark:bg-yellow-500 dark:border-yellow-500',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      status: 'default',
      indeterminate: false,
    },
  }
)

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onDrag' | 'onDragStart' | 'onDragEnd'>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  error?: string
  helperText?: string
  indeterminate?: boolean
  labelPosition?: 'right' | 'left'
  onIndeterminateChange?: (indeterminate: boolean) => void
}

// Checkbox组件实现
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      required = false,
      disabled = false,
      variant = 'default',
      size = 'md',
      status,
      indeterminate = false,
      labelPosition = 'right',
      onIndeterminateChange,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()
    const internalRef = useRef<HTMLInputElement>(null)
    const checkboxId = id || `checkbox-${React.useId()}`

    // 处理ref转发
    useImperativeHandle(ref, () => internalRef.current!)

    // 处理状态
    const effectiveStatus = status || (error ? 'error' : 'default')
    const effectiveIndeterminate = indeterminate && !disabled

    // 处理indeterminate状态变化
    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = effectiveIndeterminate
      }
    }, [effectiveIndeterminate])

    // 处理变化事件
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // 如果之前是indeterminate状态，现在变为checked状态
      if (effectiveIndeterminate) {
        onIndeterminateChange?.(false)
      }
      onChange?.(e)
    }

    // 获取主题样式
    const getCheckboxThemeStyle = (): React.CSSProperties => {
      if (variant === 'neon') {
        return {
          boxShadow: `0 0 5px ${themeConfig.glow}`,
        }
      }
      return {}
    }

    // 图标尺寸映射
    const iconSizeMap = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    }

    // 渲染checkbox内容
    const renderCheckboxContent = () => {
      if (effectiveIndeterminate) {
        return <Minus className={cn(iconSizeMap[size || 'md'], 'text-current')} />
      }
      if (checked) {
        return <Check className={cn(iconSizeMap[size || 'md'], 'text-current')} />
      }
      return null
    }

    // Checkbox组件
    const checkboxElement = (
      <motion.input
        ref={internalRef}
        id={checkboxId}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        className={cn(
          checkboxVariants({
            variant,
            size,
            status: effectiveStatus as any,
            indeterminate: effectiveIndeterminate,
          }),
          // 隐藏原生checkbox样式，显示自定义样式
          'appearance-none',
          variant === 'neon' && 'text-cyan-400'
        )}
        style={getCheckboxThemeStyle()}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        transition={{ duration: 0.2 }}
        // 过滤掉与Framer Motion冲突的属性
        {...Object.keys(props).reduce((acc, key) => {
          if (!['onDrag', 'onDragStart', 'onDragEnd'].includes(key)) {
            acc[key] = props[key as keyof typeof props]
          }
          return acc
        }, {} as any)}
      />
    )

    // 渲染自定义checkbox外观
    const customCheckbox = (
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none',
          checkboxVariants({
            variant,
            size,
            status: effectiveStatus as any,
            indeterminate: effectiveIndeterminate,
          })
        )}
        style={getCheckboxThemeStyle()}
      >
        {renderCheckboxContent()}
      </div>
    )

    // 渲染标签
    const renderLabel = () => {
      if (!label) return null

      return (
        <motion.label
          htmlFor={checkboxId}
          className={cn(
            'text-sm font-medium cursor-pointer select-none',
            disabled
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300',
            effectiveStatus === 'error' && 'text-red-700 dark:text-red-400',
            labelPosition === 'left' ? 'mr-3' : 'ml-3'
          )}
          initial={{ opacity: 0, x: labelPosition === 'left' ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )
    }

    return (
      <div className={cn('flex flex-col', className)}>
        <div className={cn(
          'flex items-center',
          labelPosition === 'left' ? 'flex-row' : 'flex-row'
        )}>
          {/* 根据labelPosition调整顺序 */}
          {labelPosition === 'left' && renderLabel()}

          {/* Checkbox容器 */}
          <div className="relative">
            {checkboxElement}
            {customCheckbox}
          </div>

          {labelPosition === 'right' && renderLabel()}
        </div>

        {/* 帮助文本 */}
        {helperText && !error && (
          <motion.p
            className={cn(
              'text-sm mt-1',
              labelPosition === 'left' ? 'ml-8' : 'ml-8',
              'text-gray-500 dark:text-gray-400'
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {helperText}
          </motion.p>
        )}

        {/* 错误信息 */}
        <AnimatePresence>
          {error && (
            <motion.p
              className={cn(
                'text-sm mt-1 text-red-600 dark:text-red-400',
                labelPosition === 'left' ? 'ml-8' : 'ml-8'
              )}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'