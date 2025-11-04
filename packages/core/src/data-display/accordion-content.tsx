import React from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { motion } from 'framer-motion'
import { useAccordion } from './accordion'

const accordionContentVariants = cva(
  "text-sm text-gray-600 dark:text-gray-400",
  {
    variants: {
      variant: {
        default: "",
        bordered: "",
        ghost: "",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {
  value: string
  forceMount?: boolean
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, variant, size, value, forceMount = false, children, ...props }, ref) => {
    const { isExpanded } = useAccordion()

    const isItemExpanded = isExpanded(value)
    const shouldRender = forceMount || isItemExpanded

    if (!shouldRender) {
      return null
    }

    return (
      <div
        ref={ref}
        id={`accordion-content-${value}`}
        role="region"
        aria-labelledby={`accordion-header-${value}`}
        className={cn(accordionContentVariants({ variant, size, className }))}
        hidden={!isItemExpanded}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AccordionContent.displayName = "AccordionContent"

export { AccordionContent, accordionContentVariants }