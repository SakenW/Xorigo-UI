import React from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tableCellVariants = cva(
  "px-4 py-2 text-sm",
  {
    variants: {
      variant: {
        default: "",
        striped: "",
        bordered: "border border-gray-100 dark:border-gray-800",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      header: {
        true: "font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900",
        false: "text-gray-900 dark:text-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
      align: "left",
      header: false,
    },
  }
)

export interface TableCellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof tableCellVariants> {
  asHeader?: boolean
  width?: string
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, variant, align, header, asHeader, width, ...props }, ref) => {
    const Component = asHeader || header ? 'th' : 'td'

    return (
      <Component
        ref={ref}
        className={tableCellVariants({ variant, align, header, className })}
        style={{ width }}
        scope={asHeader || header ? "col" : undefined}
        {...props}
      />
    )
  }
)

TableCell.displayName = "TableCell"

export { TableCell, tableCellVariants }