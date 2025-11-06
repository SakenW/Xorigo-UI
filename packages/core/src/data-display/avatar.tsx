'use client'
import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils/cn'
import { Spinner } from '../primitives/Spinner'
import { getAvatarAriaProps } from '../utils/accessibility'

// 测试Props生成工具
const generateTestProps = (component: string, options: {
  variant?: string
  size?: string
  shape?: string
  status?: string
  testId?: string
}) => {
  const { variant, size, shape, status, testId } = options
  const testIdValue = testId || `${component}-${variant || 'default'}-${size || 'md'}-${shape || 'circle'}-${status || 'none'}`
  return {
    'data-testid': testIdValue,
    'data-component': component,
    'data-variant': variant,
    'data-size': size,
    'data-shape': shape,
    'data-status': status,
  }
}

// Avatar 变体配置
const avatarVariants = cva(
  'relative inline-flex items-center justify-center font-medium overflow-hidden transition-all duration-200',
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
        '2xl': 'w-20 h-20 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        rounded: 'rounded-lg',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
)

// 状态指示器变体配置
const statusVariants = cva(
  'absolute rounded-full ring-2 ring-[var(--bg-primary)]',
  {
    variants: {
      status: {
        online: 'bg-[var(--bg-success)]',
        offline: 'bg-[var(--bg-secondary)]',
        busy: 'bg-[var(--bg-error)]',
        away: 'bg-[var(--bg-warning)]',
        none: '',
      },
      size: {
        xs: 'w-1.5 h-1.5 -bottom-0.5 -right-0.5',
        sm: 'w-2 h-2 -bottom-0.5 -right-0.5',
        md: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
        lg: 'w-3 h-3 -bottom-0.5 -right-0.5',
        xl: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
        '2xl': 'w-4 h-4 -bottom-0.5 -right-0.5',
      },
    },
    defaultVariants: {
      status: 'none',
      size: 'md',
    },
  }
)

// 颜色映射配置
const getBackgroundColor = (name?: string, color?: string) => {
  if (color) return color

  if (!name) return 'bg-[var(--bg-secondary)]'

  // 基于姓名的哈希生成一致的颜色
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colors = [
    'bg-[var(--bg-primary-action)]',
    'bg-[var(--bg-secondary-action)]',
    'bg-[var(--bg-success)]',
    'bg-[var(--bg-warning)]',
    'bg-[var(--bg-error)]',
    'bg-[var(--bg-info)]',
  ]

  return colors[hash % colors.length]
}

// Avatar 组件接口
export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** 头像图片源 */
  src?: string
  /** 头像备用文本（用于图片加载失败或纯文本头像） */
  name?: string
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 状态指示器 */
  status?: 'online' | 'offline' | 'busy' | 'away' | 'none'
  /** 自定义背景色 */
  color?: string
  /** 悬浮提示文本 */
  label?: string
  /** 加载状态 */
  loading?: boolean
  /** 点击事件 */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** 双击事件 */
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** 测试ID */
  testId?: string
  /** 是否可点击 */
  clickable?: boolean
}

/**
 * Avatar 头像组件
 *
 * 支持图片、文字、图标三种形式的头像显示，集成状态指示器和悬浮提示功能。
 * 基于七轴主题系统设计，确保在不同主题下的一致性。
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size = 'md',
      shape = 'circle',
      src,
      name,
      icon,
      status = 'none',
      color,
      label,
      loading = false,
      onClick,
      onDoubleClick,
      testId,
      clickable = false,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    const { themeConfig } = useTheme()

    // 获取头像内容
    const getAvatarContent = () => {
      // 显示加载状态
      if (loading || imageLoading) {
        return <Spinner size={size} />
      }

      // 显示图片（如果没有错误）
      if (src && !imageError) {
        return (
          <img
            src={src}
            alt={label || name || 'Avatar'}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
        )
      }

      // 显示图标
      if (icon) {
        return <>{icon}</>
      }

      // 显示文字（姓名的首字母）
      if (name) {
        const initials = name
          .split(' ')
          .map(part => part.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase()
        return <span className="font-medium">{initials}</span>
      }

      // 默认占位符
      return (
        <svg
          className="w-full h-full"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }

    // 生成可访问性属性
    const ariaProps = getAvatarAriaProps({
      label: label || name || 'Avatar',
    })

    // 生成测试Props
    const testProps = generateTestProps('avatar', {
      variant: 'default',
      size,
      shape,
      status,
      testId,
    })

    // 获取背景色
    const backgroundColor = getBackgroundColor(name, color)

    // 确定点击样式
    const clickableClass = clickable ? 'cursor-pointer hover:scale-105' : ''

    return (
      <motion.div
        ref={ref}
        className={cn(
          avatarVariants({ size, shape }),
          backgroundColor,
          'text-[var(--text-inverse)]',
          clickableClass,
          className
        )}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        whileHover={clickable ? { scale: 1.05 } : undefined}
        whileTap={clickable ? { scale: 0.95 } : undefined}
        transition={{ duration: 0.2 }}
        {...ariaProps}
        {...testProps}
        {...props}
      >
        {/* 头像内容 */}
        {getAvatarContent()}

        {/* 状态指示器 */}
        {status !== 'none' && (
          <motion.div
            className={statusVariants({ status, size })}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    )
  }
)

Avatar.displayName = 'Avatar'

// 导出变体类型
export { avatarVariants, statusVariants }
export type AvatarVariants = VariantProps<typeof avatarVariants>
export type StatusVariants = VariantProps<typeof statusVariants>
