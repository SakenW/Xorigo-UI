/**
 * Component file
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface DatePickerProps {
  className?: string
}

export const DatePicker = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)}>
        Component Placeholder
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
export type { DatePickerProps }
