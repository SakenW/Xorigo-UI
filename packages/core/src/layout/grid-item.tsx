import React from 'react'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'

const gridItemVariants = cva(
  "",
  {
    variants: {
      colSpan: {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        7: "col-span-7",
        8: "col-span-8",
        9: "col-span-9",
        10: "col-span-10",
        11: "col-span-11",
        12: "col-span-12",
        full: "col-span-full",
        auto: "col-auto",
      },
      rowSpan: {
        1: "row-span-1",
        2: "row-span-2",
        3: "row-span-3",
        4: "row-span-4",
        5: "row-span-5",
        6: "row-span-6",
        auto: "row-auto",
        full: "row-span-full",
      },
      colStart: {
        1: "col-start-1",
        2: "col-start-2",
        3: "col-start-3",
        4: "col-start-4",
        5: "col-start-5",
        6: "col-start-6",
        7: "col-start-7",
        8: "col-start-8",
        9: "col-start-9",
        10: "col-start-10",
        11: "col-start-11",
        12: "col-start-12",
        13: "col-start-13",
        auto: "col-auto",
      },
      colEnd: {
        1: "col-end-1",
        2: "col-end-2",
        3: "col-end-3",
        4: "col-end-4",
        5: "col-end-5",
        6: "col-end-6",
        7: "col-end-7",
        8: "col-end-8",
        9: "col-end-9",
        10: "col-end-10",
        11: "col-end-11",
        12: "col-end-12",
        13: "col-end-13",
        auto: "col-auto",
      },
      rowStart: {
        1: "row-start-1",
        2: "row-start-2",
        3: "row-start-3",
        4: "row-start-4",
        5: "row-start-5",
        6: "row-start-6",
        7: "row-start-7",
        auto: "row-auto",
      },
      rowEnd: {
        1: "row-end-1",
        2: "row-end-2",
        3: "row-end-3",
        4: "row-end-4",
        5: "row-end-5",
        6: "row-end-6",
        7: "row-end-7",
        auto: "row-auto",
      }
    },
    defaultVariants: {
      colSpan: "auto",
      rowSpan: "auto",
    },
  }
)

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({
    className,
    colSpan,
    rowSpan,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(gridItemVariants({
          colSpan,
          rowSpan,
          colStart,
          colEnd,
          rowStart,
          rowEnd,
          className
        }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GridItem.displayName = "GridItem"

export { GridItem, gridItemVariants }