import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { Avatar } from '../utilities/Avatar'

// AvatarGroup变体配置
const avatarGroupVariants = cva(
  'flex items-center',
  {
    variants: {
      variant: {
        default: 'gap-0',
        circle: '-space-x-2',
        square: '-space-x-1',
        stack: 'gap-1',
      },
      size: {
        sm: 'scale-90',
        md: 'scale-100',
        lg: 'scale-110',
        xl: 'scale-125',
        '2xl': 'scale-150',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// 头像堆叠容器样式
const stackContainerVariants = cva(
  'relative',
  {
    variants: {
      variant: {
        default: '',
        circle: '',
        square: '',
        stack: 'flex flex-col gap-1',
      },
    },
  }
)

// 更多计数器样式
const moreCounterVariants = cva(
  'flex items-center justify-center rounded-full font-medium text-white border-2 border-white dark:border-gray-900 bg-gray-500',
  {
    variants: {
      size: {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
        xl: 'h-12 w-12 text-lg',
        '2xl': 'h-16 w-16 text-xl',
      },
      variant: {
        default: 'rounded-full',
        circle: 'rounded-full',
        square: 'rounded-md',
        stack: 'rounded-md',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

export interface AvatarGroupProps
  extends Omit<HTMLMotionProps<'div'>, 'variant'>,
    VariantProps<typeof avatarGroupVariants> {
  children: React.ReactNode
  /** 最大显示数量 */
  max?: number
  /** 是否显示更多计数 */
  showMore?: boolean
  /** 更多计数文本模板 */
  moreText?: string
  /** 间距控制 */
  spacing?: number
  /** 是否启用悬浮交互 */
  hoverable?: boolean
  /** 堆叠方向 */
  stackDirection?: 'vertical' | 'horizontal'
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({
    className,
    variant = 'circle',
    size = 'md',
    children,
    max = 5,
    showMore = true,
    moreText = '+{count}',
    spacing = 0,
    hoverable = false,
    stackDirection = 'horizontal',
    ...props
  }, ref) => {
    const avatarChildren = React.Children.toArray(children)
    const visibleAvatars = avatarChildren.slice(0, max)
    const remainingCount = avatarChildren.length - max

    // 悬浮动画配置
    const hoverAnimation = {
      whileHover: hoverable ? { scale: 1.05 } : undefined,
      whileTap: hoverable ? { scale: 0.95 } : undefined,
      transition: { duration: 0.2 },
    }

    // 堆叠效果配置
    const getStackStyle = React.useCallback((index: number, total: number) => {
      if (variant === 'stack') {
        return {
          zIndex: total - index,
          transform: `translateX(${index * spacing}px)`,
        }
      }
      return {
        zIndex: total - index,
        transform: `translateX(${index * spacing}px)`,
      }
    }, [variant, spacing])

    // 根据堆叠方向渲染容器
    if (variant === 'stack' && stackDirection === 'vertical') {
      return (
        <motion.div
          ref={ref}
          className={cn(avatarGroupVariants({ variant, size, className }))}
          {...props}
        >
          <div className={cn(stackContainerVariants({ variant }), 'flex-col')}>
            {visibleAvatars.map((avatar, index) => (
              <motion.div
                key={index}
                style={getStackStyle(index, visibleAvatars.length)}
                className={cn(
                  'relative inline-block border-2 border-white dark:border-gray-900 rounded-full',
                  hoverable && 'cursor-pointer'
                )}
                {...hoverAnimation}
              >
                {avatar}
              </motion.div>
            ))}
            {showMore && remainingCount > 0 && (
              <motion.div
                className={cn(moreCounterVariants({ size, variant }))}
                style={getStackStyle(visibleAvatars.length, visibleAvatars.length + 1)}
                title={`${remainingCount} more`}
                {...hoverAnimation}
              >
                {moreText.replace('{count}', remainingCount.toString())}
              </motion.div>
            )}
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={cn(avatarGroupVariants({ variant, size, className }))}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <motion.div
            key={index}
            style={getStackStyle(index, visibleAvatars.length)}
            className={cn(
              'relative inline-block border-2 border-white dark:border-gray-900',
              variant === 'circle' ? 'rounded-full' : variant === 'square' ? 'rounded-md' : 'rounded-full',
              hoverable && 'cursor-pointer'
            )}
            {...hoverAnimation}
          >
            {avatar}
          </motion.div>
        ))}
        {showMore && remainingCount > 0 && (
          <motion.div
            className={cn(moreCounterVariants({ size, variant }))}
            style={getStackStyle(visibleAvatars.length, visibleAvatars.length + 1)}
            title={`${remainingCount} more`}
            {...hoverAnimation}
          >
            {moreText.replace('{count}', remainingCount.toString())}
          </motion.div>
        )}
      </motion.div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

// 带状态指示器的AvatarGroup
export interface AvatarGroupWithStatusProps extends AvatarGroupProps {
  /** 显示状态指示器 */
  showStatus?: boolean
  /** 状态类型 */
  status?: 'online' | 'offline' | 'away' | 'busy'
}

export const AvatarGroupWithStatus = forwardRef<HTMLDivElement, AvatarGroupWithStatusProps>(
  ({ showStatus = false, status, children, ...props }, ref) => {
    const avatarsWithStatus = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === Avatar) {
        return React.cloneElement(child, {
          showStatus,
          status: status || child.props.status,
        } as React.ComponentProps<typeof Avatar>)
      }
      return child
    })

    return (
      <AvatarGroup ref={ref} {...props}>
        {avatarsWithStatus}
      </AvatarGroup>
    )
  }
)

AvatarGroupWithStatus.displayName = 'AvatarGroupWithStatus'

export {
  avatarGroupVariants,
  stackContainerVariants,
  moreCounterVariants,
}