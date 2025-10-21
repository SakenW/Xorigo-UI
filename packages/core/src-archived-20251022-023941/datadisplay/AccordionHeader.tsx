import React, { useRef, useEffect } from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { useAccordion } from './Accordion'

const accordionHeaderVariants = cva(
  "flex w-full items-center justify-between p-4 text-left font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  {
    variants: {
      variant: {
        default: "hover:bg-gray-50 dark:hover:bg-gray-800",
        bordered: "hover:bg-gray-50 dark:hover:bg-gray-800",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md",
      },
      size: {
        sm: "p-3 text-sm",
        md: "p-4 text-base",
        lg: "p-5 text-lg",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    },
  }
)

export interface AccordionHeaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accordionHeaderVariants> {
  value: string
  disabled?: boolean
}

const AccordionHeader = React.forwardRef<HTMLButtonElement, AccordionHeaderProps>(
  ({ className, variant, size, value, disabled: itemDisabled, children, ...props }, ref) => {
    const {
      disabled: accordionDisabled,
      isExpanded,
      toggleItem,
      variant: contextVariant
    } = useAccordion()

    const internalRef = useRef<HTMLButtonElement>(null)
    const buttonRef = (ref as React.RefObject<HTMLButtonElement>) || internalRef

    const isItemDisabled = accordionDisabled || itemDisabled
    const isItemExpanded = isExpanded(value)
    const finalVariant = variant || contextVariant

    // 键盘导航支持
    useEffect(() => {
      const button = buttonRef.current
      if (!button) return

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case ' ':
          case 'Enter':
            e.preventDefault()
            if (!isItemDisabled) {
              toggleItem(value)
            }
            break
          case 'ArrowDown':
            e.preventDefault()
            // 找到下一个可聚焦的手风琴项
            const nextButton = button.parentElement?.nextElementSibling?.querySelector('button')
            if (nextButton) {
              nextButton.focus()
            }
            break
          case 'ArrowUp':
            e.preventDefault()
            // 找到上一个可聚焦的手风琴项
            const prevButton = button.parentElement?.previousElementSibling?.querySelector('button')
            if (prevButton) {
              prevButton.focus()
            }
            break
          case 'Home':
            e.preventDefault()
            // 找到第一个手风琴项
            const firstButton = button.parentElement?.parentElement?.querySelector('button')
            if (firstButton) {
              firstButton.focus()
            }
            break
          case 'End':
            e.preventDefault()
            // 找到最后一个手风琴项
            const lastButton = button.parentElement?.parentElement?.querySelector('button:last-of-type')
            if (lastButton && 'focus' in lastButton) {
              (lastButton as HTMLElement).focus()
            }
            break
        }
      }

      button.addEventListener('keydown', handleKeyDown)
      return () => {
        button.removeEventListener('keydown', handleKeyDown)
      }
    }, [toggleItem, value, isItemDisabled])

    const handleClick = () => {
      if (!isItemDisabled) {
        toggleItem(value)
      }
    }

    return (
      <button
        ref={buttonRef}
        className={cn(
          accordionHeaderVariants({ variant: finalVariant, size, disabled: isItemDisabled, className })
        )}
        onClick={handleClick}
        disabled={isItemDisabled}
        aria-expanded={isItemExpanded}
        aria-controls={`accordion-content-${value}`}
        id={`accordion-header-${value}`}
        type="button"
        {...props}
      >
        <span className="flex-1">{children}</span>
        <svg
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isItemExpanded && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    )
  }
)

AccordionHeader.displayName = "AccordionHeader"

export { AccordionHeader, accordionHeaderVariants }