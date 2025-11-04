/**
 * 📝 标题组件 - v2025.11.03
 *
 * 语义化标题组件，支持不同级别和样式
 * 响应式字体大小，可访问性支持
 *
 * @version 2025.11.03
 * @category Typography & Media
 * @layer component
 */

import React, { forwardRef } from 'react'
import { cva } from '../utils/cva-standalone'
import { cn } from '../foundations/utils/cn'
import { useTheme } from '../system/theming-engine'

/**
 * 标题级别类型
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/**
 * 标题变体样式
 */
const headingVariants = cva(
  'font-semibold tracking-tight',
  {
    variants: {
      level: {
        1: 'text-4xl lg:text-5xl',
        2: 'text-3xl lg:text-4xl',
        3: 'text-2xl lg:text-3xl',
        4: 'text-xl lg:text-2xl',
        5: 'text-lg lg:text-xl',
        6: 'text-base lg:text-lg'
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold'
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
        strikethrough: 'line-through'
      }
    },
    defaultVariants: {
      level: 1,
      weight: 'semibold',
      align: 'left',
      decoration: 'none'
    }
  }
)

/**
 * 标题组件属性
 */
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * 标题级别 (1-6)
   */
  level?: HeadingLevel

  /**
   * 字体粗细
   */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'

  /**
   * 文本对齐
   */
  align?: 'left' | 'center' | 'right' | 'justify'

  /**
   * 文本装饰
   */
  decoration?: 'none' | 'underline' | 'strikethrough'

  /**
   * 是否显示副标题
   */
  subtitle?: string

  /**
   * 是否渐变色
   */
  gradient?: boolean

  /**
   * 自定义标签名（默认根据level自动选择）
   */
  as?: keyof JSX.IntrinsicElements
}

/**
 * 标题组件
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({
    level = 1,
    weight,
    align,
    decoration,
    subtitle,
    gradient = false,
    as,
    className,
    children,
    ...props
  }, ref) => {
    const { currentTheme } = useTheme()

    // 确定标签名
    const Tag = as || (`h${level}` as keyof JSX.IntrinsicElements)

    // 渐变色样式
    const gradientClass = gradient && currentTheme.hue
      ? `text-transparent bg-clip-text bg-gradient-to-r from-${currentTheme.hue}-500 to-${currentTheme.hue}-700`
      : ''

    return (
      <Tag
        ref={ref}
        className={cn(
          headingVariants({ level, weight, align, decoration }),
          gradientClass,
          className
        )}
        {...props}
      >
        {children}
        {subtitle && (
          <p className="mt-2 text-lg font-normal text-muted-foreground">
            {subtitle}
          </p>
        )}
      </Tag>
    )
  }
)

Heading.displayName = 'Heading'

// 导出所有级别的便捷组件
export const H1 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={1} {...props} />
)
H1.displayName = 'H1'

export const H2 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={2} {...props} />
)
H2.displayName = 'H2'

export const H3 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={3} {...props} />
)
H3.displayName = 'H3'

export const H4 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={4} {...props} />
)
H4.displayName = 'H4'

export const H5 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={5} {...props} />
)
H5.displayName = 'H5'

export const H6 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={6} {...props} />
)
H6.displayName = 'H6'