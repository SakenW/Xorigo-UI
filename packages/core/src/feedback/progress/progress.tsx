/**
 * Progress 进度组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 线性进度（确定/不确定）
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const progressVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "",
        primary: "",
        success: "",
        warning: "",
        destructive: "",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3",
        xl: "h-4",
      },

      // 进度条类型
      type: {
        linear: "h-full",
        circular: "h-full w-full rounded-full",
      },

      // 状态
      state: {
        default: "",
        indeterminate: "animate-pulse",
        loading: "animate-pulse",
      },

      // 是否显示标签
      showLabel: {
        false: "",
        true: "",
      },

      // 动画效果
      animated: {
        false: "",
        true: "transition-all duration-300 ease-in-out",
      }
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'md',
      type: 'linear',
      state: 'default',
      showLabel: false,
      animated: true,
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  /**
   * 当前进度值 (0-100)
   */
  value?: number

  /**
   * 最大值
   */
  max?: number

  /**
   * 是否不确定进度
   */
  indeterminate?: boolean

  /**
   * 是否显示百分比标签
   */
  showLabel?: boolean

  /**
   * 是否显示数值标签
   */
  showValue?: boolean

  /**
   * 标签格式化函数
   */
  labelFormatter?: (value: number, max: number) => string

   /**
   * 是否垂直显示
   */
  vertical?: boolean

  /**
   * 条纹效果
   */
  striped?: boolean

   /**
   * 动画条纹
   */
  animated?: boolean

   /**
   * 自定义样式类名
   */
  className?: string

  /**
   * ARIA 标签
   */
  ariaLabel?: string

  /**
   * ARIA 值文本
   */
  ariaValueText?: string

  /**
   * 角色
   */
  role?: 'progressbar' | 'meter'
}

// =============================================================================
// Progress 主组件实现
// =============================================================================

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      variant,
      size,
      type,
      state,
      showLabel,
      value = 0,
      max = 100,
      indeterminate = false,
      showValue = false,
      labelFormatter,
      vertical = false,
      striped = false,
      animated = false,
      className,
      ariaLabel,
      ariaValueText,
      role = 'progressbar',
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 计算进度百分比
    const percentage = React.useMemo(() => {
      if (indeterminate) return 0
      const safeValue = Math.max(0, Math.min(100, (value / max) * 100))
      return Math.round(safeValue)
    }, [value, max, indeterminate])

    // 格式化标签
    const formattedLabel = React.useMemo(() => {
      if (labelFormatter) {
        return labelFormatter(value, max)
      }
      return `${percentage}%`
    }, [percentage, value, max, labelFormatter])

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      '--progress-bg': `hsl(${theme.colors.background})`,
      '--progress-foreground': `hsl(${theme.colors.primary})`,
      '--progress-secondary': `hsl(${theme.colors.secondary})`,
      '--progress-success': `hsl(${theme.colors.success})`,
      '--progress-warning': `hsl(${theme.colors.warning})`,
      '--progress-destructive': `hsl(${theme.colors.danger})`,
      // 可根据七轴动态调整
    }

    // 生成进度条样式
    const progressStyle: React.CSSProperties = {
      width: indeterminate ? undefined : `${percentage}%`,
      backgroundColor: `var(--progress-${variant === 'default' ? 'secondary' : variant})`,
      // 条纹效果
      ...(striped && {
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(255, 255, 255, 0.1) 10px,
          transparent 10px
        )`,
        ...(animated && {
          animation: 'progress-bar-stripes 1s linear infinite',
        }),
      },
    }

    // 生成 ARIA 属性
    const ariaProps: React.AriaAttributes = {
      'aria-label': ariaLabel || (vertical ? 'Vertical progress' : 'Progress'),
      'aria-valuenow': indeterminate ? undefined : percentage,
      'aria-valuemin': 0,
      'aria-valuemax': max,
      'aria-valuetext': ariaValueText || formattedLabel,
      role: role,
    }

    return (
      <div
        ref={ref}
        className={cn(
          progressVariants({
            variant,
            size,
            type,
            state: indeterminate ? 'indeterminate' : state,
            showLabel: showLabel || showValue,
            animated,
          }),
          // 垂直布局调整
          vertical && "flex-col-reverse",
          className
        )}
        style={themeStyles}
        {...ariaProps}
        {...props}
      >
        {/* 进度条 */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            progressStyle
          )}
          style={{
            // 不确定进度动画
            ...(indeterminate && {
              width: '30%',
              animation: 'progress-bar-indeterminate 1.5s ease-in-out infinite',
            },
          }}
        />

        {/* 标签 */}
        {(showLabel || showValue) && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center text-xs font-medium",
              vertical && "flex-col-reverse"
            )}
            style={{
              color: `var(--progress-${variant === 'default' ? 'foreground' : variant})`,
            }}
          >
            {showValue && (
              <span className={cn("font-mono", vertical && "mb-1")}>
                {formattedLabel}
              </span>
            )}
            {showLabel && !showValue && (
              <span className="text-xs">
                {formattedLabel}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

// =============================================================================
// 组件元数据
// =============================================================================

Progress.displayName = 'Progress'

// =============================================================================
// 导出
// =============================================================================

export { Progress, progressVariants }
export type { ProgressProps }