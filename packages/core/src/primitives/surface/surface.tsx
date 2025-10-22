/**
 * Surface 原子容器 - 符合七轴主题系统 v1.4 SSOT
 *
 * 从 ui/surface 迁移至 primitives/surface，集成新设计令牌系统
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const surfaceVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "relative overflow-hidden",
  {
    variants: {
      // 表面效果 - 使用七轴主题系统的表面令牌
      variant: {
        flat: "bg-background text-foreground border border-border",
        'soft-shadow': "bg-background text-foreground border border-border shadow-md",
        glass: "bg-background/80 backdrop-blur-md border border-white/20 text-foreground",
        neon: "bg-background text-foreground border border-primary/50 shadow-lg shadow-primary/25",
        'glass+neon': "bg-background/60 backdrop-blur-md border border-primary/30 shadow-lg shadow-primary/40",
        silk: "bg-gradient-to-br from-background/95 to-background/80 border border-white/10 text-foreground shadow-sm",
        frosted: "bg-background/70 backdrop-blur-lg border border-white/10 text-foreground",
        metallic: "bg-gradient-to-br from-background to-muted border border-white/20 text-foreground shadow-md",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        xs: "p-2 rounded-sm",
        sm: "p-3 rounded-md",
        md: "p-4 rounded-lg",
        lg: "p-6 rounded-xl",
        xl: "p-8 rounded-2xl",
        full: "p-8 rounded-2xl w-full h-full",
      },

      // 内边距控制
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },

      // 圆角控制
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        '2xl': "rounded-2xl",
        full: "rounded-full",
      },

      // 交互状态
      interactive: {
        none: "",
        hover: "hover:bg-accent/50 hover:shadow-lg transition-all duration-300 cursor-pointer",
        click: "active:scale-95 cursor-pointer transition-transform duration-200",
      },

      // 层级优先级 - 使用七轴主题系统的 z-index 令牌
      elevation: {
        base: "z-0",
        raised: "z-10",
        dropdown: "z-20",
        sticky: "z-30",
        modal: "z-40",
        tooltip: "z-50",
        toast: "z-60",
        maximum: "z-90",
      },

      // 模式适配
      mode: {
        light: "",
        dark: "dark",
        auto: "",
      }
    },

    // 默认变体
    defaultVariants: {
      variant: "flat",
      size: "md",
      interactive: "none",
      elevation: "base",
      mode: "auto",
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {
  /**
   * 表面背景渐变
   */
  background?: string

  /**
   * 是否显示背景装饰元素
   */
  showDecoration?: boolean

  /**
   * 表面容器类型
   */
  as?: keyof JSX.IntrinsicElements

  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 自定义样式类名
   */
  className?: string

  /**
   * 是否启用响应式行为
   */
  responsive?: boolean

  /**
   * 是否启用动画效果
   */
  animated?: boolean

  /**
   * 动画延迟
   */
  animationDelay?: string

  /**
   * 动画持续时间
   */
  animationDuration?: string
}

// =============================================================================
// Surface 装饰组件
// =============================================================================

export interface SurfaceDecorationProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'dots' | 'grid' | 'circles' | 'waves'
  opacity?: number
  className?: string
}

const SurfaceDecoration = React.forwardRef<HTMLDivElement, SurfaceDecorationProps>(
  ({ type = 'dots', opacity = 0.1, className, ...props }, ref) => {
    const decorations = {
      dots: (
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity
        }} />
      ),
      grid: (
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity
        }} />
      ),
      circles: (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-2 border-current opacity-20" />
          <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full border border-current opacity-15" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full border border-current opacity-10" />
        </div>
      ),
      waves: (
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-current to-transparent opacity-10" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-current to-transparent opacity-15" />
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("pointer-events-none absolute inset-0", className)} {...props}>
        {decorations[type]}
      </div>
    )
  }
)
SurfaceDecoration.displayName = "SurfaceDecoration"

// =============================================================================
// Surface 主组件实现
// =============================================================================

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      variant,
      size,
      padding,
      radius,
      interactive,
      elevation,
      mode,
      background,
      showDecoration = false,
      as: Component = 'div',
      children,
      className,
      responsive = false,
      animated = false,
      animationDelay = '0ms',
      animationDuration = '300ms',
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 获取当前表面配置
    const surfaceConfig = theme.surface

    // 生成动画类名
    const animationClasses = animated
      ? `transition-all duration-300 ease-out`
      : ''

    // 生成响应式类名
    const responsiveClasses = responsive
      ? 'w-full max-w-7xl mx-auto'
      : ''

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      // 七轴主题系统集成
      '--surface-bg': background || `hsl(${theme.colors.background})`,
      '--surface-border': `hsl(${theme.colors.border.primary})`,
      '--surface-shadow': surfaceConfig.shadow,
      '--surface-blur': surfaceConfig.blur,
      '--surface-glow': surfaceConfig.glow,
      '--surface-backdrop': surfaceConfig.backdrop,

      // 动画相关
      transition: animated ? `all ${animationDuration} ease-out` : undefined,
      transitionDelay: animationDelay,
    }

    // 生成 ARIA 属性
    const ariaProps: React.AriaAttributes = {
      'role': variant === 'glass' || variant?.includes('glass') ? 'region' : undefined,
    }

    return (
      <Component
        ref={ref}
        className={cn(
          surfaceVariants({
            variant,
            size,
            padding,
            radius,
            interactive,
            elevation,
            mode,
          }),
          animationClasses,
          responsiveClasses,
          className
        )}
        style={themeStyles}
        {...ariaProps}
        {...props}
      >
        {/* 背景装饰 */}
        {showDecoration && (
          <SurfaceDecoration type="dots" opacity={0.05} />
        )}

        {/* 表面内容 */}
        <div className="relative z-10">
          {children}
        </div>

        {/* 表面效果叠加层 */}
        {(variant === 'glass' || variant === 'glass+neon' || variant === 'frosted') && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: surfaceConfig.backdrop,
              backdropFilter: surfaceConfig.backdrop !== 'none' ? surfaceConfig.backdrop : undefined,
            }}
          />
        )}

        {/* 霓虹光效 */}
        {(variant === 'neon' || variant === 'glass+neon') && (
          <div
            className="absolute inset-0 pointer-events-none rounded-inherit"
            style={{
              boxShadow: surfaceConfig.glow,
            }}
          />
        )}
      </Component>
    )
  }
)

// =============================================================================
// 组件元数据
// =============================================================================

Surface.displayName = 'Surface'

// =============================================================================
// 导出
// =============================================================================

export { Surface, SurfaceDecoration, surfaceVariants }
export type { SurfaceProps, SurfaceDecorationProps }
