import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { usePanelContext } from './Panel'

const panelFooterVariants = cva(
  "flex items-center justify-between px-6 py-4 border-t",
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
      collapsed: {
        true: "hidden",
        false: "",
      }
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface PanelFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelFooterVariants> {}

const PanelFooter = React.forwardRef<HTMLDivElement, PanelFooterProps>(
  ({
    className,
    variant,
    size,
    children,
    ...props
  }, ref) => {
    const { collapsed, variant: contextVariant, size: contextSize } = usePanelContext()

    // Animation variants for footer
    const footerVariants = {
      expanded: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: [0.04, 0.62, 0.23, 0.98] as const,
          delay: 0.1
        }
      },
      collapsed: {
        opacity: 0,
        y: -10,
        transition: {
          duration: 0.2,
          ease: [0.04, 0.62, 0.23, 0.98] as const
        }
      }
    }

    return (
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            ref={ref}
            className={cn(
              panelFooterVariants({
                variant: variant || contextVariant,
                size: size || contextSize,
                collapsed: collapsed
              }),
              className
            )}
            variants={footerVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

PanelFooter.displayName = "PanelFooter"

export { PanelFooter, panelFooterVariants }