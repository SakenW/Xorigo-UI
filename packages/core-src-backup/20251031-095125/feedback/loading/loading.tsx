/**
 * Loading 加载组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 状态/通知/进度/结果/无障碍提示
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useThemeSafe } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const loadingVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "relative inline-flex items-center justify-center",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        destructive: "",
        overlay: "absolute inset-0 bg-background-primary/80 backdrop-blur-sm",
        inline: "inline-flex",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        xs: "w-4 h-4",
        sm: "w-5 h-5",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
        "2xl": "w-16 h-16",
      },

      // 动画类型
      type: {
        spinner: "animate-spin",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        dots: "",
        bars: "",
        circle: "",
      },

      // 状态
      state: {
        loading: "",
        success: "",
        error: "",
        paused: "animation-paused",
      },

      // 是否显示标签
      showLabel: {
        false: "",
        true: "",
      },
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'md',
      type: 'spinner',
      state: 'loading',
      showLabel: false,
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  /**
   * 加载文本
   */
  label?: string

  /**
   * 描述文本
   */
  description?: string

  /**
   * 是否全屏显示
   */
  fullscreen?: boolean

  /**
   * 自定义加载图标
   */
  icon?: React.ReactNode

  /**
   * 加载进度 (0-100)
   */
  progress?: number

  /**
   * 是否显示进度百分比
   */
  showProgress?: boolean

  /**
   * 点状动画的点的数量
   */
  dotCount?: number

  /**
   * 条状动画的条的数量
   */
  barCount?: number

  /**
   * 动画持续时间
   */
  duration?: number

  /**
   * 自定义样式类名
   */
  className?: string

  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 角色标签
   */
  role?: 'alert' | 'status' | 'progressbar'

  /**
   * ARIA 标签
   */
  ariaLabel?: string

  /**
   * 是否禁用动画
   */
  disableAnimation?: boolean
}

// =============================================================================
// Loading 主组件实现
// =============================================================================

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      variant,
      size,
      type,
      state,
      showLabel,
      label,
      description,
      fullscreen = false,
      icon,
      progress,
      showProgress = false,
      dotCount = 3,
      barCount = 3,
      duration = 1000,
      className,
      children,
      role = 'status',
      ariaLabel,
      disableAnimation = false,
      ...props
    },
    ref
  ) => {
    const theme = useThemeSafe()

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      '--loading-color': `hsl(${theme?.colors[variant === 'default' ? 'primary' : variant]})`,
      '--loading-bg': `hsl(${theme?.colors.background || '#000000'})`,
      '--loading-text': `hsl(${theme?.colors.text.primary || '#000000'})`,
      // 可根据七轴动态调整
      ...(duration && {
        '--loading-duration': `${duration}ms`,
      }),
    }

    // 生成 ARIA 属性
    const ariaProps: React.AriaAttributes = {
      'aria-label': ariaLabel || (label ? `${label} loading` : 'Loading'),
      'role': role,
      'aria-live': 'polite',
      'aria-busy': state === 'loading',
    }

    // 渲染不同类型的加载动画
    const renderLoadingIcon = () => {
      if (icon) {
        return icon
      }

      switch (type) {
        case 'spinner':
          return (
            <svg
              className={cn("w-full h-full", !disableAnimation && "animate-spin")}
              style={{ color: 'var(--loading-color)' }}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
            </svg>
          )

        case 'pulse':
          return (
            <div
              className={cn("w-full h-full rounded-full", !disableAnimation && "animate-pulse")}
              style={{ backgroundColor: 'var(--loading-color)' }}
            />
          )

        case 'bounce':
          return (
            <div className={cn("w-full h-full flex items-center justify-center gap-1", !disableAnimation && "animate-bounce")}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1/3 h-full rounded-full"
                  style={{
                    backgroundColor: 'var(--loading-color)',
                    animationDelay: disableAnimation ? undefined : `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )

        case 'dots':
          return (
            <div className="flex items-center justify-center gap-1">
              {[...Array(dotCount)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 'var(--dot-size, 8px)',
                    height: 'var(--dot-size, 8px)',
                    backgroundColor: 'var(--loading-color)',
                    animation: disableAnimation ? undefined : `loading-dot 1.4s ease-in-out infinite ${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
          )

        case 'bars':
          return (
            <div className="flex items-center justify-center gap-1">
              {[...Array(barCount)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    width: '3px',
                    height: 'var(--bar-height, 20px)',
                    backgroundColor: 'var(--loading-color)',
                    animation: disableAnimation ? undefined : `loading-bar 1.2s ease-in-out infinite ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )

        case 'circle':
          return (
            <div className="relative w-full h-full">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="opacity-25"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  className={!disableAnimation ? "animate-circle-dash" : ""}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress || 25}, 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )

        default:
          return null
      }
    }

    // 处理全屏显示
    if (fullscreen) {
      return (
        <div
          ref={ref}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-background-primary/80 backdrop-blur-sm",
            className
          )}
          style={themeStyles}
          {...ariaProps}
          {...props}
        >
          <div className={cn(
            loadingVariants({
              variant,
              size,
              type,
              state,
              showLabel: label || showLabel,
            }),
            "flex flex-col items-center gap-4"
          )}>
            {renderLoadingIcon()}

            {/* 标签和描述 */}
            {(label || description) && (
              <div className="text-center space-y-2">
                {label && (
                  <div className="font-medium text-sm" style={{ color: 'var(--loading-text)' }}>
                    {label}
                  </div>
                )}
                {description && (
                  <div className="text-xs opacity-75" style={{ color: 'var(--loading-text)' }}>
                    {description}
                  </div>
                )}
              </div>
            )}

            {/* 进度显示 */}
            {showProgress && typeof progress === 'number' && (
              <div className="text-xs font-medium" style={{ color: 'var(--loading-text)' }}>
                {Math.round(progress)}%
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          loadingVariants({
            variant,
            size,
            type,
            state,
            showLabel: label || showLabel || children,
          }),
          // 当有标签或子元素时的布局调整
          (label || description || children) && "gap-3",
          className
        )}
        style={themeStyles}
        {...ariaProps}
        {...props}
      >
        {/* 加载图标 */}
        <div className="flex-shrink-0">
          {renderLoadingIcon()}
        </div>

        {/* 标签和描述 */}
        {(label || description || children) && (
          <div className="flex flex-col gap-1 min-w-0">
            {label && (
              <div className="font-medium text-sm" style={{ color: 'var(--loading-text)' }}>
                {label}
              </div>
            )}
            {description && (
              <div className="text-xs opacity-75" style={{ color: 'var(--loading-text)' }}>
                {description}
              </div>
            )}
            {children && (
              <div className="text-sm" style={{ color: 'var(--loading-text)' }}>
                {children}
              </div>
            )}
          </div>
        )}

        {/* 进度显示 */}
        {showProgress && typeof progress === 'number' && (
          <div className="text-xs font-medium ml-2" style={{ color: 'var(--loading-text)' }}>
            {Math.round(progress)}%
          </div>
        )}
      </div>
    )
  }
)

// =============================================================================
// 组件元数据
// =============================================================================

Loading.displayName = 'Loading'

// =============================================================================
// 导出
// =============================================================================

export { Loading, loadingVariants }
export type { LoadingProps }