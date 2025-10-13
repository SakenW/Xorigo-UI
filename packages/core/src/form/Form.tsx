import React, { createContext, useContext } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@xorigo-ui/theme'

interface FormContextValue {
  disabled?: boolean
  readonly?: boolean
}

const FormContext = createContext<FormContextValue>({})

const formVariants = cva(
  "space-y-6",
  {
    variants: {
      layout: {
        vertical: "flex flex-col space-y-6",
        horizontal: "grid grid-cols-1 md:grid-cols-2 gap-6",
        inline: "flex flex-wrap items-center gap-4",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      layout: "vertical",
      size: "md",
    },
  }
)

export interface FormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {
  disabled?: boolean
  readonly?: boolean
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, layout, size, disabled = false, readonly = false, children, onSubmit, ...props }, ref) => {
    const contextValue: FormContextValue = {
      disabled,
      readonly,
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      if (disabled || readonly) {
        event.preventDefault()
        return
      }
      onSubmit?.(event)
    }

    return (
      <FormContext.Provider value={contextValue}>
        <form
          className={cn(formVariants({ layout, size, className }))}
          ref={ref}
          onSubmit={handleSubmit}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    )
  }
)

Form.displayName = "Form"

export const useFormField = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormField must be used within a Form component')
  }
  return context
}

export { Form, formVariants }