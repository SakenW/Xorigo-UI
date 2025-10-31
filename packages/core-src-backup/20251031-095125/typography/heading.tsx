'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Heading 变体定义
export const headingVariants = cva(
  "font-bold tracking-tight",
  {
    variants: {
      level: {
        h1: "text-4xl md:text-5xl lg:text-6xl",
        h2: "text-3xl md:text-4xl lg:text-5xl",
        h3: "text-2xl md:text-3xl lg:text-4xl",
        h4: "text-xl md:text-2xl lg:text-3xl",
        h5: "text-lg md:text-xl lg:text-2xl",
        h6: "text-base md:text-lg lg:text-xl"
      },
      variant: {
        primary: "text-[var(--color-text-primary)]",
        secondary: "text-[var(--color-text-secondary)]",
        muted: "text-[var(--color-text-muted)]",
        accent: "text-[var(--color-primary-600)]"
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold"
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

// Heading 属性接口
export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

// Heading 组件
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({
    className,
    level = 'h2',
    variant = "primary",
    weight = "bold",
    align = "left",
    as,
    children,
    ...props
  }, ref) => {
    const Component = as || level

    return React.createElement(
      Component,
      {
        ref,
        className: cn(headingVariants({ level, variant, weight, align, className })),
        ...props
      },
      children
    )
  }
)

Heading.displayName = 'Heading'
