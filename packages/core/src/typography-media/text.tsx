/**
 * 📝 文本组件 - v2025.11.03
 *
 * 语义化文本组件，支持不同样式和大小
 * 响应式文本，可访问性支持
 *
 * @version 2025.11.03
 * @category Typography & Media
 * @layer component
 */

import React, { forwardRef } from 'react'
import { cva } from '../utils/cva-standalone'
import { cn } from '../foundations/utils/cn'

/**
 * 文本大小变体
 */
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

/**
 * 文本变体样式
 */
const textVariants = cva(
  'text-foreground',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl'
      },
      weight: {
        thin: 'font-thin',
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
        black: 'font-black'
      },
      leading: {
        none: 'leading-none',
        tight: 'leading-tight',
        snug: 'leading-snug',
        normal: 'leading-normal',
        relaxed: 'leading-relaxed',
        loose: 'leading-loose'
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify'
      },
      decoration: {
        none: 'no-underline',
        underline: 'underline',
        strikethrough: 'line-through',
        overline: 'overline'
      },
      transform: {
        none: 'normal-case',
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize'
      },
      color: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        destructive: 'text-destructive',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600'
      }
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      leading: 'normal',
      align: 'left',
      decoration: 'none',
      transform: 'none',
      color: 'default'
    }
  }
)

/**
 * 文本组件属性
 */
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 文本大小
   */
  size?: TextSize

  /**
   * 字体粗细
   */
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'

  /**
   * 行高
   */
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'

  /**
   * 文本对齐
   */
  align?: 'left' | 'center' | 'right' | 'justify'

  /**
   * 文本装饰
   */
  decoration?: 'none' | 'underline' | 'strikethrough' | 'overline'

  /**
   * 文本转换
   */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'

  /**
   * 文本颜色
   */
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning' | 'info'

  /**
   * 是否截断文本
   */
  truncate?: boolean

  /**
   * 是否为段落
   */
  as?: keyof JSX.IntrinsicElements
}

/**
 * 文本组件
 */
export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({
    size,
    weight,
    leading,
    align,
    decoration,
    transform,
    color,
    truncate = false,
    as: Component = 'p',
    className,
    children,
    ...props
  }, ref) => {
    const classes = cn(
      textVariants({ size, weight, leading, align, decoration, transform, color }),
      {
        'truncate': truncate,
        'inline': Component === 'span'
      },
      className
    )

    return (
      <Component
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Text.displayName = 'Text'

// 便捷组件
export const Paragraph = forwardRef<HTMLParagraphElement, TextProps>(
  (props, ref) => <Text ref={ref} as="p" {...props} />
)
Paragraph.displayName = 'Paragraph'

export const Span = forwardRef<HTMLSpanElement, Omit<TextProps, 'as'>>(
  (props, ref) => <Text ref={ref} as="span" {...props} />
)
Span.displayName = 'Span'

export const Small = forwardRef<HTMLElement, Omit<TextProps, 'size' | 'as'>>(
  (props, ref) => <Text ref={ref} as="small" size="sm" {...props} />
)
Small.displayName = 'Small'

export const Strong = forwardRef<HTMLElement, Omit<TextProps, 'weight' | 'as'>>(
  (props, ref) => <Text ref={ref} as="strong" weight="bold" {...props} />
)
Strong.displayName = 'Strong'

export const Em = forwardRef<HTMLElement, Omit<TextProps, 'as'>>(
  (props, ref) => <Text ref={ref} as="em" {...props} />
)
Em.displayName = 'Em'