/**
 * 📝 引用块组件 - v2025.11.03
 *
 * 语义化引用块，支持不同样式和来源引用
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
 * 引用块变体样式
 */
const blockquoteVariants = cva(
  'border-l-4 pl-4 my-6 italic text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'border-l-muted-foreground',
        primary: 'border-l-primary',
        secondary: 'border-l-secondary',
        accent: 'border-l-accent',
        success: 'border-l-green-500',
        warning: 'border-l-yellow-500',
        danger: 'border-l-red-500',
        info: 'border-l-blue-500'
      },
      size: {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'base'
    }
  }
)

/**
 * 引用块组件属性
 */
export interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  /**
   * 引用块变体
   */
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

  /**
   * 引用块大小
   */
  size?: 'sm' | 'base' | 'lg' | 'xl'

  /**
   * 引用来源
   */
  cite?: string

  /**
   * 引用来源显示文本
   */
  source?: string

  /**
   * 引用来源URL
   */
  sourceUrl?: string
}

/**
 * 引用块组件
 */
export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({
    variant,
    size,
    cite,
    source,
    sourceUrl,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(blockquoteVariants({ variant, size }), className)}
        cite={cite || sourceUrl}
        {...props}
      >
        <div className="relative">
          <span className="absolute -left-2 top-0 text-3xl text-muted-foreground/50">
            "
          </span>
          <p className="ml-2">{children}</p>
        </div>

        {(source || sourceUrl) && (
          <footer className="mt-2 text-sm text-muted-foreground not-italic">
            — {source && (
              sourceUrl ? (
                <a href={sourceUrl} className="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">
                  {source}
                </a>
              ) : (
                <cite>{source}</cite>
              )
            )}
          </footer>
        )}
      </blockquote>
    )
  }
)

Blockquote.displayName = 'Blockquote'