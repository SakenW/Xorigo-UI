import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '../utils'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// Dialog Context
interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  variant: DialogProps['variant']
  size: DialogProps['size']
  modal: boolean
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog provider')
  }
  return context
}

// Dialog 变体定义
const dialogVariants = cva(
  'relative w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border',
  {
    variants: {
      variant: {
        default: 'border-gray-200 dark:border-gray-700',
        destructive: 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50',
        warning: 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/50',
        success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50',
      },
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Dialog Props
export interface DialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogVariants> {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  modal?: boolean
  maskClosable?: boolean
  closeOnEscape?: boolean
  preventBodyScroll?: boolean
  zIndex?: number
}

// Dialog 主组件
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({
    open,
    onOpenChange,
    onClose,
    variant = 'default',
    size = 'md',
    modal = true,
    maskClosable = true,
    closeOnEscape = true,
    preventBodyScroll = true,
    zIndex = 1000,
    className,
    children,
    ...props
  }, ref) => {
    const [internalOpen, setInternalOpen] = useState(open)
    const isOpen = onOpenChange ? open : internalOpen

    const handleOpenChange = useCallback((newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen)
      } else {
        setInternalOpen(newOpen)
      }
      if (!newOpen && onClose) {
        onClose()
      }
    }, [onOpenChange, onClose])

    const handleClose = useCallback(() => {
      handleOpenChange(false)
    }, [handleOpenChange])

    // 处理ESC键关闭
    useEffect(() => {
      if (!closeOnEscape || !isOpen) return

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          handleClose()
        }
      }

      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }, [closeOnEscape, isOpen, handleClose])

    // 处理滚动锁定
    useEffect(() => {
      if (!preventBodyScroll) return

      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen, preventBodyScroll])

    // 焦点管理
    const focusRef = useRef<HTMLDivElement>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
      if (isOpen) {
        previousFocusRef.current = document.activeElement as HTMLElement
        const timer = setTimeout(() => {
          focusRef.current?.focus()
        }, 100)
        return () => clearTimeout(timer)
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }, [isOpen])

    const contextValue: DialogContextType = {
      open: isOpen,
      onOpenChange: handleOpenChange,
      onClose: handleClose,
      variant,
      size,
      modal,
    }

    const handleMaskClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && maskClosable && !modal) {
        handleClose()
      }
    }

    const dialogContent = (
      <DialogContext.Provider value={contextValue}>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 遮罩层 */}
              {modal && (
                <motion.div
                  className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleMaskClick}
                  style={{ zIndex }}
                />
              )}

              {/* 对话框容器 */}
              <motion.div
                className={cn(
                  'fixed inset-0 flex items-center justify-center p-4',
                  'focus:outline-none',
                  !modal && 'bg-black/30 backdrop-blur-xs'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleMaskClick}
                style={{ zIndex: modal ? zIndex + 1 : zIndex }}
                ref={focusRef}
                tabIndex={-1}
              >
                <motion.div
                  ref={ref}
                  className={cn(
                    dialogVariants({ variant, size }),
                    'max-h-[90vh] overflow-hidden flex flex-col',
                    className
                  )}
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal={modal}
                  aria-labelledby="dialog-title"
                  aria-describedby="dialog-description"
                  {...props}
                >
                  {children}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DialogContext.Provider>
    )

    return createPortal(dialogContent, document.body)
  }
)

Dialog.displayName = 'Dialog'

// Dialog Header 组件
export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, onClose } = useDialogContext()

    const variantIcons = {
      default: null,
      destructive: <AlertCircle className="w-5 h-5 text-red-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-3 flex-1">
          {variantIcons[variant]}
          {children}
        </div>
        <motion.button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="关闭对话框"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>
    )
  }
)

DialogHeader.displayName = 'DialogHeader'

// Dialog Content 组件
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto p-6',
          className
        )}
        id="dialog-description"
        {...props}
      >
        {children}
      </div>
    )
  }
)

DialogContent.displayName = 'DialogContent'

// Dialog Footer 组件
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

DialogFooter.displayName = 'DialogFooter'

// Dialog Title 组件
export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          'text-xl font-semibold text-gray-900 dark:text-gray-100',
          className
        )}
        id="dialog-title"
        {...props}
      >
        {children}
      </h2>
    )
  }
)

DialogTitle.displayName = 'DialogTitle'

// Dialog Description 组件
export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-gray-600 dark:text-gray-400 mt-1',
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)

DialogDescription.displayName = 'DialogDescription'