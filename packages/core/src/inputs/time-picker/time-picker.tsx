/**
 * Component file
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface TimePickerProps {
  className?: string
}

export const TimePicker = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)}>
        Component Placeholder
      </div>
    )
  }
)

TimePicker.displayName = 'TimePicker'
export type { TimePickerProps }
