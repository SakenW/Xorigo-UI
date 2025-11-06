/**
 * @fileoverview 变体组件模板库
 * @description 提供具有多种变体的组件模板
 */

import type { ComponentTemplate } from '../types'

// ============================================================================
// 徽章组件模板
// ============================================================================

export const badgeTemplate: ComponentTemplate = {
  name: 'badge',
  type: 'variant',
  description: '徽章组件（多种变体支持）',
  code: `import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@xorigo-ui/utils'

__INTERFACE_DEFINITION__

__VARIANTS__

/**
 * __COMPONENT_DESCRIPTION__
 */
export const __COMPONENT_NAME__ = forwardRef<HTMLSpanElement, __COMPONENT_NAME__Props>(
  (
    {
      children,
      className,
      variant = 'default',
      size = 'md',
      rounded = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          {
            // 尺寸变体
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-0.5 text-sm': size === 'md',
            'px-3 py-1 text-base': size === 'lg',

            // 颜色变体
            'bg-gray-100 text-gray-800': variant === 'default',
            'bg-primary-100 text-primary-800': variant === 'primary',
            'bg-green-100 text-green-800': variant === 'success',
            'bg-yellow-100 text-yellow-800': variant === 'warning',
            'bg-red-100 text-red-800': variant === 'danger',
            'bg-blue-100 text-blue-800': variant === 'info',

            // 圆角变体
            'rounded-md': !rounded,
            'rounded-full': rounded,
          },
          className
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.span>
    )
  }
)

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__'
`,
  types: `import React from 'react'

export interface __COMPONENT_NAME__Props extends React.HTMLAttributes<HTMLSpanElement> {
  /** 徽章内容 */
  children: React.ReactNode
  /** 徽章变体 */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** 徽章尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否圆形 */
  rounded?: boolean
}
`,
  variants: [
    {
      name: 'default',
      description: '默认灰色徽章',
      props: {},
      className: 'bg-gray-100 text-gray-800'
    },
    {
      name: 'primary',
      description: '主要蓝色徽章',
      props: {},
      className: 'bg-primary-100 text-primary-800'
    },
    {
      name: 'success',
      description: '成功绿色徽章',
      props: {},
      className: 'bg-green-100 text-green-800'
    },
    {
      name: 'warning',
      description: '警告黄色徽章',
      props: {},
      className: 'bg-yellow-100 text-yellow-800'
    },
    {
      name: 'danger',
      description: '危险红色徽章',
      props: {},
      className: 'bg-red-100 text-red-800'
    }
  ]
}

// ============================================================================
// 头像组件模板
// ============================================================================

export const avatarTemplate: ComponentTemplate = {
  name: 'avatar',
  type: 'variant',
  description: '头像组件（多种变体支持）',
  code: `import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@xorigo-ui/utils'

__INTERFACE_DEFINITION__

/**
 * __COMPONENT_DESCRIPTION__
 */
export const __COMPONENT_NAME__ = forwardRef<HTMLDivElement, __COMPONENT_NAME__Props>(
  (
    {
      src,
      alt = 'Avatar',
      name,
      size = 'md',
      variant = 'circular',
      status,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
      '2xl': 'h-20 w-20 text-2xl',
    }

    const variantClasses = {
      circular: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-none',
    }

    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
    }

    const initials = name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || ''

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden bg-gray-100',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="font-medium text-gray-600">
            {initials}
          </span>
        )}

        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white',
              statusClasses[status]
            )}
          />
        )}
      </motion.div>
    )
  }
)

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__'
`,
  types: `import React from 'react'

export interface __COMPONENT_NAME__Props extends React.HTMLAttributes<HTMLDivElement> {
  /** 头像图片地址 */
  src?: string
  /** 头像图片alt文本 */
  alt?: string
  /** 显示名称（用于生成首字母） */
  name?: string
  /** 头像尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** 头像变体 */
  variant?: 'circular' | 'rounded' | 'square'
  /** 在线状态 */
  status?: 'online' | 'offline' | 'away' | 'busy'
}
`,
  variants: [
    {
      name: 'circular',
      description: '圆形头像',
      props: {},
      className: 'rounded-full'
    },
    {
      name: 'rounded',
      description: '圆角头像',
      props: {},
      className: 'rounded-lg'
    },
    {
      name: 'square',
      description: '方形头像',
      props: {},
      className: 'rounded-none'
    }
  ]
}

// ============================================================================
// 导出所有变体模板
// ============================================================================

export const variantTemplates = [
  badgeTemplate,
  avatarTemplate
]
