import React from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from '../utils/cva-standalone'

const tableHeaderVariants = cva(
  "bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700",
  {
    variants: {
      variant: {
        default: "",
        striped: "",
        bordered: "border border-gray-200 dark:border-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableHeaderVariants> {
  sticky?: boolean
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, variant, sticky = false, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn(
          tableHeaderVariants({ variant, className }),
          sticky && "sticky top-0 z-10"
        )}
        {...props}
      />
    )
  }
)

TableHeader.displayName = "TableHeader"

export { TableHeader, tableHeaderVariants }