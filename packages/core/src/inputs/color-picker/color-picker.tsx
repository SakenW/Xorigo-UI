/**
 * Component file
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface ColorPickerProps {
  className?: string
}

export const ColorPicker = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)}>
        Component Placeholder
      </div>
    )
  }
)

ColorPicker.displayName = 'ColorPicker'
export type { ColorPickerProps }
