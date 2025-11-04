import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface ComponentProps {
  children?: React.ReactNode
  className?: string
}

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn('', className)}>
        {children}
      </div>
    )
  }
)

Component.displayName = 'Component'
export type { ComponentProps }
