import React from 'react'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { usePanelContext } from './panel'

const panelContentVariants = cva(
  "flex-1",
  {
    variants: {
      variant: {
        default: "px-6 py-4",
        elevated: "px-6 py-4",
        outlined: "px-6 py-4",
        ghost: "px-0 py-0",
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

export interface PanelContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelContentVariants> {}

const PanelContent = React.forwardRef<HTMLDivElement, PanelContentProps>(
  ({
    className,
    variant,
    size,
    children,
    ...props
  }, ref) => {
    const { collapsed, variant: contextVariant, size: contextSize } = usePanelContext()

    // Animation variants for content
    const contentVariants = {
      expanded: {
        opacity: 1,
        height: 'auto',
        transition: {
          duration: 0.3,
          ease: [0.04, 0.62, 0.23, 0.98] as const
        }
      },
      collapsed: {
        opacity: 0,
        height: 0,
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
              panelContentVariants({
                variant: variant || contextVariant,
                size: size || contextSize,
                collapsed: collapsed
              }),
              className
            )}
            variants={contentVariants}
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

PanelContent.displayName = "PanelContent"

export { PanelContent, panelContentVariants }