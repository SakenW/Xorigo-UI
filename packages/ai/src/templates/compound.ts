/**
 * @fileoverview 组合组件模板库
 * @description 提供复合组件（由多个子组件组成）的模板
 */

import type { ComponentTemplate } from '../types'

// ============================================================================
// 表单组件模板
// ============================================================================

export const formTemplate: ComponentTemplate = {
  name: 'form',
  type: 'compound',
  description: '表单容器组件（包含多个子组件）',
  code: `import React, { createContext, useContext, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@xorigo-ui/utils'

__INTERFACE_DEFINITION__

// ============================================================================
// 上下文
// ============================================================================

interface FormContextValue {
  errors: Record<string, string>
  setError: (name: string, error: string) => void
  clearError: (name: string) => void
}

const FormContext = createContext<FormContextValue | null>(null)

const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('Form components must be used within a Form')
  }
  return context
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * __COMPONENT_DESCRIPTION__
 */
export const __COMPONENT_NAME__ = forwardRef<HTMLFormElement, __COMPONENT_NAME__Props>(
  (
    {
      children,
      className,
      onSubmit,
      initialErrors = {},
      ...props
    },
    ref
  ) => {
    const [errors, setErrors] = React.useState<Record<string, string>>(initialErrors)

    const setError = (name: string, error: string) => {
      setErrors(prev => ({ ...prev, [name]: error }))
    }

    const clearError = (name: string) => {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onSubmit?.(e)
    }

    const contextValue: FormContextValue = {
      errors,
      setError,
      clearError
    }

    return (
      <FormContext.Provider value={contextValue}>
        <motion.form
          ref={ref}
          className={cn('space-y-4', className)}
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {children}
        </motion.form>
      </FormContext.Provider>
    )
  }
)

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__'

// ============================================================================
// 子组件
// ============================================================================

/**
 * 表单字段组件
 */
export const FormField = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string
    name: string
    required?: boolean
  }
>(({ children, label, name, required, className, ...props }, ref) => {
  const { errors } = useFormContext()

  return (
    <div ref={ref} className={cn('space-y-1', className)} {...props}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {errors[name]}
        </motion.p>
      )}
    </div>
  )
})

FormField.displayName = 'FormField'

/**
 * 表单动作按钮组件
 */
export const FormActions = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-2 pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
})

FormActions.displayName = 'FormActions'
`,
  types: `import React from 'react'

export interface __COMPONENT_NAME__Props extends React.FormHTMLAttributes<HTMLFormElement> {
  /** 表单内容 */
  children: React.ReactNode
  /** 初始错误状态 */
  initialErrors?: Record<string, string>
  /** 表单提交处理函数 */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

// 重新导出子组件类型
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  name: string
  required?: boolean
}

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {}
`
}

// ============================================================================
// 卡片组件模板（增强版）
// ============================================================================

export const enhancedCardTemplate: ComponentTemplate = {
  name: 'enhanced-card',
  type: 'compound',
  description: '增强卡片组件（包含头部、主体、脚部）',
  code: `import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@xorigo-ui/utils'

__INTERFACE_DEFINITION__

// ============================================================================
// 子组件
// ============================================================================

/**
 * 卡片头部组件
 */
export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    subtitle?: string
    action?: React.ReactNode
  }
>(({ children, title, subtitle, action, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-start justify-between p-6 pb-4', className)}
      {...props}
    >
      <div className="space-y-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
})

CardHeader.displayName = 'CardHeader'

/**
 * 卡片主体组件
 */
export const CardBody = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardBody.displayName = 'CardBody'

/**
 * 卡片脚部组件
 */
export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-6 pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardFooter.displayName = 'CardFooter'

/**
 * __COMPONENT_DESCRIPTION__
 */
export const __COMPONENT_NAME__ = forwardRef<HTMLDivElement, __COMPONENT_NAME__Props>(
  (
    {
      children,
      className,
      variant = 'default',
      shadow = 'sm',
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200 bg-white overflow-hidden',
          {
            'shadow-sm': shadow === 'sm',
            'shadow-md': shadow === 'md',
            'shadow-lg': shadow === 'lg',
            'shadow-none': shadow === 'none',
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
  /** 阴影 */
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
`
}

// ============================================================================
// 导出所有组合组件模板
// ============================================================================

export const compoundTemplates = [
  formTemplate,
  enhancedCardTemplate
]
