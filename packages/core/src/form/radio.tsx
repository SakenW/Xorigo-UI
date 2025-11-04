'use client'

import React, { createContext, useContext, useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// RadioGroup Context
interface RadioGroupContextValue {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  name?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined' | 'neon'
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined)

const useRadioGroup = () => {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error('Radio must be used within RadioGroup')
  }
  return context
}

// Radio变体配置
const radioVariants = cva(
  // 基础样式
  'relative flex items-center justify-center border rounded-full transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // 默认样式 - 实心圆圈
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      status: 'default',
    },
  }
)

// RadioGroup Props
export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  name?: string
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined' | 'neon'
  spacing?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

// Radio Props
export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onDrag' | 'onDragStart' | 'onDragEnd'>,
    VariantProps<typeof radioVariants> {
  value: string
  label?: React.ReactNode
  description?: string
  disabled?: boolean
  labelPosition?: 'right' | 'left'
}

// RadioCard Props
export interface RadioCardProps extends RadioProps {
  icon?: React.ReactNode
  extra?: React.ReactNode
}

// RadioGroup Component
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      disabled = false,
      name,
      direction = 'vertical',
      size = 'md',
      variant = 'default',
      spacing = 'md',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue)
    const currentValue = value !== undefined ? value : internalValue

    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    }

    // 间距映射
    const spacingMap = {
      sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
      md: direction === 'vertical' ? 'space-y-3' : 'space-x-3',
      lg: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    }

    return (
      <RadioGroupContext.Provider
        value={{
          value: currentValue,
          onChange: handleChange,
          disabled,
          name,
          size,
          variant,
        }}
      >
        <div
          ref={ref}
          className={cn(
            'flex',
            direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            spacingMap[spacing],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

// Radio Component
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      label,
      description,
      disabled: disabledProp,
      labelPosition = 'right',
      className,
      ...props
    },
    ref
  ) => {
    const { value: groupValue, onChange, disabled: groupDisabled, size, variant, name } = useRadioGroup()
    const { themeConfig } = useTheme()
    const disabled = disabledProp || groupDisabled
    const isChecked = value === groupValue

    const radioId = `radio-${React.useId()}-${value}`

    const handleChange = () => {
      if (!disabled) {
        onChange(value)
      }
    }

    // 获取主题样式
    const getRadioThemeStyle = (): React.CSSProperties => {
      if (variant === 'neon') {
        return {
          boxShadow: `0 0 5px ${themeConfig.glow}`,
        }
      }
      return {}
    }

    // 图标尺寸映射
    const dotSizeMap = {
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
    }

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'flex items-start gap-3 cursor-pointer group',
          disabled && 'cursor-not-allowed opacity-50',
          labelPosition === 'left' && 'flex-row-reverse',
          className
        )}
      >
        {/* Radio输入框 */}
        <div className="relative flex items-center justify-center mt-0.5">
          <motion.input
            ref={ref}
            id={radioId}
            type="radio"
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              radioVariants({
                variant,
                size,
                }),
              // 隐藏原生radio样式，显示自定义样式
              'appearance-none',
              variant === 'neon' && 'text-cyan-400'
            )}
            style={getRadioThemeStyle()}
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

          {/* 自定义Radio外观 */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center pointer-events-none rounded-full border-2',
              variant === 'default' && cn(
                isChecked
                  ? 'border-blue-500 bg-white dark:bg-gray-800'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
                !disabled && 'group-hover:border-blue-400'
              ),
              variant === 'filled' && cn(
                isChecked
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900',
                !disabled && 'group-hover:border-blue-400'
              ),
              variant === 'outlined' && cn(
                isChecked
                  ? 'border-blue-500 bg-transparent'
                  : 'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
                !disabled && 'group-hover:border-blue-400'
              ),
              variant === 'neon' && cn(
                isChecked
                  ? 'border-cyan-400 bg-black/50'
                  : 'border-cyan-400 bg-black/50',
                !disabled && 'group-hover:border-cyan-300'
              ),
              radioVariants({ size, variant })
            )}
          >
            {/* 内圈（选中状态） */}
            <AnimatePresence>
              {isChecked && (
                <motion.div
                  className={cn(
                    'rounded-full bg-current',
                    dotSizeMap[size || 'md']
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 标签和描述 */}
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </div>
            )}
            {description && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {description}
              </div>
            )}
          </div>
        )}
      </label>
    )
  }
)

Radio.displayName = 'Radio'

// RadioCard Component (卡片样式的 Radio)
export const RadioCard = forwardRef<HTMLLabelElement, RadioCardProps>(
  (
    {
      value,
      label,
      description,
      icon,
      extra,
      disabled: disabledProp,
      className,
      ...props
    },
    ref
  ) => {
    const { value: groupValue, onChange, disabled: groupDisabled, variant } = useRadioGroup()
    const { themeConfig } = useTheme()
    const disabled = disabledProp || groupDisabled
    const isChecked = value === groupValue

    const radioId = `radio-card-${React.useId()}-${value}`

    const handleClick = (e: React.MouseEvent<HTMLLabelElement>) => {
      if (!disabled) {
        onChange(value)
      }
    }

    // 获取主题样式
    const getCardThemeStyle = (): React.CSSProperties => {
      if (variant === 'neon') {
        return {
          boxShadow: isChecked ? `0 0 10px ${themeConfig.glow}` : `0 0 5px ${themeConfig.glow}`,
          borderColor: isChecked ? (themeConfig.colors?.[400] as unknown as string) : undefined,
        }
      }
      return {}
    }

    return (
      <motion.label
        ref={ref}
        htmlFor={radioId}
        onClick={handleClick}
        className={cn(
          'relative p-4 border-2 rounded-lg cursor-pointer transition-all',
          isChecked
            ? variant === 'neon'
              ? 'border-cyan-400 bg-black/50'
              : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        style={getCardThemeStyle()}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
        {...props}
      >
        {/* 隐藏的radio输入框 */}
        <input
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => {}} // 由label的onClick处理
          disabled={disabled}
          className="sr-only"
        />

        {/* 选中指示器 */}
        <AnimatePresence>
          {isChecked && (
            <motion.div
              className="absolute top-3 right-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center',
                variant === 'neon'
                  ? 'bg-cyan-400 text-black'
                  : 'bg-blue-500 text-white'
              )}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-3">
          {icon && (
            <div className={cn(
              'mt-0.5',
              variant === 'neon'
                ? 'text-cyan-400'
                : 'text-gray-600 dark:text-gray-400'
            )}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            {label && (
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {label}
              </div>
            )}
            {description && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </div>
            )}
            {extra}
          </div>
        </div>
      </motion.label>
    )
  }
)

RadioCard.displayName = 'RadioCard'

export default { RadioGroup, Radio, RadioCard }