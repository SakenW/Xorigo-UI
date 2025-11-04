import React from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useCarousel } from './carousel'

const carouselControlVariants = cva(
  "absolute z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 dark:bg-gray-800/80 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      position: {
        prev: "left-4 top-1/2 -translate-y-1/2",
        next: "right-4 top-1/2 -translate-y-1/2",
        prevVertical: "left-1/2 top-4 -translate-x-1/2",
        nextVertical: "left-1/2 bottom-4 -translate-x-1/2",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      position: "prev",
      size: "md",
    },
  }
)

export interface CarouselControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof carouselControlVariants> {
  direction?: 'prev' | 'next'
}

const CarouselControl = React.forwardRef<HTMLButtonElement, CarouselControlProps>(
  ({ className, position, size, direction = 'prev', disabled, ...props }, ref) => {
    const { orientation, prevSlide, nextSlide } = useCarousel()

    const handleClick = () => {
      if (disabled) return
      if (direction === 'prev') {
        prevSlide()
      } else {
        nextSlide()
      }
    }

    const getPositionClass = () => {
      if (orientation === 'vertical') {
        return direction === 'prev' ? 'prevVertical' : 'nextVertical'
      }
      return direction === 'prev' ? 'prev' : 'next'
    }

    const positionClass = position || getPositionClass()

    return (
      <button
        ref={ref}
        className={cn(carouselControlVariants({ position: positionClass, size, className }))}
        onClick={handleClick}
        disabled={disabled}
        aria-label={direction === 'prev' ? '上一张' : '下一张'}
        {...props}
      >
        <svg
          className={cn(
            "h-5 w-5",
            orientation === 'vertical' && "rotate-90",
            direction === 'prev' && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }
)

CarouselControl.displayName = "CarouselControl"

export { CarouselControl, carouselControlVariants }