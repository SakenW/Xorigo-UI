/**
 * Component file
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface UploadButtonProps {
  className?: string
}

export const UploadButton = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)}>
        Component Placeholder
      </div>
    )
  }
)

UploadButton.displayName = 'UploadButton'
export type { UploadButtonProps }
