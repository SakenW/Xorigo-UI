import React from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

const tableRowVariants = cva(
  "transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-gray-50 dark:hover:bg-gray-700",
        striped: "hover:bg-gray-50 dark:hover:bg-gray-700",
        bordered: "hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-800",
      },
      selected: {
        true: "bg-blue-50 dark:bg-blue-900/20",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      selected: false,
    },
  }
)

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {
  selected?: boolean
  animated?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, selected = false, animated = true, ...props }, ref) => {
    const Component = animated ? motion.tr : 'tr'

    const motionProps = animated ? {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.2 }
    } : {}

    return (
      <Component
        ref={ref}
        className={tableRowVariants({ variant, selected, className })}
        {...motionProps}
        {...props}
      />
    )
  }
)

TableRow.displayName = "TableRow"

export { TableRow, tableRowVariants }