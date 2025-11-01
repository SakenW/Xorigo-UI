import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// Container组件变体配置
const containerVariants = cva(
  // 基础样式
  'w-full transition-all duration-200',
  {
    variants: {
      variant: {
        // 默认容器 - 居中
        default: 'mx-auto',
        // 流体容器 - 全宽度
        fluid: 'w-full',
        // 约束容器 - 最大宽度约束
        constrained: 'mx-auto',
        // 居中容器 - 内容居中
        centered: 'mx-auto flex items-center justify-center min-h-[inherit]',
        // 固定容器 - 固定宽度
        fixed: 'mx-auto',
        // 响应容器 - 完全响应式
        responsive: 'mx-auto',
      },
      size: {
        // 超小尺寸
        xs: 'max-w-xs',
        // 小尺寸
        sm: 'max-w-sm',
        // 中等尺寸
        md: 'max-w-md',
        // 大尺寸
        lg: 'max-w-lg',
        // 超大尺寸
        xl: 'max-w-xl',
        // 2倍超大尺寸
        '2xl': 'max-w-2xl',
        // 3倍超大尺寸
        '3xl': 'max-w-3xl',
        // 4倍超大尺寸
        '4xl': 'max-w-4xl',
        // 5倍超大尺寸
        '5xl': 'max-w-5xl',
        // 6倍超大尺寸
        '6xl': 'max-w-6xl',
        // 7倍超大尺寸
        '7xl': 'max-w-7xl',
        // 屏幕小尺寸
        'screen-sm': 'max-w-screen-sm',
        // 屏幕中等尺寸
        'screen-md': 'max-w-screen-md',
        // 屏幕大尺寸
        'screen-lg': 'max-w-screen-lg',
        // 屏幕超大尺寸
        'screen-xl': 'max-w-screen-xl',
        // 屏幕2倍超大尺寸
        'screen-2xl': 'max-w-screen-2xl',
        // 全宽度
        full: 'max-w-full',
        // 无限制
        none: 'max-w-none',
      },
      padding: {
        // 无内边距
        none: '',
        // 超小内边距
        xs: 'px-2 py-1 sm:px-3 sm:py-2',
        // 小内边距
        sm: 'px-3 py-2 sm:px-4 sm:py-3',
        // 中等内边距
        md: 'px-4 py-3 sm:px-6 sm:py-4',
        // 大内边距
        lg: 'px-6 py-4 sm:px-8 sm:py-6',
        // 超大内边距
        xl: 'px-8 py-6 sm:px-12 sm:py-8',
        // 水平内边距
        horizontal: 'px-4 sm:px-6 lg:px-8',
        // 垂直内边距
        vertical: 'py-4 sm:py-6 lg:py-8',
        // 响应式内边距
        responsive: 'px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-6',
      },
      background: {
        // 透明背景
        transparent: '',
        // 浅色背景
        light: 'bg-gray-50 dark:bg-gray-900',
        // 白色背景
        white: 'bg-white dark:bg-gray-800',
        // 灰色背景
        gray: 'bg-gray-100 dark:bg-gray-700',
        // 深色背景
        dark: 'bg-gray-900 dark:bg-gray-50',
      },
      border: {
        // 无边框
        none: '',
        // 圆角边框
        rounded: 'rounded-lg',
        // 大圆角
        'rounded-xl': 'rounded-xl',
        // 完全圆角
        'rounded-full': 'rounded-full',
      },
      shadow: {
        // 无阴影
        none: '',
        // 小阴影
        sm: 'shadow-sm',
        // 中等阴影
        md: 'shadow-md',
        // 大阴影
        lg: 'shadow-lg',
        // 超大阴影
        xl: 'shadow-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'screen-xl',
      padding: 'md',
      background: 'transparent',
      border: 'none',
      shadow: 'none',
    },
  }
)

// Container组件接口
export interface ContainerProps
  extends Omit<HTMLMotionProps<'div'>, 'variant'>,
    VariantProps<typeof containerVariants> {
  /** 自定义最大宽度 */
  maxWidth?: string
  /** 自定义最小高度 */
  minHeight?: string
  /** 是否启用滚动 */
  scrollable?: boolean
  /** 滚动方向 */
  scrollDirection?: 'x' | 'y' | 'both'
}

// Container组件实现
const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      variant,
      size,
      padding,
      background,
      border,
      shadow,
      maxWidth,
      minHeight,
      scrollable = false,
      scrollDirection = 'both',
      children,
      ...props
    },
    ref
  ) => {
    // 生成滚动类名
    const scrollClasses = React.useMemo(() => {
      if (!scrollable) return ''

      switch (scrollDirection) {
        case 'x':
          return 'overflow-x-auto overflow-y-hidden'
        case 'y':
          return 'overflow-y-auto overflow-x-hidden'
        case 'both':
        default:
          return 'overflow-auto'
      }
    }, [scrollable, scrollDirection])

    // 自定义样式
    const customStyle = React.useMemo(() => {
      const style: React.CSSProperties = {}

      if (maxWidth) {
        style.maxWidth = maxWidth
      }

      if (minHeight) {
        style.minHeight = minHeight
      }

      return style
    }, [maxWidth, minHeight])

    // 动画变体
    const motionVariants = {
      initial: { opacity: 0, scale: 0.95 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.2,
          ease: [0.04, 0.62, 0.23, 0.98] as const
        }
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15 }
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          containerVariants({
            variant,
            size,
            padding,
            background,
            border,
            shadow,
          }),
          scrollClasses,
          className
        )}
        style={customStyle}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Container.displayName = 'Container'

export { Container, containerVariants }