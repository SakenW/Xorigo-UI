import React from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccordion } from './Accordion'

const accordionItemVariants = cva(
  "overflow-hidden",
  {
    variants: {
      variant: {
        default: "rounded-lg border border-gray-200 dark:border-gray-700",
        bordered: "border-b border-gray-200 dark:border-gray-700 first:rounded-t-lg last:rounded-b-lg first:border-t last:border-b",
        ghost: "rounded-md",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
)

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionItemVariants> {
  value: string
  disabled?: boolean
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, variant, value, disabled: itemDisabled, children, ...props }, ref) => {
    const { disabled: accordionDisabled, isExpanded, variant: contextVariant } = useAccordion()

    const isItemDisabled = accordionDisabled || itemDisabled
    const isItemExpanded = isExpanded(value)
    const finalVariant = variant || contextVariant

    return (
      <div
        ref={ref}
        className={cn(
          accordionItemVariants({ variant: finalVariant, disabled: isItemDisabled, className })
        )}
        data-state={isItemExpanded ? "open" : "closed"}
        data-disabled={isItemDisabled}
        {...props}
      >
        <AnimatePresence initial={false}>
          {isItemExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0">
                {children}
              </div>
            </motion.div>
          )}
          {!isItemExpanded && (
            <div className="p-4 pt-0 hidden">
              {children}
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

AccordionItem.displayName = "AccordionItem"

export { AccordionItem, accordionItemVariants }