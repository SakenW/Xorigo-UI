/**
 * 动画组件 - Framer Motion 12 增强组件
 *
 * 提供带有动画效果的 React 组件，集成七轴主题系统
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'
import { useThemeSafe } from '../system/theme-provider'

// =============================================================================
// 动画组件基础接口
// =============================================================================

export interface AnimatedComponentProps {
  /** 动画类型 */
  animation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'flip' | 'none'
  /** 动画方向 */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** 动画持续时间 */
  duration?: number
  /** 动画延迟 */
  delay?: number
  /** 是否在初始渲染时执行动画 */
  initial?: boolean
  /** 自定义动画变体 */
  variants?: any
  /** 子元素 */
  children?: React.ReactNode
  /** CSS 类名 */
  className?: string
}

// =============================================================================
// AnimatedDiv - 通用动画容器
// =============================================================================

export interface AnimatedDivProps extends AnimatedComponentProps, React.HTMLAttributes<HTMLDivElement> {}

export const AnimatedDiv = React.forwardRef<HTMLDivElement, AnimatedDivProps>(
  ({
    animation = 'fade',
    direction = 'up',
    duration = 0.3,
    delay = 0,
    initial = true,
    variants,
    children,
    className,
    ...props
  }, ref) => {
    const theme = useThemeSafe()

    // 默认动画变体
    const defaultVariants = {
      fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      },
      slide: {
        hidden: {
          opacity: 0,
          x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
          y: direction === 'up' ? -20 : direction === 'down' ? 20 : 0
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0
        }
      },
      scale: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
      },
      bounce: {
        hidden: { opacity: 0, scale: 0.3 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
          }
        }
      },
      flip: {
        hidden: { opacity: 0, rotateY: -90 },
        visible: {
          opacity: 1,
          rotateY: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
          }
        }
      }
    }

    const animationVariants = variants || defaultVariants[animation]
    const transition = {
      duration,
      delay,
      ease: "easeOut"
    }

    return (
      <motion.div
        ref={ref}
        initial={initial ? "hidden" : false}
        animate="visible"
        exit="hidden"
        variants={animationVariants}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedDiv.displayName = 'AnimatedDiv'

// =============================================================================
// AnimatedCard - 动画卡片组件
// =============================================================================

const animatedCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "border-border shadow-md hover:shadow-lg",
        outlined: "border-2 border-border",
        ghost: "border-transparent bg-transparent"
      },
      animation: {
        none: "",
        hover: "hover:scale-105 hover:shadow-md transition-transform duration-200",
        float: "animate-pulse",
        bounce: "hover:animate-bounce"
      }
    },
    defaultVariants: {
      variant: 'default',
      animation: 'none'
    }
  }
)

export interface AnimatedCardProps extends AnimatedComponentProps,
  VariantProps<typeof animatedCardVariants>,
  React.HTMLAttributes<HTMLDivElement> {
  /** 卡片变体 */
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  /** 悬停动画效果 */
  hoverAnimation?: 'none' | 'hover' | 'float' | 'bounce'
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({
    animation = 'fade',
    direction = 'up',
    duration = 0.3,
    delay = 0,
    initial = true,
    variants,
    variant,
    hoverAnimation = 'none',
    className,
    children,
    ...props
  }, ref) => {
    const theme = useThemeSafe()

    // 默认动画变体
    const defaultVariants = {
      fade: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      },
      slide: {
        hidden: {
          opacity: 0,
          x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
          y: direction === 'up' ? -50 : direction === 'down' ? 50 : 0
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0
        }
      },
      scale: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      },
      bounce: {
        hidden: { opacity: 0, scale: 0.3, y: -20 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
          }
        }
      },
      flip: {
        hidden: { opacity: 0, rotateY: -90, scale: 0.8 },
        visible: {
          opacity: 1,
          rotateY: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
          }
        }
      }
    }

    const animationVariants = variants || defaultVariants[animation]
    const transition = {
      duration,
      delay,
      ease: "easeOut"
    }

    return (
      <motion.div
        ref={ref}
        initial={initial ? "hidden" : false}
        animate="visible"
        whileHover={hoverAnimation !== 'none' ? { scale: 1.02 } : undefined}
        variants={animationVariants}
        transition={transition}
        className={cn(animatedCardVariants({ variant, animation: hoverAnimation }), className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedCard.displayName = 'AnimatedCard'

// =============================================================================
// AnimatedButton - 动画按钮组件
// =============================================================================

const animatedButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface AnimatedButtonProps extends AnimatedComponentProps,
  VariantProps<typeof animatedButtonVariants>,
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体 */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** 按钮尺寸 */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** 点击动画效果 */
  tapAnimation?: 'scale' | 'bounce' | 'ripple'
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    animation = 'scale',
    duration = 0.2,
    delay = 0,
    initial = true,
    variants,
    variant,
    size,
    tapAnimation = 'scale',
    className,
    children,
    ...props
  }, ref) => {
    const theme = useThemeSafe()

    // 按钮动画变体
    const buttonVariants = {
      scale: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        tap: { scale: 0.95 }
      },
      bounce: {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        tap: { scale: 0.95 }
      },
      ripple: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        tap: { scale: 1.05 }
      }
    }

    const animationVariants = variants || buttonVariants[tapAnimation]
    const transition = {
      duration,
      delay,
      ease: "easeOut"
    }

    return (
      <motion.button
        ref={ref}
        initial={initial ? "hidden" : false}
        animate="visible"
        whileTap="tap"
        variants={animationVariants}
        transition={transition}
        className={cn(animatedButtonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

// =============================================================================
// 其他动画组件的简化实现
// =============================================================================

export interface AnimatedAlertProps extends AnimatedComponentProps, React.HTMLAttributes<HTMLDivElement> {}

export const AnimatedAlert = React.forwardRef<HTMLDivElement, AnimatedAlertProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <AnimatedDiv
        ref={ref}
        animation="bounce"
        className={cn("p-4 rounded-lg border bg-background", className)}
        {...props}
      >
        {children}
      </AnimatedDiv>
    )
  }
)

AnimatedAlert.displayName = 'AnimatedAlert'

export interface AnimatedBadgeProps extends AnimatedComponentProps, React.HTMLAttributes<HTMLSpanElement> {}

export const AnimatedBadge = React.forwardRef<HTMLSpanElement, AnimatedBadgeProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.span
        ref={ref}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary text-primary-foreground", className)}
        {...props}
      >
        {children}
      </motion.span>
    )
  }
)

AnimatedBadge.displayName = 'AnimatedBadge'

export interface AnimatedListProps extends AnimatedComponentProps, React.HTMLAttributes<HTMLUListElement> {}

export const AnimatedList = React.forwardRef<HTMLUListElement, AnimatedListProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.ul
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.ul>
    )
  }
)

AnimatedList.displayName = 'AnimatedList'

// =============================================================================
// AnimatedPresence - 动画 Presence 组件
// =============================================================================

export interface AnimatedPresenceProps {
  /** 子元素 */
  children: React.ReactNode
  /** 初始渲染时是否显示动画 */
  initial?: boolean
  /** 自定义动画变体 */
  variants?: any
  /** 动画模式 */
  mode?: 'sync' | 'popLayout'
  /** CSS 类名 */
  className?: string
}

export const AnimatedPresence: React.FC<AnimatedPresenceProps> = ({
  children,
  initial = true,
  mode = 'sync',
  className
}) => {
  return (
    <AnimatePresence initial={initial} mode={mode}>
      <div className={className}>
        {children}
      </div>
    </AnimatePresence>
  )
}

// =============================================================================
// 类型导出
// =============================================================================

export type {
  AnimatedComponentProps,
  AnimatedDivProps,
  AnimatedCardProps,
  AnimatedButtonProps,
  AnimatedAlertProps,
  AnimatedBadgeProps,
  AnimatedListProps,
  AnimatedPresenceProps
}