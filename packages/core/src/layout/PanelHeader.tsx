import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import { usePanelContext } from './Panel'

const panelHeaderVariants = cva(
  "flex items-center justify-between px-6 py-4 border-b",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50",
        elevated: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50",
        outlined: "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/50",
        ghost: "border-transparent bg-transparent dark:border-transparent dark:bg-transparent",
      },
      size: {
        sm: "px-4 py-3 text-sm",
        md: "px-6 py-4 text-base",
        lg: "px-8 py-6 text-lg",
      },
      collapsible: {
        true: "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors",
        false: "",
      }
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface PanelHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelHeaderVariants> {
  showCollapseIcon?: boolean
  collapseIcon?: React.ReactNode
}

const PanelHeader = React.forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({
    className,
    variant,
    size,
    showCollapseIcon,
    collapseIcon,
    children,
    onClick,
    ...props
  }, ref) => {
    const { collapsed, toggle, collapsible, variant: contextVariant, size: contextSize } = usePanelContext()

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (collapsible) {
        toggle()
      }
      onClick?.(event)
    }, [collapsible, toggle, onClick])

    const shouldShowCollapseIcon = (showCollapseIcon !== false) && collapsible

    return (
      <motion.div
        ref={ref}
        className={cn(
          panelHeaderVariants({
            variant: variant || contextVariant,
            size: size || contextSize,
            collapsible: shouldShowCollapseIcon
          }),
          className
        )}
        onClick={handleClick}
        whileHover={shouldShowCollapseIcon ? { scale: 1.01 } : {}}
        whileTap={shouldShowCollapseIcon ? { scale: 0.99 } : {}}
        transition={{ duration: 0.1 }}
        {...props}
      >
        <div className="flex items-center flex-1">
          {children}
        </div>

        {shouldShowCollapseIcon && (
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            {collapseIcon || (
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </motion.div>
        )}
      </motion.div>
    )
  }
)

PanelHeader.displayName = "PanelHeader"

export { PanelHeader, panelHeaderVariants }