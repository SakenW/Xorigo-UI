import React from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { motion, AnimatePresence } from 'framer-motion'

const tableBodyVariants = cva(
  "divide-y divide-gray-200 dark:divide-gray-700",
  {
    variants: {
      variant: {
        default: "",
        striped: "",
        bordered: "divide-y divide-gray-200 dark:divide-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableBodyVariants> {
  animated?: boolean
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, variant, animated = true, children, ...props }, ref) => {
    if (animated) {
      return (
        <tbody
          ref={ref}
          className={tableBodyVariants({ variant, className })}
          {...props}
        >
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </tbody>
      )
    }

    return (
      <tbody
        ref={ref}
        className={tableBodyVariants({ variant, className })}
        {...props}
      >
        {children}
      </tbody>
    )
  }
)

TableBody.displayName = "TableBody"

export { TableBody, tableBodyVariants }