'use client'
import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../../utils/cn'
import { getChipAriaProps } from '../../utils/accessibility'

// 测试Props生成工具
const generateTestProps = (component: string, options: {
  color?: string
  variant?: string
  size?: string
  state?: string
  testId?: string
}) => {
  const { color, variant, size, state, testId } = options
  const testIdValue = testId || `${component}-${color || 'primary'}-${variant || 'solid'}-${size || 'md'}-${state || 'default'}`
  return {
    'data-testid': testIdValue,
    'data-component': component,
    'data-color': color,
    'data-variant': variant,
    'data-size': size,
    'data-state': state,
  }
}

// 芯片变体配置
const chipVariants = cva(
  'relative inline-flex items-center gap-1.5 font-medium transition-all duration-200 focus:outline-none',
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
      },
      variant: {
        'solid': 'bg-[var(--bg-primary-action)] text-[var(--text-inverse)]',
        'soft': 'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
        'outline': 'border border-[var(--border-primary)] text-[var(--text-primary)] bg-transparent',
        'ghost': 'text-[var(--text-primary)]',
      },
      size: {
        xs: 'px-2 py-0.5 text-xs h-5',
        sm: 'px-2.5 py-1 text-xs h-6',
        md: 'px-3 py-1.5 text-sm h-8',
        lg: 'px-4 py-2 text-sm h-10',
      },
      state: {
        default: '',
        selected: 'ring-2 ring-[var(--border-focus)]',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    compoundVariants: [
      // Primary color combinations
      {
        color: 'primary',
        variant: 'soft',
        className: 'bg-[var(--bg-primary)] text-[var(--text-primary)]',
      },
      {
        color: 'primary',
        variant: 'outline',
        className: 'border-[var(--border-primary-action)] text-[var(--text-primary-action)]',
      },
      {
        color: 'primary',
        variant: 'ghost',
        className: 'text-[var(--text-primary-action)]',
      },
      {
        color: 'primary',
        state: 'selected',
        className: 'ring-[var(--border-primary-action)]',
      },
      // Secondary color combinations
      {
        color: 'secondary',
        variant: 'soft',
        className: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
      },
      {
        color: 'secondary',
        variant: 'outline',
        className: 'border-[var(--border-secondary)] text-[var(--text-secondary)]',
      },
      {
        color: 'secondary',
        variant: 'ghost',
        className: 'text-[var(--text-secondary)]',
      },
      // Success color combinations
      {
        color: 'success',
        variant: 'soft',
        className: 'bg-[var(--bg-success)]/20 text-[var(--text-success)]',
      },
      {
        color: 'success',
        variant: 'outline',
        className: 'border-[var(--border-success)] text-[var(--text-success)]',
      },
      {
        color: 'success',
        variant: 'ghost',
        className: 'text-[var(--text-success)]',
      },
      {
        color: 'success',
        state: 'selected',
        className: 'ring-[var(--border-success)]',
      },
      // Warning color combinations
      {
        color: 'warning',
        variant: 'soft',
        className: 'bg-[var(--bg-warning)]/20 text-[var(--text-warning)]',
      },
      {
        color: 'warning',
        variant: 'outline',
        className: 'border-[var(--border-warning)] text-[var(--text-warning)]',
      },
      {
        color: 'warning',
        variant: 'ghost',
        className: 'text-[var(--text-warning)]',
      },
      {
        color: 'warning',
        state: 'selected',
        className: 'ring-[var(--border-warning)]',
      },
      // Error color combinations
      {
        color: 'error',
        variant: 'soft',
        className: 'bg-[var(--bg-error)]/20 text-[var(--text-error)]',
      },
      {
        color: 'error',
        variant: 'outline',
        className: 'border-[var(--border-error)] text-[var(--text-error)]',
      },
      {
        color: 'error',
        variant: 'ghost',
        className: 'text-[var(--text-error)]',
      },
      {
        color: 'error',
        state: 'selected',
        className: 'ring-[var(--border-error)]',
      },
      // Info color combinations
      {
        color: 'info',
        variant: 'soft',
        className: 'bg-[var(--bg-info)]/20 text-[var(--text-info)]',
      },
      {
        color: 'info',
        variant: 'outline',
        className: 'border-[var(--border-info)] text-[var(--text-info)]',
      },
      {
        color: 'info',
        variant: 'ghost',
        className: 'text-[var(--text-info)]',
      },
      {
        color: 'info',
        state: 'selected',
        className: 'ring-[var(--border-info)]',
      },
    ],
    defaultVariants: {
      color: 'primary',
      variant: 'solid',
      size: 'md',
      state: 'default',
    },
  }
)

// 图标尺寸配置
const iconSizeVariants = cva('flex-shrink-0', {
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// ChipDisplay 组件接口
export interface ChipDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  /** 芯片文本内容 */
  label: string
  /** 左侧图标 */
  leftIcon?: React.ReactNode
  /** 右侧图标 */
  rightIcon?: React.ReactNode
  /** 头像图片 */
  avatar?: string
  /** 是否显示为选中状态 */
  isSelected?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 悬浮提示文本 */
  labelText?: string
  /** 点击事件 */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** 自定义图标组件 */
  icon?: React.ReactNode
  /** 测试ID */
  testId?: string
  /** 是否可关闭（显示关闭按钮） */
  isClosable?: boolean
  /** 关闭事件 */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** 状态指示器（dot） */
  status?: 'online' | 'offline' | 'busy' | 'away'
  /** 最大宽度（超过则截断） */
  maxWidth?: number
  /** 截断时显示的工具提示 */
  showTooltip?: boolean
  /** 点击动画效果 */
  clickable?: boolean
}

/**
 * ChipDisplay 展示型芯片组件
 *
 * 用于显示标签、状态、信息等内容的芯片组件，支持多种颜色、变体和尺寸。
 * 基于七轴主题系统设计，确保在不同主题下的一致性。
 */
export const ChipDisplay = forwardRef<HTMLDivElement, ChipDisplayProps>(
  (
    {
      className,
      color = 'primary',
      variant = 'solid',
      size = 'md',
      state = 'default',
      label,
      leftIcon,
      rightIcon,
      avatar,
      isSelected = false,
      isDisabled = false,
      labelText,
      onClick,
      icon,
      testId,
      isClosable = false,
      onClose,
      status,
      maxWidth,
      showTooltip = true,
      clickable = false,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()
    const [isHovered, setIsHovered] = useState(false)
    const [isImageError, setIsImageError] = useState(false)

    // 确定状态
    const currentState = isDisabled ? 'disabled' : isSelected ? 'selected' : 'default'

    // 生成可访问性属性
    const ariaProps = getChipAriaProps({
      label: labelText || label,
      isSelected,
      isDisabled,
    })

    // 生成测试Props
    const testProps = generateTestProps('chip-display', {
      color,
      variant,
      size,
      state: currentState,
      testId,
    })

    // 获取状态指示器颜色
    const getStatusColor = (statusType?: string) => {
      switch (statusType) {
        case 'online':
          return 'bg-[var(--bg-success)]'
        case 'offline':
          return 'bg-[var(--bg-secondary)]'
        case 'busy':
          return 'bg-[var(--bg-error)]'
        case 'away':
          return 'bg-[var(--bg-warning)]'
        default:
          return ''
      }
    }

    // 处理图片错误
    const handleImageError = () => {
      setIsImageError(true)
    }

    // 渲染内容
    const renderContent = () => {
      const contentClass = 'inline-flex items-center gap-1.5 truncate'
      const hasMaxWidth = maxWidth && maxWidth > 0

      // 文本内容
      const textElement = (
        <span
          className={contentClass}
          style={hasMaxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
        >
          {/* 左侧内容 */}
          <div className="inline-flex items-center gap-1.5 truncate">
            {/* 头像或图标 */}
            {avatar && !isImageError ? (
              <img
                src={avatar}
                alt={label}
                className={cn(
                  iconSizeVariants({ size }),
                  'rounded-full object-cover'
                )}
                onError={handleImageError}
              />
            ) : leftIcon || icon ? (
              <span className={iconSizeVariants({ size })}>
                {leftIcon || icon}
              </span>
            ) : null}

            {/* 文本标签 */}
            <span
              className={hasMaxWidth ? 'truncate' : ''}
              title={showTooltip && hasMaxWidth ? label : undefined}
            >
              {label}
            </span>
          </div>

          {/* 右侧内容 */}
          <div className="inline-flex items-center gap-1">
            {/* 状态指示器 */}
            {status && (
              <span
                className={cn(
                  'rounded-full',
                  iconSizeVariants({ size })
                )}
              >
                <span
                  className={cn(
                    'block w-full h-full rounded-full',
                    getStatusColor(status)
                  )}
                />
              </span>
            )}

            {/* 右侧图标 */}
            {rightIcon && !isClosable && (
              <span className={iconSizeVariants({ size })}>
                {rightIcon}
              </span>
            )}

            {/* 关闭按钮 */}
            {isClosable && (
              <button
                type="button"
                className={cn(
                  iconSizeVariants({ size }),
                  'ml-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
                  'focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]',
                  isDisabled && 'pointer-events-none'
                )}
                onClick={onClose}
                disabled={isDisabled}
                aria-label={`Close ${label}`}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </span>
      )

      return textElement
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          chipVariants({ color, variant, size, state: currentState }),
          clickable && !isDisabled && 'cursor-pointer',
          isDisabled && 'pointer-events-none',
          className
        )}
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={clickable && !isDisabled ? { scale: 1.02 } : undefined}
        whileTap={clickable && !isDisabled ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2 }}
        {...ariaProps}
        {...testProps}
        {...props}
      >
        {/* 芯片内容 */}
        {renderContent()}
      </motion.div>
    )
  }
)

ChipDisplay.displayName = 'ChipDisplay'

// 导出变体类型
export { chipVariants, iconSizeVariants }
export type ChipDisplayVariants = VariantProps<typeof chipVariants>
