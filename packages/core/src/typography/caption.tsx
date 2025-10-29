'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Caption 变体定义
export const captionVariants = cva(
  "text-xs leading-relaxed",
  {
    variants: {
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
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold"
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right"
      }
    }
  }
)

// Caption 属性接口
export interface CaptionProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof captionVariants> {
  as?: 'span' | 'p' | 'div'
}

// Caption 组件
export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(
  ({
    className,
    variant = "secondary",
    weight = "normal",
    align = "left",
    as = "span",
    children,
    ...props
  }, ref) => {
    const Component = as

    return React.createElement(
      Component,
      {
        ref,
        className: cn(captionVariants({ variant, weight, align, className })),
        ...props
      },
      children
    )
  }
)

Caption.displayName = 'Caption'
