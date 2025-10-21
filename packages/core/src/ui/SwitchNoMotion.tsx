'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// SwitchNoMotion变体配置
const switchNoMotionVariants = cva(
  // 基础样式
  'relative inline-flex items-center cursor-pointer transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'w-9 h-5',
        md: 'w-11 h-6',
        lg: 'w-14 h-7',
      },
      variant: {
        default: 'bg-[var(--bg-tertiary)] peer-checked:bg-[var(--bg-primary)]',
        primary: 'bg-[var(--bg-tertiary)] peer-checked:bg-[var(--bg-primary-action)]',
        success: 'bg-[var(--bg-tertiary)] peer-checked:bg-[var(--bg-success)]',
        danger: 'bg-[var(--bg-tertiary)] peer-checked:bg-[var(--bg-error)]',
        warning: 'bg-[var(--bg-tertiary)] peer-checked:bg-[var(--bg-warning)]',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      disabled: false,
    },
  }
)

// Thumb滑块变体配置
const thumbVariants = cva(
  'absolute top-0.5 left-0.5 bg-[var(--bg-glass)] rounded-full shadow-md flex items-center justify-center transition-transform duration-200 ease-in-out',
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
      checked: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  }
)

export interface SwitchNoMotionProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof switchNoMotionVariants> {
  /** 标签文本 */
  label?: string
  /** 描述文本 */
  description?: string
  /** 状态改变回调 */
  onCheckedChange?: (checked: boolean) => void
  /** 默认状态 */
  defaultChecked?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 标签位置 */
  labelPosition?: 'left' | 'right' | 'top' | 'bottom'
}

export const SwitchNoMotion = forwardRef<HTMLInputElement, SwitchNoMotionProps>(
  (
    {
      label,
      description,
      size,
      variant,
      checked,
      defaultChecked = false,
      disabled = false,
      loading = false,
      onChange,
      onCheckedChange,
      labelPosition = 'right',
      className,
      id,
      ...restProps
    },
    forwardedRef
  ) => {
    const switchId = id || `switch-no-motion-${React.useId()}`

    // 内部 ref 和状态用于非受控模式
    const internalRef = React.useRef<HTMLInputElement>(null)
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)

    // 合并 ref
    const ref = forwardedRef || internalRef

    // 判断是否为受控组件
    const isControlled = checked !== undefined
    const currentChecked = isControlled ? checked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked

      // 如果是非受控模式，更新内部状态
      if (!isControlled) {
        setInternalChecked(newChecked)
      }

      onChange?.(e)
      onCheckedChange?.(newChecked)
    }

    // 尺寸配置
    const sizeConfig = {
      sm: {
        track: 'w-9 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-4',
        spinner: 'w-2.5 h-2.5',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
        spinner: 'w-3 h-3',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
        spinner: 'w-3.5 h-3.5',
      },
    }

    const currentSize = sizeConfig[size || 'md']

    // 布局配置
    const layoutClasses = {
      left: 'flex-row-reverse',
      right: 'flex-row',
      top: 'flex-col-reverse items-center',
      bottom: 'flex-col items-center',
    }

    const spacingClasses = {
      left: 'mr-3',
      right: 'mr-3',
      top: 'mb-2',
      bottom: 'mb-2',
    }

    return (
      <div className={cn('inline-flex items-start gap-3', layoutClasses[labelPosition], className)}>
        {/* Switch组件 */}
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={currentChecked}
            disabled={disabled || loading}
            onChange={handleChange}
            className="sr-only peer"
            {...restProps}
          />
          <label
            htmlFor={switchId}
            className={switchNoMotionVariants({
              size,
              variant,
              disabled: disabled || loading,
            })}
          >
            {/* 轨道 */}
            <div
              className={cn(
                'relative rounded-full transition-colors duration-200',
                currentSize.track,
                'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring-primary-action)] peer-focus-visible:ring-offset-2'
              )}
            >
              {/* 滑块 */}
              <div
                className={cn(
                  thumbVariants({ size }),
                  currentChecked && currentSize.translate,
                  'border border-[var(--border-secondary)]'
                )}
              >
                {loading && (
                  <div
                    className={cn(
                      'border-2 border-[var(--border-secondary)] border-t-[var(--text-primary-action)] rounded-full animate-spin',
                      currentSize.spinner
                    )}
                  />
                )}
              </div>
            </div>
          </label>
        </div>

        {/* 标签和描述 */}
        {(label || description) && (
          <div className={cn('flex flex-col', spacingClasses[labelPosition])}>
            {label && (
              <label
                htmlFor={switchId}
                className={cn(
                  'text-sm font-medium text-[var(--text-primary)]',
                  'cursor-pointer select-none',
                  (disabled || loading) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-sm text-[var(--text-secondary)]">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

SwitchNoMotion.displayName = 'SwitchNoMotion'

// 特殊组件：无动画开关组
export interface SwitchNoMotionGroupProps {
  /** 开关选项 */
  options: Array<{
    id: string
    label: string
    description?: string
    checked: boolean
    disabled?: boolean
    loading?: boolean
  }>
  /** 改变回调 */
  onChange?: (id: string, checked: boolean) => void
  /** 开关大小 */
  size?: SwitchNoMotionProps['size']
  /** 变体 */
  variant?: SwitchNoMotionProps['variant']
  /** 布局方向 */
  direction?: 'vertical' | 'horizontal'
  /** 类名 */
  className?: string
}

export const SwitchNoMotionGroup: React.FC<SwitchNoMotionGroupProps> = ({
  options,
  onChange,
  size = 'md',
  variant = 'primary',
  direction = 'vertical',
  className,
}) => {
  const directionClasses = {
    vertical: 'flex-col gap-4',
    horizontal: 'flex-row gap-6',
  }

  return (
    <div className={cn('flex', directionClasses[direction], className)}>
      {options.map((option) => (
        <SwitchNoMotion
          key={option.id}
          id={option.id}
          label={option.label}
          description={option.description}
          checked={option.checked}
          disabled={option.disabled}
          loading={option.loading}
          size={size}
          variant={variant}
          onCheckedChange={(checked) => onChange?.(option.id, checked)}
        />
      ))}
    </div>
  )
}

SwitchNoMotionGroup.displayName = 'SwitchNoMotionGroup'

export { SwitchNoMotion, SwitchNoMotionGroup }