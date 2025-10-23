/**
 * Container 容器组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 布局组件 - 响应式容器和内容约束
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const containerVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "w-full mx-auto px-4 sm:px-6 lg:px-8",
  {
    variants: {
      // 尺寸预设 - 响应式最大宽度
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full",
        none: "",
      },

      // 流体布局
      fluid: {
        true: "max-w-none px-0",
        false: "",
      },

      // 垂直内边距
      py: {
        none: "py-0",
        sm: "py-2 sm:py-4",
        md: "py-4 sm:py-6",
        lg: "py-6 sm:py-8",
        xl: "py-8 sm:py-12",
        "2xl": "py-12 sm:py-16",
        "3xl": "py-16 sm:py-20",
      },

      // 水平内边距覆盖
      px: {
        none: "px-0",
        sm: "px-2 sm:px-4",
        md: "px-4 sm:px-6",
        lg: "px-6 sm:px-8",
        xl: "px-8 sm:px-12",
        "2xl": "px-12 sm:px-16",
      },

      // 居中对齐
      centered: {
        true: "flex items-center justify-center",
        false: "",
      },

      // 网格布局
      grid: {
        true: "grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8",
        false: "",
      },

      // 列数（仅当grid为true时生效）
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
        12: "grid-cols-12",
        auto: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
      },

      // 背景样式
      background: {
        none: "",
        muted: "bg-background-primary-secondary",
        accent: "bg-accent-500-500",
        card: "bg-background-primary-primary border border-border-base-base rounded-lg",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary-500-500 text-secondary-600-600-foreground",
      },

      // 阴影效果
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        inner: "shadow-inner",
      },

      // 圆角
      rounded: {
        none: "",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },

    // 默认变体
    defaultVariants: {
      size: '7xl',
      fluid: false,
      py: 'none',
      px: 'sm',
      centered: false,
      grid: false,
      cols: 1,
      background: 'none',
      shadow: 'none',
      rounded: 'none',
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /**
   * 自定义最大宽度
   */
  maxWidth?: string

  /**
   * 自定义最小高度
   */
  minHeight?: string

  /**
   * 是否启用视口高度
   */
  viewportHeight?: boolean

  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 内容对齐方式（当centered为true时）
   */
  contentAlignment?: 'start' | 'center' | 'end' | 'stretch'

  /**
   * 方向（当centered为true时）
   */
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'

  /**
   * 间距（当grid为true时）
   */
  gap?: string

  /**
   * 自定义样式类名
   */
  className?: string
}

// =============================================================================
// Container 主组件实现
// =============================================================================

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size,
      fluid,
      py,
      px,
      centered,
      grid,
      cols,
      background,
      shadow,
      rounded,
      maxWidth,
      minHeight,
      viewportHeight = false,
      contentAlignment = 'center',
      direction = 'col',
      gap,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      // 背景颜色集成
      ...(background && background !== 'none' && {
        backgroundColor: `var(--container-bg, hsl(${theme.colors.background}))`,
        color: `var(--container-text, hsl(${theme.colors.text.primary}))`,
      }),

      // 自定义最大宽度
      ...(maxWidth && { maxWidth }),

      // 自定义最小高度
      ...(minHeight && { minHeight }),

      // 视口高度
      ...(viewportHeight && { minHeight: '100vh' }),

      // 自定义间距
      ...(gap && { gap }),

      // 主题颜色变量
      '--container-bg': `hsl(${theme.colors.background})`,
      '--container-text': `hsl(${theme.colors.text.primary})`,
      '--container-border': `hsl(${theme.colors.border.primary})`,
      '--container-muted': `hsl(${theme.colors.muted})`,
      // 可根据七轴动态调整
    }

    // 生成居中对齐样式
    const centerStyles = centered ? {
      display: 'flex',
      flexDirection: direction,
      alignItems: contentAlignment === 'stretch' ? 'stretch' :
                  contentAlignment === 'start' ? 'flex-start' :
                  contentAlignment === 'end' ? 'flex-end' : 'center',
      justifyContent: contentAlignment === 'stretch' ? 'stretch' :
                      contentAlignment === 'start' ? 'flex-start' :
                      contentAlignment === 'end' ? 'flex-end' : 'center',
    } : {}

    return (
      <div
        ref={ref}
        className={cn(
          containerVariants({
            size: fluid ? 'none' : size,
            fluid,
            py,
            px,
            centered,
            grid,
            cols: grid ? cols : 1,
            background,
            shadow,
            rounded,
          }),
          className
        )}
        style={{
          ...themeStyles,
          ...centerStyles,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// =============================================================================
// 专用容器组件
// =============================================================================

// Section 容器 - 用于页面区块
export interface SectionProps extends Omit<ContainerProps, 'size' | 'py'> {
  as?: 'section' | 'div'
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ as: Component = 'section', py = 'lg', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        {...props}
        className={cn(
          'w-full',
          props.className
        )}
      >
        <Container
          size="7xl"
          py={py}
          {...props}
          className={cn('relative', props.className)}
        />
      </Component>
    )
  }
)

Section.displayName = 'Section'

// Page 容器 - 用于整页布局
export const Page = React.forwardRef<HTMLDivElement, Omit<ContainerProps, 'size'>>(
  ({ children, ...props }, ref) => {
    return (
      <Container
        ref={ref}
        size="7xl"
        {...props}
        className={cn('min-h-screen', props.className)}
      >
        {children}
      </Container>
    )
  }
)

Page.displayName = 'Page'

// Content 容器 - 用于内容区域
export const Content = React.forwardRef<HTMLDivElement, Omit<ContainerProps, 'size' | 'py' | 'px'>>(
  ({ children, py = 'md', px = 'md', ...props }, ref) => {
    return (
      <Container
        ref={ref}
        size="full"
        py={py}
        px={px}
        {...props}
      >
        {children}
      </Container>
    )
  }
)

Content.displayName = 'Content'

// Card 容器 - 用于卡片布局
export const CardContainer = React.forwardRef<HTMLDivElement, Omit<ContainerProps, 'size' | 'background' | 'shadow' | 'rounded'>>(
  ({ children, ...props }, ref) => {
    return (
      <Container
        ref={ref}
        size="full"
        background="card"
        shadow="md"
        rounded="lg"
        py="lg"
        px="lg"
        {...props}
      >
        {children}
      </Container>
    )
  }
)

CardContainer.displayName = 'CardContainer'

// =============================================================================
// 组件元数据
// =============================================================================

Container.displayName = 'Container'

// =============================================================================
// 导出
// =============================================================================

export { Container, containerVariants }
export type { ContainerProps }