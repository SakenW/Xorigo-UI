import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'

// Surface变体配置
const surfaceVariants = cva(
  'relative transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
        elevated: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg',
        outlined: 'bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700',
        ghost: 'bg-transparent border-0',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl',
        inner: 'shadow-inner',
      },
      background: {
        transparent: 'bg-transparent',
        white: 'bg-white',
        gray: 'bg-gray-50 dark:bg-gray-900',
        primary: 'bg-blue-50 dark:bg-blue-900/20',
        secondary: 'bg-gray-100 dark:bg-gray-800',
        success: 'bg-green-50 dark:bg-green-900/20',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20',
        danger: 'bg-red-50 dark:bg-red-900/20',
        info: 'bg-cyan-50 dark:bg-cyan-900/20',
      },
      borderColor: {
        transparent: 'border-transparent',
        gray: 'border-gray-200 dark:border-gray-700',
        primary: 'border-blue-200 dark:border-blue-800',
        secondary: 'border-gray-300 dark:border-gray-600',
        success: 'border-green-200 dark:border-green-800',
        warning: 'border-yellow-200 dark:border-yellow-800',
        danger: 'border-red-200 dark:border-red-800',
        info: 'border-cyan-200 dark:border-cyan-800',
      },
    },
    compoundVariants: [
      // 高亮变体的组合样式
      {
        variant: 'elevated',
        shadow: 'lg',
        className: 'hover:shadow-xl',
      },
      {
        variant: 'elevated',
        shadow: 'xl',
        className: 'hover:shadow-2xl',
      },
      // 轮廓变体的特殊处理
      {
        variant: 'outlined',
        background: 'transparent',
        className: 'bg-white dark:bg-gray-900',
      },
      // 幽灵变体的特殊处理
      {
        variant: 'ghost',
        background: 'transparent',
        className: 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
      },
    ],
    defaultVariants: {
      variant: 'default',
      rounded: 'md',
      shadow: 'none',
      background: 'white',
      borderColor: 'gray',
    },
  }
)

// 响应式断点变体
const responsiveVariants = cva(
  '',
  {
    variants: {
      responsive: {
        mobile: 'rounded-sm sm:rounded-md',
        tablet: 'rounded-md lg:rounded-lg',
        desktop: 'rounded-lg xl:rounded-xl',
        all: 'rounded-sm sm:rounded-md lg:rounded-lg xl:rounded-xl',
      },
    },
  }
)

export interface SurfaceProps
  extends Omit<HTMLMotionProps<'div'>, 'variant'>,
    VariantProps<typeof surfaceVariants>,
    VariantProps<typeof responsiveVariants> {
  /** 是否启用悬浮效果 */
  hoverable?: boolean
  /** 是否启用点击效果 */
  clickable?: boolean
  /** 是否显示边框光泽效果 */
  withGlow?: boolean
  /** 自定义悬浮动画 */
  hoverAnimation?: boolean
  /** 内边距 */
  padding?: string | number
  /** 外边距 */
  margin?: string | number
  /** 子元素 */
  children: React.ReactNode
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({
    className,
    variant = 'default',
    rounded = 'md',
    shadow = 'none',
    background = 'white',
    borderColor = 'gray',
    responsive,
    hoverable = false,
    clickable = false,
    withGlow = false,
    hoverAnimation = true,
    padding,
    margin,
    children,
    ...props
  }, ref) => {
    // 悬浮动画配置
    const hoverProps = hoverAnimation ? {
      whileHover: hoverable ? {
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      } : clickable ? {
        scale: 1.01,
        transition: { duration: 0.15 },
      } : undefined,
      whileTap: clickable ? {
        scale: 0.99,
        transition: { duration: 0.1 },
      } : undefined,
    } : {}

    // 处理自定义样式
    const customStyle = React.useMemo(() => {
      const style: React.CSSProperties = {}

      if (padding) {
        if (typeof padding === 'number') {
          style.padding = `${padding}px`
        } else {
          style.padding = padding
        }
      }

      if (margin) {
        if (typeof margin === 'number') {
          style.margin = `${margin}px`
        } else {
          style.margin = margin
        }
      }

      return style
    }, [padding, margin])

    // 光泽效果样式
    const glowStyle = withGlow ? {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.15), 0 0 40px rgba(59, 130, 246, 0.1)',
    } : {}

    return (
      <motion.div
        ref={ref}
        className={cn(
          surfaceVariants({ variant, rounded, shadow, background, borderColor }),
          responsive && responsiveVariants({ responsive }),
          hoverable && 'cursor-pointer',
          clickable && 'cursor-pointer select-none',
          className
        )}
        style={{
          ...customStyle,
          ...glowStyle,
        }}
        {...hoverProps}
        {...props}
      >
        {/* 内容区域 */}
        <div className="relative z-10">
          {children}
        </div>

        {/* 背景装饰 */}
        {variant === 'elevated' && (
          <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/20 to-transparent dark:from-black/20 pointer-events-none" />
        )}

        {/* 边框装饰 */}
        {(variant === 'outlined' || borderColor !== 'gray') && (
          <div className="absolute inset-0 rounded-inherit pointer-events-none" />
        )}
      </motion.div>
    )
  }
)

Surface.displayName = 'Surface'

// 卡片表面组件
export interface CardSurfaceProps extends Omit<SurfaceProps, 'variant'> {}

export const CardSurface = forwardRef<HTMLDivElement, CardSurfaceProps>(
  (props, ref) => (
    <Surface ref={ref} variant="elevated" rounded="lg" shadow="md" {...props} />
  )
)

CardSurface.displayName = 'CardSurface'

// 面板表面组件
export interface PanelSurfaceProps extends Omit<SurfaceProps, 'variant'> {}

export const PanelSurface = forwardRef<HTMLDivElement, PanelSurfaceProps>(
  (props, ref) => (
    <Surface ref={ref} variant="default" rounded="md" shadow="sm" {...props} />
  )
)

PanelSurface.displayName = 'PanelSurface'

// 模态框表面组件
export interface ModalSurfaceProps extends Omit<SurfaceProps, 'variant'> {}

export const ModalSurface = forwardRef<HTMLDivElement, ModalSurfaceProps>(
  (props, ref) => (
    <Surface ref={ref} variant="elevated" rounded="xl" shadow="2xl" background="white" {...props} />
  )
)

ModalSurface.displayName = 'ModalSurface'

// 浮动表面组件
export interface FloatingSurfaceProps extends Omit<SurfaceProps, 'variant'> {}

export const FloatingSurface = forwardRef<HTMLDivElement, FloatingSurfaceProps>(
  (props, ref) => (
    <Surface
      ref={ref}
      variant="elevated"
      rounded="lg"
      shadow="lg"
      hoverable
      hoverAnimation
      {...props}
    />
  )
)

FloatingSurface.displayName = 'FloatingSurface'

// 玻璃表面组件
export interface GlassSurfaceProps extends Omit<SurfaceProps, 'variant' | 'background'> {}

export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, ...props }, ref) => (
    <Surface
      ref={ref}
      variant="ghost"
      rounded="lg"
      className={cn(
        'backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20',
        className
      )}
      {...props}
    />
  )
)

GlassSurface.displayName = 'GlassSurface'

// 渐变表面组件
export interface GradientSurfaceProps extends Omit<SurfaceProps, 'variant' | 'background'> {
  /** 渐变颜色 */
  gradientColors?: string
  /** 渐变方向 */
  gradientDirection?: 'to-right' | 'to-left' | 'to-top' | 'to-bottom' | 'to-br' | 'to-tr' | 'to-bl' | 'to-tl'
}

export const GradientSurface = forwardRef<HTMLDivElement, GradientSurfaceProps>(
  ({
    className,
    gradientColors = 'from-blue-500 to-purple-600',
    gradientDirection = 'to-br',
    ...props
  }, ref) => (
    <Surface
      ref={ref}
      variant="ghost"
      rounded="lg"
      className={cn(
        `bg-gradient-to-br ${gradientColors}`,
        className
      )}
      {...props}
    />
  )
)

GradientSurface.displayName = 'GradientSurface'

export {
  surfaceVariants,
  responsiveVariants,
}