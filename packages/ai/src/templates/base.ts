/**
 * @fileoverview 基础组件模板库
 * @description 提供基础组件的代码模板
 */

import type { ComponentTemplate, ComponentVariant } from '../types'

// ============================================================================
// 按钮组件模板
// ============================================================================

export const buttonTemplate: ComponentTemplate = {
  name: 'button',
  type: 'base',
  description: '基础按钮组件模板',
  code: `import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@xorigo-ui/utils'

__INTERFACE_DEFINITION__

__VARIANTS__

/**
 * __COMPONENT_DESCRIPTION__
 */
export const __COMPONENT_NAME__ = forwardRef<HTMLButtonElement, __COMPONENT_NAME__Props>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          // 基础样式
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // 变体样式
          {
            'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500':
              variant === 'primary',
            'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-500':
              variant === 'secondary',
            'text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500':
              variant === 'ghost',
          },

          // 尺寸样式
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },

          className
        )}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    )
  }
)

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__'
`,
  types: `import React from 'react'

export interface __COMPONENT_NAME__Props {
  /** 按钮内容 */
  children: React.ReactNode
  /** 自定义样式类名 */
  className?: string
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 左侧图标 */
  leftIcon?: React.ReactNode
  /** 右侧图标 */
  rightIcon?: React.ReactNode
}
`,
  variants: [
    {
      name: 'primary',
      description: '主要按钮',
      props: {},
      className: 'bg-primary-500 text-white hover:bg-primary-600'
    },
    {
      name: 'secondary',
      description: '次要按钮',
      props: {},
      className: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
    },
    {
      name: 'ghost',
      description: '幽灵按钮',
      props: {},
      className: 'text-gray-900 hover:bg-gray-100'
    }
  ]
}

// ============================================================================
// 输入框组件模板
// ============================================================================

export const inputTemplate: ComponentTemplate = {
  name: 'input',
  type: 'base',
  description: '基础输入框组件模板',
  code: `import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@xorigo-ui/utils'

__INTERFACE_DEFINITION__

/**
 * __COMPONENT_DESCRIPTION__
 */
export const __COMPONENT_NAME__ = forwardRef<HTMLInputElement, __COMPONENT_NAME__Props>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || \`input-\${Math.random().toString(36).substr(2, 9)}\`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}

          <motion.input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full rounded-lg border border-gray-300 px-3 py-2',
              'text-gray-900 placeholder-gray-400',
              'focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              'transition-colors duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    )
  }
)

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__'
`,
  types: `import React from 'react'

export interface __COMPONENT_NAME__Props extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 输入框标签 */
  label?: string
  /** 错误信息 */
  error?: string
  /** 提示信息 */
  hint?: string
  /** 左侧图标 */
  leftIcon?: React.ReactNode
  /** 右侧图标 */
  rightIcon?: React.ReactNode
}
`
}

// ============================================================================
// 卡片组件模板
// ============================================================================

export const cardTemplate: ComponentTemplate = {
  name: 'card',
  type: 'base',
  description: '基础卡片组件模板',
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
      children,
      className,
      variant = 'default',
      padding = 'md',
      shadow = 'sm',
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200 bg-white',
          {
            'shadow-sm': shadow === 'sm',
            'shadow-md': shadow === 'md',
            'shadow-lg': shadow === 'lg',
            'shadow-none': shadow === 'none',
          },
          {
            'p-3': padding === 'sm',
            'p-4': padding === 'md',
            'p-6': padding === 'lg',
          },
          className
        )}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__'
`,
  types: `import React from 'react'

export interface __COMPONENT_NAME__Props extends React.HTMLAttributes<HTMLDivElement> {
  /** 卡片内容 */
  children: React.ReactNode
  /** 卡片变体 */
  variant?: 'default' | 'outlined' | 'ghost'
  /** 内边距 */
  padding?: 'sm' | 'md' | 'lg' | 'none'
  /** 阴影 */
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}
`
}

// ============================================================================
// 导出所有基础模板
// ============================================================================

export const baseTemplates = [
  buttonTemplate,
  inputTemplate,
  cardTemplate
]
