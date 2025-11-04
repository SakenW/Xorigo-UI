/**
 * Component file
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface FileUploadProps {
  className?: string
}

export const FileUpload = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)}>
        Component Placeholder
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
export type { FileUploadProps }
