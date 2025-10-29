'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Text 变体定义
export const textVariants = cva(
  "leading-normal",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        '2xl': "text-2xl",
        '3xl': "text-3xl",
        '4xl': "text-4xl"
      },
      variant: {
        primary: "text-[var(--color-text-primary)]",
        secondary: "text-[var(--color-text-secondary)]",
        muted: "text-[var(--color-text-muted)]",
        accent: "text-[var(--color-primary-600)]",
        success: "text-[var(--color-success-600)]",
        warning: "text-[var(--color-warning-600)]",
        error: "text-[var(--color-error-600)]"
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold"
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify"
      }
    }
  }
)

// Text 属性接口
export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div'
}

// Text 组件
export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({
    className,
    size = "base",
    variant = "primary",
    weight = "normal",
    align = "left",
    as = "p",
    children,
    ...props
  }, ref) => {
    const Component = as

    return React.createElement(
      Component,
      {
        ref,
        className: cn(textVariants({ size, variant, weight, align, className })),
        ...props
      },
      children
    )
  }
)

Text.displayName = 'Text'
