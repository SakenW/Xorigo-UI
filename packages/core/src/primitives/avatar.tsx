import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// Avatar变体配置
const avatarVariants = cva(
  // 基础样式
  'relative inline-flex items-center justify-center overflow-hidden transition-colors',
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-20 h-20 text-2xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-lg',
      },
      variant: {
        default: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
        primary: 'bg-[var(--bg-primary-action)] text-[var(--text-inverse)]',
        secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
        ghost: 'bg-transparent border border-[var(--border-secondary)]',
      },
      bordered: {
        true: 'ring-2 ring-[var(--bg-glass)] dark:ring-[var(--bg-contrast-high)]',
      },
      clickable: {
        true: 'cursor-pointer hover:scale-105 active:scale-95 transition-transform',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
      variant: 'default',
      bordered: false,
      clickable: false,
    },
  }
)

// 状态指示器变体
const statusVariants = cva(
  'absolute rounded-full ring-2 ring-[var(--bg-glass)] dark:ring-[var(--bg-contrast-high)]',
  {
    variants: {
      size: {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
        '2xl': 'w-5 h-5',
      },
      status: {
        online: 'bg-[var(--bg-success)]',
        offline: 'bg-[var(--bg-disabled)]',
        away: 'bg-[var(--bg-warning)]',
        busy: 'bg-[var(--bg-error)]',
      },
      position: {
        'top-right': 'top-0 right-0',
        'bottom-right': 'bottom-0 right-0',
        'top-left': 'top-0 left-0',
        'bottom-left': 'bottom-0 left-0',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'offline',
      position: 'bottom-right',
    },
  }
)

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'>,
    VariantProps<typeof avatarVariants> {
  /** 图片源 */
  src?: string
  /** 替代文本 */
  alt?: string
  /** 备用内容（文字或图标） */
  fallback?: React.ReactNode
  /** 状态指示器 */
  status?: 'online' | 'offline' | 'away' | 'busy'
  /** 状态位置 */
  statusPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  /** 点击事件 */
  onClick?: () => void
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt = 'Avatar',
  fallback,
  size,
  shape,
  variant,
  bordered,
  status,
  statusPosition = 'bottom-right',
  onClick,
  className,
  ...props
}, ref) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const showImage = src && !imageError
  const showFallback = !showImage

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        avatarVariants({
          size,
          shape,
          variant,
          bordered: bordered || !!status,
          clickable: !!onClick
        }),
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {showImage && (
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {showFallback && (
        <div className="flex items-center justify-center w-full h-full font-medium">
          {fallback || (
            typeof alt === 'string' && alt ? (
              getInitials(alt)
            ) : (
              <svg
                className={size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )
          )}
        </div>
      )}

      {status && (
        <span
          className={statusVariants({
            size,
            status,
            position: statusPosition,
          })}
        />
      )}
    </motion.div>
  )
})

Avatar.displayName = 'Avatar'

// Avatar Group Component
export interface AvatarGroupProps {
  /** 头像元素 */
  children: React.ReactNode
  /** 最大显示数量 */
  max?: number
  /** 头像大小 */
  size?: AvatarProps['size']
  /** 头像形状 */
  shape?: AvatarProps['shape']
  /** 间距 */
  spacing?: 'tight' | 'normal' | 'loose'
  /** 类名 */
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 5,
  size = 'md',
  shape = 'circle',
  spacing = 'normal',
  className,
}) => {
  const childrenArray = React.Children.toArray(children)
  const displayedAvatars = childrenArray.slice(0, max)
  const remainingCount = childrenArray.length - max

  const spacingClasses = {
    tight: '-space-x-3',
    normal: '-space-x-2',
    loose: '-space-x-1',
  }

  const getSizeClasses = (size: AvatarProps['size']) => {
    const sizeMap = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    }
    return sizeMap[size || 'md']
  }

  return (
    <div className={cn('flex items-center', spacingClasses[spacing], className)}>
      {displayedAvatars.map((child, index) => (
        <div
          key={index}
          className="relative ring-2 ring-[var(--bg-glass)] dark:ring-[var(--bg-contrast-high)] rounded-full"
          style={{ zIndex: displayedAvatars.length - index }}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child, { size, shape } as Partial<AvatarProps>)
            : child
          }
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative flex items-center justify-center',
            'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
            'rounded-full ring-2 ring-[var(--bg-glass)] dark:ring-[var(--bg-contrast-high)]',
            'font-medium border border-[var(--border-secondary)]',
            getSizeClasses(size)
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

AvatarGroup.displayName = 'AvatarGroup'