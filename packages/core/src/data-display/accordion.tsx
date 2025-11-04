import React, { useState, useCallback } from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from '../utils/cva-standalone'

const accordionVariants = cva(
  "space-y-2",
  {
    variants: {
      variant: {
        default: "",
        bordered: "space-y-0",
        ghost: "space-y-1",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  multiple?: boolean
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  collapsible?: boolean
  disabled?: boolean
}

interface AccordionContextValue {
  value: string[]
  onValueChange: (value: string[]) => void
  multiple: boolean
  collapsible: boolean
  disabled: boolean
  variant: 'default' | 'bordered' | 'ghost'
  toggleItem: (itemValue: string) => void
  isExpanded: (itemValue: string) => boolean
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

const useAccordion = () => {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion')
  }
  return context
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({
    className,
    variant = "default",
    size = "md",
    multiple = false,
    defaultValue = [],
    value,
    onValueChange,
    collapsible = true,
    disabled = false,
    children,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const handleValueChange = useCallback((newValue: string[]) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }, [isControlled, onValueChange])

    const toggleItem = useCallback((itemValue: string) => {
      if (disabled) return

      const isExpanded = currentValue.includes(itemValue)

      if (isExpanded) {
        if (collapsible || multiple) {
          handleValueChange(currentValue.filter(v => v !== itemValue))
        }
      } else {
        if (multiple) {
          handleValueChange([...currentValue, itemValue])
        } else {
          handleValueChange([itemValue])
        }
      }
    }, [currentValue, disabled, collapsible, multiple, handleValueChange])

    const isExpanded = useCallback((itemValue: string) => {
      return currentValue.includes(itemValue)
    }, [currentValue])

    const contextValue: AccordionContextValue = {
      value: currentValue,
      onValueChange: handleValueChange,
      multiple,
      collapsible,
      disabled,
      variant: variant || 'default',
      toggleItem,
      isExpanded,
    }

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(accordionVariants({ variant, size, className }))}
          role="region"
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)

Accordion.displayName = "Accordion"

export { Accordion, accordionVariants, useAccordion }