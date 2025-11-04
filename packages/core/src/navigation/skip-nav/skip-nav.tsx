import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface SkipNavProps {
  href: string
  children: React.ReactNode
  className?: string
}

export const SkipNav = forwardRef<HTMLAnchorElement, SkipNavProps>(
  ({ href, children, className }, ref) => {
    return (
      <motion.a
        ref={ref}
        href={href}
        className={cn(
          'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
          'px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md',
          className
        )}
        initial={{ y: -100 }}
        whileFocus={{ y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.a>
    )
  }
)

SkipNav.displayName = 'SkipNav'
export type { SkipNavProps }
