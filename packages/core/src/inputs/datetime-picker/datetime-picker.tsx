/**
 * Component file
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface DatetimePickerProps {
  className?: string
}

export const DatetimePicker = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)}>
        Component Placeholder
      </div>
    )
  }
)

DatetimePicker.displayName = 'DatetimePicker'
export type { DatetimePickerProps }
