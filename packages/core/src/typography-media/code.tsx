/**
 * 📝 代码组件 - v2025.11.03
 *
 * 行内代码和代码块组件，支持语法高亮
 * 响应式设计，可访问性支持
 *
 * @version 2025.11.03
 * @category Typography & Media
 * @layer component
 */

import React, { forwardRef } from 'react'
import { cva } from '../utils/cva-standalone'
import { cn } from '../foundations/utils/cn'

/**
 * 代码块变体样式
 */
const codeVariants = cva(
  'bg-muted rounded px-1 py-0.5 text-sm font-mono',
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground',
        primary: 'bg-primary/10 text-primary border border-primary/20',
        secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
        success: 'bg-green-100 text-green-800 border border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        danger: 'bg-red-100 text-red-800 border border-red-200',
        info: 'bg-blue-100 text-blue-800 border border-blue-200'
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm'
    }
  }
)

/**
 * 预格式化代码块变体样式
 */
const preCodeVariants = cva(
  'bg-muted border rounded-lg p-4 overflow-x-auto',
  {
    variants: {
      variant: {
        default: 'bg-muted border-border',
        dark: 'bg-slate-900 border-slate-700 text-slate-100',
        github: 'bg-gray-100 border-gray-300 text-gray-800',
        vscode: 'bg-[#1e1e1e] border-[#333333] text-[#d4d4d4]'
      },
      size: {
        sm: 'text-xs',
        base: 'text-sm',
        lg: 'text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'base'
    }
  }
)

/**
 * 行内代码组件属性
 */
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 代码变体
   */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'

  /**
   * 代码大小
   */
  size?: 'xs' | 'sm' | 'base' | 'lg'
}

/**
 * 预格式化代码块组件属性
 */
export interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  /**
   * 代码块变体
   */
  variant?: 'default' | 'dark' | 'github' | 'vscode'

  /**
   * 代码块大小
   */
  size?: 'sm' | 'base' | 'lg'

  /**
   * 是否显示行号
   */
  showLineNumbers?: boolean

  /**
   * 起始行号
   */
  startLineNumber?: number

  /**
   * 编程语言
   */
  language?: string

  /**
   * 是否可复制
   */
  copyable?: boolean
}

/**
 * 行内代码组件
 */
export const Code = forwardRef<HTMLElement, CodeProps>(
  ({
    variant,
    size,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(codeVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </code>
    )
  }
)

Code.displayName = 'Code'

/**
 * 预格式化代码块组件
 */
export const Pre = forwardRef<HTMLPreElement, PreProps>(
  ({
    variant,
    size,
    showLineNumbers = false,
    startLineNumber = 1,
    language,
    copyable = false,
    className,
    children,
    ...props
  }, ref) => {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = async () => {
      if (typeof children === 'string') {
        try {
          await navigator.clipboard.writeText(children)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (error) {
          console.error('Failed to copy code:', error)
        }
      }
    }

    const codeContent = typeof children === 'string' ? children.split('\n') : [children]

    return (
      <div className="relative">
        {copyable && typeof children === 'string' && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-background border rounded hover:bg-muted transition-colors"
            aria-label="复制代码"
          >
            {copied ? '已复制' : '复制'}
          </button>
        )}

        <pre
          ref={ref}
          className={cn(preCodeVariants({ variant, size }), className)}
          {...props}
        >
          <code className={`language-${language || 'plaintext'}`}>
            {showLineNumbers ? (
              <div className="flex">
                <div className="mr-4 text-muted-foreground select-none">
                  {codeContent.map((_, index) => (
                    <div key={index} className="text-right">
                      {startLineNumber + index}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  {codeContent.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            ) : (
              children
            )}
          </code>
        </pre>

        {language && (
          <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-background/80 border rounded">
            {language}
          </div>
        )}
      </div>
    )
  }
)

Pre.displayName = 'Pre'

// 便捷组合
export const InlineCode = forwardRef<HTMLElement, Omit<CodeProps, 'as'>>(
  (props, ref) => <Code ref={ref} {...props} />
)
InlineCode.displayName = 'InlineCode'

export const CodeBlock = forwardRef<HTMLPreElement, Omit<PreProps, 'as'>>(
  (props, ref) => <Pre ref={ref} {...props} />
)
CodeBlock.displayName = 'CodeBlock'