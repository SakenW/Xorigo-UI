import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@xorigo-ui/theme'

const containerVariants = cva(
  "mx-auto px-4 sm:px-6 lg:px-8",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
        fluid: "",
      },
      center: {
        true: "mx-auto",
        false: "",
      }
    },
    defaultVariants: {
      size: "lg",
      center: true,
    },
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, center, children, ...props }, ref) => {
    return (
      <div
        className={cn(containerVariants({ size, center, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = "Container"

export { Container, containerVariants }