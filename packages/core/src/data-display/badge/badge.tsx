import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../../utils'

// 测试Props生成工具
const generateTestProps = (component: string, options: {
  variant?: string
  color?: string
  size?: string
  state?: string
  testId?: string
}) => {
  const { variant, color, size, state, testId } = options
  const testIdValue = testId || `${component}-${variant || 'default'}-${color || 'primary'}-${size || 'md'}-${state || 'normal'}`
  return {
    'data-testid': testIdValue,
    'data-component': component,
    'data-variant': variant,
    'data-color': color,
    'data-size': size,
    'data-state': state,
  }
}

// 使用语义化令牌定义徽章颜色变体
const getSemanticColorClasses = () => ({
  // 主要徽章 - 使用语义化主色
  primary: `bg-[var(--bg-primary-action)] text-[var(--text-inverse)] border-[var(--border-primary-action)] shadow-sm`,

  // 次要徽章 - 使用语义化次要色
  secondary: `bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-secondary)]`,

  // 成功徽章 - 使用语义化成功色
  success: `bg-[var(--bg-success)] text-[var(--text-inverse)] border-[var(--border-success)] shadow-sm`,

  // 警告徽章 - 使用语义化警告色
  warning: `bg-[var(--bg-warning)] text-[var(--text-inverse)] border-[var(--border-warning)] shadow-sm`,

  // 错误徽章 - 使用语义化错误色
  error: `bg-[var(--bg-error)] text-[var(--text-inverse)] border-[var(--border-error)] shadow-sm`,

  // 信息徽章 - 使用语义化信息色
  info: `bg-[var(--bg-info)] text-[var(--text-inverse)] border-[var(--border-info)] shadow-sm`,

  // 灰度徽章
  gray: `bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-tertiary)]`,

  // 霓虹徽章
  neon: `bg-[var(--bg-contrast-high)] text-[var(--text-info)] border-[var(--border-info)] shadow-[0_0_8px_var(--border-info)] animate-pulse`,
})

// 徽章变体配置
const badgeVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
  {
    variants: {
      variant: {
        // 实心徽章
        solid: '',

        // 描边徽章
        outline: 'border-2 bg-transparent',

        // 柔和徽章
        soft: 'bg-opacity-10 border-0 font-normal',

        // 轮廓徽章
        ghost: 'border-0 bg-transparent font-normal text-[var(--text-primary)]',

        // 渐变徽章
        gradient: 'bg-gradient-to-r shadow-md hover:shadow-lg',

        // 发光徽章
        glow: 'shadow-[0_0_12px_currentColor] animate-pulse',
      },
      color: {
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
        gray: '',
        neon: '',
      },
      size: {
        xs: 'px-2 py-0.5 text-[10px] min-h-[16px]',
        sm: 'px-2.5 py-0.5 text-xs min-h-[20px]',
        md: 'px-3 py-1 text-sm min-h-[24px]',
        lg: 'px-4 py-1.5 text-sm min-h-[28px]',
        xl: 'px-5 py-2 text-base min-h-[32px]',
      },
      shape: {
        rounded: 'rounded-full',
        pill: 'rounded-full',
        square: 'rounded-md',
      },
      elevated: {
        true: 'shadow-md',
        false: 'shadow-sm',
      },
    },
    compoundVariants: [
      // variant + color 组合
      ...Object.entries(getSemanticColorClasses()).map(([color, classes]) => ({
        color: color as keyof typeof getSemanticColorClasses,
        className: classes,
      })),
      // outline + soft 变体调整
      {
        variant: 'outline',
        size: 'xs',
        className: 'px-1.5 py-0.5',
      },
      {
        variant: 'soft',
        size: 'xs',
        className: 'px-2 py-0',
      },
      // 点形徽章特殊尺寸
      {
        dot: true,
        size: 'xs',
        className: 'w-1.5 h-1.5 p-0 min-h-[6px] min-w-[6px]',
      },
      {
        dot: true,
        size: 'sm',
        className: 'w-2 h-2 p-0 min-h-[8px] min-w-[8px]',
      },
      {
        dot: true,
        size: 'md',
        className: 'w-2.5 h-2.5 p-0 min-h-[10px] min-w-[10px]',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'md',
      shape: 'rounded',
      elevated: false,
    },
  }
)

// 徽章组件接口
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** 徽章内容 */
  children?: React.ReactNode
  /** 点形徽章（仅显示一个点） */
  dot?: boolean
  /** 数字徽章（显示数字） */
  count?: number
  /** 数字徽章的最大显示值 */
  max?: number
  /** 可关闭状态 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 悬浮显示的提示文本 */
  title?: string
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 隐藏空值徽章 */
  hidden?: boolean
  /** 闪烁动画 */
  pulse?: boolean
  /** 徽章状态 - 用于无障碍访问 */
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  /** 测试ID */
  testId?: string
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      color = 'primary',
      size = 'md',
      shape = 'rounded',
      elevated,
      children,
      dot = false,
      count,
      max = 99,
      closable = false,
      onClose,
      title,
      icon,
      hidden = false,
      pulse = false,
      status,
      testId,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()

    // 处理数字徽章显示
    const displayCount = count !== undefined ? (count > max ? `${max}+` : count) : undefined

    // 隐藏条件
    if (hidden || (count === 0 && !dot && !children)) {
      return null
    }

    // 获取语义化颜色类名
    const getSemanticClasses = () => {
      const semanticColors = getSemanticColorClasses()
      return semanticColors[color as keyof typeof semanticColors] || ''
    }

    // 获取状态类名
    const getStatusClass = () => {
      if (!status) return ''
      const statusMap = {
        success: 'text-[var(--text-success)]',
        warning: 'text-[var(--text-warning)]',
        error: 'text-[var(--text-error)]',
        info: 'text-[var(--text-info)]',
        neutral: 'text-[var(--text-secondary)]',
      }
      return statusMap[status]
    }

    // 生成可访问性属性
    const getAriaProps = () => {
      const ariaProps: Record<string, any> = {}

      if (title) {
        ariaProps.title = title
      }

      if (dot) {
        ariaProps['aria-label'] = '状态指示器'
      }

      if (status) {
        ariaProps['aria-label'] = `状态: ${status}`
      }

      if (count !== undefined) {
        ariaProps['aria-label'] = `通知数量: ${count}`
      }

      if (closable) {
        ariaProps['aria-label'] = '可关闭的徽章'
      }

      return ariaProps
    }

    // 生成测试Props
    const testProps = generateTestProps('badge', {
      variant,
      color,
      size,
      state: hidden ? 'hidden' : 'visible',
      testId,
    })

    // 关闭按钮组件
    const CloseButton = () => (
      <button
        onClick={onClose}
        className="ml-1 flex h-full items-center justify-center rounded-full p-0 text-current opacity-60 hover:opacity-100 focus:opacity-100 focus:outline-none"
        aria-label="关闭徽章"
        type="button"
      >
        <svg
          className={cn(
            'h-3 w-3',
            size === 'xs' && 'h-2.5 w-2.5',
            size === 'sm' && 'h-3 w-3',
            size === 'lg' && 'h-4 w-4',
            size === 'xl' && 'h-5 w-5'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )

    // 徽章内容
    const BadgeContent = () => (
      <>
        {/* 图标 */}
        {icon && !dot && !children && (
          <span className={cn('mr-1', size === 'xs' && 'h-3 w-3', size === 'sm' && 'h-3.5 w-3.5', size === 'md' && 'h-4 w-4', size === 'lg' && 'h-4.5 w-4.5', size === 'xl' && 'h-5 w-5')}>
            {icon}
          </span>
        )}

        {/* 点形徽章 */}
        {dot && !children && !icon && <span className="block h-full w-full rounded-full bg-current" />}

        {/* 数字徽章 */}
        {displayCount !== undefined && !dot && (
          <span>{displayCount}</span>
        )}

        {/* 自定义内容 */}
        {!dot && !icon && displayCount === undefined && children}

        {/* 关闭按钮 */}
        {closable && onClose && <CloseButton />}
      </>
    )

    return (
      <motion.span
        ref={ref}
        className={cn(
          badgeVariants({ variant, color, size, shape, elevated }),
          getSemanticClasses(),
          getStatusClass(),
          pulse && 'animate-pulse',
          className
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        {...getAriaProps()}
        {...testProps}
        {...props}
      >
        <BadgeContent />
      </motion.span>
    )
  }
)

Badge.displayName = 'Badge'

// 导出变体类型
export { badgeVariants }
export type BadgeVariants = VariantProps<typeof badgeVariants>
