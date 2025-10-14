import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const boxVariants = cva(
  "",
  {
    variants: {
      display: {
        block: "block",
        inline: "inline",
        "inline-block": "inline-block",
        flex: "flex",
        "inline-flex": "inline-flex",
        grid: "grid",
        "inline-grid": "inline-grid",
        hidden: "hidden",
      },
      padding: {
        0: "p-0",
        1: "p-1",
        2: "p-2",
        3: "p-3",
        4: "p-4",
        5: "p-5",
        6: "p-6",
        8: "p-8",
        10: "p-10",
        12: "p-12",
      },
      margin: {
        0: "m-0",
        1: "m-1",
        2: "m-2",
        3: "m-3",
        4: "m-4",
        5: "m-5",
        6: "m-6",
        8: "m-8",
        10: "m-10",
        12: "m-12",
        auto: "m-auto",
      },
      borderRadius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        full: "rounded-full",
      },
      backgroundColor: {
        transparent: "bg-transparent",
        current: "bg-current",
        primary: "bg-primary-500",
        secondary: "bg-secondary-500",
        success: "bg-success-500",
        warning: "bg-warning-500",
        error: "bg-error-500",
        gray: "bg-gray-500",
        white: "bg-white",
        black: "bg-black",
      },
      border: {
        0: "border-0",
        1: "border",
        2: "border-2",
        4: "border-4",
        8: "border-8",
      },
      borderColor: {
        transparent: "border-transparent",
        current: "border-current",
        primary: "border-primary-500",
        secondary: "border-secondary-500",
        success: "border-success-500",
        warning: "border-warning-500",
        error: "border-error-500",
        gray: "border-gray-300",
        white: "border-white",
        black: "border-black",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
        inner: "shadow-inner",
      },
    },
    defaultVariants: {
      display: "block",
    },
  }
)

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({
    className,
    display,
    padding,
    margin,
    borderRadius,
    backgroundColor,
    border,
    borderColor,
    shadow,
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(
          boxVariants({
            display,
            padding,
            margin,
            borderRadius,
            backgroundColor,
            border,
            borderColor,
            shadow,
            className
          })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Box.displayName = "Box"

export { Box, boxVariants }