import React from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const carouselItemVariants = cva(
  "flex-shrink-0",
  {
    variants: {
      variant: {
        default: "",
        fade: "",
        slide: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CarouselItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselItemVariants> {
  isActive?: boolean
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, variant, isActive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(carouselItemVariants({ variant, className }))}
        role="group"
        aria-roledescription="轮播项"
        aria-hidden={!isActive}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CarouselItem.displayName = "CarouselItem"

export { CarouselItem, carouselItemVariants }