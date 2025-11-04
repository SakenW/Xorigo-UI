/**
 * Component file
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface ChipProps {
  className?: string
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)}>
        Chip Placeholder
      </div>
    )
  }
)

Chip.displayName = 'Chip'
export type { ChipProps }
